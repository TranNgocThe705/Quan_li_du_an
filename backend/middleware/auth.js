import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return errorResponse(res, 401, 'User not found');
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return errorResponse(res, 401, 'Not authorized, token failed');
  }
});

// Admin middleware - check if user is workspace admin
export const isWorkspaceAdmin = asyncHandler(async (req, res, next) => {
  const { workspaceId } = req.params;
  
  // Import here to avoid circular dependency
  const WorkspaceMember = (await import('../models/WorkspaceMember.js')).default;
  const { WorkspaceRole } = await import('../config/constants.js');

  const membership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: workspaceId,
  });

  if (!membership || membership.role !== WorkspaceRole.ADMIN) {
    return errorResponse(res, 403, 'Access denied. Admin privileges required.');
  }

  next();
});

// System Admin middleware - check if user is system admin
export const isSystemAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user.isSystemAdmin) {
    return errorResponse(res, 403, 'Access denied. System admin privileges required.');
  }
  next();
});

// Super Admin alias (for backward compatibility)
export const isSuperAdmin = isSystemAdmin;
