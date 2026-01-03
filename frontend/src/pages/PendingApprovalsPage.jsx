import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/client';
import { taskAPI } from '../api';

const PendingApprovalsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, urgent, normal
  const navigate = useNavigate();
  
  // Get current project from Redux
  const currentProject = useSelector((state) => state.project.currentProject);

  const fetchPendingTasks = useCallback(async () => {
    if (!currentProject?._id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const projectId = currentProject._id;
      console.log('🔍 Fetching pending approvals for project:', projectId);
      const response = await API.get(`/tasks/pending-approval?projectId=${projectId}`);
      console.log('📋 Pending approvals response:', response.data);
      setTasks(response.data.data || []);
      console.log('✅ Tasks set:', response.data.data?.length || 0, 'tasks');
    } catch (error) {
      console.error('❌ Error fetching pending approvals:', error);
      toast.error(error.response?.data?.message || 'Không thể tải danh sách chờ duyệt');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentProject?._id]);

  useEffect(() => {
    if (currentProject?._id) {
      fetchPendingTasks();
    } else {
      setLoading(false);
      toast.error('Vui lòng chọn một dự án trước');
    }
  }, [currentProject?._id, fetchPendingTasks]);

  const handleApprove = async (taskId) => {
    try {
      await taskAPI.approveTask(taskId);
      toast.success('Đã duyệt công việc thành công');
      fetchPendingTasks(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể duyệt công việc');
      console.error(error);
    }
  };

  const handleReject = async (taskId) => {
    const reason = prompt('Vui lòng nhập lý do từ chối (tối thiểu 5 ký tự):');
    if (!reason || reason.trim() === '') {
      toast.error('Bạn phải nhập lý do từ chối');
      return;
    }
    
    if (reason.trim().length < 5) {
      toast.error('Lý do từ chối phải có ít nhất 5 ký tự');
      return;
    }

    try {
      await taskAPI.rejectTask(taskId, reason);
      toast.success('Đã từ chối công việc');
      fetchPendingTasks(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể từ chối công việc');
      console.error(error);
    }
  };

  const handleViewTask = (taskId, projectId) => {
    if (!taskId || !projectId) {
      toast.error('Không thể mở chi tiết công việc');
      return;
    }
    navigate(`/taskDetails?taskId=${taskId}&projectId=${projectId}`);
  };

  const getTimeRemaining = (autoApproveAt) => {
    if (!autoApproveAt) return null;

    const now = new Date();
    const approveTime = new Date(autoApproveAt);
    const diffMs = approveTime - now;

    if (diffMs <= 0) return { expired: true };

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    return { days, hours: hours % 24, totalHours: hours };
  };

  const getUrgencyClass = (task) => {
    const timeRemaining = getTimeRemaining(task.approvalConfig?.autoApproveAt);
    if (!timeRemaining) return 'border-gray-200';
    if (timeRemaining.expired) return 'border-green-500 bg-green-50';
    if (timeRemaining.totalHours <= 4) return 'border-red-500 bg-red-50';
    if (timeRemaining.totalHours <= 12) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-200';
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    const timeRemaining = getTimeRemaining(task.approvalConfig?.autoApproveAt);
    if (filter === 'urgent') {
      return timeRemaining && timeRemaining.totalHours <= 12;
    }
    if (filter === 'normal') {
      return !timeRemaining || timeRemaining.totalHours > 12;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">Chờ Duyệt</h1>
        <p className="mt-2 text-gray-600 dark:text-zinc-400">
          Công việc đang chờ phê duyệt ({filteredTasks.length} {filter !== 'all' ? filter : 'tổng'})
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-zinc-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'urgent'
                ? 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            Khẩn cấp (
            {tasks.filter((t) => {
              const tr = getTimeRemaining(t.approvalConfig?.autoApproveAt);
              return tr && tr.totalHours <= 12;
            }).length}
            )
          </button>
          <button
            onClick={() => setFilter('normal')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'normal'
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700'
            }`}
          >
            Bình thường (
            {tasks.filter((t) => {
              const tr = getTimeRemaining(t.approvalConfig?.autoApproveAt);
              return !tr || tr.totalHours > 12;
            }).length}
            )
          </button>
        </nav>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-600"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-zinc-100">Không có công việc chờ duyệt</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Tất cả công việc đã được duyệt hoặc không có yêu cầu phê duyệt.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const timeRemaining = getTimeRemaining(task.approvalConfig?.autoApproveAt);
            const checklistProgress = task.checklist?.length
              ? {
                  completed: task.checklist.filter((item) => item.checked).length,
                  total: task.checklist.length
                }
              : null;

            return (
              <div
                key={task._id}
                className={`border-l-4 rounded-lg p-6 bg-white dark:bg-zinc-900 shadow hover:shadow-md transition-shadow ${getUrgencyClass(
                  task
                )}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3
                        className="text-lg font-semibold text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        onClick={() => handleViewTask(task._id, task.projectId?._id)}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadgeClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {task.type}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">{task.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-zinc-400">
                      <div>
                        <strong>Dự án:</strong> {task.projectId?.name}
                      </div>
                      <div>
                        <strong>Người thực hiện:</strong> {task.assigneeId?.name || 'Chưa giao'}
                      </div>
                      {task.storyPoints && (
                        <div>
                          <strong>Points:</strong> {task.storyPoints}
                        </div>
                      )}
                    </div>

                    {checklistProgress && (
                      <div className="mt-3 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Checklist: {checklistProgress.completed}/{checklistProgress.total}
                        </span>
                        {checklistProgress.completed === checklistProgress.total && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                    {timeRemaining && !timeRemaining.expired && (
                      <div className="mt-3 flex items-center space-x-2 text-sm">
                        <svg
                          className={`w-4 h-4 ${
                            timeRemaining.totalHours <= 4
                              ? 'text-red-500'
                              : timeRemaining.totalHours <= 12
                              ? 'text-yellow-500'
                              : 'text-blue-500'
                          }`}
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
                        <span
                          className={
                            timeRemaining.totalHours <= 4
                              ? 'text-red-600 font-semibold'
                              : timeRemaining.totalHours <= 12
                              ? 'text-yellow-600 font-semibold'
                              : 'text-gray-600'
                          }
                        >
                          {timeRemaining.days > 0
                            ? `${timeRemaining.days}d ${timeRemaining.hours}h remaining`
                            : `${timeRemaining.hours}h remaining`}
                          {' until auto-approve'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleApprove(task._id)}
                      className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                    >
                      ✓ Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(task._id)}
                      className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                    >
                      ✗ Từ chối
                    </button>
                    <button
                      onClick={() => handleViewTask(task._id, task.projectId?._id)}
                      className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingApprovalsPage;
