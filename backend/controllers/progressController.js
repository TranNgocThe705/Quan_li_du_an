import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Progress from '../models/Progress.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';

// @desc    Create or update daily progress
// @route   POST /api/progress
// @access  Private (Task assignee)
export const createOrUpdateProgress = asyncHandler(async (req, res) => {
  const {
    taskId,
    date,
    percentage,
    workDone,
    planForTomorrow,
    blockers,
    priority,
    hoursSpent,
    estimatedHoursRemaining,
  } = req.body;

  // Validate required fields
  if (!taskId || !date || !workDone) {
    return errorResponse(res, 400, 'taskId, date, and workDone are required');
  }

  // Check if task exists
  const task = await Task.findById(taskId).populate('projectId');
  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is assignee
  if (task.assigneeId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Access denied. Only task assignee can report progress');
  }

  // Normalize date to start of day
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Check if progress already exists for this date
  let progress = await Progress.findOne({
    taskId,
    userId: req.user._id,
    date: normalizedDate,
  });

  if (progress) {
    // Update existing progress
    progress.percentage = percentage || progress.percentage;
    progress.workDone = workDone || progress.workDone;
    progress.planForTomorrow = planForTomorrow || progress.planForTomorrow;
    progress.blockers = blockers || progress.blockers;
    progress.priority = priority || progress.priority;
    progress.hoursSpent = hoursSpent !== undefined ? hoursSpent : progress.hoursSpent;
    progress.estimatedHoursRemaining = estimatedHoursRemaining !== undefined ? estimatedHoursRemaining : progress.estimatedHoursRemaining;
    progress.status = 'SUBMITTED';
  } else {
    // Create new progress
    progress = new Progress({
      taskId,
      userId: req.user._id,
      projectId: task.projectId._id,
      date: normalizedDate,
      percentage: percentage || 0,
      workDone,
      planForTomorrow: planForTomorrow || '',
      blockers: blockers || '',
      priority: priority || 'MEDIUM',
      hoursSpent: hoursSpent || 0,
      estimatedHoursRemaining: estimatedHoursRemaining || 0,
      status: 'SUBMITTED',
    });
  }

  await progress.save();
  await progress.populate('userId', 'name email image');

  return successResponse(res, 201, 'Progress reported successfully', progress);
});

// @desc    Get progress for a task
// @route   GET /api/progress?taskId=xxx
// @access  Private (Task assignee, team lead, or workspace admin)
export const getTaskProgress = asyncHandler(async (req, res) => {
  const { taskId, startDate, endDate, userId } = req.query;

  if (!taskId) {
    return errorResponse(res, 400, 'taskId is required');
  }

  // Check if task exists
  const task = await Task.findById(taskId).populate('projectId');
  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check permissions
  const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user._id.toString();
  const project = await Project.findById(task.projectId._id || task.projectId);
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });
  const isWorkspaceAdmin = workspaceMembership && workspaceMembership.role === 'ADMIN';

  if (!isAssignee && !isTeamLead && !isWorkspaceAdmin) {
    return errorResponse(res, 403, 'Access denied');
  }

  // Build query
  const query = { taskId };
  
  if (userId) {
    query.userId = userId;
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const progress = await Progress.find(query)
    .populate('userId', 'name email image')
    .sort({ date: -1 });

  return successResponse(res, 200, 'Progress retrieved successfully', progress);
});

// @desc    Get progress for all tasks in a project
// @route   GET /api/progress/project/:projectId
// @access  Private (Team lead or workspace admin)
export const getProjectProgress = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { startDate, endDate, userId } = req.query;

  // Check if project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check permissions
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });
  const isWorkspaceAdmin = workspaceMembership && workspaceMembership.role === 'ADMIN';

  if (!isTeamLead && !isWorkspaceAdmin) {
    return errorResponse(res, 403, 'Access denied. Only team lead or workspace admin can view project progress');
  }

  // Build query
  const query = { projectId };

  if (userId) {
    query.userId = userId;
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const progress = await Progress.find(query)
    .populate('taskId', 'title')
    .populate('userId', 'name email image')
    .sort({ date: -1 });

  return successResponse(res, 200, 'Project progress retrieved successfully', progress);
});

// @desc    Get my progress (current user)
// @route   GET /api/progress/my-progress
// @access  Private
export const getMyProgress = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Build query
  const query = { userId: req.user._id };

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const progress = await Progress.find(query)
    .populate('taskId', 'title')
    .populate('userId', 'name email image')
    .sort({ date: -1 });

  return successResponse(res, 200, 'My progress retrieved successfully', progress);
});

// @desc    Review progress
// @route   PUT /api/progress/:id/review
// @access  Private (Team lead or workspace admin)
export const reviewProgress = asyncHandler(async (req, res) => {
  const { feedback, status } = req.body;

  const progress = await Progress.findById(req.params.id).populate('taskId');
  if (!progress) {
    return errorResponse(res, 404, 'Progress not found');
  }

  // Check permissions
  const task = await Task.findById(progress.taskId._id).populate('projectId');
  const project = task.projectId;
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });
  const isWorkspaceAdmin = workspaceMembership && workspaceMembership.role === 'ADMIN';

  if (!isTeamLead && !isWorkspaceAdmin) {
    return errorResponse(res, 403, 'Access denied. Only team lead or workspace admin can review progress');
  }

  progress.status = status || 'REVIEWED';
  progress.feedback = feedback || progress.feedback;
  progress.reviewedBy = req.user._id;
  progress.reviewedAt = new Date();

  await progress.save();
  await progress.populate('userId', 'name email image');
  await progress.populate('reviewedBy', 'name email image');

  return successResponse(res, 200, 'Progress reviewed successfully', progress);
});

// @desc    Delete progress
// @route   DELETE /api/progress/:id
// @access  Private (Progress owner)
export const deleteProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return errorResponse(res, 404, 'Progress not found');
  }

  // Check if user is the progress owner
  if (progress.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Access denied. You can only delete your own progress');
  }

  await Progress.deleteOne({ _id: req.params.id });

  return successResponse(res, 200, 'Progress deleted successfully');
});
