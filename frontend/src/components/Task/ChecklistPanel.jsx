import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import API from '../../api/client';

const ChecklistPanel = ({ task, onUpdate }) => {
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(false);

  const fetchChecklistProgress = useCallback(async () => {
    try {
      const response = await API.get(`/tasks/${task._id}/checklist/progress`);
      setProgress(response.data.data);
    } catch (error) {
      console.error('Error fetching checklist progress:', error);
    }
  }, [task._id]);

  useEffect(() => {
    if (task._id) {
      fetchChecklistProgress();
    }
  }, [task._id, fetchChecklistProgress]);

  useEffect(() => {
    setChecklist(task.checklist || []);
  }, [task.checklist]);

  const handleToggleItem = async (itemId, checked) => {
    setLoading(true);
    try {
      const response = await API.patch(`/tasks/${task._id}/checklist/${itemId}`, {
        checked
      });
      
      const updatedTask = response.data.data;
      setChecklist(updatedTask.checklist);
      fetchChecklistProgress();
      
      if (onUpdate) {
        onUpdate(updatedTask);
      }
      
      toast.success(checked ? 'Item completed' : 'Item unchecked');
    } catch (error) {
      toast.error('Failed to update checklist item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!checklist || checklist.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Task Checklist</h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            {progress.completed} / {progress.total} completed
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{progress.percentage}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {checklist.map((item) => (
          <div
            key={item._id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${
              item.checked
                ? 'bg-green-50 border-green-200'
                : item.required
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => handleToggleItem(item._id, e.target.checked)}
                disabled={loading}
                className={`w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 ${
                  loading ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm ${
                    item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {item.name}
                </span>
                {item.required && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Required
                  </span>
                )}
              </div>
              
              {item.checked && item.checkedBy && (
                <div className="mt-1 text-xs text-gray-500">
                  Completed by {item.checkedBy.name} on{' '}
                  {new Date(item.checkedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {checklist.some((item) => item.required && !item.checked) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Required items pending</p>
              <p className="mt-1">All required checklist items must be completed before approval.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistPanel;
