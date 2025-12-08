import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend.enroseze.id.vn/api';

// Async thunks
export const fetchUserPermissionsSummary = createAsyncThunk(
  'permissions/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permissions/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

export const fetchWorkspacePermissions = createAsyncThunk(
  'permissions/fetchWorkspace',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permissions/workspace/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { workspaceId, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspace permissions');
    }
  }
);

export const fetchProjectPermissions = createAsyncThunk(
  'permissions/fetchProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/permissions/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { projectId, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project permissions');
    }
  }
);

export const checkPermission = createAsyncThunk(
  'permissions/check',
  async ({ resourceType, resourceId, permission }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/permissions/check`,
        { resourceType, resourceId, permission },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        key: `${resourceType}_${resourceId}_${permission}`,
        hasPermission: response.data.data.hasPermission,
        details: response.data.data.details
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check permission');
    }
  }
);

// Initial state
const initialState = {
  summary: null,
  workspaces: {}, // { [workspaceId]: { hasAccess, role, permissions, ... } }
  projects: {}, // { [projectId]: { hasAccess, role, permissions, ... } }
  checks: {}, // { [key]: { hasPermission, details } }
  loading: false,
  error: null,
};

// Slice
const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissions: (state) => {
      state.summary = null;
      state.workspaces = {};
      state.projects = {};
      state.checks = {};
      state.error = null;
    },
    clearWorkspacePermissions: (state, action) => {
      delete state.workspaces[action.payload];
    },
    clearProjectPermissions: (state, action) => {
      delete state.projects[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch summary
      .addCase(fetchUserPermissionsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPermissionsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPermissionsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch workspace permissions
      .addCase(fetchWorkspacePermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspacePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces[action.payload.workspaceId] = action.payload.data;
      })
      .addCase(fetchWorkspacePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch project permissions
      .addCase(fetchProjectPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.projects[action.payload.projectId] = action.payload.data;
      })
      .addCase(fetchProjectPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check permission
      .addCase(checkPermission.fulfilled, (state, action) => {
        state.checks[action.payload.key] = {
          hasPermission: action.payload.hasPermission,
          details: action.payload.details
        };
      });
  },
});

export const { clearPermissions, clearWorkspacePermissions, clearProjectPermissions } = permissionSlice.actions;

// Selectors
export const selectPermissionsSummary = (state) => state.permissions.summary;
export const selectWorkspacePermissions = (state, workspaceId) => state.permissions.workspaces[workspaceId];
export const selectProjectPermissions = (state, projectId) => state.permissions.projects[projectId];
export const selectPermissionCheck = (state, resourceType, resourceId, permission) => {
  const key = `${resourceType}_${resourceId}_${permission}`;
  return state.permissions.checks[key]?.hasPermission || false;
};
export const selectPermissionsLoading = (state) => state.permissions.loading;
export const selectPermissionsError = (state) => state.permissions.error;

// Helper selectors
export const selectUserWorkspaces = (state) => state.permissions.summary?.workspaces?.list || [];
export const selectUserProjects = (state) => state.permissions.summary?.projects?.list || [];
export const selectIsWorkspaceOwner = (state, workspaceId) => {
  return state.permissions.workspaces[workspaceId]?.isOwner || false;
};
export const selectIsWorkspaceAdmin = (state, workspaceId) => {
  return state.permissions.workspaces[workspaceId]?.isAdmin || false;
};
export const selectIsProjectTeamLead = (state, projectId) => {
  return state.permissions.projects[projectId]?.isTeamLead || false;
};
export const selectHasWorkspacePermission = (state, workspaceId, permission) => {
  const perms = state.permissions.workspaces[workspaceId]?.permissions || [];
  return perms.includes(permission);
};
export const selectHasProjectPermission = (state, projectId, permission) => {
  const perms = state.permissions.projects[projectId]?.permissions || [];
  return perms.includes(permission);
};

export default permissionSlice.reducer;
