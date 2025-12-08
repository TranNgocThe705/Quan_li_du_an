/**
 * Event emitter for application events
 * Integrated with email notifications and activity logging
 */

import { sendEmail, emailTemplates } from '../config/nodemailer.js';
import ActivityLog from '../models/ActivityLog.js';

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  off(event, listenerToRemove) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        (listener) => listener !== listenerToRemove
      );
    }
  }
}

// Create singleton instance
const eventEmitter = new EventEmitter();

// Define event types
export const Events = {
  // User events
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',

  // Workspace events
  WORKSPACE_CREATED: 'workspace.created',
  WORKSPACE_UPDATED: 'workspace.updated',
  WORKSPACE_DELETED: 'workspace.deleted',
  WORKSPACE_MEMBER_ADDED: 'workspace.member.added',
  WORKSPACE_MEMBER_REMOVED: 'workspace.member.removed',

  // Project events
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',
  PROJECT_DELETED: 'project.deleted',
  PROJECT_MEMBER_ADDED: 'project.member.added',
  PROJECT_MEMBER_REMOVED: 'project.member.removed',

  // Task events
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_DELETED: 'task.deleted',
  TASK_ASSIGNED: 'task.assigned',
  TASK_COMPLETED: 'task.completed',

  // Comment events
  COMMENT_CREATED: 'comment.created',
};

// Event listeners with email and activity logging
eventEmitter.on(Events.TASK_ASSIGNED, async (data) => {
  console.log(`📧 [Event] Task assigned to ${data.assignee?.name || 'user'}:`, data.task?.title);
  
  // Send email notification
  if (data.assignee?.email) {
    const emailData = emailTemplates.taskAssigned(
      data.task,
      data.assignee,
      data.createdBy || data.reassignedBy
    );
    await sendEmail({
      to: data.assignee.email,
      subject: emailData.subject,
      html: emailData.html,
    });
  }

  // Log activity
  await ActivityLog.logActivity({
    userId: data.createdBy?._id || data.reassignedBy?._id,
    action: 'TASK_ASSIGNED',
    entityType: 'TASK',
    entityId: data.task._id,
    entityName: data.task.title,
    projectId: data.task.projectId,
    metadata: { assigneeId: data.assignee._id, assigneeName: data.assignee.name },
    description: `Assigned task "${data.task.title}" to ${data.assignee.name}`,
  });
});

eventEmitter.on(Events.TASK_COMPLETED, async (data) => {
  console.log(`✅ [Event] Task completed:`, data.task?.title);
  
  // Log activity
  await ActivityLog.logActivity({
    userId: data.completedBy?._id,
    action: 'TASK_COMPLETED',
    entityType: 'TASK',
    entityId: data.task._id,
    entityName: data.task.title,
    projectId: data.task.projectId,
    metadata: { completedBy: data.completedBy?.name },
    description: `Completed task "${data.task.title}"`,
  });

  // Send email to project lead (if needed)
  if (data.task.projectId?.team_lead?.email) {
    const emailData = emailTemplates.taskCompleted(data.task, data.completedBy);
    await sendEmail({
      to: data.task.projectId.team_lead.email,
      subject: emailData.subject,
      html: emailData.html,
    });
  }
});

eventEmitter.on(Events.PROJECT_CREATED, async (data) => {
  console.log(`🎉 [Event] Project created:`, data.project?.name);
  
  // Log activity
  await ActivityLog.logActivity({
    userId: data.creator?._id,
    action: 'PROJECT_CREATED',
    entityType: 'PROJECT',
    entityId: data.project._id,
    entityName: data.project.name,
    workspaceId: data.project.workspaceId,
    projectId: data.project._id,
    description: `Created project "${data.project.name}"`,
  });
});

eventEmitter.on(Events.PROJECT_MEMBER_ADDED, async (data) => {
  console.log(`📧 [Event] User ${data.user?.name} added to project:`, data.project?.name);
  
  // Log activity
  await ActivityLog.logActivity({
    userId: data.addedBy?._id,
    action: 'PROJECT_MEMBER_ADDED',
    entityType: 'PROJECT',
    entityId: data.project._id,
    entityName: data.project.name,
    projectId: data.project._id,
    workspaceId: data.project.workspaceId,
    metadata: { newMemberId: data.user._id, newMemberName: data.user.name },
    description: `Added ${data.user.name} to project "${data.project.name}"`,
  });
});

eventEmitter.on(Events.WORKSPACE_MEMBER_ADDED, async (data) => {
  console.log(`📧 [Event] User ${data.user?.name} added to workspace:`, data.workspace?.name);
  
  // Send invitation email
  if (data.user?.email) {
    const emailData = emailTemplates.workspaceInvite(
      data.workspace,
      data.invitedBy,
      data.user.email
    );
    await sendEmail({
      to: data.user.email,
      subject: emailData.subject,
      html: emailData.html,
    });
  }

  // Log activity
  await ActivityLog.logActivity({
    userId: data.invitedBy?._id,
    action: 'WORKSPACE_MEMBER_ADDED',
    entityType: 'WORKSPACE',
    entityId: data.workspace._id,
    entityName: data.workspace.name,
    workspaceId: data.workspace._id,
    metadata: { newMemberId: data.user._id, newMemberName: data.user.name },
    description: `Added ${data.user.name} to workspace "${data.workspace.name}"`,
  });
});

eventEmitter.on(Events.COMMENT_CREATED, async (data) => {
  console.log(`💬 [Event] New comment on task:`, data.task?.title);
  
  // Send email to task assignee (if not the commenter)
  if (data.task?.assigneeId?.email && 
      data.task.assigneeId._id.toString() !== data.commentBy._id.toString()) {
    const emailData = emailTemplates.commentAdded(data.comment, data.task, data.commentBy);
    await sendEmail({
      to: data.task.assigneeId.email,
      subject: emailData.subject,
      html: emailData.html,
    });
  }

  // Log activity
  await ActivityLog.logActivity({
    userId: data.commentBy?._id,
    action: 'COMMENT_ADDED',
    entityType: 'COMMENT',
    entityId: data.comment._id,
    entityName: data.task.title,
    projectId: data.task.projectId,
    metadata: { taskId: data.task._id, taskTitle: data.task.title },
    description: `Commented on task "${data.task.title}"`,
  });
});

export default eventEmitter;
