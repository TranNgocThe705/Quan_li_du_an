import express from 'express';
import { 
  getDashboard, 
  getWorkspaceDashboard,
  getProjectDashboard 
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/dashboard
// @desc    Get user's main dashboard
// @access  Private
router.get('/', getDashboard);

// @route   GET /api/dashboard/workspace/:workspaceId
// @desc    Get workspace-specific dashboard
// @access  Private
router.get('/workspace/:workspaceId', getWorkspaceDashboard);

// @route   GET /api/dashboard/project/:projectId
// @desc    Get project-specific dashboard
// @access  Private
router.get('/project/:projectId', getProjectDashboard);

export default router;
