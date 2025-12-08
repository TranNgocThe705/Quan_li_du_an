import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        // Task actions
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_DELETED',
        'TASK_ASSIGNED',
        'TASK_COMPLETED',
        'TASK_STATUS_CHANGED',
        // Project actions
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'PROJECT_DELETED',
        'PROJECT_MEMBER_ADDED',
        'PROJECT_MEMBER_REMOVED',
        // Workspace actions
        'WORKSPACE_CREATED',
        'WORKSPACE_UPDATED',
        'WORKSPACE_DELETED',
        'WORKSPACE_MEMBER_ADDED',
        'WORKSPACE_MEMBER_REMOVED',
        // Comment actions
        'COMMENT_ADDED',
        'COMMENT_UPDATED',
        'COMMENT_DELETED',
        // Other
        'USER_LOGGED_IN',
        'USER_REGISTERED',
      ],
    },
    entityType: {
      type: String,
      required: true,
      enum: ['TASK', 'PROJECT', 'WORKSPACE', 'COMMENT', 'USER'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    entityName: {
      type: String,
      default: '',
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    description: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ workspaceId: 1, createdAt: -1 });
activityLogSchema.index({ projectId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function (data) {
  try {
    const log = await this.create({
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      entityName: data.entityName || '',
      workspaceId: data.workspaceId || null,
      projectId: data.projectId || null,
      metadata: data.metadata || {},
      description: data.description || '',
      ipAddress: data.ipAddress || '',
      userAgent: data.userAgent || '',
    });
    return log;
  } catch (error) {
    console.error('❌ Activity log error:', error.message);
    return null;
  }
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
