/**
 * User API Service
 */

import API from '../client.js';

export const userAPI = {
  getUsers: () => API.get('/users'),
  getUserById: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  deleteUser: (id) => API.delete(`/users/${id}`),
};
