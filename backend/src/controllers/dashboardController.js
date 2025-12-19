import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import ActivityLog from '../models/ActivityLog.js';
import ProjectMember from '../models/ProjectMember.js';

// @desc    Get dashboard overview for current user
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user's workspaces
  const workspaceMemberships = await WorkspaceMember.find({ userId })
    .populate('workspaceId', 'name slug image_url');
  
  const workspaceIds = workspaceMemberships.map(m => m.workspaceId._id);

  // Get user's projects
  const projectMemberships = await ProjectMember.find({ userId })
    .populate({
      path: 'projectId',
      select: 'name status priority workspaceId',
      populate: { path: 'workspaceId', select: 'name' }
    });

  const projectIds = projectMemberships.map(m => m.projectId?._id).filter(Boolean);

  // Get user's tasks
  const myTasks = await Task.find({ assigneeId: userId })
    .populate('projectId', 'name')
    .sort({ due_date: 1 });

  // Tasks due soon (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const tasksDueSoon = myTasks.filter(task => 
    task.status !== 'DONE' && 
    new Date(task.due_date) >= today && 
    new Date(task.due_date) <= nextWeek
  );

  // Overdue tasks
  const overdueTasks = myTasks.filter(task =>
    task.status !== 'DONE' && new Date(task.due_date) < today
  );

  // Task statistics
  const taskStats = {
    total: myTasks.length,
    todo: myTasks.filter(t => t.status === 'TODO').length,
    inProgress: myTasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: myTasks.filter(t => t.status === 'DONE').length,
    overdue: overdueTasks.length,
    dueSoon: tasksDueSoon.length,
    byPriority: {
      high: myTasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').length,
      medium: myTasks.filter(t => t.priority === 'MEDIUM' && t.status !== 'DONE').length,
      low: myTasks.filter(t => t.priority === 'LOW' && t.status !== 'DONE').length,
    },
  };

  // Recent activity (last 20 activities)
  const recentActivity = await ActivityLog.find({
    $or: [
      { userId },
      { workspaceId: { $in: workspaceIds } },
      { projectId: { $in: projectIds } },
    ]
  })
    .populate('userId', 'name email image')
    .sort({ createdAt: -1 })
    .limit(20);

  // Project statistics
  const projects = projectMemberships.map(m => m.projectId).filter(Boolean);
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    planning: projects.filter(p => p.status === 'PLANNING').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length,
  };

  // Workspace statistics
  const workspaceStats = {
    total: workspaceMemberships.length,
    admin: workspaceMemberships.filter(m => m.role === 'ADMIN').length,
    member: workspaceMemberships.filter(m => m.role === 'MEMBER').length,
  };

  return successResponse(res, 200, 'Dashboard data retrieved successfully', {
    user: {
      id: userId,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
    },
    taskStats,
    projectStats,
    workspaceStats,
    tasksDueSoon: tasksDueSoon.slice(0, 5), // Top 5 urgent tasks
    overdueTasks: overdueTasks.slice(0, 5), // Top 5 overdue tasks
    recentActivity: recentActivity.slice(0, 10), // Latest 10 activities
    workspaces: workspaceMemberships.map(m => ({
      ...m.workspaceId.toObject(),
      userRole: m.role,
    })),
    recentProjects: projects.slice(0, 5), // Latest 5 projects
  });
});

// @desc    Get workspace-specific dashboard
// @route   GET /api/dashboard/workspace/:workspaceId
// @access  Private
export const getWorkspaceDashboard = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.user._id;

  // Check if user is member
  const membership = await WorkspaceMember.findOne({ userId, workspaceId });
  if (!membership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  // Get all projects in workspace
  const projects = await Project.find({ workspaceId })
    .populate('team_lead', 'name email image')
    .sort({ createdAt: -1 });

  const projectIds = projects.map(p => p._id);

  // Get all tasks in these projects
  const tasks = await Task.find({ projectId: { $in: projectIds } })
    .populate('assigneeId', 'name email image');

  // My tasks in this workspace
  const myTasks = tasks.filter(t => t.assigneeId._id.toString() === userId.toString());

  // Task statistics
  const taskStats = {
    total: tasks.length,
    myTasks: myTasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
    overdue: tasks.filter(t => 
      t.status !== 'DONE' && new Date(t.due_date) < new Date()
    ).length,
  };

  // Project statistics
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    planning: projects.filter(p => p.status === 'PLANNING').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length,
    cancelled: projects.filter(p => p.status === 'CANCELLED').length,
  };

  // Member statistics
  const members = await WorkspaceMember.find({ workspaceId })
    .populate('userId', 'name email image');

  const memberStats = {
    total: members.length,
    admin: members.filter(m => m.role === 'ADMIN').length,
    member: members.filter(m => m.role === 'MEMBER').length,
  };

  // Recent activity in this workspace
  const recentActivity = await ActivityLog.find({ workspaceId })
    .populate('userId', 'name email image')
    .sort({ createdAt: -1 })
    .limit(15);

  return successResponse(res, 200, 'Workspace dashboard retrieved successfully', {
    workspaceId,
    taskStats,
    projectStats,
    memberStats,
    recentProjects: projects.slice(0, 6),
    recentActivity: recentActivity.slice(0, 10),
    myTasks: myTasks.filter(t => t.status !== 'DONE').slice(0, 5),
  });
});

// @desc    Get project-specific dashboard
// @route   GET /api/dashboard/project/:projectId
// @access  Private
export const getProjectDashboard = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  // Check if user is project member
  const membership = await ProjectMember.findOne({ userId, projectId });
  if (!membership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
  }

  // Get project details
  const project = await Project.findById(projectId)
    .populate('team_lead', 'name email image')
    .populate('workspaceId', 'name slug');

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Get all tasks
  const tasks = await Task.find({ projectId })
    .populate('assigneeId', 'name email image');

  // Task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
    byPriority: {
      high: tasks.filter(t => t.priority === 'HIGH').length,
      medium: tasks.filter(t => t.priority === 'MEDIUM').length,
      low: tasks.filter(t => t.priority === 'LOW').length,
    },
    byType: {
      task: tasks.filter(t => t.type === 'TASK').length,
      bug: tasks.filter(t => t.type === 'BUG').length,
      feature: tasks.filter(t => t.type === 'FEATURE').length,
      improvement: tasks.filter(t => t.type === 'IMPROVEMENT').length,
      other: tasks.filter(t => t.type === 'OTHER').length,
    },
    completionRate: tasks.length > 0 
      ? ((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100).toFixed(2)
      : 0,
  };

  // Get team members
  const members = await ProjectMember.find({ projectId })
    .populate('userId', 'name email image');

  // Member task distribution
  const memberTaskDistribution = members.map(member => {
    const memberTasks = tasks.filter(
      t => t.assigneeId._id.toString() === member.userId._id.toString()
    );
    return {
      user: member.userId,
      role: member.role,
      totalTasks: memberTasks.length,
      completedTasks: memberTasks.filter(t => t.status === 'DONE').length,
      inProgressTasks: memberTasks.filter(t => t.status === 'IN_PROGRESS').length,
    };
  });

  // Recent activity
  const recentActivity = await ActivityLog.find({ projectId })
    .populate('userId', 'name email image')
    .sort({ createdAt: -1 })
    .limit(10);

  return successResponse(res, 200, 'Project dashboard retrieved successfully', {
    project: {
      id: project._id,
      name: project.name,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      teamLead: project.team_lead,
      workspace: project.workspaceId,
    },
    taskStats,
    memberStats: {
      total: members.length,
      distribution: memberTaskDistribution,
    },
    recentActivity,
  });
});

export default { getDashboard, getWorkspaceDashboard, getProjectDashboard };
