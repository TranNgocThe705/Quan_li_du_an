import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Get all users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Get user details
export const getUserDetails = createAsyncThunk(
  'admin/getUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// Update user info
export const updateUserInfo = createAsyncThunk(
  'admin/updateUserInfo',
  async ({ userId, name, email, isSystemAdmin }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, { name, email, isSystemAdmin });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user info');
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, systemRole }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { systemRole });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

// Update user status
export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Get all workspaces
export const getAllWorkspaces = createAsyncThunk(
  'admin/getAllWorkspaces',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/workspaces', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspaces');
    }
  }
);

// Get system stats
export const getSystemStats = createAsyncThunk(
  'admin/getSystemStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system stats');
    }
  }
);

// Get activity logs
export const getActivityLogs = createAsyncThunk(
  'admin/getActivityLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/logs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    selectedUser: null,
    workspaces: [],
    stats: null,
    logs: [],
    pagination: {
      users: { currentPage: 1, totalPages: 1, total: 0 },
      workspaces: { currentPage: 1, totalPages: 1, total: 0 },
      logs: { currentPage: 1, totalPages: 1, total: 0 },
    },
    loading: {
      users: false,
      workspaces: false,
      stats: false,
      logs: false,
    },
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading.users = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload.data.users;
        state.pagination.users = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          total: action.payload.data.totalUsers,
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error = action.payload;
      })

      // Get user details
      .addCase(getUserDetails.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading.users = false;
        state.selectedUser = action.payload.data;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading.users = false;
        state.error = action.payload;
      })

      // Update user info
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        const updatedUser = action.payload.data.user;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...updatedUser };
        }
      })

      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.data.user;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...updatedUser };
        }
      })

      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.data.user;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...updatedUser };
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload.userId);
        state.pagination.users.total -= 1;
      })

      // Get all workspaces
      .addCase(getAllWorkspaces.pending, (state) => {
        state.loading.workspaces = true;
        state.error = null;
      })
      .addCase(getAllWorkspaces.fulfilled, (state, action) => {
        state.loading.workspaces = false;
        state.workspaces = action.payload.data.workspaces;
        state.pagination.workspaces = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          total: action.payload.data.totalWorkspaces,
        };
      })
      .addCase(getAllWorkspaces.rejected, (state, action) => {
        state.loading.workspaces = false;
        state.error = action.payload;
      })

      // Get system stats
      .addCase(getSystemStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(getSystemStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload.data;
      })
      .addCase(getSystemStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload;
      })

      // Get activity logs
      .addCase(getActivityLogs.pending, (state) => {
        state.loading.logs = true;
        state.error = null;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.loading.logs = false;
        state.logs = action.payload.data.logs;
        state.pagination.logs = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          total: action.payload.data.totalLogs,
        };
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading.logs = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
