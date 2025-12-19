import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Get all notifications for current user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const query = { userId: req.user._id };
  if (unreadOnly === 'true') {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .populate('fromUserId', 'name email image')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.getUnreadCount(req.user._id);

  return successResponse(res, 200, 'Lấy thông báo thành công', {
    notifications,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
    },
    unreadCount,
  });
});

/**
 * @desc    Get unread count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.getUnreadCount(req.user._id);
  return successResponse(res, 200, 'Lấy số lượng thông báo chưa đọc thành công', { count });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.markAsRead(req.params.id, req.user._id);

  if (!notification) {
    return errorResponse(res, 404, 'Không tìm thấy thông báo');
  }

  return successResponse(res, 200, 'Đã đánh dấu thông báo là đã đọc', notification);
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/mark-all-read
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user._id);
  return successResponse(res, 200, 'Đã đánh dấu tất cả thông báo là đã đọc');
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!notification) {
    return errorResponse(res, 404, 'Không tìm thấy thông báo');
  }

  return successResponse(res, 200, 'Đã xóa thông báo');
});

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/notifications/clear-read
 * @access  Private
 */
export const clearReadNotifications = asyncHandler(async (req, res) => {
  const result = await Notification.deleteMany({
    userId: req.user._id,
    isRead: true,
  });

  return successResponse(res, 200, 'Đã xóa tất cả thông báo đã đọc', {
    deletedCount: result.deletedCount,
  });
});

/**
 * @desc    Create a test notification (for development)
 * @route   POST /api/notifications/test
 * @access  Private
 */
export const createTestNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.createNotification({
    userId: req.user._id,
    type: 'SYSTEM_ANNOUNCEMENT',
    title: 'Test Notification',
    message: 'This is a test notification',
    priority: 'MEDIUM',
  });

  return successResponse(res, 201, 'Đã tạo thông báo test', notification);
});
