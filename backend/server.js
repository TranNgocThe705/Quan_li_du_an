import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/database.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import passport from './config/passport.js';
import CronService from './services/cronService.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import approvalPolicyRoutes from './routes/approvalPolicyRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://management.enroseze.id.vn',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Logger middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Project Management API Server',
    version: '1.0.0',
    status: 'Running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/approval-policies', approvalPolicyRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start cron jobs
    CronService.start();
    
    // Then start the server
    server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\n❌ Unhandled Promise Rejection:`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}\n`);
  
  // Close server & exit process gracefully
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
  
  // Close server & exit process gracefully
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
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM signal received: closing HTTP server gracefully');
  CronService.stop();
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  }
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n👋 SIGINT signal received: closing HTTP server gracefully');
  CronService.stop();
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  }
});
