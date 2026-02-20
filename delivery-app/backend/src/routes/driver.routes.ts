import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Driver authentication middleware (simplified)
const authenticateDriver = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    // In a real app, verify JWT and get driver ID
    const driverId = req.headers['x-driver-id'];
    if (!driverId) {
      throw new AppError('Driver ID required', 401);
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId as string },
    });

    if (!driver || !driver.isActive) {
      throw new AppError('Driver not found or inactive', 401);
    }

    req.driver = driver;
    next();
  } catch (error) {
    next(error);
  }
};

// Get available orders for driver
router.get('/orders/available', authenticateDriver, async (req, res, next) => {
  try {
    const driver = req.driver;

    const orders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        vehicleType: driver.vehicleType,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// Accept order
router.post('/orders/:id/accept', authenticateDriver, async (req, res, next) => {
  try {
    const driver = req.driver;

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        status: 'PENDING',
      },
    });

    if (!order) {
      throw new AppError('Order not found or already taken', 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        driverId: driver.id,
        status: 'DRIVER_ASSIGNED',
        acceptedAt: new Date(),
        statusHistory: {
          create: {
            status: 'DRIVER_ASSIGNED',
            note: `Driver ${driver.name} assigned`,
          },
        },
      },
      include: {
        driver: true,
      },
    });

    // Notify user
    const io = req.app.get('io');
    io.to(`order:${order.id}`).emit('driverAssigned', {
      orderId: order.id,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        avatar: driver.avatar,
        vehicleNumber: driver.vehicleNumber,
        vehicleModel: driver.vehicleModel,
        rating: driver.rating,
      },
    });

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.post(
  '/orders/:id/status',
  authenticateDriver,
  [body('status').isIn(['DRIVER_ARRIVED', 'PICKUP_COMPLETE', 'IN_TRANSIT', 'DELIVERED'])],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const driver = req.driver;
      const { status, latitude, longitude } = req.body;

      const order = await prisma.order.findFirst({
        where: {
          id: req.params.id,
          driverId: driver.id,
        },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const updateData: any = {
        status,
        statusHistory: {
          create: {
            status,
            latitude,
            longitude,
          },
        },
      };

      if (status === 'PICKUP_COMPLETE') {
        updateData.pickedUpAt = new Date();
      } else if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date();
        
        // Update driver stats
        await prisma.driver.update({
          where: { id: driver.id },
          data: { totalDeliveries: { increment: 1 } },
        });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: updateData,
      });

      // Notify user
      const io = req.app.get('io');
      io.to(`order:${order.id}`).emit('orderStatusUpdate', {
        orderId: order.id,
        status,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update driver location
router.post('/location', authenticateDriver, async (req, res, next) => {
  try {
    const driver = req.driver;
    const { latitude, longitude } = req.body;

    await prisma.driver.update({
      where: { id: driver.id },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
      },
    });

    // Get active order and notify user
    const activeOrder = await prisma.order.findFirst({
      where: {
        driverId: driver.id,
        status: { in: ['DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'PICKUP_COMPLETE', 'IN_TRANSIT'] },
      },
    });

    if (activeOrder) {
      const io = req.app.get('io');
      io.to(`order:${activeOrder.id}`).emit('driverLocation', {
        orderId: activeOrder.id,
        latitude,
        longitude,
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Toggle online status
router.post('/online', authenticateDriver, async (req, res, next) => {
  try {
    const driver = req.driver;
    const { isOnline } = req.body;

    const updatedDriver = await prisma.driver.update({
      where: { id: driver.id },
      data: { isOnline },
    });

    res.json({
      success: true,
      isOnline: updatedDriver.isOnline,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
