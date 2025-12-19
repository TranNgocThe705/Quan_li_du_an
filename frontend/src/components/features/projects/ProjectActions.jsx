import { useProjectPermissions } from '../../../hooks/usePermissions';
import { Edit, Trash2, UserPlus, Plus } from 'lucide-react';

const ProjectActions = ({ projectId }) => {
  const { permissions, isTeamLead, isWorkspaceAdmin, role, loading } = useProjectPermissions(projectId);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Role Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Your role:</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isTeamLead || isWorkspaceAdmin 
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
            : role === 'MEMBER'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {isTeamLead ? '👑 Team Lead' : isWorkspaceAdmin ? '⚡ Admin' : role || 'Member'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Create Task - Chỉ hiện nếu không phải VIEWER */}
        {permissions.includes('create_tasks') && (
          <button 
            onClick={() => console.log('Create task')}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Create Task
          </button>
        )}

        {/* Edit Project - Team Lead hoặc Admin */}
        {permissions.includes('update_project') && (
          <button 
            onClick={() => console.log('Edit project')}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 text-sm"
          >
            <Edit size={16} />
            Edit Project
          </button>
        )}

        {/* Add Members - Team Lead hoặc Admin */}
        {permissions.includes('add_members') && (
          <button 
            onClick={() => console.log('Add member')}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
          >
            <UserPlus size={16} />
            Add Member
          </button>
        )}

        {/* Delete Project - Chỉ Team Lead hoặc Admin */}
        {permissions.includes('delete_project') && (
          <button 
            onClick={() => console.log('Delete project')}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>

      {/* Permission List (for debugging) */}
      {import.meta.env.DEV && (
        <details className="mt-4">
          <summary className="text-xs text-gray-500 cursor-pointer">Show Permissions</summary>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            <div className="font-semibold mb-1">Available Permissions:</div>
            <ul className="list-disc list-inside space-y-1">
              {permissions.map((perm) => (
                <li key={perm} className="text-gray-700 dark:text-gray-300">
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </div>
  );
};

export default ProjectActions;
