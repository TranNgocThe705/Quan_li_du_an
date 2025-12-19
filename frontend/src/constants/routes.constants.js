/**
 * Route Constants
 */

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  GOOGLE_CALLBACK: '/auth/google/callback',
  
  // Main
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projectsDetail',
  
  // Tasks
  TASK_DETAILS: '/task-details',
  
  // Team
  TEAM: '/team',
  
  // Settings
  SETTINGS: '/settings',
  PROFILE: '/profile',
  PERMISSION_GUIDE: '/permission-guide',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.GOOGLE_CALLBACK,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
];
