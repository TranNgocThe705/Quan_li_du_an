import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import ProjectMember from '../models/ProjectMember.js';
import Workspace from '../models/Workspace.js';

// @desc    Get user permissions for a specific workspace
// @route   GET /api/users/permissions/workspace/:workspaceId
// @access  Private
export const getUserWorkspacePermissions = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  
  // Get workspace info
  const workspace = await Workspace.findById(workspaceId).select('name slug ownerId');
  
  if (!workspace) {
    return successResponse(res, 200, 'No permissions', {
      hasAccess: false,
      workspace: null,
      role: null,
      isOwner: false,
      permissions: []
    });
  }

  // Check if user is member
  const membership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: workspaceId,
  });

  if (!membership) {
    return successResponse(res, 200, 'No permissions', {
      hasAccess: false,
      workspace: {
        id: workspace._id,
        name: workspace.name,
        slug: workspace.slug
      },
      role: null,
      isOwner: false,
      permissions: []
    });
  }

  const isOwner = workspace.ownerId.toString() === req.user._id.toString();
  const isAdmin = membership.role === 'ADMIN';

  // Define permissions based on role
  let permissions = [];
  
  if (isOwner) {
    permissions = [
      'view_workspace',
      'update_workspace',
      'delete_workspace',
      'manage_members',
      'invite_members',
      'remove_members',
      'update_member_roles',
      'create_projects',
      'manage_all_projects',
      'manage_all_tasks',
    ];
  } else if (isAdmin) {
    permissions = [
      'view_workspace',
      'update_workspace',
      'manage_members',
      'invite_members',
      'remove_members',
      'update_member_roles',
      'create_projects',
      'manage_all_projects',
      'manage_all_tasks',
    ];
  } else {
    permissions = [
      'view_workspace',
      'view_projects',
      'create_projects',
    ];
  }

  return successResponse(res, 200, 'Permissions retrieved', {
    hasAccess: true,
    workspace: {
      id: workspace._id,
      name: workspace.name,
      slug: workspace.slug
    },
    role: membership.role,
    isOwner: isOwner,
    isAdmin: isAdmin,
    permissions: permissions,
  });
});

// @desc    Get user permissions for a specific project
// @route   GET /api/users/permissions/project/:projectId
// @access  Private
export const getUserProjectPermissions = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  
  const Project = (await import('../models/Project.js')).default;
  const project = await Project.findById(projectId)
    .select('name workspaceId team_lead')
    .populate('workspaceId', 'name slug ownerId');

  if (!project) {
    return successResponse(res, 200, 'No permissions', {
      hasAccess: false,
      project: null,
      role: null,
      isTeamLead: false,
      permissions: []
    });
  }

  // Check workspace membership first
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId._id,
  });

  const isWorkspaceAdmin = workspaceMembership && workspaceMembership.role === 'ADMIN';
  const isWorkspaceOwner = project.workspaceId.ownerId.toString() === req.user._id.toString();

  // Check project membership
  const projectMembership = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: projectId,
  });

  if (!projectMembership && !isWorkspaceAdmin && !isWorkspaceOwner) {
    return successResponse(res, 200, 'No permissions', {
      hasAccess: false,
      project: {
        id: project._id,
        name: project.name,
        workspace: {
          id: project.workspaceId._id,
          name: project.workspaceId.name
        }
      },
      role: null,
      isTeamLead: false,
      permissions: []
    });
  }

  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  
  // Define permissions
  let permissions = [];
  let role = projectMembership?.role || null;

  if (isWorkspaceOwner || isWorkspaceAdmin || isTeamLead) {
    permissions = [
      'view_project',
      'update_project',
      'delete_project',
      'manage_members',
      'add_members',
      'remove_members',
      'create_tasks',
      'update_all_tasks',
      'delete_all_tasks',
      'assign_tasks',
    ];
    if (!role) role = 'LEAD'; // Implicit lead role from workspace admin
  } else if (role === 'MEMBER') {
    permissions = [
      'view_project',
      'create_tasks',
      'update_own_tasks',
      'delete_own_tasks',
    ];
  } else if (role === 'VIEWER') {
    permissions = [
      'view_project',
      'view_tasks',
    ];
  }

  return successResponse(res, 200, 'Permissions retrieved', {
    hasAccess: true,
    project: {
      id: project._id,
      name: project.name,
      workspace: {
        id: project.workspaceId._id,
        name: project.workspaceId.name
      }
    },
    role: role,
    isTeamLead: isTeamLead,
    isWorkspaceAdmin: isWorkspaceAdmin,
    permissions: permissions,
  });
});

// @desc    Get all user permissions summary
// @route   GET /api/users/permissions/summary
// @access  Private
export const getUserPermissionsSummary = asyncHandler(async (req, res) => {
  // Get all workspaces user is member of
  const workspaceMemberships = await WorkspaceMember.find({ 
    userId: req.user._id 
  }).populate('workspaceId', 'name slug ownerId');

  // Get all projects user is member of
  const projectMemberships = await ProjectMember.find({ 
    userId: req.user._id 
  }).populate({
    path: 'projectId',
    select: 'name team_lead workspaceId',
    populate: {
      path: 'workspaceId',
      select: 'name'
    }
  });

  // Format workspace permissions
  const workspaces = workspaceMemberships.map(membership => {
    const isOwner = membership.workspaceId.ownerId.toString() === req.user._id.toString();
    const isAdmin = membership.role === 'ADMIN';

    return {
      id: membership.workspaceId._id,
      name: membership.workspaceId.name,
      slug: membership.workspaceId.slug,
      role: membership.role,
      isOwner: isOwner,
      isAdmin: isAdmin,
      joinedAt: membership.createdAt,
    };
  });

  // Format project permissions
  const projects = projectMemberships.map(membership => {
    const isTeamLead = membership.projectId.team_lead.toString() === req.user._id.toString();

    return {
      id: membership.projectId._id,
      name: membership.projectId.name,
      workspace: {
        id: membership.projectId.workspaceId._id,
        name: membership.projectId.workspaceId.name,
      },
      role: membership.role || 'MEMBER',
      isTeamLead: isTeamLead,
      joinedAt: membership.createdAt,
    };
  });

  return successResponse(res, 200, 'Permissions summary retrieved', {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    workspaces: {
      total: workspaces.length,
      asOwner: workspaces.filter(w => w.isOwner).length,
      asAdmin: workspaces.filter(w => w.isAdmin).length,
      asMember: workspaces.filter(w => !w.isAdmin && !w.isOwner).length,
      list: workspaces,
    },
    projects: {
      total: projects.length,
      asTeamLead: projects.filter(p => p.isTeamLead).length,
      asMember: projects.filter(p => !p.isTeamLead).length,
      list: projects,
    },
  });
});

// @desc    Check if user has specific permission
// @route   POST /api/users/permissions/check
// @access  Private
export const checkUserPermission = asyncHandler(async (req, res) => {
  const { resourceType, resourceId, permission } = req.body;

  let hasPermission = false;
  let details = {};

  if (resourceType === 'workspace') {
    const workspace = await Workspace.findById(resourceId);
    if (!workspace) {
      return successResponse(res, 200, 'Permission check result', {
        hasPermission: false,
        reason: 'Workspace not found'
      });
    }

    const membership = await WorkspaceMember.findOne({
      userId: req.user._id,
      workspaceId: resourceId,
    });

    const isOwner = workspace.ownerId.toString() === req.user._id.toString();
    const isAdmin = membership && membership.role === 'ADMIN';

    // Permission logic
    switch (permission) {
      case 'delete_workspace':
        hasPermission = isOwner;
        break;
      case 'update_workspace':
      case 'manage_members':
      case 'invite_members':
        hasPermission = isOwner || isAdmin;
        break;
      case 'view_workspace':
        hasPermission = !!membership;
        break;
      default:
        hasPermission = false;
    }

    details = {
      role: membership?.role || null,
      isOwner: isOwner,
      isAdmin: isAdmin,
    };
  } else if (resourceType === 'project') {
    const Project = (await import('../models/Project.js')).default;
    const project = await Project.findById(resourceId);
    
    if (!project) {
      return successResponse(res, 200, 'Permission check result', {
        hasPermission: false,
        reason: 'Project not found'
      });
    }

    const workspaceMembership = await WorkspaceMember.findOne({
      userId: req.user._id,
      workspaceId: project.workspaceId,
    });

    const projectMembership = await ProjectMember.findOne({
      userId: req.user._id,
      projectId: resourceId,
    });

    const isWorkspaceAdmin = workspaceMembership && workspaceMembership.role === 'ADMIN';
    const isTeamLead = project.team_lead.toString() === req.user._id.toString();

    // Permission logic
    switch (permission) {
      case 'delete_project':
      case 'update_project':
      case 'manage_members':
        hasPermission = isTeamLead || isWorkspaceAdmin;
        break;
      case 'view_project':
        hasPermission = !!projectMembership || isWorkspaceAdmin;
        break;
      case 'create_tasks':
        hasPermission = (projectMembership && projectMembership.role !== 'VIEWER') || isWorkspaceAdmin;
        break;
      default:
        hasPermission = false;
    }

    details = {
      role: projectMembership?.role || null,
      isTeamLead: isTeamLead,
      isWorkspaceAdmin: isWorkspaceAdmin,
    };
  }

  return successResponse(res, 200, 'Permission check result', {
    hasPermission: hasPermission,
    details: details,
  });
});
