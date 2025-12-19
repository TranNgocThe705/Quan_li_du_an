import express from 'express';
import { body } from 'express-validator';
import {
  getUserWorkspacePermissions,
  getUserProjectPermissions,
  getUserPermissionsSummary,
  checkUserPermission,
} from '../controllers/permissionController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const checkPermissionValidation = [
  body('resourceType').isIn(['workspace', 'project']).withMessage('Invalid resource type'),
  body('resourceId').notEmpty().withMessage('Resource ID is required'),
  body('permission').notEmpty().withMessage('Permission is required'),
];

// Permission routes
router.get('/summary', protect, getUserPermissionsSummary);
router.get('/workspace/:workspaceId', protect, getUserWorkspacePermissions);
router.get('/project/:projectId', protect, getUserProjectPermissions);
router.post('/check', protect, checkPermissionValidation, validate, checkUserPermission);

export default router;
