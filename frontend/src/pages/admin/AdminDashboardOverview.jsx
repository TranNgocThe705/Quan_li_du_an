import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  Building2, 
  TrendingUp, 
  TrendingDown,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../../api/index.js';
import toast from 'react-hot-toast';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import AreaChart from '../../components/charts/AreaChart';
import { downloadReportFromAPI } from '../../utils/exportUtils';

const AdminDashboardOverview = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

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

  useEffect(() => {
    if (!user?.isSystemAdmin) {
      toast.error(t('admin.noPermission'));
      navigate('/');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, t]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.errorLoadingDashboard'));
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
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

  // Stats cards data
  const statsCards = [
    {
      title: t('admin.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      bgLight: 'bg-pink-50',
      bgDark: 'bg-pink-900/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      change: '+6%',
      changeType: 'increase',
      subtitle: `${stats.activeUsers} ${t('admin.activeUsers')}`
    },
    {
      title: t('admin.totalWorkspaces'),
      value: stats.totalWorkspaces,
      icon: Building2,
      color: 'from-orange-500 to-amber-500',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: t('admin.totalProjects'),
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      change: '+1.2%',
      changeType: 'increase'
    },
    {
      title: t('admin.totalTasks'),
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'from-purple-500 to-violet-500',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      change: '+0.5%',
      changeType: 'increase',
      subtitle: `${stats.completionRate}% ${t('admin.completed')}`
    },
  ];

  // Prepare chart data
  const projectsChartData = projectsByStatus?.map(item => {
    const statusKey = item._id.toLowerCase(); // ACTIVE -> active, COMPLETED -> completed
    return {
      name: t(`projects.${statusKey}`) || item._id,
      value: item.count,
      _id: item._id
    };
  }) || [];

  const tasksChartData = tasksByStatus?.map(item => {
    // Convert TODO -> todo, IN_PROGRESS -> inProgress, PENDING_APPROVAL -> pendingApproval
    const statusKey = item._id === 'TODO' ? 'todo' : 
                      item._id === 'IN_PROGRESS' ? 'inProgress' :
                      item._id === 'DONE' ? 'done' :
                      item._id === 'PENDING_APPROVAL' ? 'pendingApproval' :
                      item._id.toLowerCase().replace(/_/g, '');
    return {
      name: t(`taskDetails.${statusKey}`) || item._id.replace('_', ' '),
      value: item.count
    };
  }) || [];

  const priorityChartData = projectsByPriority?.map(item => {
    const priorityKey = item._id.toLowerCase(); // HIGH -> high, MEDIUM -> medium, LOW -> low
    return {
      name: t(`taskDetails.${priorityKey}`) || item._id,
      value: item.count,
      _id: item._id
    };
  }) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.dashboard')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            {t('admin.dashboardSubtitle')}
          </p>
        </div>
        <button 
          onClick={() => handleExportReport('excel')}
          disabled={exportLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">{exportLoading ? t('admin.exporting') || 'Đang xuất...' : t('admin.export')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${card.bgLight} dark:${card.bgDark} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              {card.change && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.changeType === 'increase' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {card.changeType === 'increase' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {card.change}
                </div>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">{card.title}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{card.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Trend */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.userGrowth')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.monthly')}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="h-64">
            {userGrowth && userGrowth.length > 0 ? (
              <LineChart 
                data={userGrowth.map(item => ({
                  name: item._id,
                  value: item.count
                }))}
                dataKey="value"
                color="#3b82f6"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t('admin.noData')}
              </div>
            )}
          </div>
        </div>

        {/* Projects by Status */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.projectsByStatus')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.distribution')}</p>
            </div>
          </div>
          <div className="h-64">
            {projectsChartData.length > 0 ? (
              <PieChart data={projectsChartData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t('admin.noData')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.tasksByStatus')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.overview')}</p>
            </div>
          </div>
          <div className="h-64">
            {tasksChartData.length > 0 ? (
              <BarChart data={tasksChartData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t('admin.noData')}
              </div>
            )}
          </div>
        </div>

        {/* Projects by Priority */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.projectsByPriority')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.distribution')}</p>
            </div>
          </div>
          <div className="h-64">
            {priorityChartData.length > 0 ? (
              <BarChart data={priorityChartData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t('admin.noData')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Trend */}
      {tasksTrend && tasksTrend.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.taskTrend')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.last30Days')}</p>
            </div>
          </div>
          <div className="h-64">
            <AreaChart 
              data={tasksTrend.map(item => ({
                name: item._id,
                value: item.count
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardOverview;
