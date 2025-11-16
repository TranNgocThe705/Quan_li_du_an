import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';

// @desc    Get all comments for a task
// @route   GET /api/comments?taskId=xxx
// @access  Private
export const getComments = asyncHandler(async (req, res) => {
  const { taskId } = req.query;

  if (!taskId) {
    return errorResponse(res, 400, 'Task ID is required');
  }

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is project member
  const isMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: task.projectId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
  }

  const comments = await Comment.find({ taskId })
    .populate('userId', 'name email image')
    .sort({ createdAt: 1 });

  return successResponse(res, 200, 'Comments retrieved successfully', comments);
});

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { taskId, content } = req.body;

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    return errorResponse(res, 404, 'Task not found');
  }

  // Check if user is project member
  const isMember = await ProjectMember.findOne({
    userId: req.user._id,
    projectId: task.projectId,
  });

  if (!isMember) {
    return errorResponse(res, 403, 'Access denied. You are not a member of this project');
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
