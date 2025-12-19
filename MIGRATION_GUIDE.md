# 🔄 MIGRATION GUIDE - Cấu Trúc Mới

## 📋 Tổng Quan Thay Đổi

Dự án đã được tổ chức lại hoàn toàn để cải thiện khả năng bảo trì và mở rộng.

---

## 🎯 BACKEND - Thay Đổi Import Paths

### ❌ CŨ → ✅ MỚI

#### Models
```javascript
// ❌ Cũ
import User from './models/User.js';
import Project from './models/Project.js';

// ✅ Mới - Import từ index
import { User, Project } from './src/models/index.js';

// ✅ Hoặc import tất cả
import models from './src/models/index.js';
const { User, Project } = models;
```

#### Controllers
```javascript
// ❌ Cũ
import { getUsers } from './controllers/userController.js';

// ✅ Mới
import { userController } from './src/controllers/index.js';
const { getUsers } = userController;
```

#### Middleware
```javascript
// ❌ Cũ
import { protect } from './middleware/auth.js';

// ✅ Mới
import { protect } from './src/middleware/index.js';
```

#### Utils
```javascript
// ❌ Cũ
import { successResponse } from './utils/apiResponse.js';

// ✅ Mới
import { successResponse } from './src/utils/index.js';
```

#### Routes
```javascript
// ❌ Cũ - Manually import all routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
// ... many more

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... many more

// ✅ Mới - Single import
import apiRoutes from './src/routes/index.js';
app.use('/api', apiRoutes);
```

### 📁 Entry Point Thay Đổi
```bash
# ❌ Cũ
npm run dev  # Chạy server.js (root)

# ✅ Mới
npm run dev  # Chạy src/server.js
```

### 📝 Scripts Mới
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node seeds/seedData.js",
    "db:check": "node scripts/database/check-task.js",
    "db:clear-notifications": "node scripts/database/clear-notifications.js"
  }
}
```

---

## 🎨 FRONTEND - Thay Đổi Import Paths

### ❌ CŨ → ✅ MỚI

#### API Services
```javascript
// ❌ Cũ - Import từ file api.js khổng lồ
import { authAPI, userAPI, projectAPI } from '../services/api.js';

// ✅ Mới - Import từ services riêng biệt
import { authAPI } from '../api/services/auth.service.js';
import { userAPI } from '../api/services/user.service.js';
import { projectAPI } from '../api/services/project.service.js';

// ✅ Hoặc import từ index
import { authAPI, userAPI, projectAPI } from '../api/index.js';
```

#### Components
```javascript
// ❌ Cũ
import ProjectCard from '../components/ProjectCard';
import CreateProjectDialog from '../components/CreateProjectDialog';

// ✅ Mới - Theo features
import ProjectCard from '../components/features/projects/ProjectCard';
import CreateProjectDialog from '../components/features/projects/CreateProjectDialog';
```

#### Layout Components
```javascript
// ❌ Cũ
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// ✅ Mới
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
```

#### Route Guards
```javascript
// ❌ Cũ
import ProtectedRoute from '../components/ProtectedRoute';

// ✅ Mới
import ProtectedRoute from '../components/guards/ProtectedRoute';
```

#### Pages
```javascript
// ❌ Cũ
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// ✅ Mới - Theo modules
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
```

#### Constants
```javascript
// ❌ Cũ - Hardcoded strings
const API_URL = 'http://localhost:5000/api';
navigate('/dashboard');

// ✅ Mới - Sử dụng constants
import { API_BASE_URL, ROUTES } from '../constants';
navigate(ROUTES.DASHBOARD);
```

#### Hooks
```javascript
// ❌ Cũ
import usePermissions from '../hooks/usePermissions';

// ✅ Mới - Import từ index
import { usePermissions } from '../hooks';
```

---

## 📂 CẤU TRÚC THƯ MỤC MỚI

### Backend
```
backend/
├── src/                          # ✨ MỚI - Source code wrapper
│   ├── config/
│   ├── controllers/
│   │   └── index.js             # ✨ Export tất cả controllers
│   ├── middleware/
│   │   └── index.js             # ✨ Export tất cả middleware
│   ├── models/
│   │   └── index.js             # ✨ Export tất cả models
│   ├── routes/
│   │   └── index.js             # ✨ Combine all routes
│   ├── services/
│   │   └── index.js
│   ├── utils/
│   │   └── index.js
│   ├── validators/              # ✨ MỚI
│   ├── app.js                   # ✨ MỚI - Express setup
│   └── server.js                # ✨ UPDATED - Server start
│
├── scripts/                      # ✨ MỚI - Utility scripts
│   ├── database/
│   │   ├── check-task.js
│   │   └── clear-notifications.js
│   └── test/
│       └── test-server.js
│
├── docs/                         # ✨ MỚI - Documentation
│   ├── features.md
│   ├── google-oauth-setup.md
│   └── ...
│
├── seeds/
├── package.json
└── README.md
```

### Frontend
```
frontend/src/
├── api/                          # ✨ MỚI - API layer
│   ├── services/                # ✨ API services tách riêng
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── project.service.js
│   │   └── ...
│   ├── client.js                # Axios instance
│   └── index.js                 # Export all
│
├── components/
│   ├── common/                  # ✨ MỚI - Shared components
│   ├── layout/                  # ✨ MỚI - Layout
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── features/                # ✨ MỚI - Feature components
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── workspaces/
│   │   ├── tasks/
│   │   ├── notifications/
│   │   ├── ai/
│   │   ├── permissions/
│   │   ├── dashboard/
│   │   └── admin/
│   └── guards/                  # ✨ MỚI - Route guards
│
├── pages/
│   ├── auth/                    # ✨ MỚI - Auth pages
│   ├── admin/                   # ✨ MỚI
│   ├── dashboard/               # ✨ MỚI
│   ├── projects/                # ✨ MỚI
│   ├── tasks/                   # ✨ MỚI
│   ├── team/                    # ✨ MỚI
│   ├── settings/                # ✨ MỚI
│   └── Layout.jsx
│
├── constants/                   # ✨ MỚI - Constants
│   ├── api.constants.js
│   ├── routes.constants.js
│   └── index.js
│
├── hooks/
│   └── index.js                # ✨ Export all hooks
│
├── features/                    # Redux slices (unchanged)
├── services/                    # ❌ DEPRECATED - Use api/ instead
└── ...
```

---

## 🚀 HƯỚNG DẪN MIGRATION

### Bước 1: Cập Nhật Backend Imports
Tìm và thay thế tất cả imports cũ trong backend:

```bash
# Trong terminal, chạy:
cd backend
grep -r "from './models/" src/
grep -r "from './controllers/" src/
grep -r "from './middleware/" src/
```

Sau đó cập nhật thành import từ index files.

### Bước 2: Cập Nhật Frontend Imports
Tìm và thay thế imports trong frontend:

```bash
cd frontend/src
# Tìm các import cũ
grep -r "from '../services/api'" .
grep -r "from '../components/" .
```

### Bước 3: Chạy Lại Servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Bước 4: Kiểm Tra Errors
- Mở browser console
- Kiểm tra network tab
- Test các tính năng chính

---

## 🔧 TROUBLESHOOTING

### Lỗi "Cannot find module"
```bash
# Kiểm tra path đã đúng chưa
# ❌ Sai
import User from './models/User.js';

# ✅ Đúng
import { User } from './src/models/index.js';
```

### Lỗi "Default export not found"
```bash
# Một số module export named, không phải default
# ❌ Sai
import successResponse from './utils/apiResponse.js';

# ✅ Đúng
import { successResponse } from './src/utils/index.js';
```

---

## 📚 BEST PRACTICES

1. **Luôn import từ index files** khi có thể
2. **Sử dụng constants** thay vì hardcode strings
3. **Tổ chức components theo features**, không phải theo type
4. **Tách API services** ra các file riêng
5. **Sử dụng absolute imports** trong React (setup jsconfig.json)

---

## 💡 LỢI ÍCH CỦA CẤU TRÚC MỚI

✅ **Dễ tìm kiếm**: Components được nhóm theo chức năng
✅ **Dễ bảo trì**: Mỗi module độc lập
✅ **Dễ mở rộng**: Thêm features mới không ảnh hưởng cũ
✅ **Dễ test**: Mỗi module có thể test riêng
✅ **Dễ onboard**: Dev mới dễ hiểu structure
✅ **Giảm conflicts**: Ít merge conflicts khi team làm việc

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề khi migration, kiểm tra:
1. File đã được di chuyển đúng chưa
2. Import paths đã cập nhật chưa
3. Index files đã export đúng chưa
4. Server đã restart chưa

**Created:** December 19, 2025
**Version:** 2.0.0
