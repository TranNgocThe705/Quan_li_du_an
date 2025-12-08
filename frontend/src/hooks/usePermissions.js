import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserPermissionsSummary,
  fetchWorkspacePermissions,
  fetchProjectPermissions,
  checkPermission,
  selectWorkspacePermissions,
  selectProjectPermissions,
  selectPermissionCheck,
  selectHasWorkspacePermission,
  selectHasProjectPermission,
  selectIsWorkspaceOwner,
  selectIsWorkspaceAdmin,
  selectIsProjectTeamLead,
} from '../features/permissionSlice';

/**
 * Hook to get user's permissions summary
 */
export const usePermissionsSummary = () => {
  const dispatch = useDispatch();
  const summary = useSelector((state) => state.permissions.summary);
  const loading = useSelector((state) => state.permissions.loading);
  const error = useSelector((state) => state.permissions.error);

  useEffect(() => {
    if (!summary) {
      dispatch(fetchUserPermissionsSummary());
    }
  }, [dispatch, summary]);

  return { summary, loading, error };
};

/**
 * Hook to get workspace permissions
 */
export const useWorkspacePermissions = (workspaceId) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectWorkspacePermissions(state, workspaceId));
  const loading = useSelector((state) => state.permissions.loading);

  useEffect(() => {
    if (workspaceId && !permissions) {
      dispatch(fetchWorkspacePermissions(workspaceId));
    }
  }, [dispatch, workspaceId, permissions]);

  return {
    permissions: permissions?.permissions || [],
    role: permissions?.role,
    isOwner: permissions?.isOwner || false,
    isAdmin: permissions?.isAdmin || false,
    hasAccess: permissions?.hasAccess || false,
    loading,
  };
};

/**
 * Hook to get project permissions
 */
export const useProjectPermissions = (projectId) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectProjectPermissions(state, projectId));
  const loading = useSelector((state) => state.permissions.loading);

  useEffect(() => {
    if (projectId && !permissions) {
      dispatch(fetchProjectPermissions(projectId));
    }
  }, [dispatch, projectId, permissions]);

  return {
    permissions: permissions?.permissions || [],
    role: permissions?.role,
    isTeamLead: permissions?.isTeamLead || false,
    isWorkspaceAdmin: permissions?.isWorkspaceAdmin || false,
    hasAccess: permissions?.hasAccess || false,
    loading,
  };
};

/**
 * Hook to check specific permission
 */
export const usePermission = (resourceType, resourceId, permission) => {
  const dispatch = useDispatch();
  const hasPermission = useSelector((state) =>
    selectPermissionCheck(state, resourceType, resourceId, permission)
  );

  useEffect(() => {
    if (resourceType && resourceId && permission) {
      dispatch(checkPermission({ resourceType, resourceId, permission }));
    }
  }, [dispatch, resourceType, resourceId, permission]);

  return hasPermission;
};

/**
 * Hook to check workspace-specific permission
 */
export const useWorkspacePermission = (workspaceId, permission) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectWorkspacePermissions(state, workspaceId));
  
  useEffect(() => {
    if (workspaceId && !permissions) {
      dispatch(fetchWorkspacePermissions(workspaceId));
    }
  }, [dispatch, workspaceId, permissions]);

  return useSelector((state) => selectHasWorkspacePermission(state, workspaceId, permission));
};

/**
 * Hook to check project-specific permission
 */
export const useProjectPermission = (projectId, permission) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectProjectPermissions(state, projectId));
  
  useEffect(() => {
    if (projectId && !permissions) {
      dispatch(fetchProjectPermissions(projectId));
    }
  }, [dispatch, projectId, permissions]);

  return useSelector((state) => selectHasProjectPermission(state, projectId, permission));
};

/**
 * Hook to check if user is workspace owner
 */
export const useIsWorkspaceOwner = (workspaceId) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectWorkspacePermissions(state, workspaceId));
  
  useEffect(() => {
    if (workspaceId && !permissions) {
      dispatch(fetchWorkspacePermissions(workspaceId));
    }
  }, [dispatch, workspaceId, permissions]);

  return useSelector((state) => selectIsWorkspaceOwner(state, workspaceId));
};

/**
 * Hook to check if user is workspace admin
 */
export const useIsWorkspaceAdmin = (workspaceId) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectWorkspacePermissions(state, workspaceId));
  
  useEffect(() => {
    if (workspaceId && !permissions) {
      dispatch(fetchWorkspacePermissions(workspaceId));
    }
  }, [dispatch, workspaceId, permissions]);

  return useSelector((state) => selectIsWorkspaceAdmin(state, workspaceId));
};

/**
 * Hook to check if user is project team lead
 */
export const useIsProjectTeamLead = (projectId) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => selectProjectPermissions(state, projectId));
  
  useEffect(() => {
    if (projectId && !permissions) {
      dispatch(fetchProjectPermissions(projectId));
    }
  }, [dispatch, projectId, permissions]);

  return useSelector((state) => selectIsProjectTeamLead(state, projectId));
};

/**
 * Hook to get multiple permission checks at once
 */
export const useMultiplePermissions = (workspaceId, projectId) => {
  const workspacePerms = useWorkspacePermissions(workspaceId);
  const projectPerms = useProjectPermissions(projectId);

  return {
    workspace: workspacePerms,
    project: projectPerms,
    loading: workspacePerms.loading || projectPerms.loading,
  };
};

/**
 * Helper hook to show/hide UI elements based on permissions
 */
export const useConditionalRender = (resourceType, resourceId, permission) => {
  const hasPermission = usePermission(resourceType, resourceId, permission);
  
  const canRender = (component) => {
    return hasPermission ? component : null;
  };

  return { hasPermission, canRender };
};
