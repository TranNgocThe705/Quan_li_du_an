import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: [
        // Task notifications
        'TASK_ASSIGNED',
        'TASK_UPDATED',
        'TASK_COMPLETED',
        'TASK_DUE_SOON',
        'TASK_OVERDUE',
        'TASK_COMMENT',
        'TASK_APPROVED',
        'TASK_REJECTED',
        'TASK_APPROVAL_REQUIRED',
        'TASK_AUTO_APPROVED',
        'TASK_APPROVAL_ESCALATED',
        'TASK_APPROVAL_BYPASSED',
        'TASK_SUBMITTED_FOR_APPROVAL',
        // Project notifications
        'PROJECT_MEMBER_ADDED',
        'PROJECT_UPDATED',
        'PROJECT_DEADLINE_APPROACHING',
        // Workspace notifications
        'WORKSPACE_MEMBER_ADDED',
        'WORKSPACE_ROLE_CHANGED',
        // Mention notifications
        'MENTIONED_IN_COMMENT',
        'MENTIONED_IN_TASK',
        // System notifications
        'SYSTEM_ANNOUNCEMENT',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ['TASK', 'PROJECT', 'WORKSPACE', 'COMMENT', 'USER', 'SYSTEM'],
      default: 'SYSTEM',
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
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
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    actionUrl: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ workspaceId: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  try {
    const notification = await this.create({
      userId: data.userId,
      fromUserId: data.fromUserId || null,
      type: data.type,
      title: data.title,
      message: data.message,
      entityType: data.entityType || 'SYSTEM',
      entityId: data.entityId || null,
      entityName: data.entityName || '',
      workspaceId: data.workspaceId || null,
      projectId: data.projectId || null,
      priority: data.priority || 'MEDIUM',
      actionUrl: data.actionUrl || '',
      metadata: data.metadata || {},
    });
    return notification;
  } catch (error) {
    console.error('❌ Notification creation error:', error.message);
    return null;
  }
};

// Static method to mark notification as read
notificationSchema.statics.markAsRead = async function (notificationId, userId) {
  try {
    const notification = await this.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('❌ Mark as read error:', error.message);
    return null;
  }
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
  try {
    const result = await this.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return result;
  } catch (error) {
    console.error('❌ Mark all as read error:', error.message);
    return null;
  }
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  try {
    const count = await this.countDocuments({ userId, isRead: false });
    return count;
  } catch (error) {
    console.error('❌ Get unread count error:', error.message);
    return 0;
  }
};

// Auto-delete old read notifications after 30 days
notificationSchema.index(
  { readAt: 1 },
  {
    expireAfterSeconds: 30 * 24 * 60 * 60, // 30 days
    partialFilterExpression: { isRead: true },
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
