import { Bell, X, Check, Trash2, CheckCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
} from '../features/notificationSlice';
import toast from 'react-hot-toast';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { notifications, unreadCount, loading } = useSelector((state) => state.notification);

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(getUnreadCount());
  }, [dispatch]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getNotifications({ page: 1, limit: 20 }));
    }
  }, [isOpen, dispatch]);

  // Auto-refresh unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markAsRead(notificationId)).unwrap();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast.success(t('notifications.allMarkedRead') || 'Đã đánh dấu tất cả đã đọc');
    } catch (error) {
      toast.error(error || 'Không thể đánh dấu đã đọc');
    }
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      toast.success(t('notifications.deleted') || 'Đã xóa thông báo');
    } catch (error) {
      toast.error(error || 'Không thể xóa thông báo');
    }
  };

  const handleClearRead = async () => {
    try {
      await dispatch(clearReadNotifications()).unwrap();
      toast.success(t('notifications.readCleared') || 'Đã xóa thông báo đã đọc');
    } catch (error) {
      toast.error(error || 'Không thể xóa thông báo');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    } else if (notification.entityType === 'TASK' && notification.entityId) {
      navigate(`/taskDetails?id=${notification.entityId}`);
      setIsOpen(false);
    } else if (notification.entityType === 'PROJECT' && notification.entityId) {
      navigate(`/projectsDetail?id=${notification.entityId}&tab=overview`);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      TASK_ASSIGNED: '📋',
      TASK_UPDATED: '✏️',
      TASK_COMPLETED: '✅',
      TASK_DUE_SOON: '⏰',
      TASK_OVERDUE: '🚨',
      TASK_COMMENT: '💬',
      PROJECT_MEMBER_ADDED: '👥',
      PROJECT_UPDATED: '📁',
      PROJECT_DEADLINE_APPROACHING: '📅',
      WORKSPACE_MEMBER_ADDED: '🏢',
      WORKSPACE_ROLE_CHANGED: '🔑',
      MENTIONED_IN_COMMENT: '@',
      MENTIONED_IN_TASK: '@',
      SYSTEM_ANNOUNCEMENT: '📢',
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'text-blue-600 dark:text-blue-400',
      MEDIUM: 'text-yellow-600 dark:text-yellow-400',
      HIGH: 'text-orange-600 dark:text-orange-400',
      URGENT: 'text-red-600 dark:text-red-400',
    };
    return colors[priority] || 'text-gray-600 dark:text-gray-400';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95"
      >
        <Bell className="size-4 text-gray-800 dark:text-gray-200" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('notifications.title') || 'Thông báo'}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title={t('notifications.markAllRead') || 'Đánh dấu tất cả đã đọc'}
                >
                  <CheckCheck size={16} />
                </button>
              )}
              {notifications.some(n => n.isRead) && (
                <button
                  onClick={handleClearRead}
                  className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded transition-colors"
                  title={t('notifications.clearRead') || 'Xóa đã đọc'}
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
                <div className="animate-spin size-8 border-4 border-gray-200 dark:border-zinc-700 border-t-blue-500 rounded-full mx-auto mb-2"></div>
                {t('notifications.loading') || 'Đang tải...'}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
                <Bell className="size-12 mx-auto mb-2 opacity-50" />
                <p>{t('notifications.empty') || 'Không có thông báo nào'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-zinc-300'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="size-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        {notification.fromUserId && (
                          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                            Từ: {notification.fromUserId.name}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-zinc-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {notification.priority !== 'MEDIUM' && (
                              <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification._id, e)}
                              className="p-1 text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-zinc-700 text-center">
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t('notifications.viewAll') || 'Xem tất cả thông báo'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
