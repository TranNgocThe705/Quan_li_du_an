# Admin Dashboard - Redesign

## Tổng quan

Trang admin đã được thiết kế lại với giao diện hiện đại, bao gồm:

### 🎨 Thiết kế mới

- **Sidebar Navigation**: Menu điều hướng ở bên trái với các mục rõ ràng
- **Modern Header**: Header với search bar, language selector, theme toggle, notifications và user menu
- **Separated Pages**: Các chức năng được tách thành các trang riêng biệt để tránh scroll quá dài
- **Responsive Design**: Hoàn toàn responsive, hỗ trợ mobile với sidebar có thể ẩn/hiện

### 📁 Cấu trúc mới

```
frontend/src/
├── components/
│   └── admin/
│       ├── AdminSidebar.jsx       # Sidebar navigation
│       ├── AdminHeader.jsx        # Header với search, notifications, user menu
│       └── AdminLayout.jsx        # Layout chính cho admin pages
│
└── pages/
    └── admin/
        ├── AdminDashboardOverview.jsx  # Trang tổng quan với charts
        ├── AdminUsersPage.jsx          # Quản lý người dùng
        ├── AdminWorkspacesPage.jsx     # Quản lý workspaces
        └── AdminProjectsPage.jsx       # Quản lý dự án
```

### 🚀 Tính năng

#### 1. **Dashboard Overview** (`/admin`)
- Stats cards với metrics chính (Users, Workspaces, Projects, Tasks)
- Biểu đồ tăng trưởng người dùng
- Biểu đồ phân bố dự án theo trạng thái
- Biểu đồ tasks theo trạng thái
- Biểu đồ dự án theo độ ưu tiên
- Xu hướng tasks

#### 2. **Users Management** (`/admin/users`)
- Danh sách tất cả người dùng
- Search và filter theo trạng thái
- Stats cards (Total, Active, Admins, New this month)
- CRUD operations: Edit, Delete
- Bulk selection
- Export functionality

#### 3. **Workspaces Management** (`/admin/workspaces`)
- Danh sách tất cả workspaces
- Search functionality
- Stats cards (Total Workspaces, Members, Projects, New this month)
- Transfer ownership
- Delete workspace
- View workspace details

#### 4. **Projects Management** (`/admin/projects`)
- Danh sách tất cả dự án
- Search và filter theo trạng thái
- Stats cards (Total, Active, Completed, On Hold)
- Status badges với màu sắc phân biệt
- Priority indicators
- Delete projects

### 🎯 Navigation Menu

- **Dashboard**: Tổng quan hệ thống
- **Users**: Quản lý người dùng
- **Workspaces**: Quản lý workspaces
- **Projects**: Quản lý dự án
- **Tasks**: Quản lý công việc (placeholder)
- **Reports**: Báo cáo (placeholder)
- **Activity Log**: Nhật ký hoạt động (placeholder)
- **Settings**: Cài đặt hệ thống (placeholder)

### 🛠️ Component Details

#### AdminSidebar
- Collapsible sidebar
- Active route highlighting
- Icon-based navigation
- Logout button
- Logo và branding

#### AdminHeader
- Global search bar
- Language selector (EN/VI)
- Theme toggle (Dark/Light mode)
- Notifications bell với badge
- User dropdown menu với profile và settings

#### AdminLayout
- Desktop sidebar (có thể collapse)
- Mobile sidebar (slide-in overlay)
- Main content area với max-width container
- Responsive padding và spacing

### 🎨 Design System

#### Colors
- **Blue/Purple Gradient**: Primary actions và active states
- **Status Colors**:
  - Green: Active, Completed, Success
  - Blue: In Progress, Active Projects
  - Yellow: Planning, Warning
  - Orange: On Hold, Medium Priority
  - Red: Inactive, Cancelled, High Priority
  - Purple: Admin roles

#### Cards
- White background với border subtle
- Hover effects
- Shadow on hover
- Rounded corners (lg = 0.5rem)

#### Tables
- Sticky header
- Hover row highlight
- Alternating row colors (subtle)
- Action buttons với icon tooltips

### 📱 Responsive Breakpoints

- **Mobile**: < 768px (sidebar hidden, hamburger menu)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (full sidebar visible)

### 🌐 Internationalization

Tất cả text đều sử dụng i18n với keys trong:
- `admin.dashboard`
- `admin.users`
- `admin.workspaces`
- `admin.projects`
- etc.

### 🔐 Access Control

- Chỉ system admins (`isSystemAdmin: true`) mới có quyền truy cập
- ProtectedAdminRoute wrapper
- Redirect về home page nếu không có quyền

### 📊 Charts Integration

Sử dụng các component charts có sẵn:
- `PieChart`: Phân bố theo categories
- `LineChart`: Trends theo thời gian
- `BarChart`: So sánh giữa các nhóm
- `AreaChart`: Xu hướng với area fill

### 🚧 Future Enhancements

- **Tasks Page**: Quản lý tất cả tasks
- **Reports Page**: Tạo và xem báo cáo tùy chỉnh
- **Activity Log**: Theo dõi hoạt động người dùng
- **Settings Page**: Cấu hình hệ thống
- **Advanced Filters**: Multi-select filters, date ranges
- **Bulk Actions**: Delete, export, assign multiple items
- **Real-time Updates**: Socket.io integration
- **Advanced Analytics**: More detailed charts và metrics

### 💡 Usage

1. **Truy cập**: Đăng nhập với tài khoản system admin
2. **Navigation**: Sử dụng sidebar để chuyển giữa các trang
3. **Search**: Tìm kiếm users, workspaces, projects
4. **Actions**: Click vào icons để edit, delete, hoặc xem chi tiết
5. **Export**: Download reports dưới dạng PDF hoặc Excel

### 🔧 Maintenance

Để thêm trang mới:

1. Tạo component trong `pages/admin/`
2. Thêm route trong `App.jsx`
3. Thêm menu item trong `AdminSidebar.jsx`
4. Thêm translations trong `i18n/locales/`

### 📝 Notes

- Tất cả các trang đều responsive
- Dark mode được hỗ trợ đầy đủ
- Animations mượt mà với Tailwind transitions
- Loading states cho tất cả API calls
- Error handling với toast notifications
