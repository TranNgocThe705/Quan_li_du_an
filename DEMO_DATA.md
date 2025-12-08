# 🎯 Hệ Thống Quản Lý Dự Án - Demo Data

## 🏢 Công Ty TNHH Phần Mềm ABC

Dữ liệu demo cho công ty phát triển phần mềm với **5 dự án thực tế** và **8 thành viên** có các vai trò khác nhau.

---

## 👥 Tài Khoản (Password: `123456`)

| Email | Tên | Vai Trò | Mô Tả |
|-------|-----|---------|-------|
| **admin@gmail.com** | Nguyễn Văn Admin | System Admin + Owner | 🔐 Chủ workspace, truy cập trang Admin |
| **manager@gmail.com** | Trần Thị Manager | Admin | Quản lý workspace & projects |
| **lead@gmail.com** | Lê Văn Lead | Team Lead | Lead các dự án |
| **member@gmail.com** | Phạm Thị Member | Member | Frontend Developer |
| **dev@gmail.com** | Hoàng Văn Dev | Member | Backend Developer |
| **designer@gmail.com** | Võ Thị Designer | Member | UI/UX Designer |
| **tester@gmail.com** | Đặng Văn Tester | Member | QA Tester |
| **viewer@gmail.com** | Bùi Thị Viewer | Viewer | Stakeholder (chỉ xem) |

---

## 📁 Các Dự Án

### 1. Hệ Thống Quản Lý Bán Hàng (35% - HIGH)
**Lead:** lead@gmail.com | **Team:** 6 người  
Phát triển hệ thống quản lý bán hàng với quản lý kho, đơn hàng, khách hàng và báo cáo.

**Tasks:**
- ✅ Thiết kế database schema
- 🔄 Xây dựng API quản lý sản phẩm
- 🔄 Thiết kế giao diện dashboard
- 📝 Phát triển module đơn hàng
- 📝 Tích hợp thanh toán VNPay
- 🐛 Fix bug hiển thị tồn kho

### 2. App Di Động Đặt Đồ Ăn (25% - HIGH)
**Lead:** lead@gmail.com | **Team:** 5 người  
Ứng dụng mobile đặt đồ ăn với tracking realtime và thanh toán online.

**Tasks:**
- ✅ Setup React Native project
- ✅ Thiết kế UI/UX app
- 🔄 Xây dựng màn hình đăng nhập
- 🔄 Phát triển tìm kiếm nhà hàng
- 📝 Tích hợp Google Maps
- 📝 Setup push notification

### 3. Website Tin Tức (50% - MEDIUM)
**Lead:** manager@gmail.com | **Team:** 4 người  
Website tin tức với CMS quản lý nội dung và hệ thống comment.

**Tasks:**
- 🔄 Xây dựng CMS quản lý bài viết
- ✅ Thiết kế giao diện trang chủ
- 🔄 Implement hệ thống comment
- 📝 Tối ưu SEO
- 🔄 Viết nội dung mẫu

### 4. Hệ Thống Nhân Sự - HRM (5% - MEDIUM - Planning)
**Lead:** lead@gmail.com | **Team:** 3 người  
Phần mềm quản lý nhân sự: chấm công, tính lương, quản lý phép.

**Tasks:**
- 🔄 Phân tích yêu cầu hệ thống
- 📝 Thiết kế database cho chấm công
- 📝 Mockup giao diện quản lý nhân viên

### 5. Dashboard Analytics (100% - COMPLETED)
**Lead:** manager@gmail.com | **Team:** 3 người  
Dashboard báo cáo với charts và real-time monitoring.

**Tasks:**
- ✅ Tích hợp Chart.js
- ✅ Real-time data updates
- ✅ Export báo cáo PDF/Excel
- ✅ Responsive design cho mobile

---

## 🚀 Bắt Đầu

### 1. Tạo Dữ Liệu Demo
```bash
cd backend
node seeds/seedData.js
```

### 2. Chạy Ứng Dụng
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Login và Test

#### 🔐 Admin Panel
- **admin@gmail.com** / 123456 → Tự động redirect đến `/admin`
  - Dashboard với statistics
  - Quản lý tất cả users
  - Quản lý tất cả workspaces
  - View tất cả projects

#### 👥 Regular Users
- 🔵 **lead@gmail.com** - Test quyền Team Lead
- 🟢 **dev@gmail.com** - Test quyền Developer  
- 🟡 **designer@gmail.com** - Test quyền Designer
- ⚪ **viewer@gmail.com** - Test quyền Viewer (read-only)

---

## 📊 Thống Kê

- **Workspace:** 1 (Công Ty ABC)
- **Projects:** 5 (3 active, 1 planning, 1 completed)
- **Users:** 8 (2 admin, 5 members, 1 viewer)
- **Tasks:** 28 (7 done, 11 in-progress, 10 todo)
- **Comments:** 16

---

## 🎯 Test Phân Quyền

### Owner/Admin
✅ Quản lý workspace  
✅ Thêm/xóa members  
✅ Tạo/sửa/xóa projects

### Team Lead
✅ Quản lý project  
✅ Assign tasks  
✅ Thêm/xóa project members  
❌ Xóa project

### Member (Dev/Designer/Tester)
✅ Tạo tasks  
✅ Sửa tasks được assign  
✅ Comment  
❌ Sửa project settings  
❌ Xóa tasks

### Viewer
✅ Xem projects & tasks  
❌ Tạo/sửa bất cứ thứ gì

---

📖 **Chi tiết**: Xem `TESTING_ACCOUNTS.md` hoặc `backend/TESTING_PERMISSIONS.md`
