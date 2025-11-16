import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Task from '../models/Task.js';

// @desc    Get all projects in a workspace
// @route   GET /api/projects?workspaceId=xxx
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
  const { workspaceId } = req.query;

  if (!workspaceId) {
    return errorResponse(res, 400, 'Workspace ID is required');
  }

  // Check if user is member of workspace
  const isMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  const projects = await Project.find({ workspaceId })
    .populate('team_lead', 'name email image')
    .populate('workspaceId', 'name slug');

  return successResponse(res, 200, 'Projects retrieved successfully', projects);
});

// @desc    Get project by ID with details
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = asyncHandler(async (req, res) => {
  console.log('🔍 getProjectById called with ID:', req.params.id);
  console.log('👤 User:', req.user?.email);
  
  const project = await Project.findById(req.params.id)
    .populate('team_lead', 'name email image')
    .populate('workspaceId', 'name slug');

  console.log('📦 Project found:', project ? project.name : 'NOT FOUND');

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is member of workspace
  const isMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId._id || project.workspaceId,
  });

  console.log('🔐 Is member?', isMember ? 'YES' : 'NO');

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  // Get project members
  const members = await ProjectMember.find({ projectId: project._id })
    .populate('userId', 'name email image');

  // Get tasks
  const tasks = await Task.find({ projectId: project._id })
    .populate('assigneeId', 'name email image');

  return successResponse(res, 200, 'Project retrieved successfully', {
    ...project.toObject(),
    members,
    tasks,
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    priority,
    status,
    start_date,
    end_date,
    workspaceId,
    team_lead,
  } = req.body;

  // Check if user is member of workspace
  const isMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this workspace');
  }

  // Create project
  const project = await Project.create({
    name,
    description,
    priority,
    status,
    start_date,
    end_date,
    workspaceId,
    team_lead: team_lead || req.user._id,
  });

  // Add team lead as project member
  await ProjectMember.create({
    userId: team_lead || req.user._id,
    projectId: project._id,
  });

  const populatedProject = await Project.findById(project._id)
    .populate('team_lead', 'name email image')
    .populate('workspaceId', 'name slug');

  return successResponse(res, 201, 'Project created successfully', populatedProject);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Team lead or workspace admin)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is team lead or workspace admin
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (!isTeamLead && (!workspaceMembership || workspaceMembership.role !== 'ADMIN')) {
    return errorResponse(res, 403, 'Access denied. Only team lead or workspace admin can update');
  }

  // Update fields
  const updateFields = [
    'name',
    'description',
    'priority',
    'status',
    'start_date',
    'end_date',
    'progress',
    'team_lead',
  ];

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  const updatedProject = await project.save();
  const populatedProject = await Project.findById(updatedProject._id)
    .populate('team_lead', 'name email image')
    .populate('workspaceId', 'name slug');

  return successResponse(res, 200, 'Project updated successfully', populatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Team lead or workspace admin)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is team lead or workspace admin
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (!isTeamLead && (!workspaceMembership || workspaceMembership.role !== 'ADMIN')) {
    return errorResponse(res, 403, 'Access denied');
  }

  await project.deleteOne();

  return successResponse(res, 200, 'Project deleted successfully');
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Team lead or workspace admin)
export const addProjectMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const projectId = req.params.id;

  const project = await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if requester is team lead or workspace admin
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (!isTeamLead && (!workspaceMembership || workspaceMembership.role !== 'ADMIN')) {
    return errorResponse(res, 403, 'Access denied');
  }

  // Check if user is member of workspace
  const isWorkspaceMember = await WorkspaceMember.findOne({
    userId,
    workspaceId: project.workspaceId,
  });

  if (!isWorkspaceMember) {
    return errorResponse(res, 400, 'User must be a workspace member first');
  }

  // Check if already a project member
  const existingMember = await ProjectMember.findOne({ userId, projectId });
  if (existingMember) {
    return errorResponse(res, 400, 'User is already a project member');
  }

  // Add member
  const member = await ProjectMember.create({ userId, projectId });
  const populatedMember = await ProjectMember.findById(member._id).populate(
    'userId',
    'name email image'
  );

  return successResponse(res, 201, 'Project member added successfully', populatedMember);
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private (Team lead or workspace admin)
export const removeProjectMember = asyncHandler(async (req, res) => {
  const { id: projectId, memberId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if requester is team lead or workspace admin
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (!isTeamLead && (!workspaceMembership || workspaceMembership.role !== 'ADMIN')) {
    return errorResponse(res, 403, 'Access denied');
  }

  // Cannot remove team lead
  if (project.team_lead.toString() === memberId) {
    return errorResponse(res, 400, 'Cannot remove team lead from project');
  }

  const member = await ProjectMember.findOne({ userId: memberId, projectId });
  if (!member) {
    return errorResponse(res, 404, 'Project member not found');
  }

  await member.deleteOne();

  return successResponse(res, 200, 'Project member removed successfully');
});
