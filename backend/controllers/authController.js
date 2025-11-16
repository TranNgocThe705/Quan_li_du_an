import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import generateToken from '../utils/generateToken.js';
import { WorkspaceRole } from '../config/constants.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return errorResponse(res, 400, 'User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    image: image || '',
  });

  if (user) {
    // Create default workspace for new user
    const defaultWorkspace = await Workspace.create({
      name: `${name}'s Workspace`,
      slug: `${name.toLowerCase().replace(/\s+/g, '-')}-workspace-${Date.now()}`,
      description: 'My personal workspace',
      ownerId: user._id,
    });

    // Add user as admin member to the workspace
    await WorkspaceMember.create({
      userId: user._id,
      workspaceId: defaultWorkspace._id,
      role: WorkspaceRole.ADMIN,
    });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 201, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      token,
      workspace: defaultWorkspace,
    });
  } else {
    return errorResponse(res, 400, 'Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 200, 'Login successful', {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      token,
    });
  } else {
    return errorResponse(res, 401, 'Invalid email or password');
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  return successResponse(res, 200, 'User retrieved successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
  });
});

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  return successResponse(res, 200, 'Logged out successfully');
});
