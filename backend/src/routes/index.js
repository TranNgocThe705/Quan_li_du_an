/**
 * Routes Index
 * Central configuration for all API routes
 */

import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import workspaceRoutes from './workspaceRoutes.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import commentRoutes from './commentRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import aiRoutes from './aiRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import attachmentRoutes from './attachment.routes.js';
import progressRoutes from './progressRoutes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/permissions', permissionRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/progress', progressRoutes);
router.use('/', attachmentRoutes); // Mount at root to support /tasks/:id/attachments

export default router;
