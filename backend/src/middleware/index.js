/**
 * Middleware Index
 * Central export point for all middleware
 */

export { protect, protectAdmin } from './auth.js';
export { checkWorkspaceAccess, checkProjectAccess, checkTaskAccess } from './checkPermission.js';
export { notFound, errorHandler } from './errorHandler.js';
export { validateRequest } from './validation.js';
