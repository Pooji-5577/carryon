import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { socketService } from '../services/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinChatRoom: (orderId: string) => void;
  leaveChatRoom: (orderId: string) => void;
  sendMessage: (orderId: string, message: string) => void;
  onDriverLocationUpdate: (callback: (data: { latitude: number; longitude: number }) => void) => void;
  onOrderStatusUpdate: (callback: (data: { status: string; timestamp: string }) => void) => void;
  onDriverAssigned: (callback: (data: { driver: any }) => void) => void;
  onNewMessage: (callback: (data: { message: any }) => void) => void;
  onETAUpdate: (callback: (data: { eta: number }) => void) => void;
  offDriverLocationUpdate: (callback: (data: { latitude: number; longitude: number }) => void) => void;
  offOrderStatusUpdate: (callback: (data: { status: string; timestamp: string }) => void) => void;
  offDriverAssigned: (callback: (data: { driver: any }) => void) => void;
  offNewMessage: (callback: (data: { message: any }) => void) => void;
  offETAUpdate: (callback: (data: { eta: number }) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated]);

  const connect = async () => {
    try {
      await socketService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    socketService.disconnect();
    setIsConnected(false);
  };

  const joinOrderRoom = (orderId: string) => {
    socketService.joinOrderRoom(orderId);
  };

  const leaveOrderRoom = (orderId: string) => {
    socketService.leaveOrderRoom(orderId);
  };

  const joinChatRoom = (orderId: string) => {
    socketService.joinChatRoom(orderId);
  };

  const leaveChatRoom = (orderId: string) => {
    socketService.leaveChatRoom(orderId);
  };

  const sendMessage = (orderId: string, message: string) => {
    socketService.sendMessage(orderId, message);
  };

  const onDriverLocationUpdate = (callback: (data: { latitude: number; longitude: number }) => void) => {
    socketService.onDriverLocationUpdate(callback);
  };

  const onOrderStatusUpdate = (callback: (data: { status: string; timestamp: string }) => void) => {
    socketService.onOrderStatusUpdate(callback);
  };

  const onDriverAssigned = (callback: (data: { driver: any }) => void) => {
    socketService.onDriverAssigned(callback);
  };

  const onNewMessage = (callback: (data: { message: any }) => void) => {
    socketService.onNewMessage(callback);
  };

  const onETAUpdate = (callback: (data: { eta: number }) => void) => {
    socketService.onETAUpdate(callback);
  };

  const offDriverLocationUpdate = (callback: (data: { latitude: number; longitude: number }) => void) => {
    socketService.off('driver_location', callback);
  };

  const offOrderStatusUpdate = (callback: (data: { status: string; timestamp: string }) => void) => {
    socketService.off('order_status', callback);
  };

  const offDriverAssigned = (callback: (data: { driver: any }) => void) => {
    socketService.off('driver_assigned', callback);
  };

  const offNewMessage = (callback: (data: { message: any }) => void) => {
    socketService.off('new_message', callback);
  };

  const offETAUpdate = (callback: (data: { eta: number }) => void) => {
    socketService.off('eta_update', callback);
  };

  const value: SocketContextType = {
    isConnected,
    connect,
    disconnect,
    joinOrderRoom,
    leaveOrderRoom,
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    onDriverLocationUpdate,
    onOrderStatusUpdate,
    onDriverAssigned,
    onNewMessage,
    onETAUpdate,
    offDriverLocationUpdate,
    offOrderStatusUpdate,
    offDriverAssigned,
    offNewMessage,
    offETAUpdate,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketContext;
