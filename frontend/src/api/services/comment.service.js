/**
 * Comment API Service
 */

import API from '../client.js';

export const commentAPI = {
  getComments: (taskId) => API.get(`/comments?taskId=${taskId}`),
  createComment: (data) => API.post('/comments', data),
  updateComment: (id, data) => API.put(`/comments/${id}`, data),
  deleteComment: (id) => API.delete(`/comments/${id}`),
};
