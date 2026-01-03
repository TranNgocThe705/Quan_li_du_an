import mongoose from 'mongoose';
import { TaskStatus, TaskType, Priority, ApprovalStatus } from '../config/constants.js';

const checklistItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  checkedAt: {
    type: Date,
    default: null,
  },
  note: {
    type: String,
    default: '',
  },
});

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    type: {
      type: String,
      enum: Object.values(TaskType),
      default: TaskType.TASK,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    due_date: {
      type: Date,
      required: [true, 'Please provide a due date'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Approval fields
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    // Approval configuration
    approvalConfig: {
      required: {
        type: Boolean,
        default: false,
      },
      ruleId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      ruleName: {
        type: String,
        default: null,
      },
      autoApprove: {
        type: Boolean,
        default: false,
      },
      autoApproveAt: {
        type: Date,
        default: null,
      },
      escalate: {
        type: Boolean,
        default: false,
      },
      escalateAt: {
        type: Date,
        default: null,
      },
      escalationNotificationSent: {
        type: Boolean,
        default: false,
      },
      bypassReason: {
        type: String,
        default: null,
      },
      bypassedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    // Approval requests
    approvalRequests: [{
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      approvers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'AUTO_APPROVED', 'BYPASSED'],
        default: 'PENDING',
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
      reason: {
        type: String,
        default: null,
      },
      autoApprovedAt: {
        type: Date,
        default: null,
      },
      bypassedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      bypassedAt: {
        type: Date,
        default: null,
      },
    }],
    // Checklist
    checklist: [checklistItemSchema],
    // Metrics
    approvalMetrics: {
      submittedAt: {
        type: Date,
        default: null,
      },
      firstReviewAt: {
        type: Date,
        default: null,
      },
      totalReviewTime: {
        type: Number, // minutes
        default: 0,
      },
      revisionCount: {
        type: Number,
        default: 0,
      },
    },
    // Estimated hours (for approval rules)
    estimatedHours: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for comments
taskSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'taskId',
});

// Methods
taskSchema.methods.canApprove = function() {
  // Kiểm tra xem có thể approve không
  if (this.status !== TaskStatus.PENDING_APPROVAL) {
    return { can: false, reason: 'Task không ở trạng thái chờ duyệt' };
  }

  // Kiểm tra checklist required items
  const requiredItems = this.checklist.filter(item => item.required);
  const uncheckedRequired = requiredItems.filter(item => !item.checked);
  
  if (uncheckedRequired.length > 0) {
    return { 
      can: false, 
      reason: `Còn ${uncheckedRequired.length} mục bắt buộc chưa hoàn thành trong checklist` 
    };
  }

  return { can: true };
};

taskSchema.methods.updateChecklistItem = function(itemId, data) {
  const item = this.checklist.id(itemId);
  if (!item) {
    throw new Error('Không tìm thấy checklist item');
  }

  if (data.checked !== undefined) {
    item.checked = data.checked;
    item.checkedAt = data.checked ? new Date() : null;
  }
  if (data.checkedBy) {
    item.checkedBy = data.checkedBy;
  }
  if (data.note !== undefined) {
    item.note = data.note;
  }

  return item;
};

taskSchema.methods.getChecklistProgress = function() {
  if (this.checklist.length === 0) {
    return { total: 0, checked: 0, required: 0, requiredChecked: 0, percentage: 0 };
  }

  const total = this.checklist.length;
  const checked = this.checklist.filter(item => item.checked).length;
  const required = this.checklist.filter(item => item.required).length;
  const requiredChecked = this.checklist.filter(item => item.required && item.checked).length;
  const percentage = Math.round((checked / total) * 100);

  return { total, checked, required, requiredChecked, percentage };
};

// Virtual field: statusInfo - Thông tin chi tiết về trạng thái
taskSchema.virtual('statusInfo').get(function() {
  const latestRequest = this.approvalRequests?.length > 0
    ? this.approvalRequests[this.approvalRequests.length - 1]
    : null;

  // Calculate waiting hours for pending approval
  const waitingHours = latestRequest?.requestedAt 
    ? Math.floor((Date.now() - latestRequest.requestedAt.getTime()) / (1000 * 60 * 60))
    : 0;

  return {
    status: this.status,
    approvalStatus: this.approvalStatus,
    latestApprovalRequest: latestRequest ? {
      status: latestRequest.status,
      requestedAt: latestRequest.requestedAt,
      approvers: latestRequest.approvers,
      approvedBy: latestRequest.approvedBy,
      approvedAt: latestRequest.approvedAt,
      rejectedBy: latestRequest.rejectedBy,
      rejectedAt: latestRequest.rejectedAt,
      reason: latestRequest.reason,
      autoApprovedAt: latestRequest.autoApprovedAt,
      bypassedBy: latestRequest.bypassedBy,
      bypassedAt: latestRequest.bypassedAt,
      waitingHours,
    } : null,
    // Helper flags
    isCompleted: this.status === 'DONE',
    isPendingApproval: this.status === 'PENDING_APPROVAL',
    isRejected: this.approvalStatus === 'REJECTED',
    isApproved: this.approvalStatus === 'APPROVED',
    isBypassed: latestRequest?.status === 'BYPASSED',
    isAutoApproved: latestRequest?.status === 'AUTO_APPROVED',
    needsAttention: this.approvalStatus === 'REJECTED' || waitingHours > 24,
  };
});

// Enable virtuals in JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
