import { useState, useEffect, useCallback } from 'react';

const AutoApproveCountdown = ({ task }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const calculateTimeRemaining = useCallback(() => {
    if (!task.approvalConfig?.autoApproveAt) return;

    const now = new Date();
    const autoApproveTime = new Date(task.approvalConfig.autoApproveAt);
    const diffMs = autoApproveTime - now;

    if (diffMs <= 0) {
      setTimeRemaining({ expired: true });
      return;
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    setTimeRemaining({
      expired: false,
      days,
      hours: remainingHours,
      minutes,
      totalHours: hours
    });
  }, [task.approvalConfig?.autoApproveAt]);

  useEffect(() => {
    // Check if task is pending approval and has auto-approve enabled
    if (
      task.status === 'PENDING_APPROVAL' &&
      task.approvalConfig?.autoApprove &&
      task.approvalConfig?.autoApproveAt
    ) {
      setIsVisible(true);
      calculateTimeRemaining();
      
      // Update every minute
      const interval = setInterval(() => {
        calculateTimeRemaining();
      }, 60000);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [task, calculateTimeRemaining]);

  if (!isVisible || !timeRemaining) {
    return null;
  }

  const getProgressPercentage = () => {
    if (!task.approvalRequests?.[0]?.requestedAt || !task.approvalConfig?.autoApproveAt) {
      return 0;
    }

    const startTime = new Date(task.approvalRequests[0].requestedAt);
    const endTime = new Date(task.approvalConfig.autoApproveAt);
    const now = new Date();

    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;

    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const getColorClass = () => {
    if (timeRemaining.expired) return 'border-green-500 bg-green-50';
    if (timeRemaining.totalHours <= 4) return 'border-red-500 bg-red-50';
    if (timeRemaining.totalHours <= 12) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  const getTextColorClass = () => {
    if (timeRemaining.expired) return 'text-green-800';
    if (timeRemaining.totalHours <= 4) return 'text-red-800';
    if (timeRemaining.totalHours <= 12) return 'text-yellow-800';
    return 'text-blue-800';
  };

  const getIconColorClass = () => {
    if (timeRemaining.expired) return 'text-green-600';
    if (timeRemaining.totalHours <= 4) return 'text-red-600';
    if (timeRemaining.totalHours <= 12) return 'text-yellow-600';
    return 'text-blue-600';
  };

  if (timeRemaining.expired) {
    return (
      <div className={`border-l-4 p-4 rounded-lg ${getColorClass()}`}>
        <div className="flex items-start">
          <svg
            className={`w-6 h-6 mr-3 mt-0.5 ${getIconColorClass()}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className={`font-semibold ${getTextColorClass()}`}>Auto-Approval Scheduled</h4>
            <p className={`text-sm mt-1 ${getTextColorClass()}`}>
              This task will be automatically approved soon if no action is taken.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-l-4 p-4 rounded-lg ${getColorClass()}`}>
      <div className="flex items-start">
        <svg
          className={`w-6 h-6 mr-3 mt-0.5 ${getIconColorClass()}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        
        <div className="flex-1">
          <h4 className={`font-semibold ${getTextColorClass()}`}>Auto-Approve Countdown</h4>
          
          <div className="mt-2 flex items-center space-x-4">
            {timeRemaining.days > 0 && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${getTextColorClass()}`}>
                  {timeRemaining.days}
                </div>
                <div className={`text-xs ${getTextColorClass()}`}>days</div>
              </div>
            )}
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getTextColorClass()}`}>
                {timeRemaining.hours}
              </div>
              <div className={`text-xs ${getTextColorClass()}`}>hours</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getTextColorClass()}`}>
                {timeRemaining.minutes}
              </div>
              <div className={`text-xs ${getTextColorClass()}`}>minutes</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className={getTextColorClass()}>Time elapsed</span>
              <span className={getTextColorClass()}>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  timeRemaining.totalHours <= 4
                    ? 'bg-red-600'
                    : timeRemaining.totalHours <= 12
                    ? 'bg-yellow-600'
                    : 'bg-blue-600'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <p className={`text-sm mt-3 ${getTextColorClass()}`}>
            {timeRemaining.totalHours <= 4 ? (
              <strong>⚠️ Approval time almost expired!</strong>
            ) : (
              <>
                Task will be auto-approved on{' '}
                <strong>
                  {new Date(task.approvalConfig.autoApproveAt).toLocaleString()}
                </strong>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoApproveCountdown;
