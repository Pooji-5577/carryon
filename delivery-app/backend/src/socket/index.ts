import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './utils/jwt';
import logger from './utils/logger';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  driverId?: string;
  userType?: 'user' | 'driver';
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const userType = socket.handshake.auth.userType || 'user';

      if (token) {
        const decoded = verifyToken(token);
        
        if (userType === 'driver') {
          socket.driverId = decoded.userId;
        } else {
          socket.userId = decoded.userId;
        }
        socket.userType = userType;
      }

      next();
    } catch (error) {
      // Allow connection even without auth for public events
      next();
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`Socket connected: ${socket.id}, User: ${socket.userId || socket.driverId || 'anonymous'}`);

    // User joins their personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Driver joins their personal room and vehicle type room
    if (socket.driverId) {
      socket.join(`driver:${socket.driverId}`);
      
      // Get driver's vehicle type and join that room
      prisma.driver.findUnique({
        where: { id: socket.driverId },
      }).then((driver) => {
        if (driver) {
          socket.join(`drivers:${driver.vehicleType}`);
          logger.info(`Driver ${driver.name} joined ${driver.vehicleType} room`);
        }
      });
    }

    // Join order room for tracking
    socket.on('joinOrder', (orderId: string) => {
      socket.join(`order:${orderId}`);
      logger.info(`Socket ${socket.id} joined order:${orderId}`);
    });

    // Leave order room
    socket.on('leaveOrder', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      logger.info(`Socket ${socket.id} left order:${orderId}`);
    });

    // Join chat room
    socket.on('joinChat', (orderId: string) => {
      socket.join(`chat:${orderId}`);
      logger.info(`Socket ${socket.id} joined chat:${orderId}`);
    });

    // Leave chat room
    socket.on('leaveChat', (orderId: string) => {
      socket.leave(`chat:${orderId}`);
    });

    // Send chat message
    socket.on('sendMessage', async (data: { orderId: string; message: string }) => {
      try {
        const { orderId, message } = data;
        
        let senderId: string;
        let senderType: 'USER' | 'DRIVER';

        if (socket.userId) {
          senderId = socket.userId;
          senderType = 'USER';
        } else if (socket.driverId) {
          senderId = socket.driverId;
          senderType = 'DRIVER';
        } else {
          return;
        }

        const chatMessage = await prisma.chatMessage.create({
          data: {
            orderId,
            senderId,
            senderType,
            message,
          },
        });

        io.to(`chat:${orderId}`).emit('newMessage', {
          message: chatMessage,
        });
      } catch (error) {
        logger.error('Error sending message:', error);
      }
    });

    // Driver location update
    socket.on('updateLocation', async (data: { latitude: number; longitude: number }) => {
      if (!socket.driverId) return;

      try {
        const { latitude, longitude } = data;

        // Update driver location in database
        await prisma.driver.update({
          where: { id: socket.driverId },
          data: {
            currentLatitude: latitude,
            currentLongitude: longitude,
          },
        });

        // Find active order for this driver
        const activeOrder = await prisma.order.findFirst({
          where: {
            driverId: socket.driverId,
            status: {
              in: ['DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'PICKUP_COMPLETE', 'IN_TRANSIT'],
            },
          },
        });

        if (activeOrder) {
          // Emit to order room
          io.to(`order:${activeOrder.id}`).emit('driverLocation', {
            orderId: activeOrder.id,
            latitude,
            longitude,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        logger.error('Error updating location:', error);
      }
    });

    // Driver accepts order
    socket.on('acceptOrder', async (orderId: string) => {
      if (!socket.driverId) return;

      try {
        const order = await prisma.order.findFirst({
          where: {
            id: orderId,
            status: 'PENDING',
          },
        });

        if (!order) {
          socket.emit('orderError', { message: 'Order not available' });
          return;
        }

        const driver = await prisma.driver.findUnique({
          where: { id: socket.driverId },
        });

        if (!driver) return;

        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            driverId: socket.driverId,
            status: 'DRIVER_ASSIGNED',
            acceptedAt: new Date(),
            statusHistory: {
              create: {
                status: 'DRIVER_ASSIGNED',
                note: `Driver ${driver.name} assigned`,
              },
            },
          },
        });

        // Notify user
        io.to(`order:${orderId}`).emit('driverAssigned', {
          orderId,
          driver: {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            avatar: driver.avatar,
            vehicleNumber: driver.vehicleNumber,
            vehicleModel: driver.vehicleModel,
            rating: driver.rating,
            latitude: driver.currentLatitude,
            longitude: driver.currentLongitude,
          },
        });

        // Confirm to driver
        socket.emit('orderAccepted', { order: updatedOrder });

        // Notify other drivers that order is taken
        socket.to(`drivers:${order.vehicleType}`).emit('orderTaken', { orderId });
      } catch (error) {
        logger.error('Error accepting order:', error);
        socket.emit('orderError', { message: 'Failed to accept order' });
      }
    });

    // Driver updates order status
    socket.on('updateOrderStatus', async (data: { orderId: string; status: string }) => {
      if (!socket.driverId) return;

      try {
        const { orderId, status } = data;

        const order = await prisma.order.findFirst({
          where: {
            id: orderId,
            driverId: socket.driverId,
          },
        });

        if (!order) return;

        const driver = await prisma.driver.findUnique({
          where: { id: socket.driverId },
        });

        const updateData: any = {
          status,
          statusHistory: {
            create: {
              status,
              latitude: driver?.currentLatitude,
              longitude: driver?.currentLongitude,
            },
          },
        };

        if (status === 'PICKUP_COMPLETE') {
          updateData.pickedUpAt = new Date();
        } else if (status === 'DELIVERED') {
          updateData.deliveredAt = new Date();
          
          // Update driver stats
          if (socket.driverId) {
            await prisma.driver.update({
              where: { id: socket.driverId },
              data: { totalDeliveries: { increment: 1 } },
            });
          }
        }

        await prisma.order.update({
          where: { id: orderId },
          data: updateData,
        });

        // Notify user
        io.to(`order:${orderId}`).emit('orderStatusUpdate', {
          orderId,
          status,
          timestamp: new Date(),
        });
      } catch (error) {
        logger.error('Error updating order status:', error);
      }
    });

    // Driver goes online/offline
    socket.on('setOnline', async (isOnline: boolean) => {
      if (!socket.driverId) return;

      try {
        await prisma.driver.update({
          where: { id: socket.driverId },
          data: { isOnline },
        });

        logger.info(`Driver ${socket.driverId} is now ${isOnline ? 'online' : 'offline'}`);
      } catch (error) {
        logger.error('Error setting online status:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);

      // Set driver offline on disconnect
      if (socket.driverId) {
        try {
          await prisma.driver.update({
            where: { id: socket.driverId },
            data: { isOnline: false },
          });
        } catch (error) {
          logger.error('Error setting driver offline:', error);
        }
      }
    });
  });

  logger.info('Socket.IO handlers initialized');
};
