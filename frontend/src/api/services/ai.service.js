/**
 * AI API Service
 */

import API from '../client.js';

export const aiAPI = {
  chat: (data) => API.post('/ai/chat', data),
  getProjectInsights: (projectId) => API.get(`/ai/project-insights/${projectId}`),
  suggestTasks: (projectId, data) => API.post(`/ai/suggest-tasks/${projectId}`, data),
};
