import { VehicleType } from '@prisma/client';

// Base fares for each vehicle type (in INR)
const BASE_FARES: Record<VehicleType, number> = {
  BIKE: 30,
  CAR: 80,
  VAN: 150,
  TRUCK: 300,
};

// Per KM rates
const PER_KM_RATES: Record<VehicleType, number> = {
  BIKE: 8,
  CAR: 12,
  VAN: 18,
  TRUCK: 25,
};

// Per minute rates (for traffic/waiting)
const PER_MINUTE_RATES: Record<VehicleType, number> = {
  BIKE: 1,
  CAR: 1.5,
  VAN: 2,
  TRUCK: 2.5,
};

// Weight capacity in KG
export const WEIGHT_CAPACITY: Record<VehicleType, number> = {
  BIKE: 20,
  CAR: 100,
  VAN: 500,
  TRUCK: 2000,
};

interface FareCalculationResult {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  totalFare: number;
}

export const calculateFare = (
  vehicleType: VehicleType,
  distanceInMeters: number,
  durationInSeconds: number
): FareCalculationResult => {
  const distanceInKm = distanceInMeters / 1000;
  const durationInMinutes = durationInSeconds / 60;

  const baseFare = BASE_FARES[vehicleType];
  const distanceFare = Math.round(distanceInKm * PER_KM_RATES[vehicleType]);
  const timeFare = Math.round(durationInMinutes * PER_MINUTE_RATES[vehicleType]);

  const totalFare = baseFare + distanceFare + timeFare;

  return {
    baseFare,
    distanceFare,
    timeFare,
    totalFare: Math.round(totalFare),
  };
};

export const applyDiscount = (
  totalFare: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number,
  maxDiscount?: number
): number => {
  let discount = 0;

  if (discountType === 'PERCENTAGE') {
    discount = (totalFare * discountValue) / 100;
  } else {
    discount = discountValue;
  }

  // Apply max discount cap
  if (maxDiscount && discount > maxDiscount) {
    discount = maxDiscount;
  }

  return Math.round(discount);
};
