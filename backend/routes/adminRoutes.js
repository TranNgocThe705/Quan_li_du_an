import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllWorkspaces,
  deleteWorkspace,
  getAllProjects,
  deleteProject,
  getSystemStats,
  getActivityLogs,
} from '../controllers/adminController.js';
import { protect, isSuperAdmin, isSystemAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and system admin privileges
router.use(protect);

// Dashboard
router.get('/dashboard', isSystemAdmin, getAdminDashboard);

// User management routes
router.get('/users', isSystemAdmin, getAllUsers);
router.get('/users/:id', isSystemAdmin, getUserDetails);
router.put('/users/:id/role', isSuperAdmin, updateUserRole);
router.put('/users/:id/status', isSystemAdmin, updateUserStatus);
router.delete('/users/:id', isSuperAdmin, deleteUser);

// Workspace management routes
router.get('/workspaces', isSystemAdmin, getAllWorkspaces);
router.delete('/workspaces/:id', isSuperAdmin, deleteWorkspace);

// Project management routes
router.get('/projects', isSystemAdmin, getAllProjects);
router.delete('/projects/:id', isSuperAdmin, deleteProject);

// System statistics
router.get('/stats', isSystemAdmin, getSystemStats);

// Activity logs
router.get('/logs', isSystemAdmin, getActivityLogs);

export default router;
