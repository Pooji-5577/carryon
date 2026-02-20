import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get user's support tickets
router.get('/tickets', authenticate, async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user!.id },
      include: {
        replies: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    next(error);
  }
});

// Get single ticket
router.get('/tickets/:id', authenticate, async (req, res, next) => {
  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
});

// Create support ticket
router.post(
  '/tickets',
  authenticate,
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { category, subject, description, orderId } = req.body;

      const ticket = await prisma.supportTicket.create({
        data: {
          userId: req.user!.id,
          category,
          subject,
          description,
          orderId,
        },
      });

      res.status(201).json({
        success: true,
        ticket,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add reply to ticket
router.post(
  '/tickets/:id/reply',
  authenticate,
  [body('message').notEmpty().withMessage('Message is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const ticket = await prisma.supportTicket.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.id,
        },
      });

      if (!ticket) {
        throw new AppError('Ticket not found', 404);
      }

      const { message } = req.body;

      const reply = await prisma.ticketReply.create({
        data: {
          ticketId: ticket.id,
          message,
          isStaff: false,
        },
      });

      // Reopen ticket if closed
      if (ticket.status === 'CLOSED' || ticket.status === 'RESOLVED') {
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: { status: 'OPEN' },
        });
      }

      res.status(201).json({
        success: true,
        reply,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Close ticket
router.post('/tickets/:id/close', authenticate, async (req, res, next) => {
  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: { status: 'CLOSED' },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
