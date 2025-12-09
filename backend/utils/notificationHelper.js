import Notification from '../models/Notification.js';

/**
 * Helper function to create notifications for various events
 */

/**
 * Notify when a user is assigned to a task
 */
export const notifyTaskAssignment = async (assignedUserId, task, assignedByUserId) => {
  try {
    await Notification.createNotification({
      userId: assignedUserId,
      fromUserId: assignedByUserId,
      type: 'TASK_ASSIGNED',
      title: 'Bạn được giao công việc mới',
      message: `Bạn đã được giao công việc: "${task.title}"`,
      entityType: 'TASK',
      entityId: task._id,
      entityName: task.title,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      priority: task.priority === 'HIGH' || task.priority === 'URGENT' ? 'HIGH' : 'MEDIUM',
      actionUrl: `/taskDetails?id=${task._id}`,
      metadata: {
        taskId: task._id,
        taskTitle: task.title,
        taskPriority: task.priority,
        taskDueDate: task.dueDate,
      },
    });
  } catch (error) {
    console.error('Error creating task assignment notification:', error);
  }
};

/**
 * Notify when a task is updated
 */
export const notifyTaskUpdate = async (task, updatedByUserId, changes) => {
  try {
    // Notify assignee if they're not the one who made the update
    if (task.assignedTo && task.assignedTo.toString() !== updatedByUserId.toString()) {
      await Notification.createNotification({
        userId: task.assignedTo,
        fromUserId: updatedByUserId,
        type: 'TASK_UPDATED',
        title: 'Công việc được cập nhật',
        message: `Công việc "${task.title}" đã được cập nhật`,
        entityType: 'TASK',
        entityId: task._id,
        entityName: task.title,
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        priority: 'MEDIUM',
        actionUrl: `/taskDetails?id=${task._id}`,
        metadata: {
          changes,
          taskId: task._id,
        },
      });
    }
  } catch (error) {
    console.error('Error creating task update notification:', error);
  }
};

/**
 * Notify when a task is completed
 */
export const notifyTaskCompletion = async (task, completedByUserId) => {
  try {
    // Notify task creator if they're not the one who completed it
    if (task.createdBy && task.createdBy.toString() !== completedByUserId.toString()) {
      await Notification.createNotification({
        userId: task.createdBy,
        fromUserId: completedByUserId,
        type: 'TASK_COMPLETED',
        title: 'Công việc hoàn thành',
        message: `Công việc "${task.title}" đã được hoàn thành`,
        entityType: 'TASK',
        entityId: task._id,
        entityName: task.title,
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        priority: 'MEDIUM',
        actionUrl: `/taskDetails?id=${task._id}`,
      });
    }
  } catch (error) {
    console.error('Error creating task completion notification:', error);
  }
};

/**
 * Notify when a comment is added to a task
 */
export const notifyTaskComment = async (task, comment, commentAuthorId) => {
  try {
    console.log('🔔 notifyTaskComment called');
    console.log('Task:', { id: task._id, title: task.title, assignedTo: task.assignedTo });
    console.log('Comment author:', commentAuthorId);
    
    const usersToNotify = new Set();
    
    // Notify assignee (if not the comment author)
    if (task.assignedTo && task.assignedTo.toString() !== commentAuthorId.toString()) {
      console.log('✅ Adding assignee to notify list:', task.assignedTo);
      usersToNotify.add(task.assignedTo.toString());
    } else {
      console.log('⚠️ Assignee is comment author or not set');
    }
    
    // Notify task creator if exists (if not the comment author)
    if (task.createdBy && task.createdBy.toString() !== commentAuthorId.toString()) {
      console.log('✅ Adding creator to notify list:', task.createdBy);
      usersToNotify.add(task.createdBy.toString());
    }

    console.log(`📬 Total users to notify: ${usersToNotify.size}`);

    // Create notifications for all relevant users
    for (const userId of usersToNotify) {
      console.log('📨 Creating notification for user:', userId);
      const notification = await Notification.createNotification({
        userId,
        fromUserId: commentAuthorId,
        type: 'TASK_COMMENT',
        title: 'Bình luận mới',
        message: `Có bình luận mới trên công việc "${task.title}"`,
        entityType: 'COMMENT',
        entityId: comment._id,
        entityName: task.title,
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        priority: 'MEDIUM',
        actionUrl: `/taskDetails?id=${task._id}`,
        metadata: {
          commentId: comment._id,
          taskId: task._id,
        },
      });
      console.log('✅ Notification created:', notification?._id);
    }
  } catch (error) {
    console.error('❌ Error creating task comment notification:', error);
  }
};

/**
 * Notify when a user is added to a project
 */
export const notifyProjectMemberAdded = async (userId, project, addedByUserId) => {
  try {
    await Notification.createNotification({
      userId,
      fromUserId: addedByUserId,
      type: 'PROJECT_MEMBER_ADDED',
      title: 'Thêm vào dự án',
      message: `Bạn đã được thêm vào dự án "${project.name}"`,
      entityType: 'PROJECT',
      entityId: project._id,
      entityName: project.name,
      workspaceId: project.workspaceId,
      projectId: project._id,
      priority: 'MEDIUM',
      actionUrl: `/projectsDetail?id=${project._id}&tab=overview`,
      metadata: {
        projectId: project._id,
        projectName: project.name,
      },
    });
  } catch (error) {
    console.error('Error creating project member added notification:', error);
  }
};

/**
 * Notify when a project is updated
 */
export const notifyProjectUpdate = async (project, updatedByUserId, memberIds) => {
  try {
    // Notify all project members except the one who made the update
    for (const memberId of memberIds) {
      if (memberId.toString() !== updatedByUserId.toString()) {
        await Notification.createNotification({
          userId: memberId,
          fromUserId: updatedByUserId,
          type: 'PROJECT_UPDATED',
          title: 'Dự án được cập nhật',
          message: `Dự án "${project.name}" đã được cập nhật`,
          entityType: 'PROJECT',
          entityId: project._id,
          entityName: project.name,
          workspaceId: project.workspaceId,
          projectId: project._id,
          priority: 'LOW',
          actionUrl: `/projectsDetail?id=${project._id}&tab=overview`,
        });
      }
    }
  } catch (error) {
    console.error('Error creating project update notification:', error);
  }
};

/**
 * Notify when a user is added to a workspace
 */
export const notifyWorkspaceMemberAdded = async (userId, workspace, addedByUserId) => {
  try {
    await Notification.createNotification({
      userId,
      fromUserId: addedByUserId,
      type: 'WORKSPACE_MEMBER_ADDED',
      title: 'Thêm vào workspace',
      message: `Bạn đã được thêm vào workspace "${workspace.name}"`,
      entityType: 'WORKSPACE',
      entityId: workspace._id,
      entityName: workspace.name,
      workspaceId: workspace._id,
      priority: 'HIGH',
      actionUrl: `/`,
      metadata: {
        workspaceId: workspace._id,
        workspaceName: workspace.name,
      },
    });
  } catch (error) {
    console.error('Error creating workspace member added notification:', error);
  }
};

/**
 * Notify about task due dates
 */
export const notifyTaskDueSoon = async (task) => {
  try {
    if (!task.assignedTo) return;

    await Notification.createNotification({
      userId: task.assignedTo,
      type: 'TASK_DUE_SOON',
      title: 'Công việc sắp đến hạn',
      message: `Công việc "${task.title}" sắp đến hạn vào ${new Date(task.dueDate).toLocaleDateString('vi-VN')}`,
      entityType: 'TASK',
      entityId: task._id,
      entityName: task.title,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      priority: 'HIGH',
      actionUrl: `/taskDetails?id=${task._id}`,
      metadata: {
        taskId: task._id,
        dueDate: task.dueDate,
      },
    });
  } catch (error) {
    console.error('Error creating task due soon notification:', error);
  }
};

/**
 * Notify about overdue tasks
 */
export const notifyTaskOverdue = async (task) => {
  try {
    if (!task.assignedTo) return;

    await Notification.createNotification({
      userId: task.assignedTo,
      type: 'TASK_OVERDUE',
      title: 'Công việc quá hạn',
      message: `Công việc "${task.title}" đã quá hạn`,
      entityType: 'TASK',
      entityId: task._id,
      entityName: task.title,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      priority: 'URGENT',
      actionUrl: `/taskDetails?id=${task._id}`,
      metadata: {
        taskId: task._id,
        dueDate: task.dueDate,
      },
    });
  } catch (error) {
    console.error('Error creating task overdue notification:', error);
  }
};

/**
 * Create a system announcement notification
 */
export const createSystemAnnouncement = async (userIds, title, message, priority = 'MEDIUM') => {
  try {
    const notifications = userIds.map(userId =>
      Notification.createNotification({
        userId,
        type: 'SYSTEM_ANNOUNCEMENT',
        title,
        message,
        entityType: 'SYSTEM',
        priority,
      })
    );
    
    await Promise.all(notifications);
  } catch (error) {
    console.error('Error creating system announcement:', error);
  }
};

export default {
  notifyTaskAssignment,
  notifyTaskUpdate,
  notifyTaskCompletion,
  notifyTaskComment,
  notifyProjectMemberAdded,
  notifyProjectUpdate,
  notifyWorkspaceMemberAdded,
  notifyTaskDueSoon,
  notifyTaskOverdue,
  createSystemAnnouncement,
};
