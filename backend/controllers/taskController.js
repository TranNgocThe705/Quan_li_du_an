import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';

// @desc    Get all tasks for a project
// @route   GET /api/tasks?projectId=xxx
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { projectId, status, priority, assigneeId } = req.query;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is project member
  const isMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
  }

  // Build query
  const query = { projectId };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assigneeId) query.assigneeId = assigneeId;

  const tasks = await Task.find(query)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'Tasks retrieved successfully', tasks);
});

// @desc    Get task by ID with details
// @route   GET /api/tasks/:id
// @access  Private (Project Member)
export const getTaskById = asyncHandler(async (req, res) => {
  // Task and access already checked by middleware
  const task = req.task || await Task.findById(req.params.id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name workspaceId');

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  return successResponse(res, 200, 'Task retrieved successfully', task);
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Workspace Member with project access)
export const createTask = asyncHandler(async (req, res) => {
  const {
    projectId,
    title,
    description,
    status,
    type,
    priority,
    assigneeId,
    due_date,
  } = req.body;

  // Project and workspace membership already checked by middleware
  const project = req.project || await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if assignee is project member
  const isAssigneeMember = await ProjectMember.findOne({
    userId: assigneeId,
    projectId,
  });

  if (!isAssigneeMember) {
    return errorResponse(res, 400, 'Assignee must be a project member');
  }

  // Create task
  const task = await Task.create({
    projectId,
    title,
    description,
    status,
    type,
    priority,
    assigneeId,
    due_date,
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name');

  return successResponse(res, 201, 'Task created successfully', populatedTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Task assignee, Team Lead, or Workspace Admin)
export const updateTask = asyncHandler(async (req, res) => {
  // Task and permissions already checked by middleware
  const task = req.task || await Task.findById(req.params.id);

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Update fields
  const updateFields = [
    'title',
    'description',
    'status',
    'type',
    'priority',
    'assigneeId',
    'due_date',
  ];

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  // If assignee is being changed, verify they're a project member
  if (req.body.assigneeId) {
    const isAssigneeMember = await ProjectMember.findOne({
      userId: req.body.assigneeId,
      projectId: task.projectId,
    });

    if (!isAssigneeMember) {
      return errorResponse(res, 400, 'Assignee must be a project member');
    }
  }

  const updatedTask = await task.save();
  const populatedTask = await Task.findById(updatedTask._id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name');

  return successResponse(res, 200, 'Task updated successfully', populatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Task assignee, Team Lead, or Workspace Admin)
export const deleteTask = asyncHandler(async (req, res) => {
  // Task and permissions already checked by middleware
  const task = req.task || await Task.findById(req.params.id);

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  await task.deleteOne();

  return successResponse(res, 200, 'Task deleted successfully');
});

// @desc    Get my assigned tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;

  // Build query
  const query = { assigneeId: req.user._id };
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tasks = await Task.find(query)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name')
    .sort({ due_date: 1 });

  return successResponse(res, 200, 'My tasks retrieved successfully', tasks);
});
