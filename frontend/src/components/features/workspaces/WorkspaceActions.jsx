import { useWorkspacePermissions } from '../../../hooks/usePermissions';
import { Trash2, Settings, UserPlus, Edit } from 'lucide-react';

const WorkspaceActions = ({ workspaceId }) => {
  const { permissions, isOwner, isAdmin, loading } = useWorkspacePermissions(workspaceId);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading permissions...</div>;
  }

  return (
    <div className="flex gap-2">
      {/* Chỉ hiện nút Edit nếu có quyền update_workspace */}
      {permissions.includes('update_workspace') && (
        <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
          <Edit size={16} />
          Edit Workspace
        </button>
      )}

      {/* Chỉ hiện nút Invite nếu có quyền invite_members */}
      {permissions.includes('invite_members') && (
        <button className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
          <UserPlus size={16} />
          Invite Member
        </button>
      )}

      {/* Chỉ hiện nút Settings nếu là Admin hoặc Owner */}
      {(isAdmin || isOwner) && (
        <button className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2">
          <Settings size={16} />
          Settings
        </button>
      )}

      {/* Chỉ hiện nút Delete nếu là Owner (có quyền delete_workspace) */}
      {permissions.includes('delete_workspace') && (
        <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2">
          <Trash2 size={16} />
          Delete
        </button>
      )}
    </div>
  );
};

export default WorkspaceActions;
