import express from 'express';
import {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
  downloadAttachment,
} from '../controllers/attachment.controller.js';
import { protect } from '../middleware/auth.js';
import {
  uploadSingle,
  handleUploadError,
} from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Task attachments routes
router.post(
  '/tasks/:taskId/attachments',
  uploadSingle,
  handleUploadError,
  uploadAttachment
);
router.get('/tasks/:taskId/attachments', getTaskAttachments);

// Attachment routes
router.delete('/attachments/:id', deleteAttachment);
router.get('/attachments/:id/download', downloadAttachment);

export default router;
