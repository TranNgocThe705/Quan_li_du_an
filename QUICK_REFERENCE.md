# 🚀 QUICK REFERENCE CARD

## 📂 Tìm File Nhanh

### Backend
```bash
Controllers:    backend/src/controllers/
Models:         backend/src/models/
Routes:         backend/src/routes/
Middleware:     backend/src/middleware/
Services:       backend/src/services/
Utils:          backend/src/utils/
Config:         backend/src/config/
Entry Point:    backend/src/server.js
```

### Frontend
```bash
API Services:   frontend/src/api/services/
Components:     frontend/src/components/features/
Pages:          frontend/src/pages/
Redux:          frontend/src/features/
Constants:      frontend/src/constants/
Hooks:          frontend/src/hooks/
Utils:          frontend/src/utils/
```

---

## 💡 Import Nhanh

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

// Routes
import apiRoutes from './src/routes/index.js';
```

### Frontend
```javascript
// API Services
import { authAPI, projectAPI, taskAPI } from '../api/index.js';

// Components
import ProjectCard from '../components/features/projects/ProjectCard';
import Navbar from '../components/layout/Navbar';

// Pages
import Dashboard from '../pages/dashboard/Dashboard';

// Constants
import { ROUTES, API_ENDPOINTS } from '../constants';

// Hooks
import { usePermissions } from '../hooks';
```

---

## 🔧 Commands

### Development
```bash
# Backend
cd backend
npm run dev              # Start dev server
npm run seed             # Seed database

# Frontend
cd frontend
npm run dev              # Start Vite
npm run build            # Build for prod
```

### Database Scripts
```bash
npm run db:check                    # Check data
npm run db:clear-notifications      # Clear notifications
```

---

## 📁 Folder Cheat Sheet

| What                  | Backend                      | Frontend                           |
|-----------------------|------------------------------|------------------------------------|
| API Calls             | `src/routes/`                | `src/api/services/`                |
| Business Logic        | `src/controllers/`           | `src/features/` (Redux)            |
| Data Models           | `src/models/`                | Redux state                        |
| Reusable Components   | N/A                          | `src/components/features/`         |
| Pages/Screens         | N/A                          | `src/pages/`                       |
| Authentication        | `src/middleware/auth.js`     | `src/components/guards/`           |
| Configuration         | `src/config/`                | `src/constants/`                   |
| Utilities             | `src/utils/`                 | `src/utils/`                       |

---

## 🎯 Common Tasks

### Add New Feature
**Backend:**
1. Create controller in `src/controllers/`
2. Create model in `src/models/` (if needed)
3. Create route in `src/routes/`
4. Add to `index.js` exports

**Frontend:**
1. Create component in `src/components/features/[feature]/`
2. Create page in `src/pages/[module]/` (if needed)
3. Create service in `src/api/services/` (if needed)
4. Add to Redux in `src/features/` (if needed)

### Add New API Endpoint
**Backend:**
1. Add controller function
2. Add route
3. Test with Postman

**Frontend:**
1. Add service function in `src/api/services/`
2. Use in component/Redux

---

## 📖 Documentation Quick Links

| Document                  | Purpose                           |
|---------------------------|-----------------------------------|
| `README.md`               | Project overview                  |
| `STRUCTURE.md`            | Complete structure guide          |
| `MIGRATION_GUIDE.md`      | How to migrate code               |
| `REFACTORING_SUMMARY.md`  | What changed                      |
| `TREE.md`                 | Visual tree structure             |
| `CHECKLIST.md`            | Post-refactor tasks               |

---

## 🔍 Search Commands

```bash
# Find files
find . -name "*.controller.js"
find . -name "*.service.js"

# Search in files
grep -r "authAPI" frontend/src/
grep -r "import { User }" backend/src/
```

---

## ⚡ Keyboard Shortcuts (VS Code)

| Shortcut          | Action                    |
|-------------------|---------------------------|
| `Ctrl + P`        | Quick file open           |
| `Ctrl + Shift + F`| Search in all files       |
| `Ctrl + Click`    | Go to definition          |
| `F12`             | Go to definition          |
| `Ctrl + B`        | Toggle sidebar            |

---

## 🐛 Common Issues

### "Cannot find module"
- Check import path
- Check file location
- Restart dev server

### API not working
- Check backend server running
- Check API_URL in .env
- Check CORS settings

### Component not found
- Check component path
- Check export/import
- Check file moved correctly

---

## 📞 Get Help

1. Check documentation files
2. Check `CHECKLIST.md`
3. Check `MIGRATION_GUIDE.md`
4. Search in codebase
5. Ask team

---

**Print this & keep handy! 📄✨**

Version 2.0.0 | December 19, 2025
