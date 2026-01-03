/**
 * Task Status Helper Functions
 * Giúp nhận biết và phân biệt các trạng thái khác nhau của task
 */

/**
 * Lấy thông tin chi tiết về trạng thái task
 * @param {Object} task - Task object
 * @returns {Object} Status info
 */
export const getTaskStatusInfo = (task) => {
  // Lấy approval request mới nhất
  const latestRequest = task.approvalRequests?.length > 0 
    ? task.approvalRequests[task.approvalRequests.length - 1]
    : null;

  // 1. Hoàn thành - Bypass
  if (task.status === 'DONE' && task.approvalStatus === 'APPROVED' && latestRequest?.status === 'BYPASSED') {
    return {
      key: 'BYPASSED',
      label: 'Bypass - Khẩn cấp',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-300',
      icon: '🔓',
      badge: {
        text: 'Bypassed',
        color: 'orange'
      },
      details: {
        bypassedBy: latestRequest.bypassedBy,
        bypassedAt: latestRequest.bypassedAt,
        reason: latestRequest.reason
      }
    };
  }

  // 2. Hoàn thành - Tự động duyệt
  if (task.status === 'DONE' && task.approvalStatus === 'APPROVED' && latestRequest?.status === 'AUTO_APPROVED') {
    return {
      key: 'AUTO_APPROVED',
      label: 'Tự động duyệt',
      color: 'success-light',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      icon: '⚡',
      badge: {
        text: 'Auto-approved',
        color: 'green'
      },
      details: {
        autoApprovedAt: latestRequest.autoApprovedAt
      }
    };
  }

  // 3. Hoàn thành - Đã duyệt
  if (task.status === 'DONE' && task.approvalStatus === 'APPROVED') {
    return {
      key: 'APPROVED',
      label: 'Hoàn thành - Đã duyệt',
      color: 'success',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      icon: '✅',
      badge: null,
      details: {
        approvedBy: latestRequest?.approvedBy,
        approvedAt: latestRequest?.approvedAt
      }
    };
  }

  // 4. Chờ phê duyệt
  if (task.status === 'PENDING_APPROVAL' && task.approvalStatus === 'PENDING') {
    const waitingHours = latestRequest?.requestedAt 
      ? Math.floor((Date.now() - new Date(latestRequest.requestedAt).getTime()) / (1000 * 60 * 60))
      : 0;
      
    return {
      key: 'PENDING_APPROVAL',
      label: 'Chờ phê duyệt',
      color: 'warning',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
      icon: '⏳',
      badge: {
        text: `${waitingHours}h`,
        color: waitingHours > 24 ? 'red' : 'yellow'
      },
      details: {
        approvers: latestRequest?.approvers,
        requestedAt: latestRequest?.requestedAt,
        waitingHours
      }
    };
  }

  // 5. Bị từ chối - Cần làm lại
  if (task.approvalStatus === 'REJECTED') {
    return {
      key: 'REJECTED',
      label: 'Cần làm lại',
      color: 'error',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      icon: '❌',
      badge: {
        text: 'Đã từ chối',
        color: 'red'
      },
      details: {
        rejectedBy: latestRequest?.rejectedBy,
        rejectedAt: latestRequest?.rejectedAt,
        reason: latestRequest?.reason || task.rejectionReason
      }
    };
  }

  // 6. Đang làm
  if (task.status === 'IN_PROGRESS') {
    return {
      key: 'IN_PROGRESS',
      label: 'Đang làm',
      color: 'info',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      icon: '🚀',
      badge: null,
      details: null
    };
  }

  // 7. Chưa bắt đầu
  if (task.status === 'TODO') {
    return {
      key: 'TODO',
      label: 'Chưa bắt đầu',
      color: 'default',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      icon: '📝',
      badge: null,
      details: null
    };
  }

  // Default
  return {
    key: 'UNKNOWN',
    label: task.status || 'Unknown',
    color: 'default',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    icon: '❓',
    badge: null,
    details: null
  };
};

/**
 * Lọc tasks theo trạng thái
 * @param {Array} tasks - Danh sách tasks
 * @param {String} statusKey - Key của trạng thái cần lọc
 * @returns {Array} Danh sách tasks đã lọc
 */
export const filterTasksByStatus = (tasks, statusKey) => {
  if (statusKey === 'ALL') return tasks;
  
  return tasks.filter(task => {
    const statusInfo = getTaskStatusInfo(task);
    return statusInfo.key === statusKey;
  });
};

/**
 * Nhóm tasks theo trạng thái
 * @param {Array} tasks - Danh sách tasks
 * @returns {Object} Object với key là status và value là array tasks
 */
export const groupTasksByStatus = (tasks) => {
  return tasks.reduce((acc, task) => {
    const statusInfo = getTaskStatusInfo(task);
    if (!acc[statusInfo.key]) {
      acc[statusInfo.key] = {
        info: statusInfo,
        tasks: []
      };
    }
    acc[statusInfo.key].tasks.push(task);
    return acc;
  }, {});
};

/**
 * Đếm số lượng tasks theo từng trạng thái
 * @param {Array} tasks - Danh sách tasks
 * @returns {Object} Statistics object
 */
export const getTaskStatistics = (tasks) => {
  const stats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    autoApproved: 0,
    bypassed: 0,
  };

  tasks.forEach(task => {
    const statusInfo = getTaskStatusInfo(task);
    switch (statusInfo.key) {
      case 'TODO':
        stats.todo++;
        break;
      case 'IN_PROGRESS':
        stats.inProgress++;
        break;
      case 'PENDING_APPROVAL':
        stats.pendingApproval++;
        break;
      case 'APPROVED':
        stats.approved++;
        break;
      case 'REJECTED':
        stats.rejected++;
        break;
      case 'AUTO_APPROVED':
        stats.autoApproved++;
        break;
      case 'BYPASSED':
        stats.bypassed++;
        break;
    }
  });

  return stats;
};

/**
 * Lấy notification message dựa trên trạng thái
 * @param {Object} task - Task object
 * @param {String} userName - Tên người thực hiện action
 * @returns {String} Notification message
 */
export const getNotificationMessage = (task, userName = 'Hệ thống') => {
  const statusInfo = getTaskStatusInfo(task);
  
  const messages = {
    'APPROVED': `✅ Công việc "${task.title}" đã được ${userName} phê duyệt`,
    'REJECTED': `❌ Công việc "${task.title}" bị ${userName} từ chối. ${statusInfo.details?.reason ? 'Lý do: ' + statusInfo.details.reason : ''}`,
    'PENDING_APPROVAL': `⏳ Công việc "${task.title}" đang chờ bạn phê duyệt`,
    'AUTO_APPROVED': `⚡ Công việc "${task.title}" đã được tự động phê duyệt`,
    'BYPASSED': `🔓 Công việc "${task.title}" đã được ${userName} bypass approval. ${statusInfo.details?.reason ? 'Lý do: ' + statusInfo.details.reason : ''}`,
    'IN_PROGRESS': `🚀 Công việc "${task.title}" đang được thực hiện`,
    'TODO': `📝 Công việc "${task.title}" đã được tạo`,
  };
  
  return messages[statusInfo.key] || `Công việc "${task.title}" đã được cập nhật`;
};

/**
 * Sort tasks theo độ ưu tiên của trạng thái
 * @param {Array} tasks - Danh sách tasks
 * @returns {Array} Sorted tasks
 */
export const sortTasksByStatusPriority = (tasks) => {
  const priorityOrder = {
    'REJECTED': 1,          // Cao nhất - Cần làm lại ngay
    'PENDING_APPROVAL': 2,  // Chờ duyệt
    'IN_PROGRESS': 3,       // Đang làm
    'TODO': 4,              // Chưa bắt đầu
    'APPROVED': 5,          // Đã hoàn thành
    'AUTO_APPROVED': 6,     // Tự động duyệt
    'BYPASSED': 7,          // Bypass
    'UNKNOWN': 99,
  };

  return [...tasks].sort((a, b) => {
    const statusA = getTaskStatusInfo(a);
    const statusB = getTaskStatusInfo(b);
    return priorityOrder[statusA.key] - priorityOrder[statusB.key];
  });
};

/**
 * Kiểm tra xem task có cần attention không
 * @param {Object} task - Task object
 * @returns {Boolean} true nếu cần attention
 */
export const needsAttention = (task) => {
  const statusInfo = getTaskStatusInfo(task);
  
  // Rejected - cần làm lại ngay
  if (statusInfo.key === 'REJECTED') return true;
  
  // Pending approval quá lâu (>24h)
  if (statusInfo.key === 'PENDING_APPROVAL' && statusInfo.details?.waitingHours > 24) {
    return true;
  }
  
  return false;
};

/**
 * Status options cho filter dropdown
 */
export const STATUS_FILTER_OPTIONS = [
  { key: 'ALL', label: 'Tất cả', icon: '📋', color: 'gray' },
  { key: 'TODO', label: 'Chưa bắt đầu', icon: '📝', color: 'gray' },
  { key: 'IN_PROGRESS', label: 'Đang làm', icon: '🚀', color: 'blue' },
  { key: 'PENDING_APPROVAL', label: 'Chờ duyệt', icon: '⏳', color: 'yellow' },
  { key: 'APPROVED', label: 'Đã duyệt', icon: '✅', color: 'green' },
  { key: 'REJECTED', label: 'Cần làm lại', icon: '❌', color: 'red' },
  { key: 'AUTO_APPROVED', label: 'Tự động duyệt', icon: '⚡', color: 'green' },
  { key: 'BYPASSED', label: 'Bypass', icon: '🔓', color: 'orange' },
];

/**
 * Format thời gian chờ duyệt
 * @param {Number} hours - Số giờ
 * @returns {String} Formatted string
 */
export const formatWaitingTime = (hours) => {
  if (hours < 1) return 'Vừa xong';
  if (hours < 24) return `${hours} giờ`;
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) return `${days} ngày`;
  return `${days} ngày ${remainingHours} giờ`;
};

/**
 * Export all functions
 */
export default {
  getTaskStatusInfo,
  filterTasksByStatus,
  groupTasksByStatus,
  getTaskStatistics,
  getNotificationMessage,
  sortTasksByStatusPriority,
  needsAttention,
  STATUS_FILTER_OPTIONS,
  formatWaitingTime,
};
