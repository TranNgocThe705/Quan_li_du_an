import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { generateExcelReport, generatePDFReport } from '../utils/exportUtils.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (System Admin only)
export const getAdminDashboard = asyncHandler(async (req, res) => {
  // Get counts
  const [totalUsers, totalWorkspaces, totalProjects, totalTasks] = await Promise.all([
    User.countDocuments(),
    Workspace.countDocuments(),
    Project.countDocuments(),
    Task.countDocuments(),
  ]);

  // Get active users (logged in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeUsers = await User.countDocuments({
    updatedAt: { $gte: thirtyDaysAgo },
  });

  // Get projects by status
  const projectsByStatus = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get tasks by status
  const tasksByStatus = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get recent users (last 10)
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name email image createdAt');

  // Get recent workspaces (last 10)
  const recentWorkspaces = await Workspace.find()
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get tasks completion trend (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const tasksTrend = await Task.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Get projects by priority
  const projectsByPriority = await Project.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get task completion rate
  const completedTasks = await Task.countDocuments({ status: 'DONE' });
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Get user growth (last 30 days)
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Get workspace activity
  const workspaceActivity = await Workspace.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: 'workspaceId',
        as: 'projects'
      }
    },
    {
      $project: {
        name: 1,
        projectCount: { $size: '$projects' }
      }
    },
    {
      $sort: { projectCount: -1 }
    },
    {
      $limit: 5
    }
  ]);

  return successResponse(res, 200, 'Admin dashboard data retrieved successfully', {
    stats: {
      totalUsers,
      totalWorkspaces,
      totalProjects,
      totalTasks,
      activeUsers,
      completedTasks,
      completionRate,
    },
    projectsByStatus,
    tasksByStatus,
    projectsByPriority,
    tasksTrend,
    userGrowth,
    workspaceActivity,
    recentUsers,
    recentWorkspaces,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (System Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', role = '', isActive } = req.query;

  const query = {};

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by role
  if (role) {
    query.systemRole = role;
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const users = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .exec();

  const count = await User.countDocuments(query);

  return successResponse(res, 200, 'Users retrieved successfully', {
    users,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalUsers: count,
  });
});

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private (System Admin)
export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Get user's workspaces
  const workspaces = await WorkspaceMember.find({ userId: user._id })
    .populate('workspaceId', 'name slug')
    .exec();

  return successResponse(res, 200, 'User details retrieved successfully', {
    user,
    workspaces: workspaces.map((w) => ({
      ...w.workspaceId.toJSON(),
      role: w.role,
    })),
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Super Admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { systemRole } = req.body;

  // Validate role
  if (!Object.values(SystemRole).includes(systemRole)) {
    return errorResponse(res, 400, 'Invalid system role');
  }

  // Prevent changing own role
  if (req.params.id === req.user._id.toString()) {
    return errorResponse(res, 400, 'Cannot change your own role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  user.systemRole = systemRole;
  await user.save();

  return successResponse(res, 200, 'User role updated successfully', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      systemRole: user.systemRole,
    },
  });
});

// @desc    Deactivate/Activate user
// @route   PUT /api/admin/users/:id/status
// @access  Private (System Admin)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  // Prevent changing own status
  if (req.params.id === req.user._id.toString()) {
    return errorResponse(res, 400, 'Cannot change your own status');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  user.isActive = isActive;
  await user.save();

  return successResponse(
    res,
    200,
    `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    }
  );
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  // Prevent deleting own account
  if (req.params.id === req.user._id.toString()) {
    return errorResponse(res, 400, 'Cannot delete your own account');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Delete user and all related data
  await WorkspaceMember.deleteMany({ userId: user._id });
  await user.deleteOne();

  return successResponse(res, 200, 'User deleted successfully');
});

// @desc    Get all workspaces
// @route   GET /api/admin/workspaces
// @access  Private (System Admin)
export const getAllWorkspaces = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const query = {};

  // Search by name
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const workspaces = await Workspace.find(query)
    .populate('ownerId', 'name email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .exec();

  const count = await Workspace.countDocuments(query);

  // Get member count for each workspace
  const workspacesWithStats = await Promise.all(
    workspaces.map(async (workspace) => {
      const memberCount = await WorkspaceMember.countDocuments({
        workspaceId: workspace._id,
      });
      const projectCount = await Project.countDocuments({
        workspaceId: workspace._id,
      });

      return {
        ...workspace.toJSON(),
        memberCount,
        projectCount,
      };
    })
  );

  return successResponse(res, 200, 'Workspaces retrieved successfully', {
    workspaces: workspacesWithStats,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalWorkspaces: count,
  });
});

// @desc    Delete workspace
// @route   DELETE /api/admin/workspaces/:id
// @access  Private (Super Admin)
export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  // Delete all related data
  await WorkspaceMember.deleteMany({ workspaceId: workspace._id });
  await Project.deleteMany({ workspaceId: workspace._id });
  await Task.deleteMany({ workspaceId: workspace._id });
  await workspace.deleteOne();

  return successResponse(res, 200, 'Workspace and all related data deleted successfully');
});

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private (System Admin)
export const getAllProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;

  const query = {};

  // Search by name
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const projects = await Project.find(query)
    .populate('workspaceId', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .exec();

  const count = await Project.countDocuments(query);

  return successResponse(res, 200, 'Projects retrieved successfully', {
    projects,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalProjects: count,
  });
});

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private (Super Admin)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Delete all related tasks
  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();

  return successResponse(res, 200, 'Project and all related tasks deleted successfully');
});

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (System Admin)
export const getSystemStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalWorkspaces,
    totalProjects,
    totalTasks,
    completedTasks,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Workspace.countDocuments(),
    Project.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: 'DONE' }),
  ]);

  // Get user growth (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Get project status distribution
  const projectStats = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get task priority distribution
  const taskStats = await Task.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  return successResponse(res, 200, 'System statistics retrieved successfully', {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      newThisMonth: newUsers,
    },
    workspaces: {
      total: totalWorkspaces,
    },
    projects: {
      total: totalProjects,
      byStatus: projectStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    },
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
      byPriority: taskStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    },
  });
});

// @desc    Get activity logs (recent actions)
// @route   GET /api/admin/logs
// @access  Private (System Admin)
export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  // Get recently created users
  const recentUsers = await User.find()
    .select('name email createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recently created workspaces
  const recentWorkspaces = await Workspace.find()
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recently created projects
  const recentProjects = await Project.find()
    .populate('team_lead', 'name email')
    .populate('workspaceId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Combine and format activity logs
  const logs = [
    ...recentUsers.map((user) => ({
      type: 'USER_CREATED',
      message: `New user registered: ${user.name}`,
      timestamp: user.createdAt,
      data: { userId: user._id, email: user.email },
    })),
    ...recentWorkspaces.map((workspace) => ({
      type: 'WORKSPACE_CREATED',
      message: `New workspace created: ${workspace.name}`,
      timestamp: workspace.createdAt,
      data: {
        workspaceId: workspace._id,
        owner: workspace.ownerId?.name,
      },
    })),
    ...recentProjects.map((project) => ({
      type: 'PROJECT_CREATED',
      message: `New project created: ${project.name}`,
      timestamp: project.createdAt,
      data: {
        projectId: project._id,
        workspace: project.workspaceId?.name,
        lead: project.team_lead?.name,
      },
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedLogs = logs.slice(startIndex, endIndex);

  return successResponse(res, 200, 'Activity logs retrieved successfully', {
    logs: paginatedLogs,
    totalPages: Math.ceil(logs.length / limit),
    currentPage: page,
    totalLogs: logs.length,
  });
});

// @desc    Export dashboard report
// @route   GET /api/admin/export-report
// @access  Private (System Admin)
export const exportReport = asyncHandler(async (req, res) => {
  const { format = 'excel' } = req.query; // format: 'excel' or 'pdf'

  // Get all dashboard data
  const [totalUsers, totalWorkspaces, totalProjects, totalTasks] = await Promise.all([
    User.countDocuments(),
    Workspace.countDocuments(),
    Project.countDocuments(),
    Task.countDocuments(),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeUsers = await User.countDocuments({
    updatedAt: { $gte: thirtyDaysAgo },
  });

  const projectsByStatus = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const tasksByStatus = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const projectsByPriority = await Project.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const completedTasks = await Task.countDocuments({ status: 'DONE' });
  const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100) : 0;

  const reportData = {
    totalUsers,
    totalWorkspaces,
    totalProjects,
    totalTasks,
    activeUsers,
    completedTasks,
    taskCompletionRate,
    projectsByStatus,
    tasksByStatus,
    projectsByPriority,
  };

  if (format === 'pdf') {
    // Generate PDF
    const pdfBuffer = await generatePDFReport(reportData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=dashboard-report-${Date.now()}.pdf`);
    res.send(pdfBuffer);
  } else {
    // Generate Excel (default)
    const workbook = await generateExcelReport(reportData);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=dashboard-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  }
});
