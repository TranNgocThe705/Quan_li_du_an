import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';
import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { notifyTaskComment } from '../utils/notificationHelper.js';

// @desc    Get all comments for a task
// @route   GET /api/comments?taskId=xxx
// @access  Private
export const getComments = asyncHandler(async (req, res) => {
  const { taskId } = req.query;

  if (!taskId) {
    return errorResponse(res, 400, 'Task ID is required');
  }

  // Check if task exists
  const task = await Task.findById(taskId).populate('projectId');
  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is assignee
  const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user._id.toString();
  if (isAssignee) {
    const comments = await Comment.find({ taskId })
      .populate('userId', 'name email image')
      .sort({ createdAt: 1 });
    return successResponse(res, 200, 'Comments retrieved successfully', comments);
  }

  // Check if user is project team lead
  const project = await Project.findById(task.projectId._id || task.projectId);
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  if (isTeamLead) {
    const comments = await Comment.find({ taskId })
      .populate('userId', 'name email image')
      .sort({ createdAt: 1 });
    return successResponse(res, 200, 'Comments retrieved successfully', comments);
  }

  // Check if user is workspace admin
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId,
  });

  if (workspaceMembership && workspaceMembership.role === 'ADMIN') {
    const comments = await Comment.find({ taskId })
      .populate('userId', 'name email image')
      .sort({ createdAt: 1 });
    return successResponse(res, 200, 'Comments retrieved successfully', comments);
  }

  return errorResponse(res, 403, 'Access denied. Only the assignee, team lead, or workspace admin can view this task comments');
});

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { taskId, content } = req.body;

  // Check if task exists
  const task = await Task.findById(taskId).populate('projectId');
  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is assignee
  const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user._id.toString();
  if (!isAssignee) {
    // Check if user is project team lead
    const project = await Project.findById(task.projectId._id || task.projectId);
    const isTeamLead = project.team_lead.toString() === req.user._id.toString();
    
    if (!isTeamLead) {
      // Check if user is workspace admin
      const workspaceMembership = await WorkspaceMember.findOne({
        userId: req.user._id,
        workspaceId: project.workspaceId,
      });

      if (!workspaceMembership || workspaceMembership.role !== 'ADMIN') {
        return errorResponse(res, 403, 'Access denied. Only the assignee, team lead, or workspace admin can comment on this task');
      }
    }
  }

  // Create comment
  const comment = await Comment.create({
    content,
    userId: req.user._id,
    taskId,
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    'userId',
    'name email image'
  );

  // Send notification to task assignee
  console.log('🎯 Preparing to send notification for comment');
  const project = await Project.findById(task.projectId._id || task.projectId);
  
  // Don't send notification if you're commenting on your own task
  if (task.assigneeId && task.assigneeId.toString() !== req.user._id.toString()) {
    console.log('📧 Sending notification to assignee:', task.assigneeId);
    await notifyTaskComment({
      _id: task._id,
      title: task.title,
      assignedTo: task.assigneeId,
      workspaceId: project?.workspaceId,
      projectId: task.projectId,
    }, {
      _id: comment._id,
    }, req.user._id);
  } else {
    console.log('⚠️ Not sending notification - commenting on own task');
  }

  return successResponse(res, 201, 'Comment added successfully', populatedComment);
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (Owner only)
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return errorResponse(res, 404, 'Comment not found');
  }

  // Only comment owner can update
  if (comment.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Access denied. You can only update your own comments');
  }

  comment.content = req.body.content || comment.content;
  const updatedComment = await comment.save();

  const populatedComment = await Comment.findById(updatedComment._id).populate(
    'userId',
    'name email image'
  );

  return successResponse(res, 200, 'Comment updated successfully', populatedComment);
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner only)
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return errorResponse(res, 404, 'Comment not found');
  }

  // Only comment owner can delete
  if (comment.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Access denied. You can only delete your own comments');
  }

  await comment.deleteOne();

  return successResponse(res, 200, 'Comment deleted successfully');
});
