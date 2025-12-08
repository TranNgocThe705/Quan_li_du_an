# 🧪 Tài Khoản Test - Công Ty Phần Mềm ABC

## 🔑 Password cho tất cả: `123456`

## 👥 Danh Sách Tài Khoản

### 🔴 Quản Lý
| Email | Tên | Role | Mô tả |
|-------|-----|------|-------|
| admin@gmail.com | Nguyễn Văn Admin | **OWNER** | Chủ workspace - Toàn quyền |
| manager@gmail.com | Trần Thị Manager | **ADMIN** | Quản lý workspace, projects |

### 🔵 Team Members
| Email | Tên | Role | Chuyên môn |
|-------|-----|------|------------|
| lead@gmail.com | Lê Văn Lead | **PROJECT LEAD** | Team Lead các projects |
| member@gmail.com | Phạm Thị Member | **MEMBER** | Frontend Developer |
| dev@gmail.com | Hoàng Văn Dev | **MEMBER** | Backend Developer |
| designer@gmail.com | Võ Thị Designer | **MEMBER** | UI/UX Designer |
| tester@gmail.com | Đặng Văn Tester | **MEMBER** | QA Tester |
| viewer@gmail.com | Bùi Thị Viewer | **VIEWER** | Stakeholder (chỉ xem)

---

## 🏢 Workspace: Công Ty TNHH Phần Mềm ABC

### 📁 Dự Án Đang Triển Khai

#### 1. **Hệ Thống Quản Lý Bán Hàng** (35% - HIGH)
- **Team Lead**: lead@gmail.com
- **Team**: Dev, Designer, Member (Frontend), Tester, Viewer
- **Tasks**: 7 tasks (Database, API, UI, Payment integration)

#### 2. **App Di Động Đặt Đồ Ăn** (25% - HIGH)
- **Team Lead**: lead@gmail.com  
- **Team**: Dev (Mobile), Member, Designer, Tester
- **Tasks**: 7 tasks (Setup, UI, Auth, Search, Maps, Push notification)

#### 3. **Website Tin Tức** (50% - MEDIUM)
- **Team Lead**: manager@gmail.com
- **Team**: Dev (Full-stack), Designer, Member (Content)
- **Tasks**: 5 tasks (CMS, UI, Comments, SEO, Content)

#### 4. **Hệ Thống Nhân Sự - HRM** (5% - MEDIUM - Planning)
- **Team Lead**: lead@gmail.com
- **Team**: Dev, Viewer (HR Rep)
- **Tasks**: 3 tasks (Requirements, Database design, Mockup)

#### 5. **Dashboard Analytics** (100% - COMPLETED)
- **Team Lead**: manager@gmail.com
- **Team**: Dev, Designer
- **Tasks**: 4 tasks (Charts, Real-time, Export, Responsive)

---

## 🚀 Quick Start

1. **Chạy seed data**:
```bash
cd backend
node seeds/seedData.js
```

2. **Login các account và test**:
- Browser 1: `admin@gmail.com` - Test workspace owner
- Browser 2: `lead@gmail.com` - Test project lead  
- Browser 3: `dev@gmail.com` - Test developer member
- Browser 4: `viewer@gmail.com` - Test viewer (read-only)

---

## ✅ Test Cases Phân Quyền

### 🔴 Admin (admin@gmail.com)
```
✅ Tạo/sửa/xóa workspace
✅ Thêm/xóa members
✅ Thay đổi roles
✅ Quản lý tất cả projects
✅ Xem tất cả tasks
```

### 🔴 Manager (manager@gmail.com)  
```
✅ Thêm/xóa workspace members
✅ Tạo/sửa projects
✅ Làm Project Lead
❌ Xóa workspace (chỉ owner)
```

### 🔵 Team Lead (lead@gmail.com)
```
✅ Sửa project settings
✅ Thêm/xóa project members
✅ Assign/reassign tasks
✅ Sửa/xóa tất cả tasks
❌ Xóa project
```

### 🔵 Developer (dev@gmail.com)
```
✅ Tạo tasks
✅ Sửa tasks được assign
✅ Comment trên tasks
❌ Sửa project settings
❌ Xóa tasks
```

### 🔵 Designer (designer@gmail.com)
```
✅ Tạo tasks design
✅ Upload mockups/designs
✅ Comment và review
❌ Sửa backend tasks
```

### 🔵 Tester (tester@gmail.com)
```
✅ Tạo bug reports
✅ Sửa testing tasks
✅ Update test results
❌ Close bugs (dev phải fix trước)
```

### ⚪ Viewer (viewer@gmail.com)
```
✅ Xem projects & tasks
✅ Xem comments & attachments  
❌ Tạo/sửa bất cứ thứ gì
❌ Comment
```

---

## 🎯 Scenarios Test

### Scenario 1: Tạo Task và Assign
1. Login `lead@gmail.com`
2. Vào project "Hệ Thống Quản Lý Bán Hàng"
3. Tạo task mới "Implement shopping cart"
4. Assign cho `dev@gmail.com`
5. Login `dev@gmail.com` → Xem và update task

### Scenario 2: Bug Fixing Workflow
1. Login `tester@gmail.com`
2. Tạo bug "Fix lỗi thanh toán"
3. Assign cho `dev@gmail.com`
4. Login `dev@gmail.com` → Fix bug và update status
5. Login `tester@gmail.com` → Verify và close

### Scenario 3: Design Review
1. Login `designer@gmail.com`
2. Upload design mockup vào task
3. Login `lead@gmail.com` → Review và comment
4. Login `designer@gmail.com` → Update based on feedback

---

📖 **Chi tiết đầy đủ**: Xem `backend/TESTING_PERMISSIONS.md`
