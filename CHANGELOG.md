# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-11-16

### Added - Backend

#### Admin System
- ✅ System-wide admin dashboard with user/workspace management
- ✅ Three-tier system role hierarchy (SUPER_ADMIN, ADMIN, USER)
- ✅ Complete user management (view, filter, role change, activate/deactivate, delete)
- ✅ System statistics endpoint with real-time metrics
- ✅ Activity logs tracking for system-wide events
- ✅ 14 fine-grained permissions mapped to roles

#### Project Management
- ✅ Three-tier project role system (OWNER, ADMIN, MEMBER)
- ✅ Project member role management endpoints
- ✅ Project ownership transfer functionality
- ✅ Project-level permission checks in middleware

#### Workspace Features
- ✅ Workspace ownership transfer
- ✅ Workspace statistics endpoint (members, projects, tasks)
- ✅ Enhanced member management with role updates

#### Task Management
- ✅ Bulk task operations (bulk update status, bulk delete)
- ✅ Overdue tasks tracking endpoint
- ✅ Task statistics per project (completion rate, by status/priority/type)
- ✅ Event-driven task assignment notifications
- ✅ Task completion event tracking

#### User Management
- ✅ Advanced user search with regex (name/email)
- ✅ User activity tracking (workspaces, projects, tasks, comments)
- ✅ User profile management endpoints
- ✅ isActive field for user activation/deactivation

#### Security & Middleware
- ✅ `isSuperAdmin` middleware - SUPER_ADMIN only access
- ✅ `isSystemAdmin` middleware - SUPER_ADMIN or ADMIN access
- ✅ `isProjectOwner` middleware - Project ownership verification
- ✅ `isProjectAdmin` middleware - Project admin/owner verification
- ✅ `hasPermission(permission)` middleware - Fine-grained permission checks

#### Infrastructure
- ✅ Event emitter system for application events
- ✅ Task assignment event handling
- ✅ Task completion event handling
- ✅ Member addition event tracking
- ✅ Comment creation event tracking

#### API Routes Added
```
Admin Routes:
- GET    /api/admin/users
- GET    /api/admin/users/:id
- PUT    /api/admin/users/:id/role
- PUT    /api/admin/users/:id/status
- DELETE /api/admin/users/:id
- GET    /api/admin/workspaces
- GET    /api/admin/stats
- GET    /api/admin/logs

User Routes:
- GET    /api/users/search
- GET    /api/users/:id/activity

Workspace Routes:
- PUT    /api/workspaces/:id/transfer
- GET    /api/workspaces/:id/stats

Project Routes:
- PUT    /api/projects/:id/members/:memberId/role
- PUT    /api/projects/:projectId/transfer

Task Routes:
- GET    /api/tasks/overdue
- GET    /api/tasks/stats/:projectId
- PUT    /api/tasks/bulk-update-status
- DELETE /api/tasks/bulk-delete
```

### Added - Frontend

#### Admin Dashboard
- ✅ Complete admin panel with 4 tabs (Stats, Users, Workspaces, Logs)
- ✅ System statistics dashboard with real-time metrics
- ✅ User management interface with:
  - Advanced filters (role, status, search)
  - Role change modal (SUPER_ADMIN only)
  - User activation/deactivation
  - User deletion (SUPER_ADMIN only)
  - Pagination support
- ✅ Workspace overview with member/project counts
- ✅ Activity logs with event type indicators

#### State Management
- ✅ Admin Redux slice with 8 async thunks
- ✅ Separate loading states for each admin section
- ✅ Pagination state management for users/workspaces/logs

#### Components
- ✅ `ProtectedAdminRoute` - Role-based route protection
- ✅ Admin navigation menu item (conditional rendering)
- ✅ Role change modal with role selection
- ✅ User status toggle buttons

#### Internationalization
- ✅ 30+ admin-related translations (English)
- ✅ 30+ admin-related translations (Vietnamese)
- ✅ Sidebar "Admin" menu translation

#### Routing
- ✅ `/admin` route with admin-only access
- ✅ Integration with existing protected routes

### Changed - Backend

#### Models
- 📝 `User.js`: Added `systemRole` (enum), `isActive` (boolean)
- 📝 `ProjectMember.js`: Added `role` (enum: OWNER/ADMIN/MEMBER)
- 📝 Seed data: Assigned system roles to test users

#### Controllers
- 📝 `projectController.js`: Added role validation, ownership transfer
- 📝 `workspaceController.js`: Added stats, transfer ownership
- 📝 `taskController.js`: Added bulk operations, events, stats
- 📝 `userController.js`: Added search, activity tracking

#### Constants
- 📝 Added `SystemRole` enum (3 levels)
- 📝 Added `ProjectRole` enum (3 levels)
- 📝 Added `Permission` enum (14 permissions)
- 📝 Added `RolePermissions` mapping object

### Changed - Frontend

#### Store
- 📝 Added `adminReducer` to Redux store

#### App Routing
- 📝 Integrated `ProtectedAdminRoute` wrapper
- 📝 Added admin route to main App routing

### Security Improvements
- 🔒 All admin routes protected by system role middleware
- 🔒 Project operations validated against project roles
- 🔒 Workspace operations validated against workspace roles
- 🔒 User can't change own role or status
- 🔒 Only workspace owner can delete workspace
- 🔒 Only project owner can transfer ownership

### Documentation
- 📚 Updated README with:
  - Complete API endpoint documentation
  - Permission system explanation
  - Role hierarchy details
  - Test account information
  - Deployment notes
- 📚 Added CHANGELOG.md
- 📚 Documented new features and enhancements

## [1.0.0] - 2025-11-15

### Initial Release
- ✅ Basic workspace management
- ✅ Project creation and tracking
- ✅ Task assignment and management
- ✅ User authentication with JWT
- ✅ Comment system
- ✅ Dashboard with analytics
- ✅ Multi-language support (EN/VI)

---

## Upcoming Features (Roadmap)

### v2.1.0 (Planned)
- [ ] Email notifications via Nodemailer
- [ ] Push notifications
- [ ] File attachments for tasks
- [ ] Task time tracking
- [ ] Gantt chart view
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF/Excel)

### v2.2.0 (Planned)
- [ ] Real-time collaboration (WebSockets)
- [ ] Task comments threading
- [ ] @mentions in comments
- [ ] Task dependencies
- [ ] Custom fields
- [ ] Workflow automation
- [ ] Integration with third-party tools (Slack, etc.)

### v3.0.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Advanced search with filters
- [ ] Custom dashboards
- [ ] API rate limiting
- [ ] Audit logs
- [ ] Two-factor authentication (2FA)
