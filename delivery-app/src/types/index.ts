// User type
export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Address type
export interface Address {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

// Location type
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  placeId?: string;
}

// Vehicle type
export interface Vehicle {
  id: string;
  type: 'bike' | 'car' | 'van' | 'truck';
  name: string;
  description: string;
  capacity: string;
  maxWeight: string;
  basePrice: number;
  pricePerKm: number;
  icon: string;
  image: string;
}

// Driver type
export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalRides: number;
  vehicleType: string;
  vehicleNumber: string;
  vehicleModel: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
}

// Order status
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'pickup_complete'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

// Order type
export interface Order {
  id: string;
  userId: string;
  driverId?: string;
  driver?: Driver;
  
  // Locations
  pickupLocation: Address;
  dropLocation: Address;
  stops?: Address[];
  
  // Vehicle
  vehicleType: string;
  vehicle?: Vehicle;
  
  // Pricing
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  discount: number;
  totalFare: number;
  promoCode?: string;
  
  // Status
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  
  // Payment
  paymentMethod: 'cash' | 'upi' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  completedAt?: string;
  
  // Rating
  rating?: number;
  review?: string;
}

// Chat message type
export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'user' | 'driver';
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Payment method type
export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet' | 'cash';
  label: string;
  details?: string;
  isDefault: boolean;
}

// Support ticket type
export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: {
    id: string;
    senderId: string;
    senderType: 'user' | 'support';
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Promo code type
export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Navigation params
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: { phone: string };
  Home: undefined;
  LocationSearch: { type: 'pickup' | 'drop' };
  VehicleSelection: undefined;
  PriceEstimation: undefined;
  DriverMatching: undefined;
  LiveTracking: { orderId: string };
  Chat: { orderId: string; driverId: string };
  Payment: { totalAmount?: number; senderName?: string; senderPhone?: string; receiverName?: string; receiverPhone?: string; notes?: string };
  PaymentSuccess: { amount?: number; bookingId?: string; paymentMethod?: string };
  OrderHistory: undefined;
  OrderDetails: { orderId: string };
  Rating: { orderId: string };
  Profile: undefined;
  EditProfile: undefined;
  SavedAddresses: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  Help: undefined;
  FAQ: undefined;
  SupportTickets: undefined;
  CreateTicket: { orderId?: string };
  TicketDetails: { ticketId: string };
  ReadyToBook: undefined;
  ActiveShipment: undefined;
  DeliveryDetails: { orderId: string };
  SenderReceiver: undefined;
  BookingConfirmed: { bookingId?: string; paymentMethod?: string; totalAmount?: number; pickupAddress?: string; deliveryAddress?: string; vehicle?: string };
};
