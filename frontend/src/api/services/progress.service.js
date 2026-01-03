/**
 * Progress API Service
 */

import API from '../client.js';

export const progressAPI = {
  // Create or update progress
  createOrUpdateProgress: async (data) => {
    try {
      const response = await API.post(`/progress`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to report progress';
    }
  },

  // Get progress for a specific task
  getTaskProgress: async (taskId, startDate, endDate) => {
    try {
      const params = { taskId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await API.get(`/progress`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch progress';
    }
  },

  // Get my progress
  getMyProgress: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await API.get(`/progress/my-progress`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch my progress';
    }
  },

  // Get project progress
  getProjectProgress: async (projectId, startDate, endDate, userId) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (userId) params.userId = userId;
      
      const response = await API.get(`/progress/project/${projectId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch project progress';
    }
  },

  // Review progress (for team lead/admin)
  reviewProgress: async (progressId, data) => {
    try {
      const response = await API.put(`/progress/${progressId}/review`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to review progress';
    }
  },

  // Delete progress
  deleteProgress: async (progressId) => {
    try {
      const response = await API.delete(`/progress/${progressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete progress';
    }
  },
};
