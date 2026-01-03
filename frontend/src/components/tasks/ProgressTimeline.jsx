import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TrendingUpIcon, CheckCircleIcon, AlertCircleIcon, UserIcon } from 'lucide-react';

export default function ProgressTimeline({ progress = [] }) {
  if (progress.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-8 text-center">
        <TrendingUpIcon className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-500 dark:text-zinc-400">Chưa có báo cáo tiến độ nào</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      case 'REVIEWED':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
      case 'SUBMITTED':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'DRAFT':
        return 'border-l-zinc-500 bg-zinc-50 dark:bg-zinc-900/10';
      default:
        return 'border-l-zinc-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
        <TrendingUpIcon className="w-5 h-5" />
        Lịch Sử Tiến Độ
      </h3>

      <div className="space-y-3">
        {progress.map((item) => (
          <div
            key={item._id}
            className={`border-l-4 rounded-lg p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 ${getStatusColor(item.status)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {format(new Date(item.date), 'EEEE, dd MMMM yyyy', { locale: vi })}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority === 'HIGH' ? 'Cao' : item.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>

                {/* Progress Percentage */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Tiến độ
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Work Done */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                    Công việc đã hoàn thành
                  </h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                    {item.workDone}
                  </p>
                </div>

                {/* Hours */}
                {(item.hoursSpent > 0 || item.estimatedHoursRemaining > 0) && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {item.hoursSpent > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Giờ làm việc</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {item.hoursSpent}h
                        </p>
                      </div>
                    )}
                    {item.estimatedHoursRemaining > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Giờ còn lại</p>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                          {item.estimatedHoursRemaining}h
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Plan for Tomorrow */}
                {item.planForTomorrow && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                      Kế hoạch ngày mai
                    </h4>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {item.planForTomorrow}
                    </p>
                  </div>
                )}

                {/* Blockers */}
                {item.blockers && (
                  <div className="mb-3 bg-red-50 dark:bg-red-900/20 rounded p-2 border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
                          Vấn đề / Cản trở
                        </h4>
                        <p className="text-sm text-red-800 dark:text-red-300">
                          {item.blockers}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {item.feedback && (
                  <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 rounded p-2 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                      Feedback từ {item.reviewedBy?.name || 'Manager'}
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {item.feedback}
                    </p>
                  </div>
                )}

                {/* Status and Reviewer */}
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-1">
                    {item.status === 'APPROVED' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                    <span>
                      {item.status === 'APPROVED' ? 'Đã duyệt' : item.status === 'REVIEWED' ? 'Đã review' : item.status === 'SUBMITTED' ? 'Đã gửi' : 'Bản nháp'}
                    </span>
                  </div>
                  {item.reviewedAt && (
                    <span>
                      Reviewed: {format(new Date(item.reviewedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
