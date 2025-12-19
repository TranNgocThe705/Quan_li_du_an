# 📁 CẤU TRÚC DỰ ÁN MỚI - V2.0

## 🎯 Tổng Quan

Dự án đã được **tổ chức lại hoàn toàn** với cấu trúc chuẩn, dễ bảo trì và mở rộng.

---

## 📂 Cấu Trúc Root Directory

```
project-management/
├── backend/              # Node.js + Express API
├── frontend/             # React + Vite Application
├── docs/                 # 📚 Documentation (MỚI)
│   ├── features/         # Feature specifications
│   ├── guides/           # User guides & tutorials
│   └── reports/          # Project reports
├── scripts/              # 🔧 Utility Scripts (MỚI)
│   ├── database/         # Database utilities
│   └── test/             # Test scripts
├── MIGRATION_GUIDE.md    # 🔄 Migration guide
├── STRUCTURE.md          # 📋 This file
└── README.md             # Main readme
```

---

## 🔧 Backend Structure

```
backend/
├── src/                          # 🆕 Source code
│   ├── config/                   # Configuration files
│   │   ├── constants.js
│   │   ├── database.js
│   │   ├── gemini.js
│   │   ├── nodemailer.js
│   │   └── passport.js
│   │
│   ├── controllers/              # Request handlers
│   │   ├── admin.controller.js
│   │   ├── ai.controller.js
│   │   ├── auth.controller.js
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── notification.controller.js
│   │   ├── permission.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   ├── user.controller.js
│   │   ├── workspace.controller.js
│   │   └── index.js              # 🆕 Central export
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error-handler.middleware.js
│   │   ├── permission.middleware.js
│   │   ├── validation.middleware.js
│   │   └── index.js              # 🆕 Central export
│   │
│   ├── models/                   # MongoDB schemas
│   │   ├── ActivityLog.model.js
│   │   ├── Comment.model.js
│   │   ├── Notification.model.js
│   │   ├── Project.model.js
│   │   ├── ProjectMember.model.js
│   │   ├── Task.model.js
│   │   ├── User.model.js
│   │   ├── Workspace.model.js
│   │   ├── WorkspaceMember.model.js
│   │   └── index.js              # 🆕 Central export
│   │
│   ├── routes/                   # API routes
│   │   ├── admin.routes.js
│   │   ├── ai.routes.js
│   │   ├── auth.routes.js
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── notification.routes.js
│   │   ├── permission.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── user.routes.js
│   │   ├── workspace.routes.js
│   │   └── index.js              # 🆕 Combined routes
│   │
│   ├── services/                 # Business logic
│   │   ├── ai.service.js
│   │   └── index.js
│   │
│   ├── utils/                    # Helper functions
│   │   ├── api-response.util.js
│   │   ├── async-handler.util.js
│   │   ├── event-emitter.util.js
│   │   ├── export.util.js
│   │   ├── generate-token.util.js
│   │   ├── notification-helper.util.js
│   │   └── index.js              # 🆕 Central export
│   │
│   ├── validators/               # 🆕 Input validation
│   │   └── index.js
│   │
│   ├── app.js                    # 🆕 Express app setup
│   └── server.js                 # 🔄 Server entry point
│
├── docs/                         # 🆕 Backend documentation
├── seeds/                        # Database seeders
├── tests/                        # 🆕 Unit & Integration tests
├── .env
├── .env.example
├── package.json
└── README.md
```

### ✨ Backend Highlights

- **🔹 src/ wrapper**: Tất cả source code trong một folder
- **🔹 index.js exports**: Mỗi module có central export point
- **🔹 app.js + server.js**: Tách Express setup và server start
- **🔹 Naming convention**: `*.controller.js`, `*.service.js`, `*.middleware.js`

---

## 🎨 Frontend Structure

```
frontend/src/
├── api/                          # 🆕 API Layer
│   ├── services/                 # API services (tách riêng)
│   │   ├── admin.service.js
│   │   ├── ai.service.js
│   │   ├── auth.service.js
│   │   ├── comment.service.js
│   │   ├── dashboard.service.js
│   │   ├── notification.service.js
│   │   ├── permission.service.js
│   │   ├── project.service.js
│   │   ├── task.service.js
│   │   ├── user.service.js
│   │   └── workspace.service.js
│   ├── client.js                 # Axios instance
│   └── index.js                  # 🆕 Central export
│
├── components/
│   ├── common/                   # 🆕 Shared components
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   │
│   ├── layout/                   # 🆕 Layout components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProjectsSidebar.jsx
│   │   └── MyTasksSidebar.jsx
│   │
│   ├── features/                 # 🆕 Feature-based components
│   │   ├── auth/
│   │   ├── projects/
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectActions.jsx
│   │   │   ├── ProjectAnalytics.jsx
│   │   │   ├── ProjectCalendar.jsx
│   │   │   ├── ProjectOverview.jsx
│   │   │   ├── ProjectSettings.jsx
│   │   │   ├── ProjectTasks.jsx
│   │   │   ├── CreateProjectDialog.jsx
│   │   │   └── AddProjectMember.jsx
│   │   ├── workspaces/
│   │   │   ├── WorkspaceDropdown.jsx
│   │   │   ├── WorkspaceActions.jsx
│   │   │   ├── CreateWorkspaceDialog.jsx
│   │   │   └── InviteMemberDialog.jsx
│   │   ├── tasks/
│   │   │   ├── CreateTaskDialog.jsx
│   │   │   └── TasksSummary.jsx
│   │   ├── notifications/
│   │   │   └── NotificationBell.jsx
│   │   ├── ai/
│   │   │   ├── AIChatWidget.jsx
│   │   │   └── AIProjectInsights.jsx
│   │   ├── permissions/
│   │   │   ├── PermissionInfo.jsx
│   │   │   ├── PermissionTooltip.jsx
│   │   │   └── RoleBadge.jsx
│   │   ├── dashboard/
│   │   │   ├── StatsGrid.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   └── charts/
│   │   └── admin/
│   │       └── EditUserModal.jsx
│   │
│   └── guards/                   # 🆕 Route protection
│       ├── ProtectedRoute.jsx
│       └── ProtectedAdminRoute.jsx
│
├── pages/                        # 🆕 Organized by modules
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── GoogleAuthCallback.jsx
│   ├── admin/
│   │   └── AdminDashboard.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── projects/
│   │   ├── Projects.jsx
│   │   └── ProjectDetails.jsx
│   ├── tasks/
│   │   └── TaskDetails.jsx
│   ├── team/
│   │   └── Team.jsx
│   ├── settings/
│   │   ├── Settings.jsx
│   │   ├── Profile.jsx
│   │   └── PermissionGuide.jsx
│   └── Layout.jsx
│
├── features/                     # Redux slices
│   ├── adminSlice.js
│   ├── authSlice.js
│   ├── notificationSlice.js
│   ├── permissionSlice.js
│   ├── projectSlice.js
│   ├── taskSlice.js
│   ├── themeSlice.js
│   └── workspaceSlice.js
│
├── hooks/                        # Custom React hooks
│   ├── usePermissions.js
│   └── index.js                  # 🆕 Central export
│
├── constants/                    # 🆕 App constants
│   ├── api.constants.js
│   ├── routes.constants.js
│   └── index.js
│
├── utils/                        # Utility functions
│   ├── exportUtils.js
│   └── index.js                  # 🆕 Central export
│
├── i18n/                         # Internationalization
├── app/                          # Redux store
├── assets/                       # Static assets
├── App.jsx
├── main.jsx
└── index.css
```

### ✨ Frontend Highlights

- **🔹 api/ folder**: Tách riêng API services, dễ maintain
- **🔹 Feature-based components**: Nhóm theo chức năng, không phải type
- **🔹 Module-based pages**: Pages được nhóm theo features
- **🔹 constants/**: Tập trung các hằng số (routes, API endpoints)
- **🔹 guards/**: Route protection components

---

## 📚 Documentation Structure

```
docs/
├── features/                     # Feature docs
│   ├── ai-integration.md
│   ├── notification-system.md
│   └── permission-system.md
│
├── guides/                       # How-to guides
│   ├── demo-guide.md
│   ├── testing-plan.md
│   ├── testing-accounts.md
│   ├── demo-data.md
│   └── seed-data-summary.md
│
├── reports/                      # Project reports
│   ├── graduation-report.md
│   ├── codebase-review.md
│   ├── system-flow-analysis.md
│   └── baocao.md
│
└── CHANGELOG.md                  # Version history
```

---

## 🛠️ Scripts Structure

```
scripts/
├── database/                     # Database utilities
│   ├── check-task.js            # Check task data
│   └── clear-notifications.js   # Clear old notifications
│
└── test/                         # Test utilities
    └── test-server.js           # Server testing
```

### 📝 NPM Scripts

```bash
# Backend
npm run dev                       # Start dev server (src/server.js)
npm run start                     # Start production server
npm run seed                      # Seed database
npm run db:check                  # Run check-task script
npm run db:clear-notifications    # Clear notifications

# Frontend
npm run dev                       # Start Vite dev server
npm run build                     # Build for production
npm run preview                   # Preview production build
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd project-management

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Setup
```bash
# Backend
cp backend/.env.example backend/.env
# Edit .env with your config

# Frontend
cp frontend/.env.example frontend/.env
# Edit .env with your config
```

### 3. Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📖 Import Examples

### Backend
```javascript
// Models
import { User, Project, Task } from './src/models/index.js';

// Controllers
import { userController } from './src/controllers/index.js';

// Middleware
import { protect, checkPermission } from './src/middleware/index.js';

// Utils
import { successResponse, asyncHandler } from './src/utils/index.js';

// Routes (in app.js)
import apiRoutes from './src/routes/index.js';
app.use('/api', apiRoutes);
```

### Frontend
```javascript
// API Services
import { authAPI, projectAPI, taskAPI } from '../api/index.js';

// Components
import ProjectCard from '../components/features/projects/ProjectCard';
import Navbar from '../components/layout/Navbar';
import ProtectedRoute from '../components/guards/ProtectedRoute';

// Pages
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';

// Constants
import { ROUTES, API_ENDPOINTS } from '../constants';

// Hooks
import { usePermissions } from '../hooks';
```

---

## ✅ Lợi Ích Cấu Trúc Mới

1. **📁 Tổ chức tốt hơn**: Components và files được nhóm theo chức năng
2. **🔍 Dễ tìm kiếm**: Biết chính xác file ở đâu
3. **🚀 Dễ mở rộng**: Thêm features mới không ảnh hưởng cũ
4. **🛠️ Dễ bảo trì**: Mỗi module độc lập, dễ sửa
5. **👥 Onboarding nhanh**: Dev mới dễ hiểu cấu trúc
6. **🧪 Dễ test**: Có thể test từng module riêng
7. **⚡ Import sạch**: Central exports, không còn import dài

---

## 🔄 Migration

Xem chi tiết trong [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 📞 Support

- **Documentation**: `docs/`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

---

**Version:** 2.0.0  
**Updated:** December 19, 2025  
**Status:** ✅ Production Ready
