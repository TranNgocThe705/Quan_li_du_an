import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

// Store active users: { userId: socketId }
const activeUsers = new Map();

// Store typing users per task: { taskId: Set of userIds }
const typingUsers = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    // Store active user
    activeUsers.set(socket.user._id.toString(), socket.id);

    // Join user to their personal room
    socket.join(`user:${socket.user._id}`);

    // Emit online status to all users
    io.emit('user:online', {
      userId: socket.user._id,
      name: socket.user.name,
      avatar: socket.user.avatar,
    });

    // Join task room
    socket.on('task:join', (taskId) => {
      socket.join(`task:${taskId}`);
      console.log(`User ${socket.user.name} joined task room: ${taskId}`);
    });

    // Leave task room
    socket.on('task:leave', (taskId) => {
      socket.leave(`task:${taskId}`);
      console.log(`User ${socket.user.name} left task room: ${taskId}`);
      
      // Remove from typing users
      if (typingUsers.has(taskId)) {
        typingUsers.get(taskId).delete(socket.user._id.toString());
        if (typingUsers.get(taskId).size === 0) {
          typingUsers.delete(taskId);
        }
      }
    });

    // User is typing
    socket.on('comment:typing:start', (taskId) => {
      if (!typingUsers.has(taskId)) {
        typingUsers.set(taskId, new Set());
      }
      typingUsers.get(taskId).add(socket.user._id.toString());

      // Broadcast to others in the room (exclude sender)
      socket.to(`task:${taskId}`).emit('comment:typing', {
        taskId,
        user: {
          _id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        isTyping: true,
      });
    });

    // User stopped typing
    socket.on('comment:typing:stop', (taskId) => {
      if (typingUsers.has(taskId)) {
        typingUsers.get(taskId).delete(socket.user._id.toString());
      }

      socket.to(`task:${taskId}`).emit('comment:typing', {
        taskId,
        user: {
          _id: socket.user._id,
          name: socket.user.name,
        },
        isTyping: false,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);

      // Remove from active users
      activeUsers.delete(socket.user._id.toString());

      // Remove from all typing indicators
      typingUsers.forEach((users, taskId) => {
        if (users.has(socket.user._id.toString())) {
          users.delete(socket.user._id.toString());
          io.to(`task:${taskId}`).emit('comment:typing', {
            taskId,
            user: {
              _id: socket.user._id,
              name: socket.user.name,
            },
            isTyping: false,
          });
        }
      });

      // Emit offline status
      io.emit('user:offline', {
        userId: socket.user._id,
      });
    });
  });

  return io;
};

// Helper functions to emit events from controllers
export const emitNewComment = (taskId, comment) => {
  if (io) {
    io.to(`task:${taskId}`).emit('comment:new', comment);
  }
};

export const emitDeleteComment = (taskId, commentId) => {
  if (io) {
    io.to(`task:${taskId}`).emit('comment:delete', { commentId });
  }
};

export const emitUpdateComment = (taskId, comment) => {
  if (io) {
    io.to(`task:${taskId}`).emit('comment:update', comment);
  }
};

export const emitNewAttachment = (taskId, attachment) => {
  if (io) {
    io.to(`task:${taskId}`).emit('attachment:new', attachment);
  }
};

export const emitDeleteAttachment = (taskId, attachmentId) => {
  if (io) {
    io.to(`task:${taskId}`).emit('attachment:delete', { attachmentId });
  }
};

export const getIO = () => io;

export default initializeSocket;
