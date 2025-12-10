import asyncHandler from '../utils/asyncHandler.js';
import { errorResponse } from '../utils/apiResponse.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import ProjectMember from '../models/ProjectMember.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { WorkspaceRole, ProjectRole } from '../config/constants.js';

/**
 * Check if user is a member of the workspace
 * Expects workspaceId in req.params or req.body
 */
export const checkWorkspaceMember = asyncHandler(async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.params.id || req.body.workspaceId;

  if (!workspaceId) {
    return errorResponse(res, 400, 'Workspace ID is required');
  }

  const membership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: workspaceId,
  });

  if (!membership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  // Attach membership to request for later use
  req.workspaceMembership = membership;
  next();
});

/**
 * Check if user is an admin of the workspace
 * Must be used after checkWorkspaceMember or independently
 */
export const checkWorkspaceAdmin = asyncHandler(async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.params.id || req.body.workspaceId;

  if (!workspaceId) {
    return errorResponse(res, 400, 'Workspace ID is required');
  }

  const membership = req.workspaceMembership || await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: workspaceId,
  });

  if (!membership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  if (membership.role !== WorkspaceRole.ADMIN) {
    return errorResponse(res, 403, 'Access denied. Admin privileges required');
  }

  req.workspaceMembership = membership;
  next();
});

/**
 * Check if user is the owner of the workspace
 */
export const checkWorkspaceOwner = asyncHandler(async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.params.id;

  if (!workspaceId) {
    return errorResponse(res, 400, 'Workspace ID is required');
  }

  const Workspace = (await import('../models/Workspace.js')).default;
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  if (workspace.ownerId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Access denied. Only workspace owner can perform this action');
  }

  req.workspace = workspace;
  next();
});

/**
 * Check if user is a member of the project
 * Expects projectId in req.params or req.body
 */
export const checkProjectMember = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  const membership = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: projectId,
  }).populate('projectId');

  if (!membership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
  }

  // Attach membership and project to request
  req.projectMembership = membership;
  req.project = membership.projectId;
  next();
});

/**
 * Check if user is team lead of the project
 */
export const checkProjectTeamLead = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  const project = req.project || await Project.findById(projectId);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  if (project.team_lead.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Access denied. Only team lead can perform this action');
  }

  req.project = project;
  next();
});

/**
 * Check if user is team lead OR workspace admin
 * More flexible permission for project management
 */
export const checkProjectManagePermission = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  const project = req.project || await Project.findById(projectId);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is team lead
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();

  if (isTeamLead) {
    req.project = project;
    req.hasManagePermission = true;
    return next();
  }

  // Check if user is workspace admin
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (workspaceMembership && workspaceMembership.role === WorkspaceRole.ADMIN) {
    req.project = project;
    req.workspaceMembership = workspaceMembership;
    req.hasManagePermission = true;
    return next();
  }

  return errorResponse(res, 403, 'Access denied. Only team lead or workspace admin can perform this action');
});

/**
 * Check if user has access to task (is project member)
 */
export const checkTaskAccess = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId || req.params.id;

  if (!taskId) {
    return errorResponse(res, 400, 'Task ID is required');
  }

  const task = await Task.findById(taskId).populate('projectId');

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is member of the project
  const projectMembership = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: task.projectId._id,
  });

  if (!projectMembership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
  }

  req.task = task;
  req.projectMembership = projectMembership;
  next();
});

/**
 * Check if user is the assignee of the task OR has project manage permission
 */
export const checkTaskManagePermission = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId || req.params.id;

  if (!taskId) {
    return errorResponse(res, 400, 'Task ID is required');
  }

  const task = req.task || await Task.findById(taskId).populate('projectId');

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is assignee
  const isAssignee = task.assigneeId.toString() === req.user._id.toString();

  if (isAssignee) {
    req.task = task;
    req.hasManagePermission = true;
    return next();
  }

  // Check if user is project team lead
  const project = await Project.findById(task.projectId._id || task.projectId);
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();

  if (isTeamLead) {
    req.task = task;
    req.project = project;
    req.hasManagePermission = true;
    return next();
  }

  // Check if user is workspace admin
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (workspaceMembership && workspaceMembership.role === WorkspaceRole.ADMIN) {
    req.task = task;
    req.project = project;
    req.workspaceMembership = workspaceMembership;
    req.hasManagePermission = true;
    return next();
  }

  return errorResponse(res, 403, 'Access denied. Only assignee, team lead, or workspace admin can manage this task');
});

/**
 * Helper middleware to check workspace access from projectId
 * Useful for routes that only have projectId but need workspace check
 */
export const checkWorkspaceAccessFromProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  const project = await Project.findById(projectId);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (!workspaceMembership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  req.project = project;
  req.workspaceMembership = workspaceMembership;
  next();
});

/**
 * Check if user can view project (project member OR workspace admin/owner)
 * More permissive than checkProjectMember for read-only access
 */
export const checkProjectViewPermission = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  const project = await Project.findById(projectId);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is workspace admin or owner first
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (workspaceMembership && workspaceMembership.role === WorkspaceRole.ADMIN) {
    req.project = project;
    req.workspaceMembership = workspaceMembership;
    req.hasViewPermission = true;
    return next();
  }

  // If not workspace admin, check if user is project member
  const projectMembership = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: projectId,
  }).populate('projectId');

  if (!projectMembership) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project or workspace admin');
  }

  req.projectMembership = projectMembership;
  req.project = projectMembership.projectId;
  req.hasViewPermission = true;
  next();
});
