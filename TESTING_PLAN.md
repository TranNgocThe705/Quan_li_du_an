# 🧪 LỘ TRÌNH TEST CHI TIẾT - HỆ THỐNG QUẢN LÝ DỰ ÁN

## 📋 MỤC LỤC
- [1. Chuẩn Bị Test](#1-chuẩn-bị-test)
- [2. Test Authentication (Xác Thực)](#2-test-authentication-xác-thực)
- [3. Test Workspace Management](#3-test-workspace-management)
- [4. Test Project Management](#4-test-project-management)
- [5. Test Task Management](#5-test-task-management)
- [6. Test Team Management](#6-test-team-management)
- [7. Test Permission System](#7-test-permission-system)
- [8. Test Dashboard & Analytics](#8-test-dashboard--analytics)
- [9. Test Admin Features](#9-test-admin-features)
- [10. Test UI/UX & Performance](#10-test-uiux--performance)
- [11. Test Security](#11-test-security)

---

## 1. CHUẨN BỊ TEST

### 1.1 Environment Setup
```bash
# Backend
✅ MongoDB đang chạy (port 27017)
✅ Backend server đang chạy (port 5000)
✅ Check: http://localhost:5000/api/health

# Frontend
✅ Frontend đang chạy (port 5173)
✅ Check: http://localhost:5173
```

### 1.2 Công Cụ Test
- **Browser**: Chrome/Firefox (mở Developer Tools - F12)
- **Postman/Thunder Client**: Test API trực tiếp
- **MongoDB Compass**: Xem database
- **Notepad**: Ghi lại test results

### 1.3 Chuẩn Bị Data
```bash
# Reset database (optional - nếu muốn test từ đầu)
cd backend
npm run seed
```

---

## 2. TEST AUTHENTICATION (XÁC THỰC)

### ✅ TEST CASE 2.1: Đăng Ký Tài Khoản

**Bước 1: Đăng ký user thường (User A)**
```
URL: http://localhost:5173/register

Input:
- Name: Nguyen Van A
- Email: nguyenvana@test.com
- Password: 123456
- Confirm Password: 123456

Expected:
✅ Hiển thị toast "Đăng ký thành công"
✅ Tự động redirect về /login
✅ Check DB: Users collection có user mới

Test Cases:
1. Email đã tồn tại → Error: "Email already exists"
2. Password < 6 ký tự → Error validation
3. Password không khớp → Error: "Passwords do not match"
4. Email sai format → Error: "Invalid email"
5. Bỏ trống field → Error validation
```

**Bước 2: Đăng ký thêm User B, C, D** (để test collaboration sau)
```
User B: nguyenvanb@test.com / 123456
User C: nguyenvanc@test.com / 123456
User D: nguyenvand@test.com / 123456
```

**Bước 3: Verify trong Database**
```bash
# MongoDB Compass hoặc mongosh
mongosh "mongodb://localhost:27017/project_management"
db.users.find({}).pretty()

Expected:
- 4 users mới được tạo
- password đã bị hash (bcrypt)
- isSystemAdmin = false (default)
```

---

### ✅ TEST CASE 2.2: Đăng Nhập

**Test với User A**
```
URL: http://localhost:5173/login

Input:
- Email: nguyenvana@test.com
- Password: 123456

Expected:
✅ Hiển thị toast "Đăng nhập thành công"
✅ Redirect về Dashboard (/)
✅ Token lưu trong localStorage
✅ Navbar hiển thị tên user + avatar
✅ Sidebar hiển thị menu

Verify:
- F12 → Application → Local Storage → token có giá trị
- F12 → Console: không có error
```

**Negative Test Cases**
```
1. Email sai: test@wrong.com
   → Error: "Invalid credentials"

2. Password sai: wrongpass
   → Error: "Invalid credentials"

3. Email chưa đăng ký: notexist@test.com
   → Error: "User not found"

4. Bỏ trống fields
   → Error validation
```

---

### ✅ TEST CASE 2.3: Google OAuth Login

```
URL: http://localhost:5173/login

Action:
1. Click button "Sign in with Google"
2. Chọn Google account
3. Authorize permissions

Expected:
✅ Redirect về /auth/google/success
✅ Tự động login và redirect về Dashboard
✅ Token được tạo và lưu
✅ User được tạo trong DB với googleId

Verify DB:
db.users.findOne({ email: "your_google_email@gmail.com" })
- Có field googleId
- password = null (vì login qua Google)
```

---

### ✅ TEST CASE 2.4: Logout

```
Action:
1. Ở Dashboard, click avatar (góc phải trên)
2. Click "Logout"

Expected:
✅ Toast "Đã đăng xuất"
✅ Redirect về /login
✅ Token bị xóa khỏi localStorage
✅ Không thể truy cập protected routes
✅ Thử truy cập http://localhost:5173/ → redirect về /login
```

---

### ✅ TEST CASE 2.5: Session Persistence

```
Test 1: Refresh page
1. Login
2. Ở Dashboard, nhấn F5 (refresh)
   Expected: ✅ Vẫn đăng nhập, không bị logout

Test 2: Close browser và mở lại
1. Login
2. Đóng browser hoàn toàn
3. Mở lại và truy cập http://localhost:5173
   Expected: ✅ Vẫn đăng nhập (token còn trong localStorage)

Test 3: Token expired
1. Mở F12 → Application → Local Storage
2. Xóa token
3. Refresh page
   Expected: ✅ Redirect về /login
```

---

## 3. TEST WORKSPACE MANAGEMENT

**Login với User A để test**

### ✅ TEST CASE 3.1: Tạo Workspace Đầu Tiên

```
URL: Dashboard → Click "Create Workspace" hoặc dropdown góc trên

Input:
- Name: Công ty ABC Tech
- Description: Workspace cho công ty công nghệ ABC
- Image URL: (để trống hoặc nhập URL ảnh)

Expected:
✅ Toast "Workspace created successfully"
✅ Workspace xuất hiện trong dropdown
✅ Tự động switch sang workspace mới
✅ Dashboard reload với workspace context

Verify DB:
db.workspaces.findOne({ name: "Công ty ABC Tech" })
- ownerId = User A ID
- slug được tạo tự động

db.workspacemembers.findOne({ workspaceId: workspace_id })
- userId = User A ID
- role = "ADMIN"
```

---

### ✅ TEST CASE 3.2: Tạo Multiple Workspaces

```
Tạo thêm 2 workspaces:

Workspace 2:
- Name: Startup XYZ
- Description: Dự án startup của tôi

Workspace 3:
- Name: Freelance Projects
- Description: Các dự án freelance

Expected:
✅ User A có 3 workspaces trong dropdown
✅ Mỗi workspace có data riêng biệt
✅ Switch qua lại không bị lỗi
```

---

### ✅ TEST CASE 3.3: Xem Chi Tiết Workspace

```
Action:
1. Ở Dashboard/Projects page
2. Workspace đang active hiển thị thông tin:
   - Name
   - Description
   - Members count
   - Projects count

Expected:
✅ Thông tin hiển thị chính xác
✅ Stats cập nhật real-time
```

---

### ✅ TEST CASE 3.4: Update Workspace

```
Action:
1. Click Settings (hoặc Workspace settings)
2. Update thông tin:
   - Name: Công ty ABC Tech Solutions (đổi tên)
   - Description: Updated description

Expected:
✅ Toast "Workspace updated"
✅ Dropdown hiển thị tên mới
✅ DB được update

Verify:
- Chỉ ADMIN mới thấy nút Edit
- MEMBER không có quyền update
```

---

### ✅ TEST CASE 3.5: Delete Workspace (CHỈ OWNER)

```
Action:
1. Settings → Workspace Settings
2. Click "Delete Workspace"
3. Confirm trong modal

Expected:
✅ Workspace bị xóa
✅ Redirect về workspace còn lại (hoặc tạo mới)
✅ Tất cả projects, tasks trong workspace bị xóa

Negative Test:
- User B (là MEMBER) không thấy nút Delete
- API /api/workspaces/:id DELETE → 403 nếu không phải owner
```

---

## 4. TEST PROJECT MANAGEMENT

**Context: User A trong Workspace "Công ty ABC Tech"**

### ✅ TEST CASE 4.1: Tạo Project Đầu Tiên

```
Action:
1. Vào trang Projects hoặc Dashboard
2. Click "Create Project" / "+ New Project"

Input:
- Project Name: Website Redesign
- Description: Thiết kế lại website công ty
- Priority: High
- Status: Active
- Start Date: 2025-12-01
- End Date: 2025-12-31
- Team Lead: User A (chọn từ dropdown)

Expected:
✅ Toast "Project created successfully"
✅ Project xuất hiện trong list
✅ User A tự động là Team Lead
✅ User A tự động thành ProjectMember

Verify DB:
db.projects.findOne({ name: "Website Redesign" })
- workspaceId = Công ty ABC Tech ID
- team_lead = User A ID

db.projectmembers.find({ projectId: project_id })
- Có 1 member là User A
- role = "PROJECT_MANAGER" (vì là team lead)
```

---

### ✅ TEST CASE 4.2: Tạo Multiple Projects

```
Tạo thêm:

Project 2:
- Name: Mobile App Development
- Priority: Urgent
- Status: Active
- Team Lead: User A

Project 3:
- Name: Marketing Campaign Q1
- Priority: Medium
- Status: Planning
- Team Lead: User A

Expected:
✅ 3 projects trong workspace
✅ Có thể filter theo Status, Priority
✅ Có thể search theo tên
```

---

### ✅ TEST CASE 4.3: Xem Project Details

```
Action:
1. Click vào project "Website Redesign"

Expected Page hiển thị:
✅ Project info (name, description, dates)
✅ Team Lead info
✅ Progress bar
✅ Tabs:
   - Overview (tổng quan)
   - Tasks (danh sách tasks)
   - Team (members)
   - Calendar (timeline)
   - Settings (cài đặt)

✅ Stats:
   - Total tasks
   - Completed tasks
   - In progress tasks
   - Overdue tasks
   - Members count
```

---

### ✅ TEST CASE 4.4: Update Project

```
Action:
1. Trong Project Details → Settings tab
2. Update:
   - Priority: High → Urgent
   - Status: Active → In Progress
   - End Date: extend thêm 1 tháng

Expected:
✅ Toast "Project updated"
✅ Changes reflected ngay
✅ Activity log ghi nhận thay đổi

Permission Test:
- Team Lead: ✅ Có quyền update
- Workspace Admin: ✅ Có quyền update
- Project Member (not lead): ❌ Không có quyền
```

---

### ✅ TEST CASE 4.5: Add Members to Project

```
Action:
1. Project Details → Team tab
2. Click "Add Member"
3. Chọn User B từ workspace members

Expected:
✅ User B xuất hiện trong project members
✅ User B có thể xem project này
✅ DB: ProjectMember mới được tạo

Test với User B:
1. Logout User A
2. Login User B (phải invite vào workspace trước)
3. Vào Projects → thấy "Website Redesign"
4. Click vào → xem được details
```

---

### ✅ TEST CASE 4.6: Remove Member from Project

```
Action:
1. Project Details → Team tab
2. Click "Remove" ở User B

Expected:
✅ User B biến mất khỏi list
✅ User B không còn thấy project (khi login)
✅ Tasks assigned cho User B vẫn còn nhưng unassigned

Negative:
- Không thể remove Team Lead
- Member thường không có quyền remove
```

---

### ✅ TEST CASE 4.7: Delete Project

```
Action:
1. Project Details → Settings → Delete Project
2. Confirm modal

Expected:
✅ Project bị xóa
✅ Tất cả tasks trong project bị xóa
✅ ProjectMembers bị xóa
✅ Redirect về Projects page

Permission:
- Team Lead: ✅ Có quyền
- Workspace Admin: ✅ Có quyền
- Member: ❌ Không có quyền
```

---

## 5. TEST TASK MANAGEMENT

**Context: Project "Website Redesign"**

### ✅ TEST CASE 5.1: Tạo Task

```
Action:
1. Project Details → Tasks tab
2. Click "Create Task" / "+ New Task"

Input:
- Title: Design Homepage Mockup
- Description: Thiết kế giao diện trang chủ mới
- Assignee: User A (chọn từ project members)
- Status: To Do
- Priority: High
- Type: Task
- Due Date: 2025-12-15

Expected:
✅ Toast "Task created successfully"
✅ Task xuất hiện trong Kanban board (cột To Do)
✅ Task có trong task list
✅ Assignee nhận được email notification (nếu config)

Verify DB:
db.tasks.findOne({ title: "Design Homepage Mockup" })
- projectId = Website Redesign ID
- assigneeId = User A ID
- status = "TODO"
```

---

### ✅ TEST CASE 5.2: Tạo Multiple Tasks

```
Tạo thêm tasks:

Task 2:
- Title: Develop Login API
- Assignee: User B
- Status: To Do
- Priority: Urgent
- Type: Feature

Task 3:
- Title: Fix Navbar Bug
- Assignee: User A
- Status: In Progress
- Priority: High
- Type: Bug

Task 4:
- Title: Write API Documentation
- Assignee: User B
- Status: Done
- Priority: Medium
- Type: Task

Expected:
✅ 4 tasks trong project
✅ Kanban board hiển thị đúng cột:
   - To Do: 2 tasks
   - In Progress: 1 task
   - Done: 1 task
```

---

### ✅ TEST CASE 5.3: Drag & Drop Task (Kanban Board)

```
Action:
1. Ở Tasks tab, Kanban view
2. Drag task "Design Homepage Mockup" từ To Do → In Progress

Expected:
✅ Task di chuyển sang cột In Progress
✅ Status tự động update
✅ Animation mượt
✅ DB được update ngay
✅ Activity log ghi nhận

Test all transitions:
- To Do → In Progress ✅
- In Progress → In Review ✅
- In Review → Done ✅
- Done → In Progress ✅ (có thể reopen)
```

---

### ✅ TEST CASE 5.4: Xem Task Details

```
Action:
1. Click vào task "Design Homepage Mockup"

Expected Page/Modal hiển thị:
✅ Task info đầy đủ
✅ Assignee với avatar
✅ Status badge (màu sắc theo status)
✅ Priority badge
✅ Due date (highlight nếu overdue)
✅ Description với markdown support
✅ Comments section
✅ Activity timeline
✅ Buttons: Edit, Delete (nếu có quyền)
```

---

### ✅ TEST CASE 5.5: Update Task

```
Action:
1. Task Details → Click Edit
2. Update:
   - Status: In Progress → In Review
   - Priority: High → Urgent
   - Due Date: extend
   - Reassign: User A → User B

Expected:
✅ Toast "Task updated"
✅ Changes reflected
✅ Activity log: "User A changed status from In Progress to In Review"
✅ Nếu reassign: User B nhận notification

Permission:
- Assignee: ✅ Có quyền update
- Project Manager: ✅ Có quyền update
- Team Lead: ✅ Có quyền update
- Other project members: ⚠️ Limited (chỉ comment)
```

---

### ✅ TEST CASE 5.6: Add Comment to Task

```
Action:
1. Task Details → Comments section
2. Type: "Đã hoàn thành design, vui lòng review"
3. Click Send/Submit

Expected:
✅ Comment xuất hiện ngay
✅ Hiển thị: avatar, name, timestamp
✅ DB: Comment được tạo
✅ Có thể edit/delete comment của mình

Test cases:
1. Comment với mentions: "@UserB please check"
2. Comment với markdown: **bold**, *italic*
3. Long comment (test scrolling)
4. Empty comment → validation error
```

---

### ✅ TEST CASE 5.7: Filter & Search Tasks

```
Filters:
1. Filter by Status: In Progress
   → Chỉ hiển thị tasks In Progress

2. Filter by Priority: High
   → Chỉ hiển thị High priority tasks

3. Filter by Assignee: User A
   → Chỉ hiển thị tasks của User A

4. Combine filters: Status=Done + Priority=High
   → Chỉ hiển thị done tasks có priority high

Search:
1. Search "Homepage"
   → Task "Design Homepage Mockup" xuất hiện

2. Search không match
   → "No tasks found"
```

---

### ✅ TEST CASE 5.8: My Tasks (Cross-Project View)

```
Action:
1. Sidebar → Click "My Tasks"

Expected:
✅ Hiển thị TẤT CẢ tasks assigned cho user
✅ Từ nhiều projects khác nhau
✅ Group by project
✅ Sort by due date
✅ Highlight overdue tasks (màu đỏ)

Stats:
- Total my tasks
- Overdue count
- Due today count
- Completed this week
```

---

### ✅ TEST CASE 5.9: Delete Task

```
Action:
1. Task Details → Delete button
2. Confirm modal

Expected:
✅ Task bị xóa
✅ Biến mất khỏi Kanban board
✅ Comments của task cũng bị xóa

Permission:
- Task creator: ✅
- Project Manager: ✅
- Team Lead: ✅
- Assignee (not creator): ❌
```

---

## 6. TEST TEAM MANAGEMENT

### ✅ TEST CASE 6.1: Mời Member vào Workspace

```
Action:
1. Sidebar → Team / Members
2. Click "Invite Member"
3. Nhập email: nguyenvanb@test.com
4. Select role: MEMBER (hoặc ADMIN)
5. Click Send Invite

Expected:
✅ Toast "Invitation sent"
✅ User B xuất hiện trong members list
✅ DB: WorkspaceMember created
✅ Email notification gửi đến User B (nếu config)

Permission:
- Workspace ADMIN: ✅ Có quyền invite
- Workspace MEMBER: ❌ Không có quyền

Negative Tests:
1. Email không tồn tại trong system
   → Error: "User not found"
   
2. Email đã là member
   → Error: "User is already a member"
   
3. Invite chính mình
   → Should prevent
```

---

### ✅ TEST CASE 6.2: Mời Multiple Members

```
Invite thêm:
- User C: nguyenvanc@test.com (role: MEMBER)
- User D: nguyenvand@test.com (role: ADMIN)

Expected:
✅ Workspace có 4 members total:
   - User A (ADMIN, Owner)
   - User B (MEMBER)
   - User C (MEMBER)
   - User D (ADMIN)

Verify:
- Members list hiển thị đầy đủ
- Avatar, name, email, role hiển thị
- Owner có badge "Owner"
```

---

### ✅ TEST CASE 6.3: Update Member Role

```
Action:
1. Team page → Click dropdown ở User B
2. Change role: MEMBER → ADMIN

Expected:
✅ Toast "Role updated"
✅ User B giờ có quyền ADMIN
✅ User B có thể invite members
✅ Badge đổi từ MEMBER → ADMIN

Permission:
- Owner: ✅ Có quyền change role
- Other ADMIN: ✅ Có quyền
- MEMBER: ❌ Không có quyền

Test với User B:
1. Logout User A, login User B
2. Vào Team → thấy "Invite Member" button
3. Có thể invite members mới
```

---

### ✅ TEST CASE 6.4: Remove Member from Workspace

```
Action:
1. Team page → Click "Remove" ở User C
2. Confirm modal

Expected:
✅ User C bị xóa khỏi workspace
✅ User C không còn thấy workspace khi login
✅ Tasks assigned cho User C vẫn còn (không mất data)
✅ Projects của User C không bị xóa

Restrictions:
- Không thể remove Owner
- ADMIN có thể remove MEMBER
- MEMBER không có quyền remove
```

---

### ✅ TEST CASE 6.5: View Member Profile

```
Action:
1. Team page → Click vào User B

Expected Modal/Page:
✅ Full profile info:
   - Name, email, avatar
   - Join date
   - Role in workspace
   - Projects participating
   - Tasks assigned (count)
   - Recent activity
```

---

## 7. TEST PERMISSION SYSTEM

### ✅ TEST CASE 7.1: Workspace Level Permissions

**Test với User B (MEMBER role)**

```
Login User B → Workspace "Công ty ABC Tech"

CÓ QUYỀN:
✅ Xem list projects
✅ Xem project details (nếu là member)
✅ Xem tasks
✅ Create tasks (trong projects mình tham gia)
✅ Update own tasks
✅ Comment tasks
✅ View team members
✅ Update own profile

KHÔNG CÓ QUYỀN:
❌ Create projects
❌ Invite workspace members
❌ Remove workspace members
❌ Update workspace settings
❌ Delete workspace
❌ Change member roles

Test:
1. Vào Settings → KHÔNG thấy workspace settings
2. Vào Team → KHÔNG thấy "Invite Member" button
3. Try API call:
   POST /api/workspaces/:id/members
   → 403 Forbidden
```

---

### ✅ TEST CASE 7.2: Project Level Permissions

**Test Project Manager vs Member**

**User A (Project Manager/Team Lead)**
```
CÓ QUYỀN:
✅ Update project info
✅ Add/remove project members
✅ Create tasks
✅ Update any tasks
✅ Delete tasks
✅ Assign tasks
✅ Close/archive project
✅ Delete project

Test: Làm tất cả actions trên → Success
```

**User B (Project Member - not lead)**
```
CÓ QUYỀN:
✅ View project
✅ View tasks
✅ Update own tasks
✅ Comment tasks
✅ Create tasks (if permitted)

KHÔNG CÓ QUYỀN:
❌ Update project info
❌ Add/remove members
❌ Delete project
❌ Update others' tasks

Test:
1. Project Details → Settings → KHÔNG thấy Edit button
2. Team tab → KHÔNG thấy "Add Member" button
3. Try update task của User A → 403 Forbidden
```

---

### ✅ TEST CASE 7.3: Task Level Permissions

```
Scenario: Task "Design Homepage" assigned to User A

User A (Assignee):
✅ Update status, priority, description
✅ Complete task
✅ Add comments
✅ Delete task (if creator)

User B (Project Manager):
✅ Update task
✅ Reassign task
✅ Delete task
✅ Change status

User C (Project Member, not assignee):
⚠️ View task
⚠️ Comment only
❌ Update task
❌ Delete task

Test:
1. Login User C
2. Vào task details
3. KHÔNG thấy Edit/Delete buttons
4. CHỈ thấy Comment section
```

---

### ✅ TEST CASE 7.4: Cross-Workspace Isolation

```
Setup:
- User A: Owner of "Workspace A", Member of "Workspace B"
- User B: Owner of "Workspace B"

Test 1: User A trong Workspace A
1. Tạo Project "Secret Project A"
2. Thêm task "Secret Task A"

Test 2: User A switch sang Workspace B
Expected:
✅ KHÔNG thấy "Secret Project A"
✅ Chỉ thấy projects của Workspace B

Test 3: User B (không phải member của Workspace A)
1. Try access Workspace A ID qua API:
   GET /api/workspaces/WORKSPACE_A_ID
   → 403 Forbidden

2. Try access Project A qua API:
   GET /api/projects/PROJECT_A_ID
   → 403 Forbidden

Expected: ✅ Hoàn toàn cô lập, không data leak
```

---

### ✅ TEST CASE 7.5: Hack Attempts (Security Test)

```
Test 1: Manipulate API calls
1. Login User B
2. F12 → Network tab
3. Thấy request: GET /api/projects?workspaceId=ABC
4. Đổi workspaceId thành ID của workspace khác (không phải member)
5. Send request
   Expected: 403 Forbidden

Test 2: Direct URL access
1. Copy URL của project trong Workspace A: 
   /projectsDetail?projectId=PROJECT_A_ID
2. Logout, login User B (không có quyền)
3. Paste URL vào browser
   Expected: 403 error hoặc redirect

Test 3: Token manipulation
1. F12 → Application → Local Storage
2. Edit token (thêm/xóa ký tự)
3. Refresh page
   Expected: Logout tự động, redirect về /login
```

---

## 8. TEST DASHBOARD & ANALYTICS

### ✅ TEST CASE 8.1: Dashboard Overview

```
Action: Login → Dashboard

Expected Components:
✅ Welcome message với user name
✅ Workspace selector dropdown
✅ Quick stats cards:
   - Total Projects
   - Active Tasks
   - Completed Tasks
   - Team Members

✅ Charts:
   - Tasks by Status (Pie/Doughnut chart)
   - Project Progress (Bar chart)
   - Tasks Timeline (Line/Area chart)

✅ Recent Activity Feed:
   - "User A created task..."
   - "User B completed task..."
   - "User C joined workspace..."

✅ My Tasks Widget:
   - Tasks assigned to me
   - Due today
   - Overdue (highlighted)

✅ Upcoming Deadlines:
   - Tasks/Projects due soon
   - Sorted by date
```

---

### ✅ TEST CASE 8.2: Stats Accuracy

```
Verify:
1. Total Projects count
   - Count projects trong DB
   - So với số trên dashboard
   Expected: ✅ Match

2. Tasks Count
   - Count tasks TODO, IN_PROGRESS, DONE
   - Compare với chart
   Expected: ✅ Accurate

3. Team Members
   - Count workspace members
   Expected: ✅ Match
```

---

### ✅ TEST CASE 8.3: Charts Interactive

```
Test:
1. Hover trên chart
   Expected: ✅ Tooltip hiển thị số liệu

2. Click legend
   Expected: ✅ Show/hide data series

3. Responsive:
   - Resize browser window
   Expected: ✅ Charts adjust size
```

---

### ✅ TEST CASE 8.4: Real-time Updates

```
Test:
1. Mở Dashboard ở tab 1
2. Mở tab 2, login cùng user
3. Ở tab 2: Create new task
4. Switch về tab 1
   Expected: ⚠️ Stats có thể cần refresh
   (Implement WebSocket để real-time)
```

---

### ✅ TEST CASE 8.5: Export Data

```
Action:
1. Dashboard → Click "Export Report"
2. Chọn format: CSV / Excel / PDF
3. Chọn date range

Expected:
✅ File download tự động
✅ Chứa data:
   - Projects list
   - Tasks summary
   - Team members
   - Activity logs
✅ Format đúng, mở được
```

---

## 9. TEST ADMIN FEATURES

**Cần tài khoản System Admin**

### ✅ TEST CASE 9.1: Tạo System Admin Account

```
Method 1: Qua Database
mongosh "mongodb://localhost:27017/project_management"
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { isSystemAdmin: true } }
)

Method 2: Qua Seed Script (đã có sẵn)
cd backend
npm run seed
→ admin@test.com / admin123
```

---

### ✅ TEST CASE 9.2: Login Admin

```
Login: admin@test.com / admin123

Expected:
✅ Redirect về /admin (không phải Dashboard)
✅ Admin layout khác user thường
✅ Sidebar menu khác:
   - Dashboard (admin stats)
   - Users Management
   - Workspaces Management
   - Projects Management
   - Activity Logs
   - System Settings
```

---

### ✅ TEST CASE 9.3: Admin Dashboard

```
URL: /admin

Expected Stats:
✅ Total Users (all system)
✅ Total Workspaces
✅ Total Projects
✅ Total Tasks
✅ Active Users (today/week)
✅ Storage Usage
✅ System Health

Charts:
✅ User Growth (line chart)
✅ Workspace Distribution
✅ Tasks Status (system-wide)
```

---

### ✅ TEST CASE 9.4: Users Management

```
URL: /admin/users (hoặc tab trong Admin Dashboard)

Features:
✅ List ALL users trong system
✅ Search users by email/name
✅ Filter: Active/Inactive, Admin/User
✅ Sort by: Created date, Name

Actions:
1. View User Details
   - Profile info
   - Workspaces joined
   - Projects participating
   - Tasks count
   - Activity history

2. Edit User
   - Update name, email
   - Change password (admin can reset)
   
3. Change Role
   - Make user System Admin
   - Revoke admin rights

4. Deactivate User
   - User không thể login
   - Data vẫn giữ

5. Delete User (Permanent)
   - Xóa user khỏi system
   - Transfer ownership của workspaces
   - Warning: Cannot undo
```

---

### ✅ TEST CASE 9.5: Workspaces Management

```
URL: /admin/workspaces

Features:
✅ List ALL workspaces (của tất cả users)
✅ View workspace details:
   - Owner
   - Members count
   - Projects count
   - Created date
   - Storage used

Actions:
1. View Workspace
   - See all projects
   - See all members
   - Activity logs

2. Edit Workspace (as admin)
   - Change name, description
   - Transfer ownership

3. Delete Workspace
   - Warning modal
   - Cascade delete: projects, tasks, members
   - Cannot undo

Test:
1. Delete workspace của User A
2. Verify: User A không còn thấy workspace đó
3. Verify DB: workspace, projects, tasks đều mất
```

---

### ✅ TEST CASE 9.6: Activity Logs

```
URL: /admin/logs

Expected Table:
Column: Timestamp | User | Action | Entity | Details

Rows:
- 2025-12-09 10:30 | User A | CREATED | Task | "Design Homepage"
- 2025-12-09 10:25 | User B | UPDATED | Project | "Website Redesign"
- 2025-12-09 10:20 | User A | JOINED | Workspace | "Công ty ABC"

Features:
✅ Filter by:
   - Date range
   - User
   - Action type (CREATED, UPDATED, DELETED)
   - Entity type (Task, Project, Workspace)
   
✅ Search logs

✅ Export logs (CSV)

✅ Pagination (1000+ logs)
```

---

## 10. TEST UI/UX & PERFORMANCE

### ✅ TEST CASE 10.1: Responsive Design

```
Test Breakpoints:

1. Mobile (375px)
   - Sidebar collapse to hamburger menu
   - Cards stack vertically
   - Tables scroll horizontally
   - Forms full width

2. Tablet (768px)
   - 2 column layout
   - Sidebar visible/collapsible
   - Charts responsive

3. Desktop (1024px+)
   - Full layout
   - Multiple columns
   - Sidebar always visible

Test:
- F12 → Toggle Device Toolbar
- Test từng breakpoint
- Không có element bị vỡ layout
```

---

### ✅ TEST CASE 10.2: Dark Mode

```
Action:
1. Click theme toggle (moon/sun icon)
2. Switch Dark → Light → Dark

Expected:
✅ Colors invert smoothly
✅ All components support dark mode
✅ Charts readable trong dark mode
✅ Preference saved (localStorage)
✅ Persist sau refresh
```

---

### ✅ TEST CASE 10.3: Loading States

```
Test:
1. Login → Hiển thị spinner
2. Dashboard loading → Skeleton screens
3. Projects loading → Loading cards
4. API slow → Loading indicators
5. Infinite scroll → Load more spinner

Expected:
✅ Không có "blank screen"
✅ User biết app đang loading
✅ Timeout sau 30s → Error message
```

---

### ✅ TEST CASE 10.4: Error Handling

```
Test Scenarios:

1. Network Error
   - Tắt backend server
   - Try login
   Expected: "Cannot connect to server" toast

2. 404 Error
   - Access /api/projects/INVALID_ID
   Expected: "Project not found" message

3. 500 Server Error
   - Trigger server error (invalid data)
   Expected: "Something went wrong" toast

4. Validation Errors
   - Submit form with invalid data
   Expected: Field-level error messages

5. Permission Denied
   - Try action without permission
   Expected: 403 error message
```

---

### ✅ TEST CASE 10.5: Performance

```
Test with Chrome DevTools:

1. Lighthouse Audit
   - Performance score > 80
   - Accessibility score > 90
   - Best Practices score > 80
   - SEO score > 80

2. Load Time
   - First Contentful Paint < 2s
   - Time to Interactive < 4s
   - Total page load < 5s

3. Bundle Size
   - Check Network tab
   - Main JS bundle < 500KB
   - Images optimized
   - Lazy loading implemented

4. Memory Leaks
   - Profile memory usage
   - Navigate pages multiple times
   - Memory should not grow infinitely
```

---

### ✅ TEST CASE 10.6: Accessibility (A11y)

```
Test:

1. Keyboard Navigation
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modals
   - Arrow keys in dropdowns

2. Screen Reader
   - Use NVDA/JAWS
   - All images have alt text
   - Forms have labels
   - Buttons have aria-labels

3. Color Contrast
   - Use axe DevTools
   - No contrast violations
   - Text readable

4. Focus Indicators
   - Visible focus outline
   - Not hidden by CSS
```

---

## 11. TEST SECURITY

### ✅ TEST CASE 11.1: SQL/NoSQL Injection

```
Test:
1. Login form, nhập:
   Email: admin@test.com' OR '1'='1
   Password: anything

Expected: ❌ Login failed (không bypass)

2. Search box:
   Input: { $ne: null }
   
Expected: ❌ Không return all data
```

---

### ✅ TEST CASE 11.2: XSS (Cross-Site Scripting)

```
Test:
1. Task description, nhập:
   <script>alert('XSS')</script>

2. Save task

Expected:
✅ Script không execute
✅ Display as text: "<script>..."
✅ Sanitized in DB

Test tất cả input fields:
- Project name
- Workspace description
- Comments
- User profile
```

---

### ✅ TEST CASE 11.3: CSRF Protection

```
Test:
1. Get JWT token từ localStorage
2. Dùng Postman, gọi API với token:
   DELETE /api/workspaces/:id
   Headers: { Authorization: Bearer <token> }

Expected: ✅ Success (vì có valid token)

3. Không có token:
   Expected: ❌ 401 Unauthorized

4. Token expired:
   Expected: ❌ 401 Token expired
```

---

### ✅ TEST CASE 11.4: Password Security

```
Test:
1. Register với password: "123"
   Expected: ❌ Validation error (min 6 chars)

2. Register với password: "123456"
   Expected: ✅ Success

3. Check DB:
   db.users.findOne({ email: "test@test.com" })
   Expected: password field là hash, NOT plaintext

4. Try login với hash password:
   Expected: ❌ Failed (không thể login bằng hash)
```

---

### ✅ TEST CASE 11.5: Rate Limiting

```
Test (nếu implement):
1. Gọi API login 10 lần liên tục với wrong password

Expected:
✅ Sau 5 lần → Block 15 minutes
✅ Message: "Too many attempts, try again later"

2. Wait 15 min → có thể login lại
```

---

## 📊 TEST RESULT TEMPLATE

Sau khi test, ghi lại kết quả:

```
| Test Case | Status | Notes |
|-----------|--------|-------|
| 2.1 Register | ✅ PASS | Tất cả validation works |
| 2.2 Login | ✅ PASS | - |
| 2.3 Google OAuth | ⚠️ SKIP | Chưa config Google |
| 3.1 Create Workspace | ✅ PASS | - |
| 4.5 Add Members | ❌ FAIL | Bug: email validation |
| ... | | |

BUG FOUND:
1. [BUG-001] Email validation không check format
   - Severity: Medium
   - Steps: Register với email "invalid"
   - Expected: Error
   - Actual: Accepted

2. [BUG-002] Task drag-drop lag trên Firefox
   - Severity: Low
   - Browser: Firefox 120
   - Workaround: Use Chrome
```

---

## 🎯 SUMMARY CHECKLIST

### Must Test (Critical):
- [ ] Đăng ký/Đăng nhập
- [ ] Tạo Workspace
- [ ] Tạo Project
- [ ] Tạo Task
- [ ] Permissions đúng (ADMIN vs MEMBER)
- [ ] Data isolation (không leak giữa workspaces)

### Should Test (Important):
- [ ] Update/Delete operations
- [ ] Team management
- [ ] Task assignment & updates
- [ ] Comments
- [ ] Dashboard stats
- [ ] Responsive design

### Nice to Test (Optional):
- [ ] Google OAuth
- [ ] Dark mode
- [ ] Export data
- [ ] Admin features
- [ ] Performance
- [ ] Accessibility

---

## 🚀 QUICK TEST SCRIPT (15 phút)

Nếu thầy cô chỉ có 15 phút để xem demo:

```
1. Đăng ký account mới (1 phút)
2. Tạo workspace "Demo Company" (30s)
3. Tạo project "Demo Project" (30s)
4. Tạo 3 tasks với status khác nhau (2 phút)
5. Drag-drop task trên Kanban board (30s)
6. Invite member (tạo account thứ 2 trước) (2 phút)
7. Login member, xem project (1 phút)
8. Test permissions: member try delete project → 403 (1 phút)
9. Show dashboard với charts (1 phút)
10. Switch workspace, show data isolation (1 phút)
11. Demo dark mode (30s)
12. Show responsive trên mobile (1 phút)
13. Login admin account, show admin dashboard (2 phút)
14. Q&A (2 phút)

Total: ~15 phút
```

---

**Good luck với testing! 🎉**
