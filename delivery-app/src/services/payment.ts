import { apiService } from './api';

export interface PaymentConfig {
  razorpayKeyId: string;
  stripePublishableKey: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  clientSecret?: string;
  razorpayOrderId?: string;
}

class PaymentService {
  private config: PaymentConfig = {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  };

  // Create payment intent
  async createPaymentIntent(
    orderId: string,
    paymentMethod: 'upi' | 'card' | 'wallet' | 'cash'
  ): Promise<PaymentIntent> {
    const response = await apiService.createPaymentIntent(orderId, paymentMethod);
    return response.paymentIntent;
  }

  // Process Razorpay payment
  async processRazorpayPayment(options: {
    orderId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    // This would integrate with RazorpayCheckout in a real implementation
    // For now, we'll simulate the flow
    try {
      // In real implementation:
      // import RazorpayCheckout from 'react-native-razorpay';
      // const data = await RazorpayCheckout.open({
      //   key: this.config.razorpayKeyId,
      //   amount: options.amount * 100, // in paise
      //   currency: options.currency,
      //   name: 'DeliveryApp',
      //   description: `Payment for Order #${options.orderId}`,
      //   order_id: options.razorpayOrderId,
      //   prefill: {
      //     name: options.customerName,
      //     email: options.customerEmail,
      //     contact: options.customerPhone,
      //   },
      //   theme: { color: '#FF6B00' },
      // });
      
      return {
        success: true,
        paymentId: `pay_${Date.now()}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }
  }

  // Process Stripe payment
  async processStripePayment(options: {
    clientSecret: string;
    paymentMethodId: string;
  }): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    // This would integrate with Stripe SDK in a real implementation
    try {
      // In real implementation:
      // import { confirmPayment } from '@stripe/stripe-react-native';
      // const { paymentIntent, error } = await confirmPayment(options.clientSecret, {
      //   paymentMethodType: 'Card',
      //   paymentMethodData: { paymentMethodId: options.paymentMethodId },
      // });
      
      return {
        success: true,
        paymentId: `pi_${Date.now()}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }
  }

  // Process UPI payment
  async processUPIPayment(options: {
    orderId: string;
    amount: number;
    upiId: string;
  }): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // UPI deep link or SDK integration would go here
      // For demo purposes, simulating success
      return {
        success: true,
        paymentId: `upi_${Date.now()}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'UPI payment failed',
      };
    }
  }

  // Confirm payment on backend
  async confirmPayment(orderId: string, paymentId: string): Promise<boolean> {
    try {
      await apiService.confirmPayment(orderId, paymentId);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get saved payment methods
  async getSavedPaymentMethods(): Promise<any[]> {
    try {
      const response = await apiService.getPaymentMethods();
      return response.methods;
    } catch (error) {
      return [];
    }
  }

  // Add payment method
  async addPaymentMethod(method: any): Promise<any | null> {
    try {
      const response = await apiService.addPaymentMethod(method);
      return response.method;
    } catch (error) {
      return null;
    }
  }

  // Remove payment method
  async removePaymentMethod(methodId: string): Promise<boolean> {
    try {
      await apiService.removePaymentMethod(methodId);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
