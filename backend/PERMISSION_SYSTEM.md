# HỆ THỐNG PHÂN QUYỀN - PERMISSION SYSTEM

## 📋 MỤC LỤC
1. [Tổng quan](#tổng-quan)
2. [Các cấp độ phân quyền](#các-cấp-độ-phân-quyền)
3. [Middleware phân quyền](#middleware-phân-quyền)
4. [Quyền theo từng tài nguyên](#quyền-theo-từng-tài-nguyên)
5. [Cách hoạt động](#cách-hoạt-động)
6. [Ví dụ sử dụng](#ví-dụ-sử-dụng)

---

## 🎯 TỔNG QUAN

Hệ thống phân quyền được thiết kế theo mô hình **3 cấp độ** với middleware tập trung để kiểm tra quyền truy cập:

```
User (Người dùng)
  ↓
Workspace (Không gian làm việc) - Role: ADMIN, MEMBER
  ↓
Project (Dự án) - Role: LEAD, MEMBER, VIEWER
  ↓
Task (Nhiệm vụ) - Assignee
```

---

## 🔐 CÁC CẤP ĐỘ PHÂN QUYỀN

### **1. WORKSPACE LEVEL (Cấp Workspace)**

#### **Roles:**
- **ADMIN** - Quản trị viên workspace
  - ✅ Mời/xóa thành viên
  - ✅ Cập nhật thông tin workspace
  - ✅ Tạo/xóa/cập nhật projects
  - ✅ Quản lý toàn bộ tasks trong workspace

- **MEMBER** - Thành viên workspace
  - ✅ Xem workspace và các projects
  - ✅ Tham gia projects (nếu được thêm)
  - ❌ Không thể mời thành viên mới
  - ❌ Không thể cập nhật workspace settings

#### **Đặc quyền Owner:**
- **OWNER** (người tạo workspace)
  - ✅ Tất cả quyền của ADMIN
  - ✅ **Xóa workspace** (chỉ owner)

---

### **2. PROJECT LEVEL (Cấp Project)**

#### **Roles:**
- **LEAD** - Team Lead (Trưởng nhóm)
  - ✅ Cập nhật/xóa project
  - ✅ Thêm/xóa members
  - ✅ Tạo/cập nhật/xóa tasks
  - ✅ Assign tasks cho members

- **MEMBER** - Thành viên project
  - ✅ Xem project và tasks
  - ✅ Tạo tasks
  - ✅ Cập nhật tasks được assign
  - ❌ Không thể xóa project
  - ❌ Không thể xóa tasks của người khác

- **VIEWER** - Người xem (read-only)
  - ✅ Chỉ xem project và tasks
  - ❌ Không thể tạo/cập nhật/xóa

**Lưu ý:** Workspace ADMIN cũng có quyền như Team LEAD

---

### **3. TASK LEVEL (Cấp Task)**

#### **Quyền:**
- **Assignee** (người được assign task)
  - ✅ Cập nhật status, priority, description
  - ✅ Thay đổi due_date
  - ✅ Xóa task (nếu là assignee)

- **Team Lead**
  - ✅ Quản lý tất cả tasks trong project

- **Workspace Admin**
  - ✅ Quản lý tất cả tasks trong workspace

---

## 🛡️ MIDDLEWARE PHÂN QUYỀN

### **File: `backend/middleware/checkPermission.js`**

Các middleware được tạo để kiểm tra quyền truy cập:

| Middleware | Mô tả | Kiểm tra |
|-----------|-------|----------|
| `checkWorkspaceMember` | Kiểm tra user là member của workspace | workspaceId in params/body |
| `checkWorkspaceAdmin` | Kiểm tra user là ADMIN của workspace | role === 'ADMIN' |
| `checkWorkspaceOwner` | Kiểm tra user là OWNER của workspace | ownerId === userId |
| `checkProjectMember` | Kiểm tra user là member của project | projectId in params/body |
| `checkProjectTeamLead` | Kiểm tra user là Team Lead | team_lead === userId |
| `checkProjectManagePermission` | Kiểm tra user là Team Lead HOẶC Workspace Admin | Linh hoạt hơn |
| `checkTaskAccess` | Kiểm tra user có quyền xem task | Project membership |
| `checkTaskManagePermission` | Kiểm tra user có quyền quản lý task | Assignee, Lead, hoặc Admin |
| `checkWorkspaceAccessFromProject` | Helper để kiểm tra workspace từ projectId | Dùng khi chỉ có projectId |

---

## 📊 QUYỀN THEO TỪNG TÀI NGUYÊN

### **WORKSPACE**

| Action | Endpoint | Middleware | Quyền yêu cầu |
|--------|----------|-----------|---------------|
| Xem danh sách | GET /api/workspaces | `protect` | User đã login |
| Tạo workspace | POST /api/workspaces | `protect` | User đã login |
| Xem chi tiết | GET /api/workspaces/:id | `protect`, `checkWorkspaceMember` | Member |
| Cập nhật | PUT /api/workspaces/:id | `protect`, `checkWorkspaceAdmin` | Admin |
| Xóa | DELETE /api/workspaces/:id | `protect`, `checkWorkspaceOwner` | Owner |
| Mời member | POST /api/workspaces/:id/invite-member | `protect`, `checkWorkspaceAdmin` | Admin |
| Xóa member | DELETE /api/workspaces/:id/members/:memberId | `protect`, `checkWorkspaceAdmin` | Admin |
| Cập nhật role | PUT /api/workspaces/:id/members/:memberId | `protect`, `checkWorkspaceAdmin` | Admin |

---

### **PROJECT**

| Action | Endpoint | Middleware | Quyền yêu cầu |
|--------|----------|-----------|---------------|
| Xem danh sách | GET /api/projects?workspaceId=xxx | `protect` | Workspace Member (checked in controller) |
| Tạo project | POST /api/projects | `protect` | Workspace Member (checked in controller) |
| Xem chi tiết | GET /api/projects/:id | `protect`, `checkProjectMember` | Project Member |
| Cập nhật | PUT /api/projects/:id | `protect`, `checkProjectManagePermission` | Team Lead hoặc Workspace Admin |
| Xóa | DELETE /api/projects/:id | `protect`, `checkProjectManagePermission` | Team Lead hoặc Workspace Admin |
| Thêm member | POST /api/projects/:id/members | `protect`, `checkProjectManagePermission` | Team Lead hoặc Workspace Admin |
| Xóa member | DELETE /api/projects/:id/members/:memberId | `protect`, `checkProjectManagePermission` | Team Lead hoặc Workspace Admin |

---

### **TASK**

| Action | Endpoint | Middleware | Quyền yêu cầu |
|--------|----------|-----------|---------------|
| Xem danh sách | GET /api/tasks?projectId=xxx | `protect` | Project Member (checked in controller) |
| Xem my tasks | GET /api/tasks/my-tasks | `protect` | User đã login |
| Tạo task | POST /api/tasks | `protect`, `checkWorkspaceAccessFromProject` | Workspace Member |
| Xem chi tiết | GET /api/tasks/:id | `protect`, `checkTaskAccess` | Project Member |
| Cập nhật | PUT /api/tasks/:id | `protect`, `checkTaskManagePermission` | Assignee, Team Lead, hoặc Workspace Admin |
| Xóa | DELETE /api/tasks/:id | `protect`, `checkTaskManagePermission` | Assignee, Team Lead, hoặc Workspace Admin |

---

## ⚙️ CÁCH HOẠT ĐỘNG

### **Flow kiểm tra quyền:**

```
1. Request → protect middleware
   ↓ (Verify JWT token)
2. req.user = current user
   ↓
3. Permission middleware (checkXXX)
   ↓ (Query database để kiểm tra membership/role)
4. req.workspaceMembership / req.projectMembership / req.task
   ↓ (Attach data vào request)
5. Controller function
   ↓ (Sử dụng data từ middleware, không cần query lại)
6. Response
```

### **Ví dụ chi tiết:**

#### **Cập nhật Project:**

```javascript
// Route
router.put('/:id', 
  protect,                         // 1. Verify JWT
  checkProjectManagePermission,    // 2. Check permission
  updateProjectValidation, 
  validate, 
  updateProject                    // 3. Execute controller
);

// Middleware: checkProjectManagePermission
export const checkProjectManagePermission = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);
  
  // Check if Team Lead
  const isTeamLead = project.team_lead.toString() === req.user._id.toString();
  if (isTeamLead) {
    req.project = project;
    req.hasManagePermission = true;
    return next();
  }
  
  // Check if Workspace Admin
  const workspaceMembership = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: project.workspaceId
  });
  
  if (workspaceMembership && workspaceMembership.role === 'ADMIN') {
    req.project = project;
    req.workspaceMembership = workspaceMembership;
    req.hasManagePermission = true;
    return next();
  }
  
  return errorResponse(res, 403, 'Access denied');
});

// Controller: updateProject
export const updateProject = asyncHandler(async (req, res) => {
  // Không cần kiểm tra permission nữa, đã có middleware xử lý
  const project = req.project; // Lấy từ middleware
  
  // Update logic...
  project.name = req.body.name || project.name;
  await project.save();
  
  return successResponse(res, 200, 'Updated', project);
});
```

---

## 💡 VÍ DỤ SỬ DỤNG

### **1. Tạo Workspace mới:**
```javascript
POST /api/workspaces
Body: { name: "My Company", slug: "my-company" }
→ User tự động trở thành ADMIN
```

### **2. Mời member vào Workspace:**
```javascript
POST /api/workspaces/:workspaceId/invite-member
Body: { email: "john@example.com", role: "MEMBER" }
→ Chỉ ADMIN mới được mời
```

### **3. Tạo Project:**
```javascript
POST /api/projects
Body: { 
  name: "Mobile App", 
  workspaceId: "xxx",
  team_lead: "userId" 
}
→ Team Lead tự động được thêm vào project
```

### **4. Thêm member vào Project:**
```javascript
POST /api/projects/:projectId/members
Body: { userId: "xxx" }
→ Chỉ Team Lead hoặc Workspace Admin
```

### **5. Tạo Task:**
```javascript
POST /api/tasks
Body: {
  projectId: "xxx",
  title: "Login API",
  assigneeId: "userId",
  due_date: "2025-12-15"
}
→ Phải là Workspace Member
→ Assignee phải là Project Member
```

### **6. Cập nhật Task:**
```javascript
PUT /api/tasks/:taskId
Body: { status: "IN_PROGRESS" }
→ Assignee, Team Lead, hoặc Workspace Admin
```

---

## 🔧 CẢI TIẾN SO VỚI HỆ THỐNG CŨ

### **Trước đây:**
❌ Mỗi controller phải tự kiểm tra quyền  
❌ Code lặp lại nhiều lần  
❌ Khó maintain và debug  
❌ Không nhất quán giữa các controllers  

### **Hiện tại:**
✅ Middleware tập trung, tái sử dụng được  
✅ Code gọn gàng, dễ đọc  
✅ Dễ dàng thêm/sửa quyền  
✅ Nhất quán trong toàn bộ hệ thống  
✅ Attach data vào request để tránh query lại  

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Thứ tự middleware rất quan trọng:**
   - Luôn đặt `protect` đầu tiên
   - Sau đó mới đến các middleware permission
   - Cuối cùng là validation và controller

2. **Workspace Admin có quyền cao:**
   - Admin có thể manage tất cả projects trong workspace
   - Admin có thể manage tất cả tasks

3. **Project Member role (mới thêm):**
   - LEAD, MEMBER, VIEWER
   - Mặc định là MEMBER khi thêm vào project

4. **Không thể xóa:**
   - Workspace Owner khỏi workspace
   - Team Lead khỏi project

5. **Assignee validation:**
   - Chỉ assign task cho Project Member
   - Không thể assign cho người không trong project

---

## 🚀 TƯƠNG LAI MỞ RỘNG

Hệ thống đã được thiết kế để dễ dàng mở rộng:

1. **Thêm role mới:**
   - Thêm vào `constants.js`
   - Tạo middleware mới nếu cần
   - Áp dụng vào routes

2. **Permission-based system:**
   - Có thể chuyển sang hệ thống permission chi tiết hơn
   - VD: `CAN_DELETE_TASK`, `CAN_INVITE_MEMBER`

3. **Fine-grained control:**
   - Project-level permissions
   - Task-level permissions
   - Custom roles

---

## 📞 HỖ TRỢ

Nếu có thắc mắc về hệ thống phân quyền, vui lòng tham khảo:
- File: `backend/middleware/checkPermission.js`
- File: `backend/config/constants.js`
- Hoặc liên hệ team backend

---

**Cập nhật lần cuối:** December 8, 2025  
**Version:** 2.0 - Hệ thống phân quyền mới với middleware tập trung
