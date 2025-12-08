import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { 
  checkTaskAccess,
  checkTaskManagePermission,
  checkWorkspaceAccessFromProject 
} from '../middleware/checkPermission.js';

const router = express.Router();

// Validation rules
const createTaskValidation = [
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('assigneeId').notEmpty().withMessage('Assignee ID is required'),
  body('due_date').isISO8601().withMessage('Valid due date is required'),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
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
    .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
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
router.get('/', protect, getTasks); // Query param: projectId (checked in controller)
router.post('/', protect, checkWorkspaceAccessFromProject, createTaskValidation, validate, createTask);
router.get('/:id', protect, checkTaskAccess, getTaskById);
router.put('/:id', protect, checkTaskManagePermission, updateTaskValidation, validate, updateTask);
router.delete('/:id', protect, checkTaskManagePermission, deleteTask);

export default router;
