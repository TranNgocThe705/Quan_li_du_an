# Project Management Frontend

Frontend application cho hệ thống quản lý dự án, được xây dựng với React, Redux Toolkit, và Tailwind CSS.

## 🚀 Công Nghệ Sử Dụng

- **React 19.1.1** - UI library
- **Redux Toolkit 2.8.2** - State management
- **React Router DOM 7.8.1** - Routing
- **Tailwind CSS 4.1.12** - CSS framework
- **Vite 7.1.2** - Build tool
- **Recharts 3.1.2** - Charts library
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **React Hot Toast** - Notifications

## 📋 Yêu Cầu

- Node.js >= 16.x
- npm hoặc yarn

## ⚙️ Cài Đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình (nếu cần)

Tạo file `.env` nếu muốn custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Chạy development server

```bash
npm run dev
```

App sẽ chạy tại: http://localhost:5173

### 4. Build cho production

```bash
npm run build
```

Output sẽ ở trong thư mục `dist/`

### 5. Preview production build

```bash
npm run preview
```

## 📁 Cấu Trúc Project

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/            # Redux store
│   │   └── store.js
│   ├── assets/         # Images, dummy data
│   │   ├── assets.js
│   │   └── schema.prisma
│   ├── components/     # React components
│   │   ├── AddProjectMember.jsx
│   │   ├── CreateProjectDialog.jsx
│   │   ├── CreateTaskDialog.jsx
│   │   ├── InviteMemberDialog.jsx
│   │   ├── MyTasksSidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectAnalytics.jsx
│   │   ├── ProjectCalendar.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectOverview.jsx
│   │   ├── ProjectSettings.jsx
│   │   ├── ProjectsSidebar.jsx
│   │   ├── ProjectTasks.jsx
│   │   ├── RecentActivity.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── TasksSummary.jsx
│   │   └── WorkspaceDropdown.jsx
│   ├── features/       # Redux slices
│   │   ├── themeSlice.js
│   │   └── workspaceSlice.js
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Layout.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── Projects.jsx
│   │   ├── TaskDetails.jsx
│   │   └── Team.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 🎨 Features

### ✅ Đã Implement (UI Only - Dummy Data)

- **Dashboard** - Tổng quan workspace, projects, tasks
- **Projects Management** - Danh sách và chi tiết projects
- **Task Management** - Tạo, xem, cập nhật tasks
- **Team Management** - Quản lý members
- **Analytics** - Biểu đồ và thống kê
- **Calendar View** - Xem tasks theo lịch
- **Dark Mode** - Theme switching
- **Responsive Design** - Mobile-friendly

### 🔜 Cần Integrate với Backend

- [ ] Replace dummy data với API calls
- [ ] Add authentication (Login/Register)
- [ ] Connect Redux actions với API endpoints
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add form validation
- [ ] Real-time updates

## 🔗 API Integration (TODO)

Để kết nối với backend, bạn cần:

1. **Cài đặt axios:**
```bash
npm install axios
```

2. **Tạo API service:**
```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

3. **Update Redux slices** để call API thay vì dùng dummy data

## 🎯 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🐛 Troubleshooting

### Port already in use
```bash
# Thay đổi port trong package.json hoặc:
npm run dev -- --port 3000
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License

---

**Happy Coding! 🎉**
