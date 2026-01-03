import Attachment from '../models/Attachment.model.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import { deleteFile } from '../middleware/upload.middleware.js';
import { emitNewAttachment, emitDeleteAttachment } from '../config/socket.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload attachment to task
 * @route   POST /api/tasks/:taskId/attachments
 * @access  Private
 */
export const uploadAttachment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  // Get file type from mime type
  const fileType = Attachment.getFileType(req.file.mimetype);

  // Create attachment record
  const attachment = await Attachment.create({
    taskId,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileUrl: `/uploads/attachments/${req.file.filename}`,
    fileType,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
    uploadedBy: req.user._id,
  });

  // Populate uploadedBy field
  await attachment.populate('uploadedBy', 'name email avatar');

  // Emit real-time event
  emitNewAttachment(taskId, attachment);

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: attachment,
  });
});

/**
 * @desc    Get all attachments for a task
 * @route   GET /api/tasks/:taskId/attachments
 * @access  Private
 */
export const getTaskAttachments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  const attachments = await Attachment.find({ taskId })
    .populate('uploadedBy', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: attachments.length,
    data: attachments,
  });
});

/**
 * @desc    Delete attachment
 * @route   DELETE /api/attachments/:id
 * @access  Private
 */
export const deleteAttachment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const attachment = await Attachment.findById(id);

  if (!attachment) {
    return res.status(404).json({
      success: false,
      message: 'Attachment not found',
    });
  }

  // Check permission: only uploader or task assignee/reporter can delete
  const task = await Task.findById(attachment.taskId);
  const isUploader = attachment.uploadedBy.toString() === req.user._id.toString();
  const isTaskOwner =
    task.assigneeId?.toString() === req.user._id.toString() ||
    task.reporterId?.toString() === req.user._id.toString();

  if (!isUploader && !isTaskOwner && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this attachment',
    });
  }

  // Delete file from storage
  const filePath = path.join(__dirname, '../../', attachment.fileUrl);
  try {
    await deleteFile(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Continue even if file deletion fails
  }

  // Emit real-time event
  emitDeleteAttachment(attachment.taskId.toString(), id);

  // Delete attachment record
  await attachment.deleteOne();

  res.json({
    success: true,
    message: 'Attachment deleted successfully',
  });
});

/**
 * @desc    Download/Get attachment file
 * @route   GET /api/attachments/:id/download
 * @access  Private
 */
export const downloadAttachment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const attachment = await Attachment.findById(id);

  if (!attachment) {
    return res.status(404).json({
      success: false,
      message: 'Attachment not found',
    });
  }

  const filePath = path.join(__dirname, '../../', attachment.fileUrl);

  // Check if file exists
  const fs = await import('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found on server',
    });
  }

  // Set headers for download
  res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
  res.setHeader('Content-Type', attachment.mimeType);

  // Send file
  res.sendFile(filePath);
});
