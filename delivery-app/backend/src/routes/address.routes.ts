import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get saved addresses
router.get('/', authenticate, async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    next(error);
  }
});

// Add address
router.post(
  '/',
  authenticate,
  [
    body('label').notEmpty().withMessage('Label is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('latitude').isFloat().withMessage('Invalid latitude'),
    body('longitude').isFloat().withMessage('Invalid longitude'),
    body('type').isIn(['HOME', 'WORK', 'OTHER']).withMessage('Invalid address type'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { label, address, latitude, longitude, type, isDefault } = req.body;

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.user!.id },
          data: { isDefault: false },
        });
      }

      const newAddress = await prisma.address.create({
        data: {
          userId: req.user!.id,
          label,
          address,
          latitude,
          longitude,
          type,
          isDefault: isDefault || false,
        },
      });

      res.status(201).json({
        success: true,
        address: newAddress,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update address
router.put(
  '/:id',
  authenticate,
  [
    body('label').optional().notEmpty(),
    body('address').optional().notEmpty(),
    body('latitude').optional().isFloat(),
    body('longitude').optional().isFloat(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { label, address, latitude, longitude, type, isDefault } = req.body;

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.user!.id },
          data: { isDefault: false },
        });
      }

      const updatedAddress = await prisma.address.updateMany({
        where: {
          id: req.params.id,
          userId: req.user!.id,
        },
        data: {
          ...(label && { label }),
          ...(address && { address }),
          ...(latitude && { latitude }),
          ...(longitude && { longitude }),
          ...(type && { type }),
          ...(isDefault !== undefined && { isDefault }),
        },
      });

      if (updatedAddress.count === 0) {
        throw new AppError('Address not found', 404);
      }

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// Delete address
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const deleted = await prisma.address.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (deleted.count === 0) {
      throw new AppError('Address not found', 404);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
