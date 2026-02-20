import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Initialize payment gateways
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create Razorpay order
router.post('/razorpay/create-order', authenticate, async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user!.id,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId,
        userId: req.user!.id,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: 'UPI', // Will be updated after payment
        gatewayOrderId: razorpayOrder.id,
      },
    });

    res.json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', authenticate, async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Update payment and order
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          gatewayId: razorpay_payment_id,
          gatewaySignature: razorpay_signature,
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          paymentId: razorpay_payment_id,
        },
      }),
    ]);

    res.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Create Stripe Payment Intent
router.post('/stripe/create-intent', authenticate, async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user!.id,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in smallest currency unit
      currency: 'inr',
      metadata: {
        orderId,
        userId: req.user!.id,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: 'CARD',
        gatewayOrderId: paymentIntent.id,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

// Stripe webhook handler
router.post('/stripe/webhook', async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      logger.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      await prisma.$transaction([
        prisma.payment.update({
          where: { gatewayOrderId: paymentIntent.id },
          data: {
            status: 'COMPLETED',
            gatewayId: paymentIntent.id,
          },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'COMPLETED',
            paymentId: paymentIntent.id,
          },
        }),
      ]);

      logger.info(`Payment succeeded for order ${orderId}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// Get saved payment methods
router.get('/methods', authenticate, async (req, res, next) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: req.user!.id },
      orderBy: { isDefault: 'desc' },
    });

    res.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    next(error);
  }
});

// Add payment method
router.post(
  '/methods',
  authenticate,
  [
    body('type').isIn(['CARD', 'UPI', 'WALLET']).withMessage('Invalid payment type'),
    body('name').notEmpty().withMessage('Name is required'),
    body('details').notEmpty().withMessage('Details required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { type, name, details, isDefault } = req.body;

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.paymentMethod.updateMany({
          where: { userId: req.user!.id },
          data: { isDefault: false },
        });
      }

      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId: req.user!.id,
          type,
          name,
          details,
          isDefault: isDefault || false,
        },
      });

      res.status(201).json({
        success: true,
        paymentMethod,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete payment method
router.delete('/methods/:id', authenticate, async (req, res, next) => {
  try {
    await prisma.paymentMethod.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
