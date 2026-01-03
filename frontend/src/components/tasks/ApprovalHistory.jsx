import { CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon } from 'lucide-react';
import { format } from 'date-fns';

const ApprovalHistory = ({ task }) => {
  if (!task?.approvalRequests || task.approvalRequests.length === 0) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'AUTO_APPROVED':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'BYPASSED':
        return <CheckCircleIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Đang chờ duyệt',
      'APPROVED': 'Đã phê duyệt',
      'REJECTED': 'Đã từ chối',
      'AUTO_APPROVED': 'Tự động phê duyệt',
      'BYPASSED': 'Đã bypass'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
      'APPROVED': 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
      'REJECTED': 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
      'AUTO_APPROVED': 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
      'BYPASSED': 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
    };
    return colorMap[status] || 'bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ClockIcon className="w-5 h-5" />
        Lịch sử phê duyệt
      </h3>

      <div className="space-y-4">
        {task.approvalRequests.map((request, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 ${getStatusColor(request.status)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(request.status)}</div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {getStatusText(request.status)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(request.requestedAt), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>

                {/* Approvers */}
                {request.approvers && request.approvers.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Người phê duyệt:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.approvers.map((approver, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs bg-white dark:bg-zinc-800 rounded px-2 py-1">
                          <UserIcon className="w-3 h-3" />
                          <span>{approver.name || approver.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved By */}
                {request.approvedBy && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Đã duyệt bởi:</span> {request.approvedBy.name}
                    {request.approvedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({format(new Date(request.approvedAt), 'dd/MM/yyyy HH:mm')})
                      </span>
                    )}
                  </div>
                )}

                {/* Rejected By */}
                {request.rejectedBy && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Từ chối bởi:</span> {request.rejectedBy.name}
                    {request.rejectedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({format(new Date(request.rejectedAt), 'dd/MM/yyyy HH:mm')})
                      </span>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {request.reason && request.status === 'REJECTED' && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded">
                    <p className="text-xs font-semibold text-red-900 dark:text-red-200">Lý do từ chối:</p>
                    <p className="text-sm text-red-800 dark:text-red-300">{request.reason}</p>
                  </div>
                )}

                {/* Bypass Info */}
                {request.bypassedBy && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Bypass bởi:</span> {request.bypassedBy.name}
                    {request.bypassedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({format(new Date(request.bypassedAt), 'dd/MM/yyyy HH:mm')})
                      </span>
                    )}
                    {request.reason && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Lý do: {request.reason}
                      </p>
                    )}
                  </div>
                )}

                {/* Auto Approve Info */}
                {request.autoApprovedAt && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Tự động phê duyệt lúc:</span>{' '}
                    {format(new Date(request.autoApprovedAt), 'dd/MM/yyyy HH:mm')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      {task.approvalMetrics && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Thống kê</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {task.approvalMetrics.submittedAt && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Gửi duyệt lần đầu:</span>
                <p className="font-medium">{format(new Date(task.approvalMetrics.submittedAt), 'dd/MM/yyyy HH:mm')}</p>
              </div>
            )}
            {task.approvalMetrics.revisionCount > 0 && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Số lần sửa:</span>
                <p className="font-medium">{task.approvalMetrics.revisionCount}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalHistory;
