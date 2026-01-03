import Task from '../models/Task.js';
import ApprovalPolicy from '../models/ApprovalPolicy.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { TaskStatus } from '../config/constants.js';

class AutoApprovalService {
  /**
   * Apply approval policy khi task chuyển sang PENDING_APPROVAL
   */
  static async applyApprovalPolicy(task) {
    try {
      // Populate task nếu chưa
      if (!task.projectId?.name) {
        await task.populate('projectId');
      }

      // Lấy policy của project
      const policy = await ApprovalPolicy.findOne({ 
        projectId: task.projectId._id || task.projectId,
        enabled: true 
      });
      
      if (!policy) {
        console.log('No active approval policy for project');
        return task;
      }

      // Check task type có cần approval không
      if (!policy.requireApprovalForTaskTypes.includes(task.type)) {
        console.log(`Task type ${task.type} không cần approval`);
        return task;
      }

      // Tìm rule áp dụng cho task này
      const applicableRule = policy.getApplicableRule(task);

      if (applicableRule) {
        console.log(`Applying rule: ${applicableRule.name}`);
        await this.applyRule(task, applicableRule, policy);
      } else {
        // Sử dụng global settings
        console.log('Using global approval settings');
        await this.applyGlobalSettings(task, policy);
      }

      return task;
    } catch (error) {
      console.error('Error applying approval policy:', error);
      return task;
    }
  }

  /**
   * Apply specific rule to task
   */
  static async applyRule(task, rule, policy) {
    const actions = rule.actions;

    // 1. Set approvers
    const approvers = await this.getApprovers(
      actions.approvers,
      task.projectId._id || task.projectId
    );

    if (approvers.length > 0) {
      // Tạo checklist từ template
      const checklistTemplate = policy.checklistTemplates[task.type] || [];
      if (checklistTemplate.length > 0) {
        task.checklist = checklistTemplate.map(item => ({
          name: item.name,
          required: item.required || false,
          checked: false
        }));
      }

      // 2. Set auto-approve timer
      if (actions.autoApprove && actions.autoApproveAfterHours) {
        task.approvalConfig = task.approvalConfig || {};
        task.approvalConfig.autoApprove = true;
        const autoApproveAt = new Date();
        autoApproveAt.setHours(autoApproveAt.getHours() + actions.autoApproveAfterHours);
        task.approvalConfig.autoApproveAt = autoApproveAt;
      }

      // 3. Set escalation timer  
      if (actions.escalate && actions.escalateAfterHours) {
        task.approvalConfig = task.approvalConfig || {};
        task.approvalConfig.escalate = true;
        const escalateAt = new Date();
        escalateAt.setHours(escalateAt.getHours() + actions.escalateAfterHours);
        task.approvalConfig.escalateAt = escalateAt;
        task.approvalConfig.escalationNotificationSent = false;
      }

      // 4. Create approval requests
      task.approvalRequests = [{
        requestedAt: new Date(),
        approvers: approvers.map(u => u._id),
        status: 'PENDING'
      }];

      // 5. Notify approvers
      await this.notifyApprovers(task, approvers);

      console.log(`✅ Applied rule "${rule.name}" - Notified ${approvers.length} approvers`);
    }
  }

  /**
   * Apply global approval settings (khi không match rule nào)
   */
  static async applyGlobalSettings(task, policy) {
    // Get Team Lead của project
    const teamLeads = await ProjectMember.find({
      projectId: task.projectId._id || task.projectId,
      role: 'Team Lead'
    }).populate('userId');

    const approvers = teamLeads.map(m => m.userId).filter(u => u);

    if (approvers.length > 0) {
      // Tạo checklist từ template
      const checklistTemplate = policy.checklistTemplates[task.type] || [];
      if (checklistTemplate.length > 0) {
        task.checklist = checklistTemplate.map(item => ({
          name: item.name,
          required: item.required || false,
          checked: false
        }));
      }

      // Set auto-approve nếu enabled
      if (policy.autoApproveEnabled && policy.autoApproveAfterHours) {
        task.approvalConfig = task.approvalConfig || {};
        task.approvalConfig.autoApprove = true;
        const autoApproveAt = new Date();
        autoApproveAt.setHours(autoApproveAt.getHours() + policy.autoApproveAfterHours);
        task.approvalConfig.autoApproveAt = autoApproveAt;
      }

      // Set escalation nếu enabled
      if (policy.escalationEnabled && policy.escalationAfterHours) {
        task.approvalConfig = task.approvalConfig || {};
        task.approvalConfig.escalate = true;
        const escalateAt = new Date();
        escalateAt.setHours(escalateAt.getHours() + policy.escalationAfterHours);
        task.approvalConfig.escalateAt = escalateAt;
        task.approvalConfig.escalationNotificationSent = false;
      }

      // Create approval requests
      task.approvalRequests = [{
        requestedAt: new Date(),
        approvers: approvers.map(u => u._id),
        status: 'PENDING'
      }];

      // Notify approvers
      await this.notifyApprovers(task, approvers);

      console.log(`✅ Applied global settings - Notified ${approvers.length} Team Leads`);
    }
  }

  /**
   * Get approvers từ config
   */
  static async getApprovers(approverConfig, projectId) {
    const approvers = [];

    // 1. Lấy theo role
    if (approverConfig.roles && approverConfig.roles.length > 0) {
      for (const role of approverConfig.roles) {
        const members = await ProjectMember.find({
          projectId,
          role
        }).populate('userId');

        members.forEach(m => {
          if (m.userId && !approvers.find(a => a._id.equals(m.userId._id))) {
            approvers.push(m.userId);
          }
        });
      }
    }

    // 2. Lấy specific users
    if (approverConfig.specificUsers && approverConfig.specificUsers.length > 0) {
      const users = await User.find({
        _id: { $in: approverConfig.specificUsers }
      });

      users.forEach(u => {
        if (!approvers.find(a => a._id.equals(u._id))) {
          approvers.push(u);
        }
      });
    }

    // 3. Any team member
    if (approverConfig.anyTeamMember) {
      const allMembers = await ProjectMember.find({ projectId }).populate('userId');
      allMembers.forEach(m => {
        if (m.userId && !approvers.find(a => a._id.equals(m.userId._id))) {
          approvers.push(m.userId);
        }
      });
    }

    return approvers;
  }

  /**
   * Notify approvers
   */
  static async notifyApprovers(task, approvers) {
    const notifications = approvers.map(approver => ({
      recipientId: approver._id,
      type: 'TASK_APPROVAL_REQUIRED',
      title: 'Task cần phê duyệt',
      message: `${task.assignee?.name || 'Developer'} yêu cầu phê duyệt task "${task.title}"`,
      taskId: task._id,
      projectId: task.projectId._id || task.projectId,
      priority: task.priority === 'CRITICAL' || task.priority === 'HIGH' ? 'HIGH' : 'MEDIUM'
    }));

    await Notification.insertMany(notifications);
    console.log(`📧 Sent ${notifications.length} approval notifications`);
  }

  /**
   * Process scheduled auto-approvals (Cron job - chạy mỗi giờ)
   */
  static async processScheduledAutoApprovals() {
    try {
      console.log('⏰ Running auto-approval job...');

      // Tìm tasks cần auto-approve
      const tasks = await Task.find({
        status: TaskStatus.PENDING_APPROVAL,
        'approvalConfig.autoApprove': true,
        'approvalConfig.autoApproveAt': { $lte: new Date() }
      }).populate('assignee projectId');

      console.log(`Found ${tasks.length} tasks eligible for auto-approval`);

      let approvedCount = 0;

      for (const task of tasks) {
        // Kiểm tra checklist required items
        const progress = task.getChecklistProgress();
        
        if (progress.required > 0 && progress.requiredChecked < progress.required) {
          console.log(`⚠️ Task ${task._id} không thể auto-approve: checklist chưa đủ`);
          continue;
        }

        // Auto-approve task
        task.status = TaskStatus.DONE;
        task.approvalRequests[0].status = 'AUTO_APPROVED';
        task.approvalRequests[0].autoApprovedAt = new Date();
        task.completedAt = new Date();

        await task.save();

        // Notify assignee
        await Notification.create({
          recipientId: task.assignee._id,
          type: 'TASK_AUTO_APPROVED',
          title: 'Task đã được tự động phê duyệt',
          message: `Task "${task.title}" đã được tự động phê duyệt`,
          taskId: task._id,
          projectId: task.projectId._id
        });

        // Notify approvers
        if (task.approvalRequests[0].approvers) {
          for (const approverId of task.approvalRequests[0].approvers) {
            await Notification.create({
              recipientId: approverId,
              type: 'TASK_AUTO_APPROVED',
              title: 'Task tự động phê duyệt',
              message: `Task "${task.title}" đã được tự động phê duyệt do hết thời gian chờ`,
              taskId: task._id,
              projectId: task.projectId._id
            });
          }
        }

        approvedCount++;
        console.log(`✅ Auto-approved task: ${task.title}`);
      }

      console.log(`✅ Auto-approval job completed: ${approvedCount}/${tasks.length} tasks approved`);

      return {
        processedCount: tasks.length,
        approvedCount,
        skippedCount: tasks.length - approvedCount
      };
    } catch (error) {
      console.error('❌ Auto-approval job failed:', error);
      throw error;
    }
  }

  /**
   * Send escalation reminders (Cron job - chạy hàng ngày)
   */
  static async sendEscalationReminders() {
    try {
      console.log('📢 Running escalation reminder job...');

      // Tìm tasks cần escalate
      const tasks = await Task.find({
        status: TaskStatus.PENDING_APPROVAL,
        'approvalConfig.escalate': true,
        'approvalConfig.escalateAt': { $lte: new Date() },
        'approvalConfig.escalationNotificationSent': { $ne: true }
      }).populate('assignee projectId');

      console.log(`Found ${tasks.length} tasks for escalation`);

      let remindersCount = 0;

      for (const task of tasks) {
        // Get escalation recipients từ policy
        const policy = await ApprovalPolicy.findOne({
          projectId: task.projectId._id
        });

        if (!policy) continue;

        const rule = policy.getApplicableRule(task);
        let escalationRecipients = [];

        if (rule && rule.actions.escalateTo) {
          escalationRecipients = await this.getApprovers(
            rule.actions.escalateTo,
            task.projectId._id
          );
        }

        // Fallback: notify Project Managers
        if (escalationRecipients.length === 0) {
          const pms = await ProjectMember.find({
            projectId: task.projectId._id,
            role: 'Project Manager'
          }).populate('userId');

          escalationRecipients = pms.map(m => m.userId).filter(u => u);
        }

        // Send escalation notifications
        for (const recipient of escalationRecipients) {
          await Notification.create({
            recipientId: recipient._id,
            type: 'TASK_APPROVAL_ESCALATED',
            title: '⚠️ Task chờ phê duyệt quá lâu',
            message: `Task "${task.title}" đã chờ phê duyệt quá ${policy.escalationAfterHours || 24} giờ`,
            taskId: task._id,
            projectId: task.projectId._id,
            priority: 'HIGH'
          });
        }

        // Mark as escalated
        task.approvalConfig.escalationNotificationSent = true;
        await task.save();

        remindersCount += escalationRecipients.length;
        console.log(`📢 Escalated task "${task.title}" to ${escalationRecipients.length} recipients`);
      }

      console.log(`✅ Escalation job completed: ${remindersCount} reminders sent`);

      return {
        tasksEscalated: tasks.length,
        remindersCount
      };
    } catch (error) {
      console.error('❌ Escalation job failed:', error);
      throw error;
    }
  }
}

export default AutoApprovalService;
