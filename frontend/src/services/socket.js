import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.IO connection
 * @param {string} token - JWT token for authentication
 */
export const initializeSocket = (token) => {
  if (socket) {
    return socket;
  }

  const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.IO disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized. Call initializeSocket() first.');
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

/**
 * Join a task room for real-time updates
 * @param {string} taskId - Task ID
 */
export const joinTaskRoom = (taskId) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.emit('task:join', taskId);
    console.log(`Joined task room: ${taskId}`);
  }
};

/**
 * Leave a task room
 * @param {string} taskId - Task ID
 */
export const leaveTaskRoom = (taskId) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.emit('task:leave', taskId);
    console.log(`Left task room: ${taskId}`);
  }
};

/**
 * Emit typing start event
 * @param {string} taskId - Task ID
 */
export const emitTypingStart = (taskId) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.emit('comment:typing:start', taskId);
  }
};

/**
 * Emit typing stop event
 * @param {string} taskId - Task ID
 */
export const emitTypingStop = (taskId) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.emit('comment:typing:stop', taskId);
  }
};

/**
 * Listen for new comments
 * @param {Function} callback - Callback function
 */
export const onNewComment = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('comment:new', callback);
  }
};

/**
 * Listen for updated comments
 * @param {Function} callback - Callback function
 */
export const onUpdateComment = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('comment:update', callback);
  }
};

/**
 * Listen for deleted comments
 * @param {Function} callback - Callback function
 */
export const onDeleteComment = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('comment:delete', callback);
  }
};

/**
 * Listen for typing indicator
 * @param {Function} callback - Callback function
 */
export const onTyping = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('comment:typing', callback);
  }
};

/**
 * Listen for new attachments
 * @param {Function} callback - Callback function
 */
export const onNewAttachment = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('attachment:new', callback);
  }
};

/**
 * Listen for deleted attachments
 * @param {Function} callback - Callback function
 */
export const onDeleteAttachment = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('attachment:delete', callback);
  }
};

/**
 * Listen for user online status
 * @param {Function} callback - Callback function
 */
export const onUserOnline = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('user:online', callback);
  }
};

/**
 * Listen for user offline status
 * @param {Function} callback - Callback function
 */
export const onUserOffline = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('user:offline', callback);
  }
};

/**
 * Remove all listeners
 */
export const removeAllListeners = () => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.removeAllListeners();
  }
};
