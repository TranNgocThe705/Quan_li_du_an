import React from 'react';
import { getTaskStatusInfo, formatWaitingTime } from '@/utils/taskStatus';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * TaskStatusBadge - Hiển thị badge trạng thái của task
 */
export const TaskStatusBadge = ({ task, showIcon = true, showDetails = false }) => {
  const statusInfo = getTaskStatusInfo(task);

  return (
    <div className="flex items-center gap-2">
      <span className={`
        inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
        ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border
      `}>
        {showIcon && <span className="text-base">{statusInfo.icon}</span>}
        <span>{statusInfo.label}</span>
      </span>

      {/* Extra badge */}
      {statusInfo.badge && (
        <span className={`
          inline-flex items-center px-2 py-1 rounded text-xs font-medium
          ${statusInfo.badge.color === 'red' ? 'bg-red-100 text-red-700' : ''}
          ${statusInfo.badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
          ${statusInfo.badge.color === 'green' ? 'bg-green-100 text-green-700' : ''}
          ${statusInfo.badge.color === 'orange' ? 'bg-orange-100 text-orange-700' : ''}
        `}>
          {statusInfo.badge.text}
        </span>
      )}

      {/* Show details */}
      {showDetails && statusInfo.details && (
        <div className="ml-2 text-xs text-gray-600">
          {statusInfo.key === 'PENDING_APPROVAL' && (
            <span>
              Chờ {statusInfo.details.waitingHours}h
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * TaskStatusDetails - Hiển thị chi tiết trạng thái
 */
export const TaskStatusDetails = ({ task }) => {
  const statusInfo = getTaskStatusInfo(task);

  if (!statusInfo.details) return null;

  return (
    <div className={`
      mt-3 p-3 rounded-lg text-sm
      ${statusInfo.bgColor} ${statusInfo.textColor}
    `}>
      {/* REJECTED */}
      {statusInfo.key === 'REJECTED' && (
        <div>
          <div className="font-semibold flex items-center gap-2 mb-1">
            <span>❌</span>
            <span>Công việc bị từ chối</span>
          </div>
          {statusInfo.details.reason && (
            <div className="mt-2">
              <strong>Lý do:</strong> {statusInfo.details.reason}
            </div>
          )}
          {statusInfo.details.rejectedAt && (
            <div className="mt-1 text-xs opacity-75">
              Từ chối lúc: {formatDistanceToNow(new Date(statusInfo.details.rejectedAt), { 
                addSuffix: true, 
                locale: vi 
              })}
            </div>
          )}
        </div>
      )}

      {/* PENDING_APPROVAL */}
      {statusInfo.key === 'PENDING_APPROVAL' && (
        <div>
          <div className="font-semibold flex items-center gap-2 mb-1">
            <span>⏳</span>
            <span>Đang chờ phê duyệt</span>
          </div>
          <div className="mt-2 space-y-1">
            <div>
              <strong>Số người duyệt:</strong> {statusInfo.details.approvers?.length || 0}
            </div>
            <div>
              <strong>Thời gian chờ:</strong> {formatWaitingTime(statusInfo.details.waitingHours)}
            </div>
            {statusInfo.details.waitingHours > 24 && (
              <div className="mt-2 bg-red-50 text-red-700 p-2 rounded">
                ⚠️ Đã chờ quá lâu! Vui lòng xem xét.
              </div>
            )}
          </div>
        </div>
      )}

      {/* BYPASSED */}
      {statusInfo.key === 'BYPASSED' && (
        <div>
          <div className="font-semibold flex items-center gap-2 mb-1">
            <span>🔓</span>
            <span>Bypass - Khẩn cấp</span>
          </div>
          {statusInfo.details.reason && (
            <div className="mt-2">
              <strong>Lý do:</strong> {statusInfo.details.reason}
            </div>
          )}
          {statusInfo.details.bypassedAt && (
            <div className="mt-1 text-xs opacity-75">
              Bypass lúc: {formatDistanceToNow(new Date(statusInfo.details.bypassedAt), { 
                addSuffix: true, 
                locale: vi 
              })}
            </div>
          )}
        </div>
      )}

      {/* AUTO_APPROVED */}
      {statusInfo.key === 'AUTO_APPROVED' && (
        <div>
          <div className="font-semibold flex items-center gap-2 mb-1">
            <span>⚡</span>
            <span>Tự động phê duyệt</span>
          </div>
          {statusInfo.details.autoApprovedAt && (
            <div className="mt-1 text-xs opacity-75">
              Tự động duyệt lúc: {formatDistanceToNow(new Date(statusInfo.details.autoApprovedAt), { 
                addSuffix: true, 
                locale: vi 
              })}
            </div>
          )}
        </div>
      )}

      {/* APPROVED */}
      {statusInfo.key === 'APPROVED' && (
        <div>
          <div className="font-semibold flex items-center gap-2 mb-1">
            <span>✅</span>
            <span>Đã phê duyệt và hoàn thành</span>
          </div>
          {statusInfo.details.approvedAt && (
            <div className="mt-1 text-xs opacity-75">
              Phê duyệt lúc: {formatDistanceToNow(new Date(statusInfo.details.approvedAt), { 
                addSuffix: true, 
                locale: vi 
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * TaskCard - Card hiển thị task với status
 */
export const TaskCard = ({ task, onClick }) => {
  const statusInfo = getTaskStatusInfo(task);

  return (
    <div 
      className={`
        p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md
        ${statusInfo.borderColor} bg-white
      `}
      onClick={() => onClick?.(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <span className="text-2xl">{statusInfo.icon}</span>
      </div>

      {/* Status */}
      <div className="mt-3">
        <TaskStatusBadge task={task} showDetails />
      </div>

      {/* Task metadata */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        {task.priority && (
          <span className={`
            px-2 py-1 rounded font-medium
            ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : ''}
            ${task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${task.priority === 'LOW' ? 'bg-green-100 text-green-700' : ''}
          `}>
            {task.priority}
          </span>
        )}
        {task.due_date && (
          <span>
            📅 {new Date(task.due_date).toLocaleDateString('vi-VN')}
          </span>
        )}
      </div>

      {/* Show details for special statuses */}
      {(statusInfo.key === 'REJECTED' || 
        statusInfo.key === 'PENDING_APPROVAL' || 
        statusInfo.key === 'BYPASSED') && (
        <TaskStatusDetails task={task} />
      )}
    </div>
  );
};

/**
 * TaskStatusFilter - Dropdown/tabs để filter theo status
 */
export const TaskStatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = [
    { key: 'ALL', label: 'Tất cả', icon: '📋', count: 0 },
    { key: 'REJECTED', label: 'Cần làm lại', icon: '❌', color: 'red' },
    { key: 'PENDING_APPROVAL', label: 'Chờ duyệt', icon: '⏳', color: 'yellow' },
    { key: 'IN_PROGRESS', label: 'Đang làm', icon: '🚀', color: 'blue' },
    { key: 'TODO', label: 'Chưa bắt đầu', icon: '📝', color: 'gray' },
    { key: 'APPROVED', label: 'Hoàn thành', icon: '✅', color: 'green' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {statusOptions.map(option => (
        <button
          key={option.key}
          onClick={() => onStatusChange(option.key)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all whitespace-nowrap
            ${selectedStatus === option.key 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * TaskStatistics - Dashboard statistics
 */
export const TaskStatistics = ({ stats }) => {
  const statCards = [
    { 
      key: 'rejected', 
      label: 'Cần làm lại', 
      icon: '❌', 
      color: 'red',
      urgent: true 
    },
    { 
      key: 'pendingApproval', 
      label: 'Chờ duyệt', 
      icon: '⏳', 
      color: 'yellow' 
    },
    { 
      key: 'inProgress', 
      label: 'Đang làm', 
      icon: '🚀', 
      color: 'blue' 
    },
    { 
      key: 'approved', 
      label: 'Hoàn thành', 
      icon: '✅', 
      color: 'green' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map(card => (
        <div 
          key={card.key}
          className={`
            p-4 rounded-lg border-2
            ${card.urgent ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}
            ${card.urgent && stats[card.key] > 0 ? 'animate-pulse' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {stats[card.key] || 0}
              </div>
              <div className={`
                text-sm font-medium mt-1
                ${card.color === 'red' ? 'text-red-600' : ''}
                ${card.color === 'yellow' ? 'text-yellow-600' : ''}
                ${card.color === 'blue' ? 'text-blue-600' : ''}
                ${card.color === 'green' ? 'text-green-600' : ''}
              `}>
                {card.label}
              </div>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  TaskStatusBadge,
  TaskStatusDetails,
  TaskCard,
  TaskStatusFilter,
  TaskStatistics,
};
