import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Address, Vehicle, Order } from '../types';
import { apiService } from '../services/api';

interface BookingState {
  pickupLocation: Address | null;
  dropLocation: Address | null;
  stops: Address[];
  selectedVehicle: Vehicle | null;
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  discount: number;
  totalFare: number;
  promoCode: string | null;
  paymentMethod: 'cash' | 'upi' | 'card' | 'wallet';
  scheduledAt: Date | null;
}

interface BookingContextType {
  booking: BookingState;
  currentOrder: Order | null;
  isCalculatingFare: boolean;
  
  // Location actions
  setPickupLocation: (location: Address) => void;
  setDropLocation: (location: Address) => void;
  addStop: (location: Address) => void;
  removeStop: (index: number) => void;
  updateStop: (index: number, location: Address) => void;
  swapLocations: () => void;
  
  // Vehicle actions
  setSelectedVehicle: (vehicle: Vehicle) => void;
  
  // Fare actions
  calculateFare: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message?: string }>;
  removePromoCode: () => void;
  
  // Payment actions
  setPaymentMethod: (method: 'cash' | 'upi' | 'card' | 'wallet') => void;
  
  // Scheduling
  setScheduledAt: (date: Date | null) => void;
  
  // Order actions
  createOrder: () => Promise<Order | null>;
  setCurrentOrder: (order: Order | null) => void;
  cancelOrder: (reason?: string) => Promise<boolean>;
  
  // Reset
  resetBooking: () => void;
}

const initialBookingState: BookingState = {
  pickupLocation: null,
  dropLocation: null,
  stops: [],
  selectedVehicle: null,
  distance: 0,
  duration: 0,
  baseFare: 0,
  distanceFare: 0,
  discount: 0,
  totalFare: 0,
  promoCode: null,
  paymentMethod: 'cash',
  scheduledAt: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [booking, setBooking] = useState<BookingState>(initialBookingState);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isCalculatingFare, setIsCalculatingFare] = useState(false);

  const setPickupLocation = (location: Address) => {
    setBooking((prev) => ({ ...prev, pickupLocation: location }));
  };

  const setDropLocation = (location: Address) => {
    setBooking((prev) => ({ ...prev, dropLocation: location }));
  };

  const addStop = (location: Address) => {
    setBooking((prev) => ({
      ...prev,
      stops: [...prev.stops, location],
    }));
  };

  const removeStop = (index: number) => {
    setBooking((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const updateStop = (index: number, location: Address) => {
    setBooking((prev) => ({
      ...prev,
      stops: prev.stops.map((stop, i) => (i === index ? location : stop)),
    }));
  };

  const swapLocations = () => {
    setBooking((prev) => ({
      ...prev,
      pickupLocation: prev.dropLocation,
      dropLocation: prev.pickupLocation,
    }));
  };

  const setSelectedVehicle = (vehicle: Vehicle) => {
    setBooking((prev) => ({ ...prev, selectedVehicle: vehicle }));
  };

  const calculateFare = async () => {
    if (!booking.pickupLocation || !booking.dropLocation || !booking.selectedVehicle) {
      return;
    }

    setIsCalculatingFare(true);
    try {
      const response = await apiService.calculateFare({
        pickupLocation: {
          latitude: booking.pickupLocation.latitude,
          longitude: booking.pickupLocation.longitude,
        },
        dropLocation: {
          latitude: booking.dropLocation.latitude,
          longitude: booking.dropLocation.longitude,
        },
        vehicleType: booking.selectedVehicle.type,
        stops: booking.stops.map((stop) => ({
          latitude: stop.latitude,
          longitude: stop.longitude,
        })),
      });

      if (response.success) {
        setBooking((prev) => ({
          ...prev,
          distance: response.distance,
          duration: response.duration,
          baseFare: response.baseFare,
          distanceFare: response.distanceFare,
          totalFare: response.totalFare - prev.discount,
        }));
      }
    } catch (error) {
      console.error('Failed to calculate fare:', error);
    } finally {
      setIsCalculatingFare(false);
    }
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.validatePromoCode(code, booking.totalFare + booking.discount);
      if (response.success) {
        setBooking((prev) => ({
          ...prev,
          promoCode: code,
          discount: response.discount,
          totalFare: prev.baseFare + prev.distanceFare - response.discount,
        }));
        return { success: true };
      }
      return { success: false, message: 'Invalid promo code' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const removePromoCode = () => {
    setBooking((prev) => ({
      ...prev,
      promoCode: null,
      discount: 0,
      totalFare: prev.baseFare + prev.distanceFare,
    }));
  };

  const setPaymentMethod = (method: 'cash' | 'upi' | 'card' | 'wallet') => {
    setBooking((prev) => ({ ...prev, paymentMethod: method }));
  };

  const setScheduledAt = (date: Date | null) => {
    setBooking((prev) => ({ ...prev, scheduledAt: date }));
  };

  const createOrder = async (): Promise<Order | null> => {
    if (!booking.pickupLocation || !booking.dropLocation || !booking.selectedVehicle) {
      return null;
    }

    try {
      const response = await apiService.createOrder({
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        stops: booking.stops,
        vehicleType: booking.selectedVehicle.type,
        distance: booking.distance,
        duration: booking.duration,
        baseFare: booking.baseFare,
        distanceFare: booking.distanceFare,
        discount: booking.discount,
        totalFare: booking.totalFare,
        promoCode: booking.promoCode,
        paymentMethod: booking.paymentMethod,
        scheduledAt: booking.scheduledAt?.toISOString(),
      });

      if (response.success && response.order) {
        setCurrentOrder(response.order);
        return response.order;
      }
      return null;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  };

  const cancelOrder = async (reason?: string): Promise<boolean> => {
    if (!currentOrder) return false;

    try {
      await apiService.cancelOrder(currentOrder.id, reason);
      setCurrentOrder(null);
      resetBooking();
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  };

  const resetBooking = () => {
    setBooking(initialBookingState);
  };

  const value: BookingContextType = {
    booking,
    currentOrder,
    isCalculatingFare,
    setPickupLocation,
    setDropLocation,
    addStop,
    removeStop,
    updateStop,
    swapLocations,
    setSelectedVehicle,
    calculateFare,
    applyPromoCode,
    removePromoCode,
    setPaymentMethod,
    setScheduledAt,
    createOrder,
    setCurrentOrder,
    cancelOrder,
    resetBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export default BookingContext;
