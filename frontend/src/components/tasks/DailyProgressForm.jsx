import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOrUpdateProgress } from '../../features/progressSlice';
import toast from 'react-hot-toast';
import { CalendarIcon, TrendingUpIcon, XIcon } from 'lucide-react';

export default function DailyProgressForm({ taskId, onSuccess }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    percentage: 50,
    workDone: '',
    planForTomorrow: '',
    blockers: '',
    priority: 'MEDIUM',
    hoursSpent: 0,
    estimatedHoursRemaining: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'percentage' || name === 'hoursSpent' || name === 'estimatedHoursRemaining' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workDone.trim()) {
      toast.error('Vui lòng mô tả công việc đã làm');
      return;
    }

    setLoading(true);
    try {
      await dispatch(createOrUpdateProgress({
        taskId,
        ...formData,
      })).unwrap();
      
      toast.success('Báo cáo tiến độ thành công');
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        percentage: 50,
        workDone: '',
        planForTomorrow: '',
        blockers: '',
        priority: 'MEDIUM',
        hoursSpent: 0,
        estimatedHoursRemaining: 0,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error || 'Không thể báo cáo tiến độ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUpIcon className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Báo Cáo Tiến Độ Hằng Ngày</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Ngày
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
          />
        </div>

        {/* Percentage */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Tiến độ (%): {formData.percentage}%
          </label>
          <input
            type="range"
            name="percentage"
            min="0"
            max="100"
            value={formData.percentage}
            onChange={handleChange}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Work Done */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Công việc đã hoàn thành *
          </label>
          <textarea
            name="workDone"
            value={formData.workDone}
            onChange={handleChange}
            placeholder="Mô tả chi tiết công việc đã làm hôm nay..."
            rows="3"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none"
          />
        </div>

        {/* Hours Spent */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Giờ làm việc
            </label>
            <input
              type="number"
              name="hoursSpent"
              min="0"
              step="0.5"
              value={formData.hoursSpent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Giờ còn lại (dự tính)
            </label>
            <input
              type="number"
              name="estimatedHoursRemaining"
              min="0"
              step="0.5"
              value={formData.estimatedHoursRemaining}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Plan for Tomorrow */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Kế hoạch ngày mai
          </label>
          <textarea
            name="planForTomorrow"
            value={formData.planForTomorrow}
            onChange={handleChange}
            placeholder="Kế hoạch công việc cho ngày mai..."
            rows="2"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none"
          />
        </div>

        {/* Blockers */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Vấn đề / Cản trở
          </label>
          <textarea
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            placeholder="Các vấn đề hoặc cản trở gặp phải..."
            rows="2"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Độ ưu tiên
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
          >
            <option value="LOW">Thấp</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="HIGH">Cao</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
        </button>
      </form>
    </div>
  );
}
