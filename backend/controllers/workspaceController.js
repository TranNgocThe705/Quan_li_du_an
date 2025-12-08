import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Project from '../models/Project.js';
import { WorkspaceRole } from '../config/constants.js';

// @desc    Get all workspaces for current user
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = asyncHandler(async (req, res) => {
  // Find all workspace memberships for the user
  const memberships = await WorkspaceMember.find({ userId: req.user._id })
    .populate('workspaceId')
    .populate('userId', 'name email image');

  // Get members count for each workspace
  const workspaces = await Promise.all(
    memberships.map(async (membership) => {
      const members = await WorkspaceMember.find({ 
        workspaceId: membership.workspaceId._id 
      }).populate('userId', 'name email image');
      
      return {
        ...membership.workspaceId.toObject(),
        userRole: membership.role,
        members: members.map(m => ({
          _id: m._id,
          userId: m.userId,
          role: m.role,
          joinedAt: m.joinedAt
        }))
      };
    })
  );

  return successResponse(res, 200, 'Workspaces retrieved successfully', workspaces);
});

// @desc    Get workspace by ID with details
// @route   GET /api/workspaces/:id
// @access  Private (Workspace Member)
export const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id).populate(
    'ownerId',
    'name email image'
  );

  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  // Membership already checked by middleware
  const membership = req.workspaceMembership;

  // Get members
  const members = await WorkspaceMember.find({ workspaceId: workspace._id })
    .populate('userId', 'name email image');

  // Get projects
  const projects = await Project.find({ workspaceId: workspace._id })
    .populate('team_lead', 'name email image');

  return successResponse(res, 200, 'Workspace retrieved successfully', {
    ...workspace.toObject(),
    members,
    projects,
    userRole: membership.role,
  });
});

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, slug, description, image_url } = req.body;

  // Check if slug already exists
  if (slug) {
    const slugExists = await Workspace.findOne({ slug });
    if (slugExists) {
      return errorResponse(res, 400, 'Workspace slug already exists');
    }
  }

  // Create workspace
  const workspace = await Workspace.create({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    description,
    image_url: image_url || '',
    ownerId: req.user._id,
  });

  // Add creator as admin member
  await WorkspaceMember.create({
    userId: req.user._id,
    workspaceId: workspace._id,
    role: WorkspaceRole.ADMIN,
  });

  return successResponse(res, 201, 'Workspace created successfully', workspace);
});

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private (Admin only)
export const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  // Admin permission already checked by middleware

  // Update fields
  workspace.name = req.body.name || workspace.name;
  workspace.description = req.body.description !== undefined ? req.body.description : workspace.description;
  workspace.image_url = req.body.image_url || workspace.image_url;
  workspace.settings = req.body.settings || workspace.settings;

  // Update slug if provided and not duplicate
  if (req.body.slug && req.body.slug !== workspace.slug) {
    const slugExists = await Workspace.findOne({ slug: req.body.slug });
    if (slugExists) {
      return errorResponse(res, 400, 'Workspace slug already exists');
    }
    workspace.slug = req.body.slug;
  }

  const updatedWorkspace = await workspace.save();

  return successResponse(res, 200, 'Workspace updated successfully', updatedWorkspace);
});

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private (Owner only)
export const deleteWorkspace = asyncHandler(async (req, res) => {
  // Workspace and owner check already done by middleware
  const workspace = req.workspace || await Workspace.findById(req.params.id);

  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  await workspace.deleteOne();

  return successResponse(res, 200, 'Workspace deleted successfully');
});

// @desc    Invite member to workspace by email
// @route   POST /api/workspaces/:id/invite-member
// @access  Private (Admin only)
export const inviteMemberByEmail = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const workspaceId = req.params.id;

  // Check if workspace exists
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  // Admin permission already checked by middleware

  // Find user by email
  const User = (await import('../models/User.js')).default;
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(res, 404, 'User with this email not found');
  }

  // Check if member already exists
  const existingMember = await WorkspaceMember.findOne({ 
    userId: user._id, 
    workspaceId 
  });
  if (existingMember) {
    return errorResponse(res, 400, 'User is already a member of this workspace');
  }

  // Add member
  const member = await WorkspaceMember.create({
    userId: user._id,
    workspaceId,
    role: role || WorkspaceRole.MEMBER,
  });

  const populatedMember = await WorkspaceMember.findById(member._id).populate(
    'userId',
    'name email image'
  );

  return successResponse(res, 201, 'Member invited successfully', populatedMember);
});

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private (Admin only)
export const addMember = asyncHandler(async (req, res) => {
  const { userId, role, message } = req.body;
  const workspaceId = req.params.id;

  // Check if workspace exists
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  // Admin permission already checked by middleware

  // Check if member already exists
  const existingMember = await WorkspaceMember.findOne({ userId, workspaceId });
  if (existingMember) {
    return errorResponse(res, 400, 'User is already a member of this workspace');
  }

  // Add member
  const member = await WorkspaceMember.create({
    userId,
    workspaceId,
    role: role || WorkspaceRole.MEMBER,
    message: message || '',
  });

  const populatedMember = await WorkspaceMember.findById(member._id).populate(
    'userId',
    'name email image'
  );

  return successResponse(res, 201, 'Member added successfully', populatedMember);
});

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:memberId
// @access  Private (Admin only)
export const removeMember = asyncHandler(async (req, res) => {
  const { id: workspaceId, memberId } = req.params;

  // Check if workspace exists
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return errorResponse(res, 404, 'Workspace not found');
  }

  // Admin permission already checked by middleware

  // Find and delete member
  const member = await WorkspaceMember.findOne({
    userId: memberId,
    workspaceId,
  });

  if (!member) {
    return errorResponse(res, 404, 'Member not found in this workspace');
  }

  // Cannot remove workspace owner
  if (workspace.ownerId.toString() === memberId) {
    return errorResponse(res, 400, 'Cannot remove workspace owner');
  }

  await member.deleteOne();

  return successResponse(res, 200, 'Member removed successfully');
});

// @desc    Update member role
// @route   PUT /api/workspaces/:id/members/:memberId
// @access  Private (Admin only)
export const updateMemberRole = asyncHandler(async (req, res) => {
  const { id: workspaceId, memberId } = req.params;
  const { role } = req.body;

  // Admin permission already checked by middleware

  // Find and update member
  const member = await WorkspaceMember.findOne({
    userId: memberId,
    workspaceId,
  });

  if (!member) {
    return errorResponse(res, 404, 'Member not found in this workspace');
  }

  member.role = role;
  await member.save();

  const updatedMember = await WorkspaceMember.findById(member._id).populate(
    'userId',
    'name email image'
  );

  return successResponse(res, 200, 'Member role updated successfully', updatedMember);
});
