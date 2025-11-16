import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Routes
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.delete('/:id', protect, deleteUser);

export default router;
