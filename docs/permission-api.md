# API KIỂM TRA QUYỀN - PERMISSION CHECK API

## 📍 BASE URL
```
http://localhost:5000/api/permissions
```

---

## 🔐 AUTHENTICATION
Tất cả endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 DANH SÁCH API

### 1. Lấy Tổng Quan Quyền của User
**GET** `/summary`

Lấy tất cả quyền của user trong tất cả workspaces và projects.

#### Response:
```json
{
  "success": true,
  "message": "Permissions summary retrieved",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "workspaces": {
      "total": 3,
      "asOwner": 1,
      "asAdmin": 1,
      "asMember": 1,
      "list": [
        {
          "id": "workspace_id",
          "name": "My Company",
          "slug": "my-company",
          "role": "ADMIN",
          "isOwner": true,
          "isAdmin": true,
          "joinedAt": "2025-01-01T00:00:00.000Z"
        }
      ]
    },
    "projects": {
      "total": 5,
      "asTeamLead": 2,
      "asMember": 3,
      "list": [
        {
          "id": "project_id",
          "name": "Mobile App",
          "workspace": {
            "id": "workspace_id",
            "name": "My Company"
          },
          "role": "LEAD",
          "isTeamLead": true,
          "joinedAt": "2025-01-05T00:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### 2. Lấy Quyền trong Workspace
**GET** `/workspace/:workspaceId`

Kiểm tra quyền của user trong workspace cụ thể.

#### Parameters:
- `workspaceId` (path) - ID của workspace

#### Response:
```json
{
  "success": true,
  "message": "Permissions retrieved",
  "data": {
    "hasAccess": true,
    "workspace": {
      "id": "workspace_id",
      "name": "My Company",
      "slug": "my-company"
    },
    "role": "ADMIN",
    "isOwner": true,
    "isAdmin": true,
    "permissions": [
      "view_workspace",
      "update_workspace",
      "delete_workspace",
      "manage_members",
      "invite_members",
      "remove_members",
      "update_member_roles",
      "create_projects",
      "manage_all_projects",
      "manage_all_tasks"
    ]
  }
}
```

#### Các quyền có thể có:

**OWNER:**
- ✅ `view_workspace` - Xem workspace
- ✅ `update_workspace` - Cập nhật workspace
- ✅ `delete_workspace` - **Xóa workspace** (chỉ owner)
- ✅ `manage_members` - Quản lý thành viên
- ✅ `invite_members` - Mời thành viên
- ✅ `remove_members` - Xóa thành viên
- ✅ `update_member_roles` - Cập nhật role thành viên
- ✅ `create_projects` - Tạo projects
- ✅ `manage_all_projects` - Quản lý tất cả projects
- ✅ `manage_all_tasks` - Quản lý tất cả tasks

**ADMIN:**
- ✅ Tất cả quyền của OWNER **trừ** `delete_workspace`

**MEMBER:**
- ✅ `view_workspace` - Xem workspace
- ✅ `view_projects` - Xem projects
- ✅ `create_projects` - Tạo projects

---

### 3. Lấy Quyền trong Project
**GET** `/project/:projectId`

Kiểm tra quyền của user trong project cụ thể.

#### Parameters:
- `projectId` (path) - ID của project

#### Response:
```json
{
  "success": true,
  "message": "Permissions retrieved",
  "data": {
    "hasAccess": true,
    "project": {
      "id": "project_id",
      "name": "Mobile App",
      "workspace": {
        "id": "workspace_id",
        "name": "My Company"
      }
    },
    "role": "LEAD",
    "isTeamLead": true,
    "isWorkspaceAdmin": false,
    "permissions": [
      "view_project",
      "update_project",
      "delete_project",
      "manage_members",
      "add_members",
      "remove_members",
      "create_tasks",
      "update_all_tasks",
      "delete_all_tasks",
      "assign_tasks"
    ]
  }
}
```

#### Các quyền có thể có:

**LEAD / WORKSPACE ADMIN:**
- ✅ `view_project` - Xem project
- ✅ `update_project` - Cập nhật project
- ✅ `delete_project` - Xóa project
- ✅ `manage_members` - Quản lý thành viên
- ✅ `add_members` - Thêm thành viên
- ✅ `remove_members` - Xóa thành viên
- ✅ `create_tasks` - Tạo tasks
- ✅ `update_all_tasks` - Cập nhật tất cả tasks
- ✅ `delete_all_tasks` - Xóa tất cả tasks
- ✅ `assign_tasks` - Assign tasks

**MEMBER:**
- ✅ `view_project` - Xem project
- ✅ `create_tasks` - Tạo tasks
- ✅ `update_own_tasks` - Cập nhật tasks của mình
- ✅ `delete_own_tasks` - Xóa tasks của mình

**VIEWER:**
- ✅ `view_project` - Xem project
- ✅ `view_tasks` - Xem tasks

---

### 4. Kiểm Tra Quyền Cụ Thể
**POST** `/check`

Kiểm tra xem user có quyền cụ thể trên resource hay không.

#### Request Body:
```json
{
  "resourceType": "workspace",
  "resourceId": "workspace_id",
  "permission": "delete_workspace"
}
```

#### Parameters:
- `resourceType` (string, required) - Loại resource: `workspace` hoặc `project`
- `resourceId` (string, required) - ID của resource
- `permission` (string, required) - Quyền cần kiểm tra

#### Response:
```json
{
  "success": true,
  "message": "Permission check result",
  "data": {
    "hasPermission": true,
    "details": {
      "role": "ADMIN",
      "isOwner": true,
      "isAdmin": true
    }
  }
}
```

#### Quyền có thể kiểm tra:

**Workspace:**
- `view_workspace`
- `update_workspace`
- `delete_workspace`
- `manage_members`
- `invite_members`

**Project:**
- `view_project`
- `update_project`
- `delete_project`
- `manage_members`
- `create_tasks`

---

## 💡 VÍ DỤ SỬ DỤNG

### JavaScript (Fetch API):

```javascript
// 1. Lấy tổng quan quyền
async function getMyPermissions() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/permissions/summary', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log('My permissions:', data.data);
}

// 2. Kiểm tra quyền trong workspace
async function checkWorkspacePermission(workspaceId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `http://localhost:5000/api/permissions/workspace/${workspaceId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  
  if (data.data.hasAccess) {
    console.log('Role:', data.data.role);
    console.log('Is Admin:', data.data.isAdmin);
    console.log('Permissions:', data.data.permissions);
  } else {
    console.log('No access to this workspace');
  }
}

// 3. Kiểm tra quyền xóa workspace
async function canDeleteWorkspace(workspaceId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/permissions/check', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      resourceType: 'workspace',
      resourceId: workspaceId,
      permission: 'delete_workspace'
    })
  });
  
  const data = await response.json();
  
  if (data.data.hasPermission) {
    console.log('✅ You can delete this workspace');
    return true;
  } else {
    console.log('❌ You cannot delete this workspace');
    return false;
  }
}

// 4. Hiển thị nút dựa trên quyền
async function showButtonsBasedOnPermissions(projectId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `http://localhost:5000/api/permissions/project/${projectId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  const permissions = data.data.permissions;
  
  // Show/hide buttons based on permissions
  if (permissions.includes('update_project')) {
    document.getElementById('editBtn').style.display = 'block';
  }
  
  if (permissions.includes('delete_project')) {
    document.getElementById('deleteBtn').style.display = 'block';
  }
  
  if (permissions.includes('manage_members')) {
    document.getElementById('addMemberBtn').style.display = 'block';
  }
}
```

---

### React Example:

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectActions({ projectId }) {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await axios.get(
          `/api/permissions/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        setPermissions(data.data.permissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {permissions.includes('update_project') && (
        <button onClick={handleEdit}>Edit Project</button>
      )}
      
      {permissions.includes('delete_project') && (
        <button onClick={handleDelete}>Delete Project</button>
      )}
      
      {permissions.includes('manage_members') && (
        <button onClick={handleAddMember}>Add Member</button>
      )}
      
      {permissions.includes('create_tasks') && (
        <button onClick={handleCreateTask}>Create Task</button>
      )}
    </div>
  );
}
```

---

### Redux Toolkit Example:

```javascript
// permissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchSummary',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get('/api/permissions/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  }
);

const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    workspaces: [],
    projects: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.workspaces = action.payload.workspaces.list;
        state.projects = action.payload.projects.list;
        state.loading = false;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default permissionSlice.reducer;

// Component
function MyWorkspaces() {
  const dispatch = useDispatch();
  const { workspaces } = useSelector(state => state.permissions);

  useEffect(() => {
    dispatch(fetchUserPermissions());
  }, [dispatch]);

  return (
    <div>
      {workspaces.map(workspace => (
        <div key={workspace.id}>
          <h3>{workspace.name}</h3>
          <span>{workspace.role}</span>
          {workspace.isOwner && <span>👑 Owner</span>}
          {workspace.isAdmin && <span>⚡ Admin</span>}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 USE CASES

### 1. Hiển thị menu dựa trên quyền
```javascript
async function buildSidebar(workspaceId) {
  const perms = await getWorkspacePermissions(workspaceId);
  
  const menu = [];
  
  menu.push({ label: 'Dashboard', path: '/' });
  menu.push({ label: 'Projects', path: '/projects' });
  
  if (perms.permissions.includes('manage_members')) {
    menu.push({ label: 'Team', path: '/team' });
  }
  
  if (perms.isAdmin || perms.isOwner) {
    menu.push({ label: 'Settings', path: '/settings' });
  }
  
  return menu;
}
```

### 2. Guard route trong React Router
```javascript
function ProtectedRoute({ children, requiredPermission, resourceId }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    checkPermission(resourceId, requiredPermission)
      .then(setHasPermission);
  }, [resourceId, requiredPermission]);

  if (hasPermission === null) return <Loading />;
  if (!hasPermission) return <Navigate to="/unauthorized" />;
  
  return children;
}

// Usage
<Route path="/workspace/:id/settings" element={
  <ProtectedRoute 
    requiredPermission="update_workspace"
    resourceId={workspaceId}
  >
    <WorkspaceSettings />
  </ProtectedRoute>
} />
```

### 3. Disable buttons
```javascript
function ProjectCard({ project }) {
  const canEdit = usePermission('project', project.id, 'update_project');
  const canDelete = usePermission('project', project.id, 'delete_project');

  return (
    <div>
      <h3>{project.name}</h3>
      <button disabled={!canEdit}>Edit</button>
      <button disabled={!canDelete}>Delete</button>
    </div>
  );
}
```

---

## 🔧 ERROR RESPONSES

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Workspace not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "resourceType",
      "message": "Invalid resource type"
    }
  ]
}
```

---

## 📝 NOTES

1. **Caching**: Nên cache kết quả permissions để giảm số lượng API calls
2. **Real-time**: Khi role thay đổi, cần refetch permissions
3. **Optimistic UI**: Có thể check permissions trên client trước khi gọi API
4. **Fallback**: Luôn check permissions trên backend, không tin tưởng 100% vào client

---

**Xem thêm:** `backend/PERMISSION_SYSTEM.md` - Tài liệu chi tiết về hệ thống phân quyền
