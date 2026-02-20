import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { generateOTP, sendOTP, formatPhone } from '../utils/otp';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Send OTP
router.post(
  '/send-otp',
  [body('phone').notEmpty().withMessage('Phone number is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { phone } = req.body;
      const formattedPhone = formatPhone(phone);

      // Generate OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Delete any existing OTPs for this phone
      await prisma.oTP.deleteMany({
        where: { phone: formattedPhone },
      });

      // Save OTP
      await prisma.oTP.create({
        data: {
          phone: formattedPhone,
          code: otpCode,
          expiresAt,
        },
      });

      // Send OTP
      const sent = await sendOTP(formattedPhone, otpCode);

      if (!sent && process.env.NODE_ENV !== 'development') {
        throw new AppError('Failed to send OTP', 500);
      }

      res.json({
        success: true,
        message: 'OTP sent successfully',
        // Only include OTP in development
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify OTP
router.post(
  '/verify-otp',
  [
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { phone, otp } = req.body;
      const formattedPhone = formatPhone(phone);

      // Find OTP
      const otpRecord = await prisma.oTP.findFirst({
        where: {
          phone: formattedPhone,
          code: otp,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        throw new AppError('Invalid or expired OTP', 400);
      }

      // Mark OTP as used
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { phone: formattedPhone },
      });

      const isNewUser = !user;

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: formattedPhone,
            isVerified: true,
          },
        });
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        phone: user.phone,
      });

      res.json({
        success: true,
        message: isNewUser ? 'Account created successfully' : 'Login successful',
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        isNewUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { userId, phone } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found', 404);
    }

    const token = generateToken({
      userId: user.id,
      phone: user.phone,
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
