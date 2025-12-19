# Quick Start Guide - Tính Năng Mới

## ⚡ Bắt Đầu Nhanh

### Bước 1: Cài Đặt (✅ Đã hoàn thành)

```bash
cd backend
npm install nodemailer  # ✅ Đã cài
```

### Bước 2: Cấu Hình Email (Tùy chọn)

**Thêm vào file `backend/.env`:**

```env
# Email Configuration (Optional - for testing only)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=test@ethereal.email
EMAIL_PASS=test_password
EMAIL_FROM=noreply@projectmanagement.com
FRONTEND_URL=http://localhost:5173
```

**Lưu ý:** Nếu không cấu hình email, hệ thống vẫn hoạt động bình thường, chỉ in log ra console thay vì gửi email thật.

### Bước 3: Khởi Động Server

```bash
cd backend
npm run dev
```

Bạn sẽ thấy log:
```
✅ Server running on port 5000
✅ MongoDB Connected
✅ Email configured (or 'Email not configured - dev mode')
```

### Bước 4: Test Các Endpoint Mới

#### 1. Dashboard Tổng Quan

```bash
# Lấy token từ login trước
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "taskStats": {
      "total": 10,
      "todo": 3,
      "inProgress": 5,
      "done": 2,
      "overdue": 1,
      "dueSoon": 2
    },
    "projectStats": {...},
    "workspaceStats": {...},
    "tasksDueSoon": [...],
    "overdueTasks": [...]
  }
}
```

#### 2. Dashboard Workspace

```bash
# Thay WORKSPACE_ID bằng ID workspace thật
curl http://localhost:5000/api/dashboard/workspace/WORKSPACE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 3. Dashboard Project

```bash
# Thay PROJECT_ID bằng ID project thật
curl http://localhost:5000/api/dashboard/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 Test Email Notifications

### Cách 1: Tạo Task Mới (Gán cho user khác)

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID",
    "title": "Test Task",
    "description": "Testing email notification",
    "assigneeId": "USER_ID",
    "due_date": "2025-12-31",
    "priority": "HIGH"
  }'
```

**Kết quả:** 
- ✅ Task được tạo
- ✅ Email notification gửi đến assignee
- ✅ Activity log được ghi vào database
- ✅ Log hiển thị trong console: `📧 [Event] Task assigned to User Name`

### Cách 2: Comment vào Task

```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "TASK_ID",
    "content": "Testing comment notification"
  }'
```

**Kết quả:**
- ✅ Comment được tạo
- ✅ Email gửi đến task assignee
- ✅ Activity log ghi lại
- ✅ Console: `💬 [Event] New comment on task`

### Cách 3: Mời Member vào Workspace

```bash
curl -X POST http://localhost:5000/api/workspaces/WORKSPACE_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "role": "MEMBER",
    "message": "Welcome to the team!"
  }'
```

**Kết quả:**
- ✅ Member được thêm
- ✅ Email invitation gửi đi
- ✅ Activity log ghi lại

---

## 📊 Test Activity Logging

### Xem Activity Logs

```javascript
// Trong MongoDB Compass hoặc mongo shell
db.activitylogs.find().sort({ createdAt: -1 }).limit(10)
```

**Hoặc query từ code:**

```javascript
// Backend controller hoặc script
const logs = await ActivityLog.find()
  .populate('userId', 'name email')
  .sort({ createdAt: -1 })
  .limit(20);

console.log(logs);
```

**Kết quả mẫu:**
```json
[
  {
    "userId": { "name": "John Doe", "email": "john@example.com" },
    "action": "TASK_CREATED",
    "entityType": "TASK",
    "entityName": "Implement login feature",
    "description": "Created task \"Implement login feature\"",
    "createdAt": "2025-11-16T10:30:00.000Z"
  },
  {
    "userId": { "name": "Jane Smith", "email": "jane@example.com" },
    "action": "COMMENT_ADDED",
    "entityType": "COMMENT",
    "entityName": "Fix bug in dashboard",
    "description": "Commented on task \"Fix bug in dashboard\"",
    "createdAt": "2025-11-16T10:25:00.000Z"
  }
]
```

---

## 🎨 Test trong Frontend

### 1. Thêm Dashboard API call

```javascript
// frontend/src/services/api.js
export const getDashboard = () => api.get('/dashboard');
export const getWorkspaceDashboard = (workspaceId) => 
  api.get(`/dashboard/workspace/${workspaceId}`);
export const getProjectDashboard = (projectId) => 
  api.get(`/dashboard/project/${projectId}`);
```

### 2. Tạo Dashboard Component

```jsx
// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboard();
      setDashboardData(response.data.data);
    };
    fetchData();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value={dashboardData.taskStats.total} />
        <StatCard title="In Progress" value={dashboardData.taskStats.inProgress} />
        <StatCard title="Completed" value={dashboardData.taskStats.done} />
        <StatCard title="Overdue" value={dashboardData.taskStats.overdue} />
      </div>

      {/* Tasks Due Soon */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Tasks Due Soon</h2>
        {dashboardData.tasksDueSoon.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        {dashboardData.recentActivity.map(activity => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
```

---

## 🔍 Kiểm Tra Email Đã Gửi

### Development Mode (Ethereal Email)

1. Check console log:
```
📧 Email sent: <message-id>
```

2. Hoặc xem trong Ethereal dashboard nếu đã config

### Production Mode (Gmail/SendGrid)

- Check email inbox của recipient
- Check SMTP service logs
- Verify trong Activity Logs

---

## 🐛 Troubleshooting

### Lỗi: "Email not configured"

**Nguyên nhân:** Không có `EMAIL_USER` trong `.env`

**Giải pháp:** 
```env
# Thêm vào .env
EMAIL_USER=test@ethereal.email
```

Hoặc bỏ qua (hệ thống vẫn chạy, chỉ log email ra console)

### Lỗi: "Cannot find module 'nodemailer'"

**Nguyên nhân:** Package chưa được cài

**Giải pháp:**
```bash
cd backend
npm install nodemailer
npm run dev
```

### Dashboard trả về data rỗng

**Nguyên nhân:** User chưa có workspace/project/task

**Giải pháp:**
```bash
# Tạo dữ liệu mẫu
cd backend
npm run seed
```

### Activity logs không được ghi

**Nguyên nhân:** Event không được emit

**Giải pháp:** Check console log xem có message `[Event]` không. Nếu không có, kiểm tra controller đã emit event chưa.

---

## ✅ Checklist Kiểm Tra

- [ ] Server khởi động không lỗi
- [ ] Dashboard endpoint trả về data
- [ ] Tạo task mới → Console hiển thị event log
- [ ] Activity logs được lưu vào MongoDB
- [ ] Email config (optional) hoạt động
- [ ] Frontend call API thành công

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check logs:** `npm run dev` hiển thị tất cả events
2. **Check database:** Xem ActivityLog collection
3. **Check .env:** Đảm bảo config đúng
4. **Test API:** Dùng Postman/curl test endpoints

---

**Ready to go!** 🚀 Hệ thống đã sẵn sàng với đầy đủ tính năng mới.
