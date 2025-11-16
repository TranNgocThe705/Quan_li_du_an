import express from 'express';
import { body } from 'express-validator';
import {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  updateMemberRole,
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createWorkspaceValidation = [
  body('name').trim().notEmpty().withMessage('Workspace name is required'),
  body('slug').optional().trim(),
  body('description').optional().trim(),
];

const updateWorkspaceValidation = [
  body('name').optional().trim().notEmpty().withMessage('Workspace name cannot be empty'),
  body('slug').optional().trim(),
];

const addMemberValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').optional().isIn(['ADMIN', 'MEMBER']).withMessage('Invalid role'),
];

const updateMemberRoleValidation = [
  body('role').isIn(['ADMIN', 'MEMBER']).withMessage('Invalid role'),
];

// Workspace routes
router.get('/', protect, getWorkspaces);
router.post('/', protect, createWorkspaceValidation, validate, createWorkspace);
router.get('/:id', protect, getWorkspaceById);
router.put('/:id', protect, updateWorkspaceValidation, validate, updateWorkspace);
router.delete('/:id', protect, deleteWorkspace);

// Member management routes
router.post('/:id/members', protect, addMemberValidation, validate, addMember);
router.delete('/:id/members/:memberId', protect, removeMember);
router.put('/:id/members/:memberId', protect, updateMemberRoleValidation, validate, updateMemberRole);

export default router;
