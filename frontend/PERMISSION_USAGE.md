# HƯỚNG DẪN SỬ DỤNG PERMISSION SYSTEM - FRONTEND

## 📦 Setup

### 1. Đã được cài đặt sẵn:
- ✅ Redux slice: `frontend/src/features/permissionSlice.js`
- ✅ Custom hooks: `frontend/src/hooks/usePermissions.js`
- ✅ Store config: `frontend/src/app/store.js`
- ✅ Example components: `WorkspaceActions.jsx`, `ProjectActions.jsx`

---

## 🎯 SỬ DỤNG HOOKS

### 1. **useWorkspacePermissions(workspaceId)**
Lấy quyền trong workspace cụ thể.

```jsx
import { useWorkspacePermissions } from '../hooks/usePermissions';

function WorkspaceSettings({ workspaceId }) {
  const { permissions, isOwner, isAdmin, hasAccess, loading } = useWorkspacePermissions(workspaceId);

  if (loading) return <div>Loading...</div>;
  if (!hasAccess) return <div>No access</div>;

  return (
    <div>
      {isOwner && <p>👑 You are the owner</p>}
      {isAdmin && <p>⚡ You are an admin</p>}
      
      {permissions.includes('update_workspace') && (
        <button>Edit Workspace</button>
      )}
      
      {permissions.includes('delete_workspace') && (
        <button>Delete Workspace</button>
      )}
    </div>
  );
}
```

---

### 2. **useProjectPermissions(projectId)**
Lấy quyền trong project cụ thể.

```jsx
import { useProjectPermissions } from '../hooks/usePermissions';

function ProjectCard({ projectId }) {
  const { permissions, isTeamLead, role, hasAccess } = useProjectPermissions(projectId);

  if (!hasAccess) return null;

  return (
    <div>
      <span>Role: {role}</span>
      
      {isTeamLead && <span>👑 Team Lead</span>}
      
      {permissions.includes('create_tasks') && (
        <button>Create Task</button>
      )}
      
      {permissions.includes('update_project') && (
        <button>Edit</button>
      )}
      
      {permissions.includes('delete_project') && (
        <button>Delete</button>
      )}
    </div>
  );
}
```

---

### 3. **useWorkspacePermission(workspaceId, permission)**
Kiểm tra quyền cụ thể trong workspace.

```jsx
import { useWorkspacePermission } from '../hooks/usePermissions';

function InviteButton({ workspaceId }) {
  const canInvite = useWorkspacePermission(workspaceId, 'invite_members');

  if (!canInvite) return null;

  return <button>Invite Members</button>;
}
```

---

### 4. **useProjectPermission(projectId, permission)**
Kiểm tra quyền cụ thể trong project.

```jsx
import { useProjectPermission } from '../hooks/usePermissions';

function DeleteButton({ projectId }) {
  const canDelete = useProjectPermission(projectId, 'delete_project');

  return (
    <button disabled={!canDelete}>
      Delete Project
    </button>
  );
}
```

---

### 5. **useIsWorkspaceOwner(workspaceId)**
Kiểm tra nhanh xem user có phải owner không.

```jsx
import { useIsWorkspaceOwner } from '../hooks/usePermissions';

function DangerZone({ workspaceId }) {
  const isOwner = useIsWorkspaceOwner(workspaceId);

  if (!isOwner) return null;

  return (
    <div className="danger-zone">
      <h3>⚠️ Danger Zone</h3>
      <button>Delete Workspace</button>
    </div>
  );
}
```

---

### 6. **useIsWorkspaceAdmin(workspaceId)**
Kiểm tra xem user có phải admin không.

```jsx
import { useIsWorkspaceAdmin } from '../hooks/usePermissions';

function AdminPanel({ workspaceId }) {
  const isAdmin = useIsWorkspaceAdmin(workspaceId);

  if (!isAdmin) return <div>Access Denied</div>;

  return (
    <div>
      <h2>Admin Panel</h2>
      {/* Admin features */}
    </div>
  );
}
```

---

### 7. **usePermissionsSummary()**
Lấy tổng quan tất cả quyền của user.

```jsx
import { usePermissionsSummary } from '../hooks/usePermissions';

function UserDashboard() {
  const { summary, loading } = usePermissionsSummary();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Workspaces ({summary.workspaces.total})</h2>
      {summary.workspaces.list.map(ws => (
        <div key={ws.id}>
          <h3>{ws.name}</h3>
          <span>{ws.role}</span>
          {ws.isOwner && <span>👑 Owner</span>}
        </div>
      ))}

      <h2>Your Projects ({summary.projects.total})</h2>
      {summary.projects.list.map(proj => (
        <div key={proj.id}>
          <h3>{proj.name}</h3>
          <span>{proj.role}</span>
          {proj.isTeamLead && <span>👑 Lead</span>}
        </div>
      ))}
    </div>
  );
}
```

---

## 🛡️ CONDITIONAL RENDERING

### Ẩn/Hiện component dựa trên quyền:

```jsx
import { useWorkspacePermissions } from '../hooks/usePermissions';

function WorkspaceSettings({ workspaceId }) {
  const { permissions } = useWorkspacePermissions(workspaceId);

  return (
    <div>
      <h1>Settings</h1>
      
      {/* Chỉ hiện General tab cho tất cả members */}
      <Tab label="General">
        <GeneralSettings />
      </Tab>
      
      {/* Chỉ hiện Members tab nếu có quyền manage_members */}
      {permissions.includes('manage_members') && (
        <Tab label="Members">
          <MembersManagement />
        </Tab>
      )}
      
      {/* Chỉ hiện Danger Zone nếu có quyền delete_workspace */}
      {permissions.includes('delete_workspace') && (
        <Tab label="Danger Zone">
          <DangerZone />
        </Tab>
      )}
    </div>
  );
}
```

---

## 🚦 PROTECTED ROUTES

### Bảo vệ route với React Router:

```jsx
import { Navigate } from 'react-router-dom';
import { useWorkspacePermission } from '../hooks/usePermissions';

function ProtectedRoute({ children, workspaceId, requiredPermission }) {
  const hasPermission = useWorkspacePermission(workspaceId, requiredPermission);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage
<Route 
  path="/workspace/:id/settings" 
  element={
    <ProtectedRoute 
      workspaceId={workspaceId} 
      requiredPermission="update_workspace"
    >
      <WorkspaceSettings />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 DISABLE BUTTONS

### Disable button nếu không có quyền:

```jsx
import { useProjectPermissions } from '../hooks/usePermissions';

function TaskActions({ projectId, taskId, isOwnTask }) {
  const { permissions } = useProjectPermissions(projectId);

  const canUpdate = isOwnTask 
    ? permissions.includes('update_own_tasks')
    : permissions.includes('update_all_tasks');

  const canDelete = isOwnTask
    ? permissions.includes('delete_own_tasks')
    : permissions.includes('delete_all_tasks');

  return (
    <div>
      <button disabled={!canUpdate}>
        Edit Task
      </button>
      
      <button 
        disabled={!canDelete}
        className={!canDelete ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Delete Task
      </button>
    </div>
  );
}
```

---

## 📋 HIỂN THỊ ROLE BADGE

```jsx
import { useProjectPermissions } from '../hooks/usePermissions';
import { Crown, Shield, Eye } from 'lucide-react';

function UserRoleBadge({ projectId }) {
  const { role, isTeamLead, isWorkspaceAdmin } = useProjectPermissions(projectId);

  const getRoleConfig = () => {
    if (isTeamLead) {
      return {
        icon: <Crown size={14} />,
        label: 'Team Lead',
        className: 'bg-purple-100 text-purple-700 dark:bg-purple-900'
      };
    }
    if (isWorkspaceAdmin) {
      return {
        icon: <Shield size={14} />,
        label: 'Admin',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900'
      };
    }
    if (role === 'MEMBER') {
      return {
        icon: null,
        label: 'Member',
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-800'
      };
    }
    if (role === 'VIEWER') {
      return {
        icon: <Eye size={14} />,
        label: 'Viewer',
        className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900'
      };
    }
  };

  const config = getRoleConfig();

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
```

---

## 🔄 REFETCH PERMISSIONS

### Sau khi thay đổi role, cần refetch:

```jsx
import { useDispatch } from 'react-redux';
import { fetchWorkspacePermissions, clearWorkspacePermissions } from '../features/permissionSlice';

function UpdateMemberRole({ workspaceId, memberId }) {
  const dispatch = useDispatch();

  const handleUpdateRole = async (newRole) => {
    // Call API to update role
    await axios.put(`/api/workspaces/${workspaceId}/members/${memberId}`, {
      role: newRole
    });

    // Clear cached permissions
    dispatch(clearWorkspacePermissions(workspaceId));

    // Refetch fresh permissions
    dispatch(fetchWorkspacePermissions(workspaceId));

    toast.success('Role updated!');
  };

  return (
    <button onClick={() => handleUpdateRole('ADMIN')}>
      Make Admin
    </button>
  );
}
```

---

## ⚡ PERFORMANCE TIP

### Cache permissions để tránh gọi API nhiều lần:

Permissions đã được cache tự động trong Redux store. Chỉ fetch lại khi:
- Component mount lần đầu
- User action thay đổi role/permissions
- Manually clear cache

```jsx
import { clearPermissions } from '../features/permissionSlice';

// Clear all permissions (khi logout)
dispatch(clearPermissions());

// Clear specific workspace
dispatch(clearWorkspacePermissions(workspaceId));

// Clear specific project
dispatch(clearProjectPermissions(projectId));
```

---

## 📱 VÍ DỤ THỰC TẾ

### Component hoàn chỉnh với permissions:

```jsx
import { useWorkspacePermissions } from '../hooks/usePermissions';
import { Settings, Trash2, UserPlus, Users } from 'lucide-react';

function WorkspaceCard({ workspace }) {
  const { permissions, isOwner, isAdmin, loading } = useWorkspacePermissions(workspace._id);

  return (
    <div className="p-4 border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{workspace.name}</h3>
          <p className="text-sm text-gray-500">{workspace.slug}</p>
        </div>
        
        {/* Owner/Admin badge */}
        {isOwner && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">👑 Owner</span>}
        {!isOwner && isAdmin && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">⚡ Admin</span>}
      </div>

      {/* Actions */}
      {!loading && (
        <div className="flex gap-2">
          {/* View Members - All members */}
          <button className="flex items-center gap-1 px-3 py-2 text-sm rounded hover:bg-gray-100">
            <Users size={16} />
            Members
          </button>

          {/* Invite - Admin only */}
          {permissions.includes('invite_members') && (
            <button className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600">
              <UserPlus size={16} />
              Invite
            </button>
          )}

          {/* Settings - Admin only */}
          {permissions.includes('update_workspace') && (
            <button className="flex items-center gap-1 px-3 py-2 text-sm rounded hover:bg-gray-100">
              <Settings size={16} />
              Settings
            </button>
          )}

          {/* Delete - Owner only */}
          {permissions.includes('delete_workspace') && (
            <button className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkspaceCard;
```

---

## 🎯 BEST PRACTICES

1. **Luôn check loading state:**
```jsx
const { permissions, loading } = useWorkspacePermissions(id);
if (loading) return <Skeleton />;
```

2. **Handle no access gracefully:**
```jsx
const { hasAccess } = useWorkspacePermissions(id);
if (!hasAccess) return <AccessDenied />;
```

3. **Use descriptive variable names:**
```jsx
// ❌ Bad
const can = useWorkspacePermission(id, 'delete_workspace');

// ✅ Good
const canDeleteWorkspace = useWorkspacePermission(id, 'delete_workspace');
```

4. **Combine với error boundaries:**
```jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <ProtectedRoute requiredPermission="admin">
    <AdminPanel />
  </ProtectedRoute>
</ErrorBoundary>
```

---

## 📚 XEM THÊM

- **Backend API:** `backend/PERMISSION_API.md`
- **System docs:** `backend/PERMISSION_SYSTEM.md`
- **Quick guide:** `backend/PERMISSION_QUICK_GUIDE.md`

---

Bây giờ bạn có thể kiểm tra và hiển thị quyền của user một cách dễ dàng! 🎉
