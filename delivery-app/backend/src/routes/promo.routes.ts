import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Validate promo code
router.post('/validate', authenticate, async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      throw new AppError('Invalid promo code', 400);
    }

    if (!promo.isActive) {
      throw new AppError('This promo code is no longer active', 400);
    }

    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      throw new AppError('This promo code has expired', 400);
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      throw new AppError('This promo code has reached its usage limit', 400);
    }

    if (promo.minOrderAmount && orderAmount < promo.minOrderAmount) {
      throw new AppError(
        `Minimum order amount is ₹${promo.minOrderAmount}`,
        400
      );
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discount = (orderAmount * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }

    // Apply max discount cap
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }

    res.json({
      success: true,
      promo: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discount: Math.round(discount),
        maxDiscount: promo.maxDiscount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get available promo codes (for listing)
router.get('/available', authenticate, async (req, res, next) => {
  try {
    const now = new Date();

    const promoCodes = await prisma.promoCode.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
        OR: [
          { maxUses: null },
          {
            maxUses: { gt: prisma.promoCode.fields.usedCount },
          },
        ],
      },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        maxDiscount: true,
        minOrderAmount: true,
        validUntil: true,
      },
      orderBy: { discountValue: 'desc' },
    });

    res.json({
      success: true,
      promoCodes,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
