import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../utils/storage';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  async connect(): Promise<void> {
    if (this.socket?.connected) return;

    const token = await getAuthToken();
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Re-attach all listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback as any);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    this.socket?.on(event, callback as any);
  }

  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
    this.socket?.off(event, callback as any);
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  // Order tracking
  joinOrderRoom(orderId: string): void {
    this.emit('join_order', { orderId });
  }

  leaveOrderRoom(orderId: string): void {
    this.emit('leave_order', { orderId });
  }

  onDriverLocationUpdate(callback: (data: { latitude: number; longitude: number }) => void): void {
    this.on('driver_location', callback);
  }

  onOrderStatusUpdate(callback: (data: { status: string; timestamp: string }) => void): void {
    this.on('order_status', callback);
  }

  onDriverAssigned(callback: (data: { driver: any }) => void): void {
    this.on('driver_assigned', callback);
  }

  // Chat
  joinChatRoom(orderId: string): void {
    this.emit('join_chat', { orderId });
  }

  leaveChatRoom(orderId: string): void {
    this.emit('leave_chat', { orderId });
  }

  sendMessage(orderId: string, message: string): void {
    this.emit('send_message', { orderId, message });
  }

  onNewMessage(callback: (data: { message: any }) => void): void {
    this.on('new_message', callback);
  }

  onMessageRead(callback: (data: { messageId: string }) => void): void {
    this.on('message_read', callback);
  }

  // Driver matching
  onSearchingDrivers(callback: () => void): void {
    this.on('searching_drivers', callback);
  }

  onNoDriversAvailable(callback: () => void): void {
    this.on('no_drivers_available', callback);
  }

  // ETA updates
  onETAUpdate(callback: (data: { eta: number }) => void): void {
    this.on('eta_update', callback);
  }
}

export const socketService = new SocketService();
export default socketService;
