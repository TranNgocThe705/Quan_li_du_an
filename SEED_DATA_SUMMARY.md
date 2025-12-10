# 📊 Dữ Liệu Test - Phiên Bản Mới Nhất

## 🎯 Mục Đích
Dữ liệu mẫu được tạo để test **ĐẦY ĐỦ TẤT CẢ** tính năng của hệ thống quản lý dự án với dữ liệu thực tế và đa dạng.

## 🆕 Cập Nhật Mới (December 10, 2025)
- ✅ **Fixed**: Task assignee không hiển thị - Đã sửa Task model
- ✅ **Added**: 2 users mới (Client, Product Owner)
- ✅ **Added**: 1 workspace mới (Startup Tech Solutions)
- ✅ **Added**: 2 projects mới (Website E-commerce, AI Chatbot)
- ✅ **Improved**: Avatars với UI Avatars API
- ✅ **Enhanced**: Thông báo chi tiết hơn khi seed

## 📈 Thống Kê Dữ Liệu

| Loại Dữ Liệu | Số Lượng | Mô Tả |
|--------------|----------|-------|
| 👥 Users | **10** | Admin, Manager, Lead, Dev, Designer, Tester, Client, Product, Member, Viewer |
| 🏢 Workspaces | **2** | ABC Software (9 members), Startup Tech (3 members) |
| 📁 Projects | **7** | Active (5), Planning (1), Completed (1) |
| ✅ Tasks | **28** | TODO, IN_PROGRESS, DONE - TẤT CẢ ĐỀU CÓ ASSIGNEE |
| 💬 Comments | **16** | Từ các thành viên khác nhau |
| 🔔 Notifications | **13** | Thông báo thực tế với projectId đầy đủ |
| 📊 Activity Logs | **13** | Ghi lại các hoạt động quan trọng |

## 👥 Tài Khoản Test

**Password cho tất cả: `123456`**

### 🔴 Tài Khoản Quản Lý

#### 1. admin@gmail.com
- **Role**: System Admin + Workspace Admin
- **Quyền**:
  - ✅ Toàn quyền trên hệ thống
  - ✅ Truy cập trang /admin
  - ✅ Quản lý users, workspaces
  - ✅ Tạo/xóa/sửa mọi thứ
- **Use Case**: Test admin panel, system management

#### 2. manager@gmail.com
- **Role**: Workspace Admin + Project Manager
- **Quyền**:
  - ✅ Quản lý workspace
  - ✅ Tạo/quản lý projects
  - ✅ Thêm/xóa members
  - ✅ Quản lý tasks
- **Use Case**: Test workspace management, project creation

### 🔵 Tài Khoản Thành Viên

#### 3. lead@gmail.com
- **Role**: Team Lead (LEAD role trong projects)
- **Quyền**:
  - ✅ Quản lý tasks trong project
  - ✅ Phân công tasks cho members
  - ✅ Cập nhật trạng thái project
  - ✅ Xem tất cả thông tin project
- **Use Case**: Test team lead features, task assignment

#### 4. dev@gmail.com
- **Role**: Backend Developer (MEMBER)
- **Quyền**:
  - ✅ Xem tasks được assign
  - ✅ Cập nhật tasks của mình
  - ✅ Comment trên tasks
  - ⛔ Không thể phân công tasks cho người khác
- **Use Case**: Test member features, task updates

#### 5. member@gmail.com
- **Role**: Frontend Developer (MEMBER)
- **Quyền**: Tương tự dev@gmail.com
- **Use Case**: Test collaboration, multi-user

#### 6. designer@gmail.com
- **Role**: UI/UX Designer (MEMBER)
- **Quyền**: Tương tự dev@gmail.com
- **Use Case**: Test design workflow

#### 7. tester@gmail.com
- **Role**: QA Tester (MEMBER)
- **Quyền**: Tương tự dev@gmail.com
- **Use Case**: Test QA workflow, bug reporting

#### 8. viewer@gmail.com
- **Role**: Stakeholder (VIEWER)
- **Quyền**:
  - ✅ Chỉ xem thông tin project
  - ✅ Xem tasks, comments
  - ⛔ Không thể tạo/sửa/xóa
  - ⛔ Không thể comment
- **Use Case**: Test read-only access

## 📁 Dự Án Mẫu

### 1. Hệ Thống Quản Lý Bán Hàng
- **Priority**: HIGH
- **Status**: ACTIVE
- **Progress**: 35%
- **Team**: 6 members (Lead, Dev, Designer, Member, Tester, Viewer)
- **Tasks**: 7 tasks (database, API, UI, payment integration, bug fixes)

### 2. App Di Động Đặt Đồ Ăn
- **Priority**: HIGH
- **Status**: ACTIVE
- **Progress**: 25%
- **Team**: 5 members
- **Tasks**: 7 tasks (React Native, UI/UX, authentication, maps, notifications)

### 3. Website Tin Tức
- **Priority**: MEDIUM
- **Status**: ACTIVE
- **Progress**: 50%
- **Team**: 4 members
- **Tasks**: 5 tasks (CMS, design, comments, SEO, content)

### 4. Hệ Thống Nhân Sự (HRM)
- **Priority**: MEDIUM
- **Status**: PLANNING
- **Progress**: 5%
- **Team**: 3 members
- **Tasks**: 3 tasks (requirements, database design, mockup)

### 5. Dashboard Analytics
- **Priority**: LOW
- **Status**: COMPLETED
- **Progress**: 100%
- **Team**: 3 members
- **Tasks**: 4 tasks (all completed - charts, real-time, export, responsive)

## 🎯 Kịch Bản Test

### Test Case 1: Đa Người Dùng
1. Mở 2 trình duyệt/tabs
2. Tab 1: Đăng nhập `admin@gmail.com`
3. Tab 2 (Incognito): Đăng nhập `dev@gmail.com`
4. Admin tạo task mới và assign cho dev
5. Dev nhận notification và cập nhật task
6. Kiểm tra realtime updates

### Test Case 2: Permissions
1. Đăng nhập `viewer@gmail.com`
2. Thử tạo task → Không có button "Create Task"
3. Thử chỉnh sửa task → Không có quyền
4. Đăng nhập `lead@gmail.com`
5. Tạo task và phân công → Thành công

### Test Case 3: Notifications
1. Đăng nhập `member@gmail.com`
2. Check notification bell → Có 2 notifications
3. Click vào notification → Navigate đến task
4. Mark as read → Notification disappears

### Test Case 4: Collaboration
1. Đăng nhập `dev@gmail.com`
2. Vào task "Xây dựng API quản lý sản phẩm"
3. Thêm comment "API đã hoàn thành 80%"
4. Cập nhật status → IN_PROGRESS
5. Lead nhận notification về update

### Test Case 5: Activity Logs
1. Đăng nhập `admin@gmail.com`
2. Vào Dashboard/Activity
3. Xem tất cả hoạt động gần đây
4. Filter theo user/project
5. Export activity logs

## 🔔 Notifications Có Sẵn

Mỗi user đã có notifications sẵn để test:

- **admin@gmail.com**: 2 notifications (project update, task completed)
- **manager@gmail.com**: 1 notification (task updated)
- **lead@gmail.com**: 2 notifications (comment, task due soon)
- **member@gmail.com**: 2 notifications (task assigned x2)
- **dev@gmail.com**: 2 notifications (task assigned, comment)
- **designer@gmail.com**: 1 notification (added to project)
- **tester@gmail.com**: 1 notification (task assigned)
- **viewer@gmail.com**: 1 notification (added to workspace)

## 📊 Activity Logs Có Sẵn

13 activity logs bao gồm:
- Workspace created & member added
- Projects created & updated
- Tasks created, assigned, status changed, completed
- Comments added

## 🚀 Chạy Seed Data

```bash
cd backend
node seeds/seedData.js
```

Hoặc:

```bash
npm run seed
```

## ⚠️ Lưu Ý

1. **Password**: Tất cả tài khoản đều dùng password `123456`
2. **Clean Data**: Mỗi lần seed sẽ xóa dữ liệu cũ
3. **MongoDB**: Đảm bảo MongoDB đang chạy
4. **Environment**: Kiểm tra file `.env` đã cấu hình đúng

## 🎨 UI Testing Points

### Dashboard
- [ ] Hiển thị thống kê đúng
- [ ] Charts render chính xác
- [ ] Activity logs xuất hiện

### Projects Page
- [ ] List 5 projects
- [ ] Filter theo status/priority
- [ ] Progress bars hiển thị đúng

### Tasks Page
- [ ] Kanban board với 3 columns
- [ ] Drag & drop tasks
- [ ] Filter/search hoạt động

### Notifications
- [ ] Bell icon hiển thị số lượng
- [ ] Dropdown notifications
- [ ] Mark as read
- [ ] Click navigate đúng page

### Team Collaboration
- [ ] Members list hiển thị avatar
- [ ] Comments real-time
- [ ] @mention suggestions

## 📚 Tài Liệu Liên Quan

- [TESTING_PERMISSIONS.md](backend/TESTING_PERMISSIONS.md) - Chi tiết về permissions
- [PERMISSION_SYSTEM.md](backend/PERMISSION_SYSTEM.md) - Hệ thống phân quyền
- [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md) - Hệ thống thông báo
- [TESTING_ACCOUNTS.md](TESTING_ACCOUNTS.md) - Tài khoản test

## 💡 Tips

1. **Multi-Browser Testing**: Dùng Chrome + Firefox hoặc Chrome Profile khác nhau
2. **Incognito Mode**: Tốt nhất cho test multi-user
3. **Network Tab**: Kiểm tra API calls
4. **Redux DevTools**: Debug state management
5. **Console Logs**: Check errors và warnings

## 🐛 Known Issues to Test

- [ ] Task assignment với empty assigneeId
- [ ] Notification real-time updates
- [ ] Permission checks trên mọi routes
- [ ] File upload nếu có
- [ ] Date/time timezone handling
- [ ] Long text rendering
- [ ] Mobile responsive

---

**Chúc bạn test vui vẻ! 🎉**
