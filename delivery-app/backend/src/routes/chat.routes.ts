import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get chat messages for an order
router.get('/:orderId/messages', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.orderId,
        userId: req.user!.id,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const messages = await prisma.chatMessage.findMany({
      where: { orderId: req.params.orderId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// Send message
router.post(
  '/:orderId/messages',
  authenticate,
  [body('message').notEmpty().withMessage('Message is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const order = await prisma.order.findFirst({
        where: {
          id: req.params.orderId,
          userId: req.user!.id,
        },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const { message } = req.body;

      const chatMessage = await prisma.chatMessage.create({
        data: {
          orderId: order.id,
          senderId: req.user!.id,
          senderType: 'USER',
          message,
        },
      });

      // Notify driver via socket
      if (order.driverId) {
        const io = req.app.get('io');
        io.to(`chat:${order.id}`).emit('newMessage', {
          message: chatMessage,
        });
      }

      res.status(201).json({
        success: true,
        message: chatMessage,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Mark messages as read
router.post('/:orderId/read', authenticate, async (req, res, next) => {
  try {
    await prisma.chatMessage.updateMany({
      where: {
        orderId: req.params.orderId,
        senderType: 'DRIVER',
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
