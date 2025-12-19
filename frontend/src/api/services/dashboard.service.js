/**
 * Dashboard API Service
 */

import API from '../client.js';

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getRecentActivity: () => API.get('/dashboard/recent-activity'),
};
