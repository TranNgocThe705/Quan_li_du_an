/**
 * Server Entry Point
 * Starts the HTTP server and handles graceful shutdown
 */

import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/database.js';
import initializeSocket from './config/socket.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
let server;
let io;

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize Socket.IO
    io = initializeSocket(httpServer);
    console.log('✅ Socket.IO initialized');
    
    // Start the HTTP server
    server = httpServer.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log(`🔌 WebSocket ready for real-time features\n`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = (signal) => {
  console.log(`\n👋 ${signal} signal received: closing HTTP server gracefully`);
  if (io) {
    io.close(() => {
      console.log('Socket.IO connections closed');
    });
  }
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\n❌ Unhandled Promise Rejection:`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}\n`);
  
  if (server) {
    server.close(() => {
      console.log('Server closed due to unhandled rejection');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`\n❌ Uncaught Exception:`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}\n`);
  
  if (server) {
    server.close(() => {
      console.log('Server closed due to uncaught exception');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM signal (graceful shutdown)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
