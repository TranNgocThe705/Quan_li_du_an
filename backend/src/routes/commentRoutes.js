import express from 'express';
import { body } from 'express-validator';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createCommentValidation = [
  body('taskId').notEmpty().withMessage('Task ID is required'),
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

const updateCommentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content cannot be empty'),
];

// Comment routes
router.get('/', protect, getComments);
router.post('/', protect, createCommentValidation, validate, createComment);
router.put('/:id', protect, updateCommentValidation, validate, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
