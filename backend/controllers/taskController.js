import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import Notification from '../models/Notification.js';
import { notifyTaskAssignment, notifyTaskUpdate, notifyTaskCompletion } from '../utils/notificationHelper.js';
import { TaskStatus, ApprovalStatus, ProjectRole } from '../config/constants.js';
import AutoApprovalService from '../services/autoApprovalService.js';

// @desc    Get all tasks for a project
// @route   GET /api/tasks?projectId=xxx
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { projectId, status, priority, assigneeId } = req.query;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Check if user is project member
  const isMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
  }

  // Build query
  const query = { projectId };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assigneeId) query.assigneeId = assigneeId;

  const tasks = await Task.find(query)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'Tasks retrieved successfully', tasks);
});

// @desc    Get task by ID with details
// @route   GET /api/tasks/:id
// @access  Private (Project Member)
export const getTaskById = asyncHandler(async (req, res) => {
  // Task and access already checked by middleware
  const task = req.task || await Task.findById(req.params.id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name workspaceId');

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  return successResponse(res, 200, 'Task retrieved successfully', task);
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Workspace Member with project access)
export const createTask = asyncHandler(async (req, res) => {
  const {
    projectId,
    title,
    description,
    status,
    type,
    priority,
    assigneeId,
    due_date,
  } = req.body;

  // Project and workspace membership already checked by middleware
  const project = req.project || await Project.findById(projectId);
  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Log incoming data for debugging
  console.log('📝 Creating task with data:', {
    projectId,
    title,
    assigneeId,
    status,
    priority,
    type
  });

  // Check if assignee is project member (only if assigneeId is provided)
  if (assigneeId) {
    const isAssigneeMember = await ProjectMember.findOne({
      userId: assigneeId,
      projectId,
    });

    if (!isAssigneeMember) {
      console.error('❌ Assignee validation failed:', {
        assigneeId,
        projectId,
        found: !!isAssigneeMember
      });
      return errorResponse(res, 400, 'Assignee must be a project member');
    }
    console.log('✅ Assignee is project member:', assigneeId);
  } else {
    console.log('⚠️ No assignee provided for task');
  }

  // Create task
  const task = await Task.create({
    projectId,
    title,
    description,
    status,
    type,
    priority,
    assigneeId,
    due_date,
  });

  console.log('✅ Task created successfully:', {
    taskId: task._id,
    assigneeId: task.assigneeId,
    title: task.title
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name');

  // Send notification to assignee
  if (assigneeId && assigneeId.toString() !== req.user._id.toString()) {
    await notifyTaskAssignment(assigneeId, {
      _id: task._id,
      title: task.title,
      priority: task.priority,
      dueDate: task.due_date,
      workspaceId: project.workspaceId,
      projectId: project._id,
    }, req.user._id);
  }

  return successResponse(res, 201, 'Task created successfully', populatedTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Task assignee, Team Lead, or Workspace Admin)
export const updateTask = asyncHandler(async (req, res) => {
  // Task and permissions already checked by middleware
  const task = req.task || await Task.findById(req.params.id);

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Update fields
  const updateFields = [
    'title',
    'description',
    'status',
    'type',
    'priority',
    'assigneeId',
    'due_date',
  ];

  const oldStatus = task.status;

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  // Kiểm tra logic chuyển trạng thái
  if (req.body.status) {
    // Nếu chuyển sang PENDING_APPROVAL
    if (req.body.status === TaskStatus.PENDING_APPROVAL) {
      if (oldStatus === TaskStatus.DONE) {
        return errorResponse(res, 400, 'Không thể chuyển công việc đã hoàn thành về chờ duyệt');
      }
      
      // Apply approval policy
      await AutoApprovalService.applyApprovalPolicy(task);
      
      // Update approval status
      task.approvalStatus = ApprovalStatus.PENDING;
      task.completedAt = null;
      task.approvedBy = null;
      task.approvedAt = null;
      task.rejectionReason = null;
      
      // Set metrics
      if (!task.approvalMetrics) {
        task.approvalMetrics = {};
      }
      if (!task.approvalMetrics.submittedAt) {
        task.approvalMetrics.submittedAt = new Date();
      }
    }

    // Nếu chuyển sang DONE
    if (req.body.status === TaskStatus.DONE) {
      // Nếu task đang PENDING_APPROVAL, phải được approve trước
      if (oldStatus === TaskStatus.PENDING_APPROVAL) {
        return errorResponse(res, 403, 'Công việc phải được phê duyệt trước');
      }
      task.completedAt = new Date();
    }

    // Reset completedAt nếu chuyển từ DONE sang status khác
    if (req.body.status !== TaskStatus.DONE && oldStatus === TaskStatus.DONE) {
      task.completedAt = null;
      task.approvalStatus = null;
      task.approvedBy = null;
      task.approvedAt = null;
    }
  }

  // If assignee is being changed, verify they're a project member
  if (req.body.assigneeId) {
    const isAssigneeMember = await ProjectMember.findOne({
      userId: req.body.assigneeId,
      projectId: task.projectId,
    });

    if (!isAssigneeMember) {
      return errorResponse(res, 400, 'Assignee must be a project member');
    }
  }

  const updatedTask = await task.save();
  const populatedTask = await Task.findById(updatedTask._id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name');

  // Send notification if task was updated by someone else
  const project = await Project.findById(task.projectId);
  await notifyTaskUpdate({
    _id: task._id,
    title: task.title,
    assignedTo: task.assigneeId,
    workspaceId: project?.workspaceId,
    projectId: task.projectId,
  }, req.user._id, req.body);

  // If task status changed to completed, notify creator
  if (req.body.status === 'COMPLETED' && task.status === 'COMPLETED') {
    await notifyTaskCompletion({
      _id: task._id,
      title: task.title,
      createdBy: task.createdBy,
      workspaceId: project?.workspaceId,
      projectId: task.projectId,
    }, req.user._id);
  }

  return successResponse(res, 200, 'Task updated successfully', populatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Task assignee, Team Lead, or Workspace Admin)
export const deleteTask = asyncHandler(async (req, res) => {
  // Task and permissions already checked by middleware
  const task = req.task || await Task.findById(req.params.id);

  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  await task.deleteOne();

  return successResponse(res, 200, 'Task deleted successfully');
});

// @desc    Get my assigned tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;

  // Build query
  const query = { assigneeId: req.user._id };
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tasks = await Task.find(query)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name')
    .sort({ due_date: 1 });

  return successResponse(res, 200, 'My tasks retrieved successfully', tasks);
});

// @desc    Submit task for approval (Member completes task)
// @route   POST /api/tasks/:id/submit-for-approval
// @access  Private (Task Assignee)
export const submitTaskForApproval = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('projectId', 'name workspaceId')
    .populate('assigneeId', 'name email');
  
  if (!task) {
    return errorResponse(res, 404, 'Không tìm thấy công việc');
  }

  // Chỉ người được giao việc mới được submit
  if (task.assigneeId?._id.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Chỉ người được giao việc mới có thể đánh dấu hoàn thành');
  }

  // Kiểm tra trạng thái công việc
  if (task.status !== TaskStatus.IN_PROGRESS) {
    return errorResponse(res, 400, 'Công việc phải ở trạng thái "Đang làm"');
  }

  // Kiểm tra checklist required items
  const requiredItems = task.checklist?.filter(item => item.required) || [];
  const uncheckedRequired = requiredItems.filter(item => !item.checked);
  
  if (uncheckedRequired.length > 0) {
    return errorResponse(res, 400, `Vui lòng hoàn thành ${uncheckedRequired.length} mục bắt buộc trong checklist trước khi submit`);
  }

  // Apply approval policy từ project
  await AutoApprovalService.applyApprovalPolicy(task);
  
  // Update task status
  task.status = TaskStatus.PENDING_APPROVAL;
  task.approvalStatus = ApprovalStatus.PENDING;
  task.rejectionReason = null;

  // Set metrics
  if (!task.approvalMetrics) {
    task.approvalMetrics = {};
  }
  task.approvalMetrics.submittedAt = new Date();
  task.approvalMetrics.revisionCount = (task.approvalMetrics.revisionCount || 0) + 1;

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name')
    .populate('approvalRequests.approvers', 'name email image');

  // Gửi thông báo cho approvers (Team Lead và các approver khác)
  const latestRequest = task.approvalRequests?.[task.approvalRequests.length - 1];
  
  if (latestRequest?.approvers) {
    for (const approverId of latestRequest.approvers) {
      await Notification.create({
        recipientId: approverId,
        type: 'TASK_SUBMITTED_FOR_APPROVAL',
        title: 'Công việc chờ phê duyệt',
        message: `${task.assigneeId.name} đã hoàn thành công việc "${task.title}" và chờ bạn phê duyệt`,
        taskId: task._id,
        projectId: task.projectId._id,
        priority: 'HIGH',
        actionUrl: `/tasks/${task._id}`,
        metadata: {
          submittedBy: task.assigneeId._id,
          submittedAt: new Date(),
        },
      });
    }
  }

  return successResponse(res, 200, 'Đã gửi yêu cầu phê duyệt thành công', populatedTask);
});

// @desc    Approve task completion (Team Lead only)
// @route   PUT /api/tasks/:id/approve
// @access  Private (Team Lead or Workspace Admin)
export const approveTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('projectId', 'workspaceId')
    .populate('assigneeId', 'name email');
  
  if (!task) {
    return errorResponse(res, 404, 'Không tìm thấy công việc');
  }

  // Kiểm tra trạng thái công việc
  if (task.status !== TaskStatus.PENDING_APPROVAL) {
    return errorResponse(res, 400, 'Công việc phải ở trạng thái chờ duyệt');
  }

  // Kiểm tra user có trong danh sách approvers không
  const latestRequest = task.approvalRequests && task.approvalRequests.length > 0 
    ? task.approvalRequests[task.approvalRequests.length - 1]
    : null;

  if (!latestRequest) {
    return errorResponse(res, 400, 'Không tìm thấy approval request');
  }

  const isApprover = latestRequest.approvers.some(
    approverId => approverId.toString() === req.user._id.toString()
  );

  if (!isApprover) {
    return errorResponse(res, 403, 'Bạn không có quyền phê duyệt công việc này');
  }

  // Kiểm tra checklist required items
  const checkResult = task.canApprove();
  if (!checkResult.can) {
    return errorResponse(res, 400, checkResult.reason);
  }

  // Approve task
  task.status = TaskStatus.DONE;
  task.approvalStatus = ApprovalStatus.APPROVED;
  task.approvedBy = req.user._id;
  task.approvedAt = new Date();
  task.completedAt = new Date();
  task.rejectionReason = null;

  // Update approval request
  latestRequest.status = 'APPROVED';
  latestRequest.approvedBy = req.user._id;
  latestRequest.approvedAt = new Date();

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assigneeId', 'name email image')
    .populate('approvedBy', 'name email image')
    .populate('projectId', 'name');

  // Gửi thông báo cho người được giao việc
  if (task.assigneeId) {
    await Notification.create({
      recipientId: task.assigneeId,
      type: 'TASK_APPROVED',
      title: 'Công việc được duyệt',
      message: `Công việc "${task.title}" đã được ${req.user.name} phê duyệt`,
      taskId: task._id,
      projectId: task.projectId._id,
      priority: 'MEDIUM'
    });
  }

  return successResponse(res, 200, 'Công việc đã được duyệt', populatedTask);
});

// @desc    Reject task completion
// @route   PUT /api/tasks/:id/reject
// @access  Private (Approvers only)
export const rejectTask = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  if (!reason || reason.trim().length < 5) {
    return errorResponse(res, 400, 'Vui lòng cung cấp lý do từ chối (tối thiểu 5 ký tự)');
  }

  const task = await Task.findById(req.params.id)
    .populate('projectId', 'workspaceId')
    .populate('assigneeId', 'name email');
  
  if (!task) {
    return errorResponse(res, 404, 'Không tìm thấy công việc');
  }

  // Kiểm tra trạng thái công việc
  if (task.status !== TaskStatus.PENDING_APPROVAL) {
    return errorResponse(res, 400, 'Công việc phải ở trạng thái chờ duyệt');
  }

  // Kiểm tra user có trong danh sách approvers không
  const latestRequest = task.approvalRequests && task.approvalRequests.length > 0 
    ? task.approvalRequests[task.approvalRequests.length - 1]
    : null;

  if (!latestRequest) {
    return errorResponse(res, 400, 'Không tìm thấy approval request');
  }

  const isApprover = latestRequest.approvers.some(
    approverId => approverId.toString() === req.user._id.toString()
  );

  if (!isApprover) {
    return errorResponse(res, 403, 'Bạn không có quyền từ chối công việc này');
  }

  // Reject task
  task.status = TaskStatus.IN_PROGRESS; // Trả về IN_PROGRESS
  task.approvalStatus = ApprovalStatus.REJECTED;
  task.rejectionReason = reason;
  task.approvedBy = null;
  task.approvedAt = null;
  task.completedAt = null;

  // Update approval request
  latestRequest.status = 'REJECTED';
  latestRequest.rejectedBy = req.user._id;
  latestRequest.rejectedAt = new Date();
  latestRequest.reason = reason;

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name')
    .populate('approvalRequests.rejectedBy', 'name email image');

  // Send notification to assignee
  if (task.assigneeId) {
    await Notification.create({
      userId: task.assigneeId,
      fromUserId: req.user._id,
      type: 'TASK_REJECTED',
      title: 'Công việc bị từ chối',
      message: `Công việc "${task.title}" bị từ chối. Lý do: ${reason}`,
      entityType: 'TASK',
      entityId: task._id,
      entityName: task.title,
      workspaceId: task.projectId.workspaceId,
      projectId: task.projectId._id,
      priority: 'HIGH',
      actionUrl: `/taskDetails?id=${task._id}`,
      metadata: {
        rejectionReason: reason,
      },
    });
  }

  return successResponse(res, 200, 'Công việc đã bị từ chối', populatedTask);
});

// @desc    Update checklist item
// @route   PATCH /api/tasks/:id/checklist/:itemId
// @access  Private (Task assignee or Team Lead)
export const updateChecklistItem = asyncHandler(async (req, res) => {
  const { id, itemId } = req.params;
  const { checked, note } = req.body;

  const task = await Task.findById(id);
  
  if (!task) {
    return errorResponse(res, 404, 'Không tìm thấy công việc');
  }

  // Check permission: assignee hoặc team lead
  const isAssignee = task.assigneeId?.toString() === req.user._id.toString();
  const projectMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: task.projectId,
  });
  const isTeamLead = projectMember?.role === ProjectRole.LEAD;

  if (!isAssignee && !isTeamLead) {
    return errorResponse(res, 403, 'Bạn không có quyền cập nhật checklist');
  }

  try {
    task.updateChecklistItem(itemId, {
      checked,
      note,
      checkedBy: req.user._id,
    });

    await task.save();

    const progress = task.getChecklistProgress();

    return successResponse(res, 200, 'Cập nhật checklist thành công', {
      task,
      progress,
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

// @desc    Get checklist progress
// @route   GET /api/tasks/:id/checklist/progress
// @access  Private
export const getChecklistProgress = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return errorResponse(res, 404, 'Không tìm thấy công việc');
  }

  const progress = task.getChecklistProgress();

  return successResponse(res, 200, 'Lấy tiến độ checklist thành công', progress);
});

// @desc    Bypass approval (Emergency)
// @route   POST /api/tasks/:id/bypass-approval
// @access  Private (Team Lead or Workspace Admin)
export const bypassApproval = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  if (!reason || reason.trim() === '') {
    return errorResponse(res, 400, 'Vui lòng cung cấp lý do bypass');
  }

  const task = await Task.findById(req.params.id).populate('projectId', 'workspaceId');
  
  if (!task) {
    return errorResponse(res, 404, 'Không tìm thấy công việc');
  }

  // Check if there's a pending approval request
  if (!task.approvalRequests || task.approvalRequests.length === 0) {
    return errorResponse(res, 400, 'Task không có yêu cầu phê duyệt nào đang chờ');
  }

  const currentRequest = task.approvalRequests[task.approvalRequests.length - 1];
  
  if (currentRequest.status !== 'PENDING') {
    return errorResponse(res, 400, 'Yêu cầu phê duyệt đã được xử lý');
  }

  // Check permission: Team Lead hoặc Workspace Admin
  const projectMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: task.projectId,
  });

  if (!projectMember || projectMember.role !== ProjectRole.LEAD) {
    // TODO: Check workspace admin role
    return errorResponse(res, 403, 'Chỉ Team Lead hoặc Workspace Admin mới có quyền bypass approval');
  }

  // Update approval request status
  currentRequest.status = 'BYPASSED';
  currentRequest.bypassedBy = req.user._id;
  currentRequest.bypassedAt = new Date();
  currentRequest.reason = reason;

  // Update task status
  task.status = TaskStatus.DONE;
  task.approvalStatus = ApprovalStatus.APPROVED;
  task.approvedBy = req.user._id;
  task.approvedAt = new Date();
  task.completedAt = new Date();

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assigneeId', 'name email image')
    .populate('approvedBy', 'name email image')
    .populate('projectId', 'name')
    .populate('approvalRequests.bypassedBy', 'name email image');

  // Notify assignee
  if (task.assigneeId) {
    await Notification.create({
      userId: task.assigneeId,
      fromUserId: req.user._id,
      type: 'TASK_APPROVAL_BYPASSED',
      title: 'Approval đã được bypass',
      message: `Task "${task.title}" đã được bypass approval và hoàn thành. Lý do: ${reason}`,
      entityType: 'TASK',
      entityId: task._id,
      workspaceId: task.projectId.workspaceId,
      projectId: task.projectId._id,
      priority: 'MEDIUM',
      actionUrl: `/taskDetails?id=${task._id}`,
    });
  }

  return successResponse(res, 200, 'Đã bypass approval thành công', populatedTask);
});

// @desc    Get tasks pending approval (for Team Lead)
// @route   GET /api/tasks/pending-approval
// @access  Private (Team Lead)
export const getPendingApprovalTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return errorResponse(res, 400, 'Project ID is required');
  }

  // Check if user is Team Lead or is an approver
  const projectMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId,
  });

  if (!projectMember) {
    return errorResponse(res, 403, 'Bạn không phải là thành viên của dự án này');
  }

  // Find tasks where user is in approvers list or user is Team Lead
  const query = {
    projectId,
    status: TaskStatus.PENDING_APPROVAL,
    approvalStatus: ApprovalStatus.PENDING,
    'approvalRequests.0': { $exists: true }, // Has at least one approval request
  };

  // If not Team Lead, only show tasks where user is an approver
  if (projectMember.role !== ProjectRole.LEAD) {
    query['approvalRequests.approvers'] = req.user._id;
    query['approvalRequests.status'] = 'PENDING';
  }

  console.log('🔍 Pending approvals query:', JSON.stringify(query, null, 2));

  const tasks = await Task.find(query)
    .populate('assigneeId', 'name email image')
    .populate('projectId', 'name _id')
    .populate('approvalRequests.approvers', 'name email image')
    .sort({ 'approvalRequests.requestedAt': 1 }); // Oldest first

  console.log('📋 Found', tasks.length, 'pending approval tasks');
  tasks.forEach(task => {
    console.log(`  - Task: ${task.title}, Status: ${task.status}, ApprovalStatus: ${task.approvalStatus}, Requests: ${task.approvalRequests.length}`);
  });

  // Add information about wait time
  const tasksWithWaitTime = tasks.map(task => {
    const currentRequest = task.approvalRequests[task.approvalRequests.length - 1];
    
    const waitTime = currentRequest.requestedAt 
      ? Math.floor((Date.now() - currentRequest.requestedAt.getTime()) / (1000 * 60 * 60))
      : 0;
    
    const autoApproveIn = task.approvalConfig.autoApproveAt
      ? Math.floor((task.approvalConfig.autoApproveAt.getTime() - Date.now()) / (1000 * 60 * 60))
      : null;

    return {
      ...task.toObject(),
      waitingHours: waitTime,
      autoApproveInHours: autoApproveIn,
      currentApprovalRequest: currentRequest,
    };
  });

  return successResponse(res, 200, 'Lấy danh sách tasks chờ duyệt thành công', tasksWithWaitTime);
});
