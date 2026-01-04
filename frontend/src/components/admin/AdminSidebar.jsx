import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  CheckSquare, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  FileText,
  Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ collapsed = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: t('admin.dashboard') || 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true
    },
    {
      id: 'users',
      label: t('admin.users') || 'Users',
      icon: Users,
      path: '/admin/users'
    },
    {
      id: 'workspaces',
      label: t('admin.workspaces') || 'Workspaces',
      icon: Building2,
      path: '/admin/workspaces'
    },
    {
      id: 'projects',
      label: t('admin.projects') || 'Projects',
      icon: Briefcase,
      path: '/admin/projects'
    },
    {
      id: 'tasks',
      label: t('admin.tasks') || 'Tasks',
      icon: CheckSquare,
      path: '/admin/tasks'
    },
    {
      id: 'reports',
      label: t('admin.reports') || 'Reports',
      icon: BarChart3,
      path: '/admin/reports'
    },
    {
      id: 'activity',
      label: t('admin.activityLog') || 'Activity Log',
      icon: FileText,
      path: '/admin/activity'
    },
    {
      id: 'settings',
      label: t('admin.settings') || 'Settings',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  return (
    <div className={`h-screen bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.subItems ? (
                // Menu with sub-items
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      expandedMenus[item.id] ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {!collapsed && expandedMenus[item.id] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.id}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700'
                            }`
                          }
                        >
                          <span>{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular menu item
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`
                  }
                  title={collapsed ? item.label : ''}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200 dark:border-zinc-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title={collapsed ? t('common.logout') : ''}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">{t('common.logout') || 'Sign Out'}</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
