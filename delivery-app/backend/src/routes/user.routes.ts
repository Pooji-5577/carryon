import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        addresses: true,
        paymentMethods: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        addresses: user.addresses,
        paymentMethods: user.paymentMethods,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().isString(),
    body('email').optional().isEmail().withMessage('Invalid email'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { name, email, avatar } = req.body;

      // Check if email is already taken
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser && existingUser.id !== req.user!.id) {
          throw new AppError('Email already in use', 400);
        }
      }

      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(avatar && { avatar }),
        },
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user statistics
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const [totalOrders, completedOrders, avgRating, totalSaved] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, status: 'DELIVERED' } }),
      prisma.rating.aggregate({
        where: { userId },
        _avg: { rating: true },
      }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { discount: true },
      }),
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        avgRating: avgRating._avg.rating || 0,
        totalSaved: totalSaved._sum.discount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get notifications
router.get('/notifications', authenticate, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticate, async (req, res, next) => {
  try {
    await prisma.notification.update({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
