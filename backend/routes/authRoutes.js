import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import passport from '../config/passport.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Google OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  }));

  router.get('/google/callback', 
    passport.authenticate('google', { 
      session: false,
      failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173/login'
    }), 
    googleCallback
  );
} else {
  // Return error if Google OAuth not configured
  router.get('/google', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Google OAuth not configured. Please contact administrator.'
    });
  });
}

export default router;
