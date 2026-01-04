import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Download,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  CheckSquare,
  Building2,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../../api/index.js';
import toast from 'react-hot-toast';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import AreaChart from '../../components/charts/AreaChart';
import { downloadReportFromAPI } from '../../utils/exportUtils';

const AdminReportsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedChart, setSelectedChart] = useState('all');

  useEffect(() => {
    if (!user?.isSystemAdmin) {
      toast.error(t('admin.noPermission'));
      navigate('/');
      return;
    }
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.errorLoadingDashboard'));
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      setExportLoading(true);
      toast.loading(t('admin.downloading') || 'Đang tải xuống...', { id: 'export' });
      
      await downloadReportFromAPI(adminAPI.exportReport, format);
      
      toast.success(t('admin.exportSuccess') || 'Xuất báo cáo thành công', { id: 'export' });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('admin.exportError') || 'Lỗi khi xuất báo cáo', { id: 'export' });
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
      </div>
    );
  }

  const { stats, projectsByStatus, tasksByStatus, projectsByPriority, tasksTrend, userGrowth } = dashboardData;

  const periods = [
    { value: '7days', label: '7 ngày qua' },
    { value: '30days', label: '30 ngày qua' },
    { value: '90days', label: '90 ngày qua' },
    { value: 'year', label: 'Năm nay' },
    { value: 'all', label: 'Toàn bộ' }
  ];

  const chartTypes = [
    { value: 'all', label: 'Tất cả biểu đồ', icon: BarChart3 },
    { value: 'overview', label: 'Tổng quan', icon: Activity },
    { value: 'users', label: 'Người dùng', icon: Users },
    { value: 'projects', label: 'Dự án', icon: Briefcase },
    { value: 'tasks', label: 'Công việc', icon: CheckSquare }
  ];

  const summaryCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Tổng dự án',
      value: stats.totalProjects,
      change: '+8%',
      changeType: 'increase',
      icon: Briefcase,
      color: 'bg-green-500'
    },
    {
      title: 'Công việc hoàn thành',
      value: `${stats.completionRate}%`,
      change: '+5%',
      changeType: 'increase',
      icon: CheckSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Workspace hoạt động',
      value: stats.totalWorkspaces,
      change: '+3%',
      changeType: 'increase',
      icon: Building2,
      color: 'bg-orange-500'
    }
  ];

  const projectsChartData = projectsByStatus?.map(item => ({
    name: t(`project.status.${item._id}`) || item._id,
    value: item.count,
    _id: item._id
  })) || [];

  const tasksChartData = tasksByStatus?.map(item => ({
    name: t(`task.status.${item._id}`) || item._id.replace('_', ' '),
    value: item.count
  })) || [];

  const priorityChartData = projectsByPriority?.map(item => ({
    name: t(`project.priority.${item._id}`) || item._id,
    value: item.count,
    _id: item._id
  })) || [];

  const showChart = (chartType) => {
    return selectedChart === 'all' || selectedChart === chartType;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.reports') || 'Báo cáo & Thống kê'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            Phân tích chi tiết hoạt động hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Period Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Khoảng thời gian
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Loại biểu đồ
            </label>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Buttons */}
          <div className="flex-1 lg:flex-none">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Xuất báo cáo
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportReport('excel')}
                disabled={exportLoading}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Excel</span>
              </button>
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={exportLoading}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {showChart('overview') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {card.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{card.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        {showChart('users') && userGrowth && userGrowth.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Tăng trưởng người dùng
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Theo tháng</p>
              </div>
            </div>
            <div className="h-64">
              <LineChart 
                data={userGrowth.map(item => ({
                  name: item._id,
                  value: item.count
                }))}
                dataKey="value"
                color="#3b82f6"
              />
            </div>
          </div>
        )}

        {/* Projects by Status */}
        {showChart('projects') && projectsChartData.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-green-600" />
                  Dự án theo trạng thái
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Phân bố hiện tại</p>
              </div>
            </div>
            <div className="h-64">
              <PieChart data={projectsChartData} />
            </div>
          </div>
        )}

        {/* Tasks by Status */}
        {showChart('tasks') && tasksChartData.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Công việc theo trạng thái
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Tổng quan</p>
              </div>
            </div>
            <div className="h-64">
              <BarChart data={tasksChartData} />
            </div>
          </div>
        )}

        {/* Projects by Priority */}
        {showChart('projects') && priorityChartData.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Dự án theo độ ưu tiên
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Phân bố</p>
              </div>
            </div>
            <div className="h-64">
              <BarChart data={priorityChartData} />
            </div>
          </div>
        )}
      </div>

      {/* Task Trend Full Width */}
      {showChart('tasks') && tasksTrend && tasksTrend.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Xu hướng công việc
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">30 ngày gần đây</p>
            </div>
          </div>
          <div className="h-80">
            <AreaChart 
              data={tasksTrend.map(item => ({
                name: item._id,
                value: item.count
              }))}
            />
          </div>
        </div>
      )}

      {/* Statistics Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chi tiết thống kê
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">
                  Chỉ số
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">
                  Thay đổi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Tổng người dùng</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white font-medium">
                  {stats.totalUsers}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">+12%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Người dùng hoạt động</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white font-medium">
                  {stats.activeUsers}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">+8%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Tổng workspace</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white font-medium">
                  {stats.totalWorkspaces}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">+3%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Tổng dự án</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white font-medium">
                  {stats.totalProjects}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">+8%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Tổng công việc</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white font-medium">
                  {stats.totalTasks}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">+15%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Tỷ lệ hoàn thành</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white font-medium">
                  {stats.completionRate}%
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600">+5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
