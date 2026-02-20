import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getAuthToken, removeAuthToken, removeUserData } from '../utils/storage';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await removeAuthToken();
      await removeUserData();
      // Navigate to login - handled by auth context
    }
    return Promise.reject(error);
  }
);

// Generic request function
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    throw new Error(message);
  }
};

// API methods
export const apiService = {
  // Auth
  sendOTP: (phone: string) =>
    request<{ success: boolean; message: string }>({
      method: 'POST',
      url: '/auth/send-otp',
      data: { phone },
    }),

  verifyOTP: (phone: string, otp: string) =>
    request<{ success: boolean; token: string; user: any }>({
      method: 'POST',
      url: '/auth/verify-otp',
      data: { phone, otp },
    }),

  loginWithEmail: (email: string, password: string) =>
    request<{ success: boolean; token: string; user: any }>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    }),

  refreshToken: () =>
    request<{ success: boolean; token: string }>({
      method: 'POST',
      url: '/auth/refresh-token',
    }),

  // User
  getProfile: () =>
    request<{ success: boolean; user: any }>({
      method: 'GET',
      url: '/user/profile',
    }),

  updateProfile: (data: any) =>
    request<{ success: boolean; user: any }>({
      method: 'PUT',
      url: '/user/profile',
      data,
    }),

  uploadAvatar: (formData: FormData) =>
    request<{ success: boolean; avatarUrl: string }>({
      method: 'POST',
      url: '/user/avatar',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Addresses
  getSavedAddresses: () =>
    request<{ success: boolean; addresses: any[] }>({
      method: 'GET',
      url: '/user/addresses',
    }),

  addAddress: (address: any) =>
    request<{ success: boolean; address: any }>({
      method: 'POST',
      url: '/user/addresses',
      data: address,
    }),

  updateAddress: (id: string, address: any) =>
    request<{ success: boolean; address: any }>({
      method: 'PUT',
      url: `/user/addresses/${id}`,
      data: address,
    }),

  deleteAddress: (id: string) =>
    request<{ success: boolean }>({
      method: 'DELETE',
      url: `/user/addresses/${id}`,
    }),

  // Vehicles
  getVehicles: () =>
    request<{ success: boolean; vehicles: any[] }>({
      method: 'GET',
      url: '/vehicles',
    }),

  // Orders
  calculateFare: (data: {
    pickupLocation: any;
    dropLocation: any;
    vehicleType: string;
    stops?: any[];
  }) =>
    request<{
      success: boolean;
      distance: number;
      duration: number;
      baseFare: number;
      distanceFare: number;
      totalFare: number;
    }>({
      method: 'POST',
      url: '/orders/calculate-fare',
      data,
    }),

  createOrder: (data: any) =>
    request<{ success: boolean; order: any }>({
      method: 'POST',
      url: '/orders',
      data,
    }),

  getOrder: (orderId: string) =>
    request<{ success: boolean; order: any }>({
      method: 'GET',
      url: `/orders/${orderId}`,
    }),

  getOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    request<{ success: boolean; orders: any[]; total: number }>({
      method: 'GET',
      url: '/orders',
      params,
    }),

  cancelOrder: (orderId: string, reason?: string) =>
    request<{ success: boolean }>({
      method: 'POST',
      url: `/orders/${orderId}/cancel`,
      data: { reason },
    }),

  rateOrder: (orderId: string, rating: number, review?: string) =>
    request<{ success: boolean }>({
      method: 'POST',
      url: `/orders/${orderId}/rate`,
      data: { rating, review },
    }),

  // Promo codes
  validatePromoCode: (code: string, orderAmount: number) =>
    request<{ success: boolean; promo: any; discount: number }>({
      method: 'POST',
      url: '/promo/validate',
      data: { code, orderAmount },
    }),

  // Payments
  createPaymentIntent: (orderId: string, paymentMethod: string) =>
    request<{ success: boolean; paymentIntent: any }>({
      method: 'POST',
      url: '/payments/create-intent',
      data: { orderId, paymentMethod },
    }),

  confirmPayment: (orderId: string, paymentId: string) =>
    request<{ success: boolean }>({
      method: 'POST',
      url: '/payments/confirm',
      data: { orderId, paymentId },
    }),

  getPaymentMethods: () =>
    request<{ success: boolean; methods: any[] }>({
      method: 'GET',
      url: '/payments/methods',
    }),

  addPaymentMethod: (data: any) =>
    request<{ success: boolean; method: any }>({
      method: 'POST',
      url: '/payments/methods',
      data,
    }),

  removePaymentMethod: (methodId: string) =>
    request<{ success: boolean }>({
      method: 'DELETE',
      url: `/payments/methods/${methodId}`,
    }),

  // Support
  getTickets: () =>
    request<{ success: boolean; tickets: any[] }>({
      method: 'GET',
      url: '/support/tickets',
    }),

  createTicket: (data: { subject: string; description: string; orderId?: string }) =>
    request<{ success: boolean; ticket: any }>({
      method: 'POST',
      url: '/support/tickets',
      data,
    }),

  getTicket: (ticketId: string) =>
    request<{ success: boolean; ticket: any }>({
      method: 'GET',
      url: `/support/tickets/${ticketId}`,
    }),

  replyToTicket: (ticketId: string, message: string) =>
    request<{ success: boolean }>({
      method: 'POST',
      url: `/support/tickets/${ticketId}/reply`,
      data: { message },
    }),

  // FAQ
  getFAQs: () =>
    request<{ success: boolean; faqs: any[] }>({
      method: 'GET',
      url: '/support/faqs',
    }),

  // Chat
  getChatMessages: (orderId: string) =>
    request<{ success: boolean; messages: any[] }>({
      method: 'GET',
      url: `/chat/${orderId}`,
    }),

  sendChatMessage: (orderId: string, message: string) =>
    request<{ success: boolean; message: any }>({
      method: 'POST',
      url: `/chat/${orderId}`,
      data: { message },
    }),
};

export default api;
