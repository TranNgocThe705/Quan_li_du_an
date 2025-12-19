# PERMISSION SYSTEM - QUICK REFERENCE

## 🎯 3 CẤP ĐỘ PHÂN QUYỀN

### 1️⃣ WORKSPACE
```
OWNER  → Xóa workspace (chỉ owner)
ADMIN  → Mời member, cập nhật workspace, quản lý projects
MEMBER → Xem workspace, tham gia projects
```

### 2️⃣ PROJECT  
```
LEAD   → Quản lý project, thêm/xóa members, quản lý tasks
MEMBER → Xem project, tạo tasks, cập nhật tasks của mình
VIEWER → Chỉ xem (read-only)
```

### 3️⃣ TASK
```
ASSIGNEE     → Cập nhật task của mình
TEAM LEAD    → Quản lý tất cả tasks trong project
WORKSPACE ADMIN → Quản lý tất cả tasks trong workspace
```

---

## 🛡️ MIDDLEWARE

| Middleware | Dùng cho |
|-----------|----------|
| `checkWorkspaceMember` | Kiểm tra member của workspace |
| `checkWorkspaceAdmin` | Kiểm tra admin của workspace |
| `checkWorkspaceOwner` | Kiểm tra owner của workspace |
| `checkProjectMember` | Kiểm tra member của project |
| `checkProjectManagePermission` | Team Lead HOẶC Workspace Admin |
| `checkTaskAccess` | Quyền xem task |
| `checkTaskManagePermission` | Quyền quản lý task |

---

## 📋 BẢNG QUYỀN NHANH

### WORKSPACE ACTIONS
| Action | Quyền |
|--------|-------|
| Xem workspace | Member |
| Cập nhật workspace | Admin |
| Xóa workspace | Owner |
| Mời/xóa member | Admin |
| Cập nhật role member | Admin |

### PROJECT ACTIONS
| Action | Quyền |
|--------|-------|
| Xem project | Project Member |
| Cập nhật project | Team Lead hoặc Workspace Admin |
| Xóa project | Team Lead hoặc Workspace Admin |
| Thêm/xóa project member | Team Lead hoặc Workspace Admin |

### TASK ACTIONS
| Action | Quyền |
|--------|-------|
| Xem task | Project Member |
| Tạo task | Workspace Member |
| Cập nhật task | Assignee, Team Lead, hoặc Workspace Admin |
| Xóa task | Assignee, Team Lead, hoặc Workspace Admin |

---

## 💡 VÍ DỤ SỬ DỤNG

### Thêm middleware vào route:
```javascript
import { 
  protect,
  checkWorkspaceAdmin,
  checkProjectManagePermission
} from '../middleware/...';

// Route cần quyền Admin
router.put('/:id', 
  protect, 
  checkWorkspaceAdmin, 
  updateWorkspace
);

// Route cần Team Lead hoặc Admin
router.put('/:id', 
  protect, 
  checkProjectManagePermission, 
  updateProject
);
```

### Sử dụng data từ middleware trong controller:
```javascript
export const getWorkspaceById = asyncHandler(async (req, res) => {
  // Không cần kiểm tra quyền nữa
  const membership = req.workspaceMembership; // Từ middleware
  const workspace = await Workspace.findById(req.params.id);
  
  // Business logic...
});
```

---

## 🔄 SO SÁNH TRƯỚC VÀ SAU

### ❌ Trước (Code lặp lại):
```javascript
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  // Kiểm tra quyền (lặp lại ở mọi controller)
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId
  });
  
  if (!isTeamLead && (!workspaceMembership || workspaceMembership.role !== 'ADMIN')) {
    return errorResponse(res, 403, 'Access denied');
  }
  
  // Business logic...
});
```

### ✅ Sau (Dùng middleware):
```javascript
// Route
router.put('/:id', protect, checkProjectManagePermission, updateProject);

// Controller
export const updateProject = asyncHandler(async (req, res) => {
  const project = req.project; // Từ middleware
  
  // Business logic (sạch hơn, không cần kiểm tra quyền)
  project.name = req.body.name || project.name;
  await project.save();
  
  return successResponse(res, 200, 'Updated', project);
});
```

---

## 📁 FILES QUAN TRỌNG

- `backend/middleware/checkPermission.js` - Tất cả middleware phân quyền
- `backend/config/constants.js` - WorkspaceRole, ProjectRole enums
- `backend/models/ProjectMember.js` - Schema với role field
- `backend/PERMISSION_SYSTEM.md` - Tài liệu chi tiết

---

Xem tài liệu đầy đủ tại: `backend/PERMISSION_SYSTEM.md`
