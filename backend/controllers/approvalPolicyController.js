import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import ApprovalPolicy from '../models/ApprovalPolicy.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import { ProjectRole } from '../config/constants.js';

// @desc    Get approval policy for a project
// @route   GET /api/approval-policies/:projectId
// @access  Private (Project Member)
export const getApprovalPolicy = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check if user is project member
  const isMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Bạn không phải thành viên của dự án này');
  }

  let policy = await ApprovalPolicy.findOne({ projectId });

  // If no policy exists, create default
  if (!policy) {
    policy = new ApprovalPolicy({
      projectId,
      enabled: false,
      requireApprovalForTaskTypes: [],
      rules: [],
      checklistTemplates: {},
      createdBy: req.user._id,
    });
    await policy.save();
  }

  return successResponse(res, 200, 'Lấy approval policy thành công', policy);
});

// @desc    Create or Update approval policy
// @route   PUT /api/approval-policies/:projectId
// @access  Private (Team Lead or Admin)
export const upsertApprovalPolicy = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const policyData = req.body;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể cập nhật approval policy');
  }

  // Find or create policy
  let policy = await ApprovalPolicy.findOne({ projectId });

  if (policy) {
    // Update existing
    Object.assign(policy, policyData);
    policy.updatedAt = new Date();
  } else {
    // Create new
    policy = new ApprovalPolicy({
      projectId,
      ...policyData,
      createdBy: req.user._id,
    });
  }

  await policy.save();

  return successResponse(
    res, 
    200, 
    policy.isNew ? 'Tạo approval policy thành công' : 'Cập nhật approval policy thành công',
    policy
  );
});

// @desc    Toggle approval policy enabled/disabled
// @route   PATCH /api/approval-policies/:projectId/toggle
// @access  Private (Team Lead)
export const toggleApprovalPolicy = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể bật/tắt approval policy');
  }

  const policy = await ApprovalPolicy.findOne({ projectId });

  if (!policy) {
    return errorResponse(res, 404, 'Không tìm thấy approval policy');
  }

  policy.enabled = !policy.enabled;
  await policy.save();

  return successResponse(
    res,
    200,
    `Đã ${policy.enabled ? 'bật' : 'tắt'} approval policy`,
    policy
  );
});

// @desc    Add rule to policy
// @route   POST /api/approval-policies/:projectId/rules
// @access  Private (Team Lead)
export const addRule = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const ruleData = req.body;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể thêm rule');
  }

  const policy = await ApprovalPolicy.findOne({ projectId });

  if (!policy) {
    return errorResponse(res, 404, 'Không tìm thấy approval policy');
  }

  policy.rules.push(ruleData);
  await policy.save();

  return successResponse(res, 201, 'Thêm rule thành công', policy);
});

// @desc    Update rule
// @route   PUT /api/approval-policies/:projectId/rules/:ruleId
// @access  Private (Team Lead)
export const updateRule = asyncHandler(async (req, res) => {
  const { projectId, ruleId } = req.params;
  const ruleData = req.body;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể cập nhật rule');
  }

  const policy = await ApprovalPolicy.findOne({ projectId });

  if (!policy) {
    return errorResponse(res, 404, 'Không tìm thấy approval policy');
  }

  const rule = policy.rules.id(ruleId);
  if (!rule) {
    return errorResponse(res, 404, 'Không tìm thấy rule');
  }

  Object.assign(rule, ruleData);
  await policy.save();

  return successResponse(res, 200, 'Cập nhật rule thành công', policy);
});

// @desc    Delete rule
// @route   DELETE /api/approval-policies/:projectId/rules/:ruleId
// @access  Private (Team Lead)
export const deleteRule = asyncHandler(async (req, res) => {
  const { projectId, ruleId } = req.params;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể xóa rule');
  }

  const policy = await ApprovalPolicy.findOne({ projectId });

  if (!policy) {
    return errorResponse(res, 404, 'Không tìm thấy approval policy');
  }

  policy.rules.pull(ruleId);
  await policy.save();

  return successResponse(res, 200, 'Xóa rule thành công', policy);
});

// @desc    Update checklist template
// @route   PUT /api/approval-policies/:projectId/checklist/:taskType
// @access  Private (Team Lead)
export const updateChecklistTemplate = asyncHandler(async (req, res) => {
  const { projectId, taskType } = req.params;
  const { items } = req.body;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể cập nhật checklist template');
  }

  const policy = await ApprovalPolicy.findOne({ projectId });

  if (!policy) {
    return errorResponse(res, 404, 'Không tìm thấy approval policy');
  }

  if (!['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER'].includes(taskType)) {
    return errorResponse(res, 400, 'Task type không hợp lệ');
  }

  policy.checklistTemplates[taskType] = items;
  await policy.save();

  return successResponse(res, 200, 'Cập nhật checklist template thành công', policy);
});

// @desc    Get policy templates (preset configs)
// @route   GET /api/approval-policies/templates
// @access  Private
export const getPolicyTemplates = asyncHandler(async (req, res) => {
  const templates = [
    {
      id: 'simple',
      name: 'Simple - Startup nhỏ',
      description: 'Chỉ task HIGH priority cần duyệt',
      config: {
        enabled: true,
        rules: [
          {
            name: 'High Priority Only',
            description: 'Chỉ task HIGH priority cần duyệt',
            condition: { priorities: ['HIGH'] },
            action: 'REQUIRE_APPROVAL',
            approvers: { type: 'TEAM_LEAD', count: 1 },
            priority: 10,
          },
          {
            name: 'Auto-approve others',
            description: 'Task khác tự động duyệt sau 24h',
            condition: { priorities: ['LOW', 'MEDIUM'] },
            action: 'AUTO_APPROVE',
            autoApproveAfter: 24,
            priority: 90,
          },
        ],
      },
    },
    {
      id: 'moderate',
      name: 'Moderate - Team trung bình',
      description: 'Phân loại theo priority và type',
      config: {
        enabled: true,
        rules: [
          {
            name: 'Critical Features',
            description: 'Feature quan trọng cần duyệt',
            condition: { 
              priorities: ['HIGH'],
              types: ['FEATURE', 'BUG'],
            },
            action: 'REQUIRE_APPROVAL',
            approvers: { type: 'TEAM_LEAD', count: 1 },
            priority: 10,
          },
          {
            name: 'Quick Tasks',
            description: 'Task đơn giản tự động duyệt',
            condition: { 
              priorities: ['LOW'],
              types: ['TASK', 'IMPROVEMENT'],
            },
            action: 'AUTO_APPROVE',
            autoApproveAfter: 4,
            priority: 50,
          },
        ],
      },
    },
    {
      id: 'strict',
      name: 'Strict - Production critical',
      description: 'Mọi task đều cần duyệt',
      config: {
        enabled: true,
        rules: [
          {
            name: 'All tasks require approval',
            description: 'Tất cả task cần phê duyệt',
            condition: { 
              priorities: ['LOW', 'MEDIUM', 'HIGH'],
            },
            action: 'REQUIRE_APPROVAL',
            approvers: { type: 'TEAM_LEAD', count: 1 },
            autoApproveAfter: 72,
            priority: 10,
          },
        ],
      },
    },
  ];

  return successResponse(res, 200, 'Lấy policy templates thành công', templates);
});

// @desc    Apply template to project
// @route   POST /api/approval-policies/:projectId/apply-template
// @access  Private (Team Lead)
export const applyTemplate = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { templateId } = req.body;

  // Check permission
  const member = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!member || member.role !== ProjectRole.LEAD) {
    return errorResponse(res, 403, 'Chỉ Team Lead mới có thể apply template');
  }

  // Get templates
  const templates = {
    simple: {
      enabled: true,
      rules: [
        {
          name: 'High Priority Only',
          description: 'Chỉ task HIGH priority cần duyệt',
          condition: { priorities: ['HIGH'] },
          action: 'REQUIRE_APPROVAL',
          approvers: { type: 'TEAM_LEAD', count: 1 },
          priority: 10,
        },
      ],
    },
    // ... other templates
  };

  const templateConfig = templates[templateId];
  
  if (!templateConfig) {
    return errorResponse(res, 404, 'Template không tồn tại');
  }

  let policy = await ApprovalPolicy.findOne({ projectId });

  if (policy) {
    Object.assign(policy, templateConfig);
  } else {
    policy = new ApprovalPolicy({
      projectId,
      ...templateConfig,
      createdBy: req.user._id,
    });
  }

  await policy.save();

  return successResponse(res, 200, 'Apply template thành công', policy);
});
