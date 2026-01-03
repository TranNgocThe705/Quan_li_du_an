import React, { useState, useMemo, useEffect } from 'react';
import {
  TaskCard,
  TaskStatusFilter,
  TaskStatistics,
} from '@/components/TaskStatusComponents';
import {
  filterTasksByStatus,
  groupTasksByStatus,
  getTaskStatistics,
  sortTasksByStatusPriority,
  needsAttention,
} from '@/utils/taskStatus';

/**
 * TaskListPage - Trang hiển thị danh sách tasks với status
 */
export const TaskListPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grouped'
  const [tasks, setTasks] = useState([]); // Load from API

  // Load tasks from API
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchTasks = async () => {
      try {
        // const response = await fetch('/api/tasks');
        // const data = await response.json();
        // setTasks(data.data || []);
        
        // For now, set empty array
        setTasks([]);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    
    fetchTasks();
  }, []);

  // Statistics
  const stats = useMemo(() => getTaskStatistics(tasks), [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return filterTasksByStatus(tasks, selectedStatus);
  }, [tasks, selectedStatus]);

  // Sort tasks by priority
  const sortedTasks = useMemo(() => {
    return sortTasksByStatusPriority(filteredTasks);
  }, [filteredTasks]);

  // Grouped tasks
  const groupedTasks = useMemo(() => {
    return groupTasksByStatus(filteredTasks);
  }, [filteredTasks]);

  // Tasks that need attention
  const urgentTasks = useMemo(() => {
    return tasks.filter(task => needsAttention(task));
  }, [tasks]);

  const handleTaskClick = (task) => {
    // Navigate to task detail page
    console.log('Task clicked:', task);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Danh Sách Công Việc
        </h1>
        <p className="text-gray-600">
          Quản lý và theo dõi tiến độ công việc của bạn
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="mb-6">
        <TaskStatistics stats={stats} />
      </div>

      {/* Urgent Tasks Alert */}
      {urgentTasks.length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-bold text-red-800">
              Có {urgentTasks.length} công việc cần xử lý ngay!
            </h3>
          </div>
          <p className="text-sm text-red-700">
            Các công việc bị từ chối hoặc chờ duyệt quá lâu cần được xem xét.
          </p>
        </div>
      )}

      {/* Filter and View Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Filter */}
        <div className="flex-1 w-full md:w-auto">
          <TaskStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            📋 Danh sách
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${viewMode === 'grouped' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            📊 Nhóm
          </button>
        </div>
      </div>

      {/* Task Count */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị <strong>{filteredTasks.length}</strong> / {tasks.length} công việc
      </div>

      {/* Tasks Display */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="grid gap-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <div>Không có công việc nào</div>
            </div>
          ) : (
            sortedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={handleTaskClick}
              />
            ))
          )}
        </div>
      ) : (
        /* Grouped View */
        <div className="space-y-6">
          {Object.entries(groupedTasks).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <div>Không có công việc nào</div>
            </div>
          ) : (
            Object.entries(groupedTasks).map(([statusKey, group]) => (
              <div key={statusKey} className="bg-gray-50 rounded-lg p-4">
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{group.info.icon}</span>
                  <h2 className="text-lg font-bold text-gray-900">
                    {group.info.label}
                  </h2>
                  <span className={`
                    px-2 py-1 rounded-full text-sm font-medium
                    ${group.info.bgColor} ${group.info.textColor}
                  `}>
                    {group.tasks.length}
                  </span>
                </div>

                {/* Tasks in Group */}
                <div className="grid gap-3">
                  {group.tasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={handleTaskClick}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
