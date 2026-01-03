// Enums matching Prisma schema
export const WorkspaceRole = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

export const ProjectRole = {
  LEAD: 'LEAD',         // Team Lead - Full control over project
  MEMBER: 'MEMBER',     // Regular member - Can create/update tasks
  VIEWER: 'VIEWER',     // Read-only access
};

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  DONE: 'DONE',
};

export const ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const TaskType = {
  TASK: 'TASK',
  BUG: 'BUG',
  FEATURE: 'FEATURE',
  IMPROVEMENT: 'IMPROVEMENT',
  OTHER: 'OTHER',
};

export const ProjectStatus = {
  ACTIVE: 'ACTIVE',
  PLANNING: 'PLANNING',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
};

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// JWT expiration
export const JWT_EXPIRATION = '30d';
