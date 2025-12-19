# 🧪 Hướng Dẫn Test Hệ Thống Phân Quyền

## 📋 Tài Khoản Test

Tất cả tài khoản đều có password: `password123`

### 1️⃣ **Workspace Level Permissions**

| Email | Role | Mô tả |
|-------|------|-------|
| `owner@example.com` | **OWNER** | Chủ sở hữu workspace - Có toàn quyền |
| `wsadmin@example.com` | **ADMIN** | Admin workspace - Quản lý members, projects |
| `member@example.com` | **MEMBER** | Thành viên workspace - Xem và tạo projects |

### 2️⃣ **Project Level Permissions**

| Email | Role | Mô tả |
|-------|------|-------|
| `lead@example.com` | **LEAD** | Team Lead - Quản lý project, tasks, members |
| `pmember@example.com` | **MEMBER** | Project Member - Tạo/sửa tasks, comments |
| `viewer@example.com` | **VIEWER** | Project Viewer - Chỉ xem, không sửa |

### 3️⃣ **Task Level Permissions**

| Email | Role | Mô tả |
|-------|------|-------|
| `assignee@example.com` | **ASSIGNEE** | Người được assign task - Sửa task của mình |

### 4️⃣ **Admin System**

| Email | Role | Mô tả |
|-------|------|-------|
| `admin@example.com` | **ADMIN** | System Admin - Quản lý toàn hệ thống |

---

## 🏢 Workspaces Test

### **Tech Startup Inc** (Owner: owner@example.com)
- **Owner**: owner@example.com - Toàn quyền workspace
- **Admin**: wsadmin@example.com - Quản lý members, projects
- **Members**: member@example.com, lead@example.com, pmember@example.com, viewer@example.com, assignee@example.com

### **Marketing Team** (Owner: admin@example.com)
- **Owner**: admin@example.com - System admin là owner
- **Admin**: wsadmin@example.com - Admin workspace
- **Member**: member@example.com - Thành viên thường

### **Development Team** (Owner: owner@example.com)
- **Owner**: owner@example.com
- **Members**: lead@example.com, pmember@example.com

---

## 📁 Projects Test

### **1. Website Redesign** (Workspace: Tech Startup Inc)
**Team Lead**: lead@example.com

| Member | Role | Test Case |
|--------|------|-----------|
| lead@example.com | **LEAD** | ✅ Sửa project, thêm/xóa members, quản lý tasks |
| pmember@example.com | **MEMBER** | ✅ Tạo/sửa tasks, comments - ❌ Không sửa project settings |
| viewer@example.com | **VIEWER** | ✅ Xem project/tasks - ❌ Không tạo/sửa gì |
| assignee@example.com | **MEMBER** | ✅ Sửa tasks được assign - ❌ Không sửa tasks của người khác |

**Tasks để test**:
- "Thiết kế trang chủ mới" - Assigned to: assignee@example.com
- "Fix lỗi navigation mobile" - Assigned to: pmember@example.com
- "Tối ưu hóa SEO" - Assigned to: lead@example.com

### **2. Mobile App Development** (Workspace: Tech Startup Inc)
**Team Lead**: lead@example.com
- Same team structure như Website Redesign
- Test việc có nhiều projects trong cùng workspace

### **3. API Development** (Workspace: Tech Startup Inc)
**Team Lead**: pmember@example.com (Member làm lead)
- Test case: Workspace Member có thể làm Project Lead không?
- Viewer chỉ có quyền xem

### **4. Q4 Marketing Campaign** (Workspace: Marketing Team)
**Team Lead**: wsadmin@example.com (Workspace Admin làm lead)
- Test case: Workspace Admin có quyền gì trên project?

---

## 🧪 Test Cases

### **A. Workspace Permissions**

#### Test với `owner@example.com`:
```
✅ Xem tất cả workspaces của mình
✅ Tạo workspace mới
✅ Sửa workspace settings
✅ Xóa workspace
✅ Thêm/xóa members
✅ Thay đổi role của members
✅ Xem tất cả projects trong workspace
✅ Tạo projects mới
```

#### Test với `wsadmin@example.com`:
```
✅ Xem workspace
✅ Thêm/xóa members (không phải owner)
✅ Thay đổi role của members
✅ Tạo projects
✅ Sửa projects
❌ Xóa workspace
❌ Thay đổi workspace owner
```

#### Test với `member@example.com`:
```
✅ Xem workspace
✅ Xem projects
✅ Tạo projects mới
❌ Thêm/xóa members
❌ Sửa workspace settings
❌ Xóa workspace
```

### **B. Project Permissions**

#### Test với `lead@example.com` (Project Lead):
```
✅ Xem project details
✅ Sửa project (name, description, status, priority)
✅ Thêm/xóa project members
✅ Thay đổi role của members
✅ Tạo tasks
✅ Sửa/xóa bất kỳ task nào
✅ Assign tasks cho members
❌ Xóa project (chỉ workspace admin/owner)
```

#### Test với `pmember@example.com` (Project Member):
```
✅ Xem project details
✅ Xem tất cả tasks
✅ Tạo tasks mới
✅ Sửa tasks được assign cho mình
✅ Comment trên tasks
✅ Update status của tasks
❌ Sửa project settings
❌ Thêm/xóa members
❌ Sửa tasks của người khác
```

#### Test với `viewer@example.com` (Project Viewer):
```
✅ Xem project details
✅ Xem tất cả tasks
✅ Xem comments
❌ Tạo tasks
❌ Sửa tasks
❌ Comment
❌ Sửa project
❌ Thêm members
```

### **C. Task Permissions**

#### Test với `assignee@example.com`:
Login và vào project "Website Redesign":
```
✅ Xem task "Thiết kế trang chủ mới" (assigned cho mình)
✅ Sửa status, priority của task này
✅ Comment trên task này
❌ Sửa task "Fix lỗi navigation mobile" (assigned cho pmember@example.com)
❌ Xóa bất kỳ task nào
```

#### Test với `lead@example.com`:
```
✅ Sửa bất kỳ task nào trong project
✅ Assign/reassign tasks
✅ Xóa tasks
✅ Update tất cả fields
```

---

## 🔄 Workflow Test

### **Scenario 1: Tạo và quản lý Project**
1. Login `owner@example.com`
2. Tạo workspace mới
3. Mời `wsadmin@example.com` làm ADMIN
4. Mời `member@example.com` làm MEMBER
5. Login `wsadmin@example.com` → Tạo project mới
6. Thêm `lead@example.com` làm LEAD
7. Login `lead@example.com` → Thêm members vào project

### **Scenario 2: Task Assignment Flow**
1. Login `lead@example.com` (Project Lead)
2. Tạo task mới "Feature X"
3. Assign cho `assignee@example.com`
4. Login `assignee@example.com`
5. Update task status từ TODO → IN_PROGRESS
6. Thêm comment "Đang làm"
7. Thử sửa task khác → Should fail ❌
8. Login `viewer@example.com`
9. Xem tasks → OK ✅
10. Thử tạo task → Should fail ❌

### **Scenario 3: Permission Escalation**
1. Login `member@example.com` (Workspace Member)
2. Thử xóa project → Should fail ❌
3. Login `wsadmin@example.com` (Workspace Admin)
4. Thêm `member@example.com` vào project làm LEAD
5. Login `member@example.com`
6. Bây giờ có thể quản lý project members ✅

---

## 🚀 Chạy Seed Data

```bash
cd backend
node seeds/seedData.js
```

Kết quả:
```
✅ MongoDB Connected
🗑️  Clearing existing data...
👥 Creating users...
✅ Users created
🏢 Creating workspaces...
✅ Workspaces created
👤 Adding workspace members...
✅ Workspace members added
📁 Creating projects...
✅ Projects created
👥 Adding project members...
✅ Project members added
✅ Creating tasks...
✅ Tasks created
✅ Comments created
✅ Seed data inserted successfully
```

---

## 📊 API Endpoints để Test

### Check Permissions:
```http
GET /api/permissions/summary
GET /api/permissions/workspace/:workspaceId
GET /api/permissions/project/:projectId
POST /api/permissions/check
```

### Workspace:
```http
GET /api/workspaces
POST /api/workspaces
PUT /api/workspaces/:id
DELETE /api/workspaces/:id
POST /api/workspaces/:id/members
```

### Project:
```http
GET /api/projects?workspaceId=xxx
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
POST /api/projects/:id/members
```

### Task:
```http
GET /api/tasks?projectId=xxx
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

---

## 🎯 Quick Test Matrix

| Action | Owner | WS Admin | WS Member | Project Lead | Project Member | Project Viewer |
|--------|-------|----------|-----------|--------------|----------------|----------------|
| Delete Workspace | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Add WS Members | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Project | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Project | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Project | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Add Project Members | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Create Task | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Any Task | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Edit Own Task | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| View Only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 💡 Tips

1. **Dùng browser khác nhau** để test nhiều users cùng lúc
2. **Mở DevTools Network tab** để xem API responses
3. **Check Redux DevTools** để xem permission state
4. **Console.log** để debug permission checks
5. **Test edge cases**: Expired tokens, invalid IDs, deleted resources

Happy Testing! 🎉
