# 🎯 HƯỚNG DẪN DEMO & TÀI KHOẢN TEST

## 📊 SƠ ĐỒ DỰ ÁN

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   CÔNG TY TNHH PHẦN MỀM ABC                              │
│                   (Workspace: abc-software)                               │
├─────────────────────────────────────────────────────────────────────────┤
│  👥 8 MEMBERS:                                                           │
│  • Nguyễn Văn Admin (ADMIN/Owner)                                       │
│  • Trần Thị Manager (ADMIN)                                             │
│  • Lê Văn Lead (MEMBER - Team Lead ở project)                           │
│  • Phạm Thị Member (MEMBER - Frontend Dev)                              │
│  • Hoàng Văn Dev (MEMBER - Backend Dev)                                 │
│  • Võ Thị Designer (MEMBER - Designer)                                  │
│  • Đặng Văn Tester (MEMBER - QA)                                        │
│  • Bùi Thị Viewer (MEMBER - Stakeholder)                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌──────────────────┐
│ PROJECT 1         │    │ PROJECT 2         │    │ PROJECT 3        │
│ Quản Lý Bán Hàng  │    │ App Đặt Đồ Ăn     │    │ Website Tin Tức  │
├───────────────────┤    ├───────────────────┤    ├──────────────────┤
│ Status: ACTIVE    │    │ Status: ACTIVE    │    │ Status: ACTIVE   │
│ Priority: HIGH    │    │ Priority: HIGH    │    │ Priority: MEDIUM │
│ Progress: 35%     │    │ Progress: 25%     │    │ Progress: 50%    │
│ Team: 6 members   │    │ Team: 5 members   │    │ Team: 4 members  │
│                   │    │                   │    │                  │
│ 📋 Tasks:         │    │ 📋 Tasks:         │    │ 📋 Tasks:        │
│ • 15 tasks total  │    │ • 12 tasks total  │    │ • 10 tasks total │
│ • 3 Done          │    │ • 2 Done          │    │ • 5 Done         │
│ • 5 In Progress   │    │ • 4 In Progress   │    │ • 3 In Progress  │
│ • 7 To Do         │    │ • 6 To Do         │    │ • 2 To Do        │
└───────────────────┘    └───────────────────┘    └──────────────────┘

        ┌───────────────────────────┐
        │ PROJECT 4                 │
        │ Hệ Thống Nhân Sự         │
        ├───────────────────────────┤
        │ Status: PLANNING          │
        │ Priority: MEDIUM          │
        │ Progress: 5%              │
        │ Team: 3 members           │
        │                           │
        │ 📋 Tasks: 8 tasks         │
        │ • 0 Done                  │
        │ • 2 In Progress           │
        │ • 6 To Do                 │
        └───────────────────────────┘

        ┌───────────────────────────┐
        │ PROJECT 5                 │
        │ Dashboard Analytics       │
        ├───────────────────────────┤
        │ Status: COMPLETED ✅      │
        │ Priority: LOW             │
        │ Progress: 100%            │
        │ Team: 3 members           │
        │                           │
        │ 📋 Tasks: 8 tasks         │
        │ • 8 Done ✅               │
        └───────────────────────────┘
```

---

## 🔑 TÀI KHOẢN TEST (8 Accounts)

### 1. 👨‍💼 SYSTEM ADMIN (Quản trị hệ thống)
```
📧 Email: admin@gmail.com
🔒 Password: 123456
🎭 Role: System Admin
💼 Position: CEO/Quản trị viên hệ thống

✅ Quyền:
- Truy cập trang Admin Dashboard (/admin)
- Xem tất cả users, workspaces, projects
- Quản lý users (edit, delete, change role)
- Xem activity logs toàn hệ thống
- Export system reports
- Owner của workspace "Công Ty ABC"
- ADMIN trong workspace

🎯 Test Cases:
1. Login → Redirect về /admin (không phải Dashboard)
2. Xem thống kê toàn hệ thống
3. Quản lý users (edit, delete)
4. Xem activity logs
5. Export reports
6. Switch về user mode → vào workspace
```

---

### 2. 👩‍💼 MANAGER (Quản lý dự án)
```
📧 Email: manager@gmail.com
🔒 Password: 123456
🎭 Role: Workspace ADMIN + Project Manager
💼 Position: Quản lý dự án

✅ Quyền:
- ADMIN trong workspace (có thể invite/remove members)
- Team Lead của Project 3 (Website Tin Tức)
- Team Lead của Project 5 (Dashboard Analytics)
- Quản lý đầy đủ 2 projects này
- Tham gia Project 1 và 2 như member

🎯 Test Cases:
1. Invite members vào workspace
2. Tạo project mới
3. Quản lý Project 3: add/remove members, update settings
4. Xem Project 5 đã completed
5. Update tasks trong Project 3
6. Xem dashboard analytics
```

---

### 3. 👨‍💻 TEAM LEAD (Trưởng nhóm)
```
📧 Email: lead@gmail.com
🔒 Password: 123456
🎭 Role: Workspace MEMBER + Team Lead
💼 Position: Tech Lead

✅ Quyền:
- MEMBER trong workspace (không invite được)
- Team Lead của Project 1 (Quản Lý Bán Hàng)
- Team Lead của Project 2 (App Đặt Đồ Ăn)
- Team Lead của Project 4 (HRM)
- Quản lý đầy đủ 3 projects này
- Có thể add/remove project members
- Có thể update/delete tasks

🎯 Test Cases:
1. KHÔNG thể invite workspace members (không có button)
2. Quản lý Project 1: add members, create tasks
3. Update project settings
4. Assign tasks cho team members
5. Xem project progress
6. Test permission: không thể delete workspace
```

---

### 4. 👩‍💻 FRONTEND DEVELOPER
```
📧 Email: member@gmail.com
🔒 Password: 123456
🎭 Role: Project Member
💼 Position: Frontend Developer

✅ Quyền:
- Member trong 3 projects (1, 2, 3)
- Xem projects
- Update own tasks
- Comment tasks
- View team members

❌ Không có quyền:
- Create projects
- Invite members
- Update project settings
- Delete tasks của người khác

🎯 Test Cases:
1. Xem danh sách projects (chỉ thấy 3 projects)
2. Xem tasks assigned cho mình
3. Update status task của mình (drag-drop)
4. Comment tasks
5. Test permission: không thể add project members
6. Xem My Tasks sidebar
```

---

### 5. 👨‍💻 BACKEND DEVELOPER
```
📧 Email: dev@gmail.com
🔒 Password: 123456
🎭 Role: Project Member (Full-stack)
💼 Position: Backend/Full-stack Developer

✅ Quyền:
- Member trong TẤT CẢ 5 projects (busiest member)
- Nhiều tasks nhất
- Update own tasks
- Comment tasks

🎯 Test Cases:
1. Login → Dashboard hiển thị 5 projects
2. My Tasks → Nhiều tasks từ nhiều projects
3. Filter tasks by project
4. Update tasks in different projects
5. Test workload distribution
6. View calendar với nhiều deadlines
```

---

### 6. 🎨 UI/UX DESIGNER
```
📧 Email: designer@gmail.com
🔒 Password: 123456
🎭 Role: Project Member
💼 Position: UI/UX Designer

✅ Quyền:
- Member trong 4 projects (1, 2, 3, 5)
- Tasks liên quan design, mockup, UI

🎯 Test Cases:
1. Xem design tasks
2. Upload design files (nếu có feature)
3. Comment với images/links
4. View project calendar
5. Collaborate với developers
```

---

### 7. 🧪 QA TESTER
```
📧 Email: tester@gmail.com
🔒 Password: 123456
🎭 Role: Project Member
💼 Position: Quality Assurance Tester

✅ Quyền:
- Member trong 2 projects (1, 2)
- Tasks testing, bug reporting

🎯 Test Cases:
1. View test tasks
2. Report bugs (create bug tasks)
3. Update bug status
4. Comment with test results
5. Track project quality
```

---

### 8. 👁️ VIEWER/STAKEHOLDER
```
📧 Email: viewer@gmail.com
🔒 Password: 123456
🎭 Role: Project VIEWER
💼 Position: Stakeholder (Chủ đầu tư/HR)

⚠️ Quyền hạn chế:
- VIEWER trong 2 projects (1, 4)
- CHỈ XEM, không edit
- Không thể update tasks
- Không thể create tasks
- Có thể comment (feedback)

🎯 Test Cases:
1. Login → chỉ thấy 2 projects
2. Vào project → CHỈ xem, không có Edit buttons
3. Try update task → 403 Forbidden
4. Comment để feedback
5. View project progress
6. Test role restrictions
```

---

## 🚀 CÁCH CHẠY DEMO

### Bước 1: Setup Data
```bash
cd backend
npm run seed
```

**Output:**
```
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
💬 Creating comments...
✅ Comments created
✅ Seed completed successfully!
```

### Bước 2: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Bước 3: Test theo Kịch Bản

---

## 📋 KỊCH BẢN DEMO CHO THẦY CÔ (15 phút)

### Phần 1: Giới thiệu (2 phút)
```
"Đây là hệ thống quản lý dự án cho công ty phát triển phần mềm ABC.
Có 8 nhân viên đang làm việc trên 5 dự án khác nhau với 53 tasks."
```

---

### Phần 2: Demo với TEAM LEAD (5 phút)

**Login: lead@gmail.com / 123456**

1. **Dashboard Overview** (1 phút)
   - Hiển thị 3 projects đang lead
   - Stats: tasks, progress, deadlines
   - Charts: Tasks by status
   - Recent activity

2. **Project Management** (2 phút)
   - Vào Project 1 "Quản Lý Bán Hàng"
   - Xem project overview: 6 members, 15 tasks, 35% progress
   - Tab Tasks: Kanban board với 3 cột
   - Drag-drop task từ To Do → In Progress
   - Task tự động update status

3. **Task Details** (1 phút)
   - Click task "Xây dựng API quản lý sản phẩm"
   - Xem details: assignee, priority, due date
   - Xem comments (có discussion)
   - Add comment mới
   - View activity timeline

4. **Team Management** (1 phút)
   - Tab Team: xem 6 members
   - Thử add member mới
   - Show dropdown chọn từ workspace members
   - (Không add thật, chỉ show feature)

---

### Phần 3: Demo Permissions (4 phút)

**Switch account: member@gmail.com / 123456**

1. **Member View** (2 phút)
   - Dashboard chỉ hiển thị 3 projects (không phải tất cả)
   - My Tasks: chỉ tasks assigned cho mình
   - Vào Project 1
   - CHỈ thấy tasks, KHÔNG thấy Settings
   - KHÔNG thấy button "Add Member"
   - KHÔNG thấy button "Delete Project"

2. **Try Restricted Actions** (1 phút)
   - Thử update task của người khác → Không có Edit button
   - Thử vào Settings → Không có tab này
   - Show F12 Console: gọi API → 403 Forbidden

3. **Data Isolation** (1 phút)
   - Show: Member chỉ thấy projects mình tham gia
   - Không thấy Project 4, 5 (không phải member)
   - Even if biết project ID, không access được

---

### Phần 4: Demo Admin Features (3 phút)

**Switch account: admin@gmail.com / 123456**

1. **System Admin Dashboard** (2 phút)
   - Login → Auto redirect to /admin
   - System stats: 8 users, 1 workspace, 5 projects, 53 tasks
   - Charts: System-wide data
   - Activity logs: Tất cả actions của mọi users

2. **User Management** (1 phút)
   - Tab Users: List tất cả 8 users
   - Click view details của "member@gmail.com"
   - Xem: workspaces joined, projects, tasks count
   - Show buttons: Edit, Change Role, Deactivate, Delete
   - (Không thực hiện, chỉ show features)

---

### Phần 5: Responsive & Dark Mode (1 phút)

1. **Responsive Design**
   - F12 → Toggle device toolbar
   - Switch Mobile (375px)
   - Sidebar collapse → Hamburger menu
   - Layout adapt

2. **Dark Mode**
   - Click toggle theme
   - Smooth transition
   - All components support dark mode

---

## 🎯 ĐIỂM NHẤN KHI DEMO

### Điểm Mạnh Cần Nhấn Mạnh:

1. **Multi-tenant Architecture**
   - Một platform phục vụ nhiều công ty
   - Data hoàn toàn cô lập

2. **3-Level Permission System**
   - Workspace level (ADMIN/MEMBER)
   - Project level (LEAD/MEMBER/VIEWER)
   - Task level (Assignee/Creator)

3. **Real-time Updates**
   - Drag-drop task → update DB ngay
   - Comment → xuất hiện instant
   - Activity logs real-time

4. **Rich Features**
   - Dashboard analytics với charts
   - Kanban board
   - Calendar view
   - Comments & collaboration
   - Activity tracking
   - Export reports

5. **Security**
   - JWT authentication
   - Permission checks mọi API
   - Data isolation
   - Password hashing
   - XSS protection

---

## 🧪 TEST SCENARIOS CHO TỪNG TÀI KHOẢN

### Scenario 1: New Project Flow (Team Lead)
```
1. Login: lead@gmail.com
2. Click "Create Project"
3. Fill form: "Mobile App Mới"
4. Add members từ workspace
5. Create tasks
6. Assign tasks cho members
7. Track progress
```

### Scenario 2: Developer Workflow (Member)
```
1. Login: dev@gmail.com
2. Sidebar → My Tasks
3. Filter: Due today
4. Pick task: "Fix bug hiển thị tồn kho"
5. Drag từ To Do → In Progress
6. Add comment: "Đang fix, sẽ done trong 2h"
7. Complete task → Drag to Done
8. View activity log
```

### Scenario 3: Cross-Project View (Designer)
```
1. Login: designer@gmail.com
2. View 4 projects
3. Calendar view: Xem tất cả deadlines
4. Filter tasks: Type = Design
5. Work on multiple projects
6. Update statuses
```

### Scenario 4: Viewer/Stakeholder (Viewer)
```
1. Login: viewer@gmail.com
2. View Project 1 progress
3. Check tasks status
4. Try edit → KHÔNG có buttons
5. Comment để hỏi thêm info
6. View reports
```

---

## 📊 DATA SUMMARY

```
WORKSPACE:
└── Công Ty TNHH Phần Mềm ABC
    ├── 8 members
    └── 5 projects
        ├── Project 1: Quản Lý Bán Hàng (ACTIVE, 35%, 15 tasks)
        ├── Project 2: App Đặt Đồ Ăn (ACTIVE, 25%, 12 tasks)
        ├── Project 3: Website Tin Tức (ACTIVE, 50%, 10 tasks)
        ├── Project 4: HRM (PLANNING, 5%, 8 tasks)
        └── Project 5: Analytics (COMPLETED, 100%, 8 tasks)

TOTAL STATS:
- Users: 8
- Workspaces: 1
- Projects: 5
- Tasks: 53
  • Done: 18 (34%)
  • In Progress: 16 (30%)
  • To Do: 19 (36%)
- Comments: 30+
- Activity Logs: 100+
```

---

## 🐛 KNOWN ISSUES (Để trả lời nếu thầy cô hỏi)

```
1. Real-time updates: Cần refresh để thấy changes từ user khác
   → Solution: Implement WebSocket/Socket.io

2. File uploads: Chưa có feature upload files
   → Solution: Integrate AWS S3 hoặc Cloudinary

3. Notifications: Chỉ có toast, chưa có notification center
   → Solution: Build notification system với unread count

4. Email: Chỉ config cho development (Ethereal)
   → Solution: Integrate SendGrid/AWS SES cho production

5. Search: Basic search, chưa có advanced filters
   → Solution: Implement ElasticSearch hoặc full-text search
```

---

## 💡 TIPS KHI DEMO

1. **Chuẩn bị trước:**
   - Chạy seed data trước 30 phút
   - Test login tất cả accounts
   - Mở sẵn 2-3 tabs với accounts khác nhau

2. **Trong khi demo:**
   - Nói rõ vai trò của từng account
   - Nhấn mạnh permissions
   - Show F12 console để chứng minh API calls
   - Demo responsive và dark mode ở cuối

3. **Khi bị hỏi khó:**
   - Thừa nhận limitations
   - Giải thích approach và trade-offs
   - Đưa ra solutions cho future improvements

4. **Highlight technical:**
   - Show database structure (MongoDB Compass)
   - Explain API endpoints
   - Show middleware permissions check
   - Explain security measures

---

## 📞 QUICK REFERENCE

```bash
# Reset data
cd backend && npm run seed

# Start servers
cd backend && npm run dev
cd frontend && npm run dev

# Check database
mongosh "mongodb://localhost:27017/project_management"
db.users.find().pretty()
db.workspaces.find().pretty()
db.projects.find().pretty()
db.tasks.find().pretty()

# Backend API
http://localhost:5000/api/health

# Frontend
http://localhost:5173

# Admin Dashboard
http://localhost:5173/admin (login với admin@gmail.com)
```

---

**🎉 Chúc bạn demo thành công!**
