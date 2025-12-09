import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Get all notifications
export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async ({ page = 1, limit = 20, unreadOnly = false }, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications', {
        params: { page, limit, unreadOnly },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông báo');
    }
  }
);

// Get unread count
export const getUnreadCount = createAsyncThunk(
  'notification/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy số lượng thông báo');
    }
  }
);

// Mark notification as read
export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể đánh dấu đã đọc');
    }
  }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.put('/notifications/mark-all-read');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể đánh dấu tất cả đã đọc');
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa thông báo');
    }
  }
);

// Clear read notifications
export const clearReadNotifications = createAsyncThunk(
  'notification/clearReadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/notifications/clear-read');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa thông báo đã đọc');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  },
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.pagination = {
        total: 0,
        page: 1,
        pages: 1,
        limit: 20,
      };
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
          if (action.payload.isRead && state.unreadCount > 0) {
            state.unreadCount -= 1;
          }
        }
      })

      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }));
        state.unreadCount = 0;
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification && !notification.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
        state.pagination.total -= 1;
      })

      // Clear read notifications
      .addCase(clearReadNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.filter(n => !n.isRead);
        state.pagination.total = state.notifications.length;
      });
  },
});

export const { clearNotifications, incrementUnreadCount, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
