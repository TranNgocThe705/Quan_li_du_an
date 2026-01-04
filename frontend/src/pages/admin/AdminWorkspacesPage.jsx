import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Building2, 
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Download,
  Users,
  Briefcase,
  Calendar,
  UserCog
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

const AdminWorkspacesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transferOwnershipModal, setTransferOwnershipModal] = useState({ show: false, workspace: null });
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!user?.isSystemAdmin) {
      toast.error(t('admin.noPermission'));
      navigate('/');
      return;
    }
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, t]);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllWorkspaces();
      setWorkspaces(response.data.data?.workspaces || []);
    } catch (error) {
      toast.error(t('admin.errorLoadingWorkspaces'));
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
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

  const handleOpenTransferOwnership = async (workspace) => {
    try {
      const response = await adminAPI.getAllUsers();
      setAllUsers(response.data.data?.users || []);
      setTransferOwnershipModal({ show: true, workspace, newOwnerId: '' });
    } catch {
      toast.error(t('admin.errorLoadingUsers'));
    }
  };

  const handleTransferOwnership = async () => {
    const { workspace, newOwnerId } = transferOwnershipModal;
    
    if (!newOwnerId) {
      toast.error(t('admin.selectNewOwner'));
      return;
    }

    if (!window.confirm(t('admin.confirmTransferOwnership'))) {
      return;
    }

    try {
      await adminAPI.transferWorkspaceOwnership(workspace._id, newOwnerId);
      toast.success(t('admin.ownershipTransferred'));
      setTransferOwnershipModal({ show: false, workspace: null, newOwnerId: '' });
      fetchWorkspaces();
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.errorTransferringOwnership'));
    }
  };

  const filteredWorkspaces = workspaces.filter(workspace => 
    workspace.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.workspaces')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            {t('admin.manageAllWorkspaces')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">{t('admin.export')}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.totalWorkspaces')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{workspaces.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.totalMembers')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {workspaces.reduce((acc, ws) => acc + (ws.members?.length || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.totalProjects')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {workspaces.reduce((acc, ws) => acc + (ws.projectCount || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{t('admin.newThisMonth')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.searchWorkspaces')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">{t('admin.filters')}</span>
          </button>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('admin.workspace')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('admin.owner')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('admin.members')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('admin.projects')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('admin.createdDate')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {filteredWorkspaces.map((workspace) => (
                <tr key={workspace._id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {workspace.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{workspace.name}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{workspace.description?.substring(0, 30)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={workspace.owner?.avatar || `https://ui-avatars.com/api/?name=${workspace.owner?.fullName}`}
                        alt={workspace.owner?.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">{workspace.owner?.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{workspace.members?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{workspace.projectCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                    {new Date(workspace.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenTransferOwnership(workspace)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title={t('admin.transferOwnership')}
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWorkspace(workspace._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t('admin.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkspaces.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-zinc-400">{t('admin.noWorkspacesFound')}</p>
          </div>
        )}
      </div>

      {/* Transfer Ownership Modal */}
      {transferOwnershipModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.transferOwnership')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
              {t('admin.transferOwnershipDescription', { workspace: transferOwnershipModal.workspace?.name })}
            </p>
            <select
              value={transferOwnershipModal.newOwnerId}
              onChange={(e) => setTransferOwnershipModal({ ...transferOwnershipModal, newOwnerId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white mb-4"
            >
              <option value="">{t('admin.selectNewOwner')}</option>
              {allUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setTransferOwnershipModal({ show: false, workspace: null, newOwnerId: '' })}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleTransferOwnership}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('admin.transfer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkspacesPage;
