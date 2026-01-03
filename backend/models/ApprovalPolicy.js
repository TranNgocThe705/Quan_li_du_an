import mongoose from 'mongoose';

// Schema cho một approval rule
const approvalRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 100,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  // Điều kiện để áp dụng rule
  conditions: {
    taskTypes: [{
      type: String,
      enum: ['STORY', 'TASK', 'BUG', 'FEATURE', 'IMPROVEMENT']
    }],
    priorities: [{
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    }],
    storyPointsMin: {
      type: Number,
      default: null
    },
    storyPointsMax: {
      type: Number,
      default: null
    },
    assignees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    labels: [String]
  },
  // Hành động khi rule match
  actions: {
    requireApproval: {
      type: Boolean,
      default: true
    },
    approvers: {
      roles: [{
        type: String,
        enum: ['Team Lead', 'Project Manager', 'Tech Lead', 'Developer']
      }],
      specificUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      anyTeamMember: {
        type: Boolean,
        default: false
      }
    },
    autoApprove: {
      type: Boolean,
      default: false
    },
    autoApproveAfterHours: {
      type: Number,
      default: 48
    },
    escalate: {
      type: Boolean,
      default: false
    },
    escalateAfterHours: {
      type: Number,
      default: 24
    },
    escalateTo: {
      roles: [{
        type: String,
        enum: ['Project Manager', 'Tech Lead', 'CTO']
      }],
      specificUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    }
  }
});

// Schema chính cho Approval Policy
const approvalPolicySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  requireApprovalForTaskTypes: [{
    type: String,
    enum: ['STORY', 'TASK', 'BUG', 'FEATURE', 'IMPROVEMENT']
  }],
  autoApproveEnabled: {
    type: Boolean,
    default: false
  },
  autoApproveAfterHours: {
    type: Number,
    default: 48
  },
  escalationEnabled: {
    type: Boolean,
    default: false
  },
  escalationAfterHours: {
    type: Number,
    default: 24
  },
  rules: [approvalRuleSchema],
  checklistTemplates: {
    STORY: [{
      name: String,
      required: Boolean
    }],
    TASK: [{
      name: String,
      required: Boolean
    }],
    BUG: [{
      name: String,
      required: Boolean
    }],
    FEATURE: [{
      name: String,
      required: Boolean
    }],
    IMPROVEMENT: [{
      name: String,
      required: Boolean
    }]
  }
}, {
  timestamps: true
});

// Method: Tìm rule phù hợp cho task
approvalPolicySchema.methods.getApplicableRule = function(task) {
  if (!this.enabled) return null;
  
  // Sắp xếp rules theo priority (nhỏ nhất = ưu tiên cao nhất)
  const sortedRules = this.rules
    .filter(rule => rule.enabled)
    .sort((a, b) => a.priority - b.priority);
  
  // Tìm rule đầu tiên match
  for (const rule of sortedRules) {
    if (this.isRuleApplicable(rule, task)) {
      return rule;
    }
  }
  
  return null;
};

// Method: Kiểm tra rule có match với task không
approvalPolicySchema.methods.isRuleApplicable = function(rule, task) {
  const conditions = rule.conditions;
  
  // Check task type
  if (conditions.taskTypes && conditions.taskTypes.length > 0) {
    if (!conditions.taskTypes.includes(task.type)) {
      return false;
    }
  }
  
  // Check priority
  if (conditions.priorities && conditions.priorities.length > 0) {
    if (!conditions.priorities.includes(task.priority)) {
      return false;
    }
  }
  
  // Check story points
  if (conditions.storyPointsMin !== null && conditions.storyPointsMin !== undefined) {
    if (!task.storyPoints || task.storyPoints < conditions.storyPointsMin) {
      return false;
    }
  }
  
  if (conditions.storyPointsMax !== null && conditions.storyPointsMax !== undefined) {
    if (!task.storyPoints || task.storyPoints > conditions.storyPointsMax) {
      return false;
    }
  }
  
  // Check assignees
  if (conditions.assignees && conditions.assignees.length > 0) {
    const taskAssigneeId = task.assignee?._id?.toString() || task.assignee?.toString();
    const conditionAssigneeIds = conditions.assignees.map(id => id.toString());
    if (!taskAssigneeId || !conditionAssigneeIds.includes(taskAssigneeId)) {
      return false;
    }
  }
  
  // Check labels
  if (conditions.labels && conditions.labels.length > 0) {
    if (!task.labels || !conditions.labels.some(label => task.labels.includes(label))) {
      return false;
    }
  }
  
  return true;
};

// Static method: Tạo policy mặc định
approvalPolicySchema.statics.createDefault = async function(projectId) {
  const defaultPolicy = {
    projectId,
    enabled: false,
    requireApprovalForTaskTypes: ['STORY', 'TASK'],
    autoApproveEnabled: false,
    autoApproveAfterHours: 48,
    escalationEnabled: false,
    escalationAfterHours: 24,
    rules: [],
    checklistTemplates: {
      STORY: [],
      TASK: [],
      BUG: [],
      FEATURE: [],
      IMPROVEMENT: []
    }
  };
  
  return await this.create(defaultPolicy);
};

const ApprovalPolicy = mongoose.model('ApprovalPolicy', approvalPolicySchema);

export default ApprovalPolicy;
