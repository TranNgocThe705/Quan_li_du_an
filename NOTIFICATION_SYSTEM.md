# Hệ Thống Thông Báo (Notification System)

## Tổng Quan

Hệ thống thông báo được tích hợp đầy đủ vào ứng dụng quản lý dự án, tự động thông báo cho người dùng về các sự kiện quan trọng.

## Tính Năng

### 1. **Biểu Tượng Thông Báo (Notification Bell)**
- Hiển thị trên Navbar, bên cạnh nút chuyển ngôn ngữ
- Badge màu đỏ hiển thị số lượng thông báo chưa đọc
- Dropdown hiển thị danh sách thông báo mới nhất
- Tự động refresh số lượng chưa đọc mỗi 30 giây

### 2. **Các Loại Thông Báo**

#### **Task Notifications**
- `TASK_ASSIGNED` - Được giao công việc mới
- `TASK_UPDATED` - Công việc được cập nhật
- `TASK_COMPLETED` - Công việc hoàn thành
- `TASK_DUE_SOON` - Công việc sắp đến hạn
- `TASK_OVERDUE` - Công việc quá hạn
- `TASK_COMMENT` - Bình luận mới trên công việc

#### **Project Notifications**
- `PROJECT_MEMBER_ADDED` - Được thêm vào dự án
- `PROJECT_UPDATED` - Dự án được cập nhật
- `PROJECT_DEADLINE_APPROACHING` - Dự án sắp đến deadline

#### **Workspace Notifications**
- `WORKSPACE_MEMBER_ADDED` - Được thêm vào workspace
- `WORKSPACE_ROLE_CHANGED` - Quyền thay đổi

#### **Mention Notifications**
- `MENTIONED_IN_COMMENT` - Được nhắc đến trong bình luận
- `MENTIONED_IN_TASK` - Được nhắc đến trong công việc

#### **System Notifications**
- `SYSTEM_ANNOUNCEMENT` - Thông báo hệ thống

### 3. **Mức Độ Ưu Tiên**
- `LOW` - Thấp (màu xanh)
- `MEDIUM` - Trung bình (màu vàng)
- `HIGH` - Cao (màu cam)
- `URGENT` - Khẩn cấp (màu đỏ)

### 4. **Chức Năng**
- ✅ Đánh dấu đã đọc từng thông báo
- ✅ Đánh dấu tất cả đã đọc
- ✅ Xóa từng thông báo
- ✅ Xóa tất cả thông báo đã đọc
- ✅ Click vào thông báo để chuyển đến nội dung liên quan
- ✅ Hiển thị thời gian tạo thông báo (relative time)
- ✅ Tự động xóa thông báo đã đọc sau 30 ngày

## Kiến Trúc Kỹ Thuật

### Backend

#### **Model: Notification.js**
```javascript
{
  userId: ObjectId,           // Người nhận thông báo
  fromUserId: ObjectId,       // Người tạo thông báo (optional)
  type: String,               // Loại thông báo
  title: String,              // Tiêu đề
  message: String,            // Nội dung
  entityType: String,         // TASK, PROJECT, WORKSPACE, etc.
  entityId: ObjectId,         // ID của entity liên quan
  workspaceId: ObjectId,
  projectId: ObjectId,
  isRead: Boolean,            // Đã đọc chưa
  readAt: Date,               // Thời gian đọc
  priority: String,           // LOW, MEDIUM, HIGH, URGENT
  actionUrl: String,          // URL để navigate
  metadata: Object            // Dữ liệu bổ sung
}
```

#### **Controller: notificationController.js**
- `getNotifications` - Lấy danh sách thông báo (có phân trang)
- `getUnreadCount` - Lấy số lượng chưa đọc
- `markAsRead` - Đánh dấu đã đọc
- `markAllAsRead` - Đánh dấu tất cả đã đọc
- `deleteNotification` - Xóa thông báo
- `clearReadNotifications` - Xóa tất cả đã đọc

#### **Routes: notificationRoutes.js**
```
GET    /api/notifications              - Lấy thông báo
GET    /api/notifications/unread-count - Số lượng chưa đọc
PUT    /api/notifications/:id/read     - Đánh dấu đã đọc
PUT    /api/notifications/mark-all-read - Đánh dấu tất cả
DELETE /api/notifications/:id          - Xóa thông báo
DELETE /api/notifications/clear-read   - Xóa đã đọc
```

#### **Helper: notificationHelper.js**
Các function tự động tạo thông báo:
- `notifyTaskAssignment()` - Khi giao task
- `notifyTaskUpdate()` - Khi cập nhật task
- `notifyTaskCompletion()` - Khi hoàn thành task
- `notifyTaskComment()` - Khi comment
- `notifyProjectMemberAdded()` - Khi thêm thành viên dự án
- `notifyWorkspaceMemberAdded()` - Khi thêm thành viên workspace

### Frontend

#### **Redux Slice: notificationSlice.js**
State management cho notifications:
```javascript
{
  notifications: [],
  unreadCount: 0,
  pagination: { total, page, pages, limit },
  loading: false,
  error: null
}
```

Actions:
- `getNotifications` - Fetch notifications
- `getUnreadCount` - Fetch unread count
- `markAsRead` - Mark as read
- `markAllAsRead` - Mark all as read
- `deleteNotification` - Delete notification
- `clearReadNotifications` - Clear read notifications

#### **Component: NotificationBell.jsx**
Component hiển thị biểu tượng thông báo và dropdown:
- Hiển thị badge với số lượng chưa đọc
- Dropdown với danh sách thông báo
- Icons khác nhau cho từng loại thông báo
- Click để navigate đến nội dung liên quan
- Actions: đánh dấu đã đọc, xóa

## Tích Hợp Tự Động

Hệ thống tự động tạo thông báo khi:

### 1. **Task Events**
- ✅ Tạo task mới → Notify assignee
- ✅ Cập nhật task → Notify assignee (nếu không phải người cập nhật)
- ✅ Hoàn thành task → Notify creator
- ✅ Comment trên task → Notify assignee và creator

### 2. **Project Events**
- ✅ Thêm thành viên → Notify member mới
- ⚠️ Cập nhật project → Notify tất cả members (có thể enable)

### 3. **Workspace Events**
- ✅ Thêm thành viên → Notify member mới

## Cấu Hình

### Thêm Notification vào Store
File: `frontend/src/app/store.js`
```javascript
import notificationReducer from '../features/notificationSlice'

export const store = configureStore({
  reducer: {
    // ...other reducers
    notification: notificationReducer,
  },
})
```

### Thêm Routes
File: `backend/server.js`
```javascript
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);
```

### Thêm vào Navbar
File: `frontend/src/components/Navbar.jsx`
```javascript
import NotificationBell from './NotificationBell'

// Trong component
<NotificationBell />
```

## Translations

### Tiếng Việt (vi.json)
```json
"notifications": {
  "title": "Thông báo",
  "empty": "Không có thông báo nào",
  "markAllRead": "Đánh dấu tất cả đã đọc",
  "viewAll": "Xem tất cả thông báo"
}
```

### English (en.json)
```json
"notifications": {
  "title": "Notifications",
  "empty": "No notifications",
  "markAllRead": "Mark all as read",
  "viewAll": "View all notifications"
}
```

## API Usage Examples

### Lấy thông báo
```javascript
GET /api/notifications?page=1&limit=20&unreadOnly=true
```

### Đánh dấu đã đọc
```javascript
PUT /api/notifications/{id}/read
```

### Tạo thông báo thủ công (trong code)
```javascript
import { notifyTaskAssignment } from '../utils/notificationHelper.js';

await notifyTaskAssignment(
  assignedUserId,
  {
    _id: task._id,
    title: task.title,
    priority: task.priority,
    workspaceId: workspace._id,
    projectId: project._id,
  },
  currentUserId
);
```

## Performance Optimization

1. **Database Indexes**
   - `userId + isRead + createdAt` - Cho query chưa đọc
   - `userId + createdAt` - Cho pagination
   - Auto-delete sau 30 ngày (TTL index)

2. **Frontend**
   - Debounce API calls
   - Auto-refresh every 30 seconds (không phải real-time)
   - Lazy load notifications khi mở dropdown

3. **Backend**
   - Pagination mặc định 20 items
   - Bulk operations cho mark all read

## Future Enhancements

- [ ] Real-time notifications với WebSocket/Socket.io
- [ ] Email notifications cho thông báo quan trọng
- [ ] Push notifications (PWA)
- [ ] Notification preferences (user settings)
- [ ] Notification grouping (gộp nhiều thông báo cùng loại)
- [ ] Notification scheduling (gửi sau X phút)
- [ ] Rich notifications (với images, actions)

## Troubleshooting

### Không nhận được thông báo?
1. Kiểm tra user có trong project/workspace không
2. Kiểm tra logs backend xem có lỗi khi tạo notification
3. Verify API endpoint `/api/notifications/unread-count` hoạt động

### Badge không cập nhật?
1. Check Redux DevTools xem state có update không
2. Verify auto-refresh interval (30s)
3. Clear browser cache

### Thông báo không navigate đúng?
1. Check `actionUrl` trong database
2. Verify route paths trong frontend

## Testing

### Test thông báo thủ công
```javascript
POST /api/notifications/test
Authorization: Bearer {token}
```

### Test flow hoàn chỉnh
1. Tạo task mới → Check assignee nhận thông báo
2. Comment trên task → Check creator/assignee nhận thông báo
3. Thêm member vào project → Check member nhận thông báo

---

**Lưu ý**: Hệ thống notification đã được tích hợp hoàn chỉnh và sẵn sàng sử dụng!
