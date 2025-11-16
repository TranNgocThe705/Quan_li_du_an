import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('workspaceId').notEmpty().withMessage('Workspace ID is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'PLANNING', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
    .withMessage('Invalid status'),
  body('start_date').optional().isISO8601().withMessage('Invalid start date'),
  body('end_date').optional().isISO8601().withMessage('Invalid end date'),
];

const updateProjectValidation = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'PLANNING', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
    .withMessage('Invalid status'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
];

const addMemberValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
];

// Project routes
router.get('/', protect, getProjects);
router.post('/', protect, createProjectValidation, validate, createProject);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProjectValidation, validate, updateProject);
router.delete('/:id', protect, deleteProject);

// Member management routes
router.post('/:id/members', protect, addMemberValidation, validate, addProjectMember);
router.delete('/:id/members/:memberId', protect, removeProjectMember);

export default router;
