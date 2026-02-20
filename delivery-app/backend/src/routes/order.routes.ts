import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient, VehicleType, OrderStatus } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { calculateFare, applyDiscount } from '../utils/fareCalculator';

const router = Router();
const prisma = new PrismaClient();

// Calculate fare estimate
router.post(
  '/estimate',
  authenticate,
  [
    body('pickupLatitude').isFloat().withMessage('Invalid pickup latitude'),
    body('pickupLongitude').isFloat().withMessage('Invalid pickup longitude'),
    body('dropLatitude').isFloat().withMessage('Invalid drop latitude'),
    body('dropLongitude').isFloat().withMessage('Invalid drop longitude'),
    body('distance').isFloat({ min: 0 }).withMessage('Invalid distance'),
    body('duration').isInt({ min: 0 }).withMessage('Invalid duration'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { distance, duration, promoCode } = req.body;

      // Calculate fares for all vehicle types
      const vehicleTypes: VehicleType[] = ['BIKE', 'CAR', 'VAN', 'TRUCK'];
      const estimates = vehicleTypes.map((type) => {
        const fare = calculateFare(type, distance, duration);
        return {
          vehicleType: type,
          ...fare,
        };
      });

      // Apply promo code if provided
      let discountInfo = null;
      if (promoCode) {
        const promo = await prisma.promoCode.findUnique({
          where: { code: promoCode.toUpperCase() },
        });

        if (
          promo &&
          promo.isActive &&
          new Date() >= promo.validFrom &&
          new Date() <= promo.validUntil &&
          (!promo.maxUses || promo.usedCount < promo.maxUses)
        ) {
          discountInfo = {
            code: promo.code,
            type: promo.discountType,
            value: promo.discountValue,
            maxDiscount: promo.maxDiscount,
          };
        }
      }

      res.json({
        success: true,
        estimates,
        discount: discountInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create order
router.post(
  '/',
  authenticate,
  [
    body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
    body('pickupLatitude').isFloat().withMessage('Invalid pickup latitude'),
    body('pickupLongitude').isFloat().withMessage('Invalid pickup longitude'),
    body('dropAddress').notEmpty().withMessage('Drop address is required'),
    body('dropLatitude').isFloat().withMessage('Invalid drop latitude'),
    body('dropLongitude').isFloat().withMessage('Invalid drop longitude'),
    body('vehicleType').isIn(['BIKE', 'CAR', 'VAN', 'TRUCK']).withMessage('Invalid vehicle type'),
    body('paymentMethod').isIn(['CASH', 'CARD', 'UPI', 'WALLET']).withMessage('Invalid payment method'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const {
        pickupLabel,
        pickupAddress,
        pickupLatitude,
        pickupLongitude,
        pickupContactName,
        pickupContactPhone,
        dropLabel,
        dropAddress,
        dropLatitude,
        dropLongitude,
        dropContactName,
        dropContactPhone,
        vehicleType,
        distance,
        duration,
        paymentMethod,
        promoCode,
        packageDescription,
        scheduledAt,
      } = req.body;

      // Calculate fare
      const fare = calculateFare(vehicleType, distance, duration);
      let discount = 0;

      // Apply promo code
      if (promoCode) {
        const promo = await prisma.promoCode.findUnique({
          where: { code: promoCode.toUpperCase() },
        });

        if (promo && promo.isActive) {
          discount = applyDiscount(
            fare.totalFare,
            promo.discountType,
            promo.discountValue,
            promo.maxDiscount || undefined
          );

          // Increment usage count
          await prisma.promoCode.update({
            where: { id: promo.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      const totalFare = fare.totalFare - discount;

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: req.user!.id,
          pickupLabel,
          pickupAddress,
          pickupLatitude,
          pickupLongitude,
          pickupContactName,
          pickupContactPhone,
          dropLabel,
          dropAddress,
          dropLatitude,
          dropLongitude,
          dropContactName,
          dropContactPhone,
          vehicleType,
          distance,
          duration,
          baseFare: fare.baseFare,
          distanceFare: fare.distanceFare,
          timeFare: fare.timeFare,
          discount,
          promoCode,
          totalFare,
          paymentMethod,
          packageDescription,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order created',
            },
          },
        },
        include: {
          statusHistory: true,
        },
      });

      // Emit event to notify nearby drivers
      const io = req.app.get('io');
      io.to(`drivers:${vehicleType}`).emit('newOrder', {
        orderId: order.id,
        pickup: { lat: pickupLatitude, lng: pickupLongitude, address: pickupAddress },
        drop: { lat: dropLatitude, lng: dropLongitude, address: dropAddress },
        fare: totalFare,
      });

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where: any = { userId: req.user!.id };
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            vehicleNumber: true,
            rating: true,
          },
        },
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.order.count({ where });

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            vehicleNumber: true,
            vehicleModel: true,
            rating: true,
            currentLatitude: true,
            currentLongitude: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        rating: true,
        payment: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const nonCancellableStatuses: OrderStatus[] = [
      'IN_TRANSIT',
      'DELIVERED',
      'CANCELLED',
    ];

    if (nonCancellableStatuses.includes(order.status)) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
        statusHistory: {
          create: {
            status: 'CANCELLED',
            note: reason || 'Cancelled by user',
          },
        },
      },
    });

    // Notify driver if assigned
    if (order.driverId) {
      const io = req.app.get('io');
      io.to(`driver:${order.driverId}`).emit('orderCancelled', {
        orderId: order.id,
        reason,
      });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// Rate order
router.post(
  '/:id/rate',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().isString(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { rating, review } = req.body;

      const order = await prisma.order.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.id,
          status: 'DELIVERED',
        },
      });

      if (!order) {
        throw new AppError('Order not found or not delivered', 404);
      }

      if (!order.driverId) {
        throw new AppError('No driver assigned to this order', 400);
      }

      // Check if already rated
      const existingRating = await prisma.rating.findUnique({
        where: { orderId: order.id },
      });

      if (existingRating) {
        throw new AppError('Order already rated', 400);
      }

      // Create rating
      const newRating = await prisma.rating.create({
        data: {
          orderId: order.id,
          userId: req.user!.id,
          driverId: order.driverId,
          rating,
          review,
        },
      });

      // Update driver's average rating
      const driverRatings = await prisma.rating.aggregate({
        where: { driverId: order.driverId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.driver.update({
        where: { id: order.driverId },
        data: {
          rating: driverRatings._avg.rating || 5,
          totalRatings: driverRatings._count.rating,
        },
      });

      res.json({
        success: true,
        rating: newRating,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
