import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Briefcase, CheckSquare, Building2, Activity, LogOut, Globe, UserCog, Trash2, Ban, CheckCircle, Sun, Moon, TrendingUp, TrendingDown, Download, FileSpreadsheet, FileText, Edit, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../services/api';
import { logout } from '../features/authSlice';
import { toggleTheme } from '../features/themeSlice';
import toast from 'react-hot-toast';
import PieChart from '../components/charts/PieChart';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import AreaChart from '../components/charts/AreaChart';
import { downloadReportFromAPI } from '../utils/exportUtils';
import EditUserModal from '../components/EditUserModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportMenuRef = useRef(null);
  const [editUserModal, setEditUserModal] = useState({ show: false, user: null });
  const [transferOwnershipModal, setTransferOwnershipModal] = useState({ show: false, workspace: null });
  const [allUsers, setAllUsers] = useState([]);

  const handleExportReport = async (format) => {
    try {
      setExportLoading(true);
      setShowExportMenu(false);
      toast.loading(t('admin.downloading'), { id: 'export' });
      
      await downloadReportFromAPI(adminAPI.exportReport, format);
      
      toast.success(t('admin.exportSuccess'), { id: 'export' });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('admin.exportError'), { id: 'export' });
    } finally {
      setExportLoading(false);
    }
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể tải dữ liệu dashboard');
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data?.users || []);
    } catch (error) {
      toast.error(t('admin.errorLoadingUsers'));
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      setWorkspacesLoading(true);
      const response = await adminAPI.getAllWorkspaces();
      setWorkspaces(response.data.data?.workspaces || []);
    } catch (error) {
      toast.error(t('admin.errorLoadingWorkspaces'));
      console.error('Error fetching workspaces:', error);
    } finally {
      setWorkspacesLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await adminAPI.getAllProjects();
      setProjects(response.data.data?.projects || []);
    } catch (error) {
      toast.error(t('admin.errorLoadingProjects'));
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is system admin
    if (!user?.isSystemAdmin) {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/');
      return;
    }

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'workspaces') {
      fetchWorkspaces();
    } else if (activeTab === 'projects') {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, activeTab]);

  const handleEditUser = (user) => {
    setEditUserModal({ show: true, user });
  };

  const handleCloseEditModal = () => {
    setEditUserModal({ show: false, user: null });
  };

  const handleEditSuccess = () => {
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('admin.confirmDeleteUser'))) return;
    
    try {
      await adminAPI.deleteUser(userId);
      toast.success(t('admin.userDeleted'));
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.errorDeletingUser'));
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    if (!window.confirm(t('admin.confirmDeleteWorkspace'))) return;
    
    try {
      await adminAPI.deleteWorkspace(workspaceId);
      toast.success(t('admin.workspaceDeleted'));
      fetchWorkspaces();
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.errorDeletingWorkspace'));
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm(t('admin.confirmDeleteProject'))) return;
    
    try {
      await adminAPI.deleteProject(projectId);
      toast.success(t('admin.projectDeleted'));
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.errorDeletingProject'));
    }
  };

  const handleOpenTransferOwnership = async (workspace) => {
    try {
      // Fetch all users for the dropdown
      const response = await adminAPI.getAllUsers();
      setAllUsers(response.data.data?.users || []);
      setTransferOwnershipModal({ show: true, workspace, newOwnerId: '' });
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    }
  };

  const handleTransferOwnership = async () => {
    const { workspace, newOwnerId } = transferOwnershipModal;
    
    if (!newOwnerId) {
      toast.error('Vui lòng chọn chủ sở hữu mới');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn chuyển quyền sở hữu workspace "${workspace.name}" cho người dùng mới?`)) {
      return;
    }

    try {
      await adminAPI.transferWorkspaceOwnership(workspace._id, newOwnerId);
      toast.success('Đã chuyển quyền sở hữu workspace thành công!');
      setTransferOwnershipModal({ show: false, workspace: null, newOwnerId: '' });
      fetchWorkspaces();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể chuyển quyền sở hữu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-zinc-400">Không có dữ liệu</p>
      </div>
    );
  }

  const { stats, projectsByStatus, tasksByStatus, projectsByPriority, tasksTrend, userGrowth, workspaceActivity, recentUsers, recentWorkspaces } = dashboardData;

  const statsCards = [
    {
      title: t('admin.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      subtitle: `${stats.activeUsers} ${t('admin.activeUsers')}`,
    },
    {
      title: t('admin.totalWorkspaces'),
      value: stats.totalWorkspaces,
      icon: Building2,
      color: 'bg-purple-500',
    },
    {
      title: t('admin.totalProjects'),
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'bg-green-500',
    },
    {
      title: t('admin.totalTasks'),
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-orange-500',
      subtitle: `${stats.completionRate}% hoàn thành`,
    },
  ];

  // Prepare chart data
  const projectsChartData = projectsByStatus?.map(item => ({
    name: item._id,
    value: item.count,
    _id: item._id
  })) || [];

  const tasksChartData = tasksByStatus?.map(item => ({
    name: item._id.replace('_', ' '),
    value: item.count
  })) || [];

  const priorityChartData = projectsByPriority?.map(item => ({
    name: item._id,
    value: item.count,
    _id: item._id
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('admin.dashboard')}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                  {t('admin.subtitle')}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Export Report Dropdown */}
              {activeTab === 'dashboard' && (
                <div className="relative" ref={exportMenuRef}>
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={exportLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t('admin.exportReport')}
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('admin.exportReport')}</span>
                  </button>
                  
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleExportReport('excel')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-green-600" />
                          <span>{t('admin.exportExcel')}</span>
                        </button>
                        <button
                          onClick={() => handleExportReport('pdf')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-red-600" />
                          <span>{t('admin.exportPDF')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                title={t('common.changeLanguage')}
              >
                <Globe className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {i18n.language === 'vi' ? 'VI' : 'EN'}
                </span>
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700">
                <img
                  src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=40`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {t('admin.systemAdmin')}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  try {
                    await dispatch(logout()).unwrap();
                    toast.success(t('auth.logoutSuccess'));
                    navigate('/login');
                  } catch {
                    toast.error(t('auth.logoutError'));
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                title={t('auth.logout')}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">{t('auth.logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 border-b border-gray-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('admin.dashboardTab')}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('admin.usersTab')}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('workspaces')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'workspaces'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {t('admin.workspacesTab')}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('admin.projectsTab')}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
        <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 border border-gray-200 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Projects by Status - Pie Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700 h-96">
            {projectsChartData && projectsChartData.length > 0 ? (
              <PieChart 
                data={projectsChartData}
                title={t('admin.projectsByStatus')}
                nameKey="_id"
                dataKey="value"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('admin.projectsByStatus')}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
              </div>
            )}
          </div>

          {/* Tasks by Status - Pie Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700 h-96">
            {tasksChartData && tasksChartData.length > 0 ? (
              <PieChart 
                data={tasksChartData}
                title={t('admin.tasksByStatus')}
                nameKey="name"
                dataKey="value"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('admin.tasksByStatus')}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
              </div>
            )}
          </div>

          {/* Projects by Priority - Pie Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700 h-96">
            {priorityChartData && priorityChartData.length > 0 ? (
              <PieChart 
                data={priorityChartData}
                title={t('admin.projectsByPriority')}
                nameKey="_id"
                dataKey="value"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('admin.projectsByPriority')}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tasks Trend - Line Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700 h-96">
            {tasksTrend && tasksTrend.length > 0 ? (
              <LineChart 
                data={tasksTrend}
                lines={[
                  { dataKey: 'total', name: 'Total Tasks', color: '#3b82f6' },
                  { dataKey: 'completed', name: 'Completed', color: '#10b981' }
                ]}
                xKey="_id"
                title={t('admin.tasksTrend')}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('admin.tasksTrend')}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
              </div>
            )}
          </div>

          {/* User Growth - Area Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700 h-96">
            {userGrowth && userGrowth.length > 0 ? (
              <AreaChart 
                data={userGrowth}
                dataKey="count"
                xKey="_id"
                title={t('admin.userGrowth')}
                color="#8b5cf6"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('admin.userGrowth')}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Activity - Bar Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700 h-96 mb-8">
          {workspaceActivity && workspaceActivity.length > 0 ? (
            <BarChart 
              data={workspaceActivity}
              dataKey="projectCount"
              xKey="name"
              title={t('admin.workspaceActivity')}
              color="#06b6d4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('admin.workspaceActivity')}
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-gray-200 dark:border-zinc-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.recentUsers')}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                      <img
                        src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=64748B&color=fff&size=40`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=U&background=64748B&color=fff&size=40'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Workspaces */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-gray-200 dark:border-zinc-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('admin.recentWorkspaces')}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentWorkspaces && recentWorkspaces.length > 0 ? (
                  recentWorkspaces.map((workspace) => (
                    <div key={workspace._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {workspace.image_url ? (
                          <img
                            src={workspace.image_url}
                            alt={workspace.name}
                            className="w-10 h-10 rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-purple-500 flex items-center justify-center text-white font-semibold">
                            {workspace.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {workspace.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            Owner: {workspace.ownerId?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {new Date(workspace.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('admin.userManagement')}
              </h2>
            </div>

            {usersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                  <thead className="bg-gray-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.user')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.email')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.role')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.createdAt')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                    {users.map((usr) => (
                      <tr key={usr._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img
                              src={usr.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(usr.name)}&background=random&size=40`}
                              alt={usr.name}
                              className="w-8 h-8 rounded-full"
                              />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {usr.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-zinc-400">{usr.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {usr.isSystemAdmin ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              System Admin
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                          {new Date(usr.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {usr._id !== user._id && (
                              <>
                                <button
                                  onClick={() => handleEditUser(usr)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title={t('admin.editUser')}
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                {!usr.isSystemAdmin && (
                                  <button
                                    onClick={() => handleDeleteUser(usr._id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    title={t('admin.deleteUser')}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Workspaces Tab */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('admin.workspaceManagement')}
              </h2>
            </div>

            {workspacesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map((ws) => (
                  <div
                    key={ws._id}
                    className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 border border-gray-200 dark:border-zinc-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {ws.image_url ? (
                          <img
                            src={ws.image_url}
                            alt={ws.name}
                            className="w-12 h-12 rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                            {ws.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {ws.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-zinc-400">
                            {t('admin.owner')}: {ws.ownerId?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenTransferOwnership(ws)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Chuyển quyền sở hữu"
                        >
                          <UserCog className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorkspace(ws._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title={t('admin.deleteWorkspace')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {ws.description && (
                      <p className="mt-4 text-sm text-gray-600 dark:text-zinc-400">
                        {ws.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
                      <span>{ws.memberCount || 0} {t('admin.members')}</span>
                      <span className="text-xs">
                        {new Date(ws.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))}
                {workspaces.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('admin.projectManagement')}
              </h2>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                  <thead className="bg-gray-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.projectName')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.workspace')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.progress')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.createdAt')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t('admin.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </div>
                          {project.description && (
                            <div className="text-xs text-gray-500 dark:text-zinc-400 truncate max-w-xs">
                              {project.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-zinc-400">
                            {project.workspaceId?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            project.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-zinc-400">
                              {project.progress || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                          {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title={t('admin.deleteProject')}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {projects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-zinc-400">{t('admin.noData')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editUserModal.show && (
        <EditUserModal
          user={editUserModal.user}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Transfer Ownership Modal */}
      {transferOwnershipModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCog size={20} />
                Chuyển Quyền Sở Hữu Workspace
              </h3>
              <button 
                onClick={() => setTransferOwnershipModal({ show: false, workspace: null, newOwnerId: '' })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  ⚠️ Cảnh báo quan trọng
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Chủ sở hữu mới sẽ có toàn quyền quản lý workspace này. Hành động không thể hoàn tác.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Workspace: <span className="text-blue-600 dark:text-blue-400">{transferOwnershipModal.workspace?.name}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                  Chủ sở hữu hiện tại: {transferOwnershipModal.workspace?.ownerId?.name} ({transferOwnershipModal.workspace?.ownerId?.email})
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Chọn chủ sở hữu mới *
                </label>
                <select
                  value={transferOwnershipModal.newOwnerId || ''}
                  onChange={(e) => setTransferOwnershipModal({
                    ...transferOwnershipModal,
                    newOwnerId: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn người dùng --</option>
                  {allUsers
                    .filter(u => u._id !== transferOwnershipModal.workspace?.ownerId?._id)
                    .map(u => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email}) {u.isSystemAdmin && '- System Admin'}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-zinc-800">
              <button
                onClick={() => setTransferOwnershipModal({ show: false, workspace: null, newOwnerId: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleTransferOwnership}
                disabled={!transferOwnershipModal.newOwnerId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UserCog size={16} />
                Xác Nhận Chuyển Quyền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

