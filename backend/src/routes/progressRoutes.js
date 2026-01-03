import express from 'express';
import { body } from 'express-validator';
import {
  createOrUpdateProgress,
  getTaskProgress,
  getProjectProgress,
  getMyProgress,
  reviewProgress,
  deleteProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createProgressValidation = [
  body('taskId').notEmpty().withMessage('Task ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),
  body('workDone').trim().notEmpty().withMessage('Work done description is required'),
  body('planForTomorrow').optional().trim(),
  body('blockers').optional().trim(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
  body('hoursSpent').optional().isFloat({ min: 0 }).withMessage('Hours spent must be a positive number'),
  body('estimatedHoursRemaining').optional().isFloat({ min: 0 }).withMessage('Estimated hours remaining must be a positive number'),
];

const reviewProgressValidation = [
  body('status').optional().isIn(['DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED']).withMessage('Invalid status'),
  body('feedback').optional().trim(),
];

// Progress routes
router.post('/', protect, createProgressValidation, validate, createOrUpdateProgress);
router.get('/my-progress', protect, getMyProgress);
router.get('/', protect, getTaskProgress); // Query param: taskId (required)
router.get('/project/:projectId', protect, getProjectProgress);
router.put('/:id/review', protect, reviewProgressValidation, validate, reviewProgress);
router.delete('/:id', protect, deleteProgress);

export default router;
