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
  inviteMemberByEmail,
  transferOwnership,
} from '../controllers/workspaceController.js';
import { protect, isSystemAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { 
  checkWorkspaceMember, 
  checkWorkspaceAdmin,
  checkWorkspaceOwner 
} from '../middleware/checkPermission.js';

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

const inviteMemberByEmailValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['ADMIN', 'MEMBER']).withMessage('Invalid role'),
];

const updateMemberRoleValidation = [
  body('role').isIn(['ADMIN', 'MEMBER']).withMessage('Invalid role'),
];

const transferOwnershipValidation = [
  body('newOwnerId').notEmpty().withMessage('New owner ID is required'),
];

// Workspace routes
router.get('/', protect, getWorkspaces);
router.post('/', protect, createWorkspaceValidation, validate, createWorkspace);
router.get('/:id', protect, checkWorkspaceMember, getWorkspaceById);
router.put('/:id', protect, checkWorkspaceAdmin, updateWorkspaceValidation, validate, updateWorkspace);
router.delete('/:id', protect, checkWorkspaceOwner, deleteWorkspace);

// Member management routes (Admin only)
router.post('/:id/members', protect, checkWorkspaceAdmin, addMemberValidation, validate, addMember);
router.post('/:id/invite-member', protect, checkWorkspaceAdmin, inviteMemberByEmailValidation, validate, inviteMemberByEmail);
router.delete('/:id/members/:memberId', protect, checkWorkspaceAdmin, removeMember);
router.put('/:id/members/:memberId', protect, checkWorkspaceAdmin, updateMemberRoleValidation, validate, updateMemberRole);

// Ownership transfer (System Admin only)
router.put('/:id/transfer-ownership', protect, isSystemAdmin, transferOwnershipValidation, validate, transferOwnership);

export default router;
