import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  submitTaskForApproval,
  approveTask,
  rejectTask,
  updateChecklistItem,
  getChecklistProgress,
  bypassApproval,
  getPendingApprovalTasks,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { 
  checkTaskAccess,
  checkTaskManagePermission,
  checkProjectMember
} from '../middleware/checkPermission.js';

const router = express.Router();

// Validation rules
const createTaskValidation = [
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('assigneeId').optional(),
  body('due_date').isISO8601().withMessage('Valid due date is required'),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'PENDING_APPROVAL', 'DONE'])
    .withMessage('Invalid status'),
  body('type')
    .optional()
    .isIn(['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER'])
    .withMessage('Invalid type'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
];

const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'PENDING_APPROVAL', 'DONE'])
    .withMessage('Invalid status'),
  body('type')
    .optional()
    .isIn(['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER'])
    .withMessage('Invalid type'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
  body('due_date').optional().isISO8601().withMessage('Invalid due date'),
];

// Task routes
router.get('/my-tasks', protect, getMyTasks);
router.get('/pending-approval', protect, getPendingApprovalTasks);
router.get('/', protect, getTasks); // Query param: projectId (checked in controller)
router.post('/', protect, checkProjectMember, createTaskValidation, validate, createTask); // Changed to checkProjectMember
router.get('/:id', protect, checkTaskAccess, getTaskById);
router.put('/:id', protect, checkTaskManagePermission, updateTaskValidation, validate, updateTask);
router.post('/:id/submit-for-approval', protect, submitTaskForApproval); // Member submits task
router.put('/:id/approve', protect, approveTask); // Team Lead approves task
router.put('/:id/reject', protect, [
  body('reason').trim().notEmpty().withMessage('Rejection reason is required')
], validate, rejectTask); // Team Lead rejects task
router.post('/:id/bypass-approval', protect, [
  body('reason').trim().notEmpty().withMessage('Bypass reason is required')
], validate, bypassApproval); // Emergency bypass
router.patch('/:id/checklist/:itemId', protect, updateChecklistItem); // Update checklist item
router.get('/:id/checklist/progress', protect, getChecklistProgress); // Get checklist progress
router.delete('/:id', protect, checkTaskManagePermission, deleteTask);

export default router;
