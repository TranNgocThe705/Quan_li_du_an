# Tính Năng Báo Cáo Tiến Độ Hằng Ngày

## Mô Tả Tính Năng
Tính năng này cho phép người được giao nhiệm vụ (assignee) báo cáo tiến độ công việc hằng ngày. Điều này giúp Team Lead và Workspace Admin theo dõi tình hình thực hiện công việc chi tiết và cung cấp feedback kịp thời.

## Thành Phần Được Tạo Mới

### 1. Backend

#### Model: Progress.js
**Vị trí:** `backend/models/Progress.js`

Lưu trữ thông tin báo cáo tiến độ hằng ngày với các trường:
- `taskId`: ID của task
- `userId`: ID của người báo cáo (assignee)
- `projectId`: ID của dự án
- `date`: Ngày báo cáo (duy nhất cho mỗi user/task/ngày)
- `percentage`: Phần trăm hoàn thành (0-100)
- `workDone`: Mô tả công việc đã làm (bắt buộc)
- `planForTomorrow`: Kế hoạch ngày mai
- `blockers`: Vấn đề/cản trở gặp phải
- `priority`: Độ ưu tiên (LOW, MEDIUM, HIGH)
- `hoursSpent`: Số giờ làm việc
- `estimatedHoursRemaining`: Ước tính giờ còn lại
- `status`: DRAFT, SUBMITTED, REVIEWED, APPROVED
- `feedback`: Feedback từ reviewer
- `reviewedBy`: Người review
- `reviewedAt`: Thời gian review

#### Controller: progressController.js
**Vị trí:** `backend/controllers/progressController.js`

Các hàm chính:
- `createOrUpdateProgress()`: Tạo hoặc cập nhật báo cáo tiến độ
- `getTaskProgress()`: Lấy tiến độ của một task
- `getProjectProgress()`: Lấy tiến độ của toàn dự án
- `getMyProgress()`: Lấy báo cáo của user hiện tại
- `reviewProgress()`: Review báo cáo tiến độ (team lead/admin)
- `deleteProgress()`: Xóa báo cáo

#### Routes: progressRoutes.js
**Vị trí:** `backend/routes/progressRoutes.js`

```
POST   /api/progress                    - Báo cáo tiến độ
GET    /api/progress                    - Lấy tiến độ của task (queryParam: taskId)
GET    /api/progress/my-progress        - Lấy báo cáo của tôi
GET    /api/progress/project/:projectId - Lấy tiến độ dự án
PUT    /api/progress/:id/review         - Review báo cáo
DELETE /api/progress/:id                - Xóa báo cáo
```

### 2. Frontend

#### API Service: progress.service.js
**Vị trị:** `frontend/src/api/services/progress.service.js`

Cung cấp các hàm để gọi API backend.

#### Redux Slice: progressSlice.js
**Vị trí:** `frontend/src/features/progressSlice.js`

Quản lý state của progress với:
- Async thunks cho tất cả các operations
- Reducers cho việc cập nhật state
- Initial state: progress, myProgress, projectProgress, loading, error

#### Component: DailyProgressForm.jsx
**Vị trí:** `frontend/src/components/tasks/DailyProgressForm.jsx`

Form để người dùng báo cáo tiến độ hằng ngày với:
- Chọn ngày
- Thanh slider cho phần trăm hoàn thành
- Textarea cho công việc đã làm
- Input cho giờ làm việc
- Textarea cho kế hoạch ngày mai
- Textarea cho vấn đề/cản trở
- Dropdown cho độ ưu tiên
- Submit button

#### Component: ProgressTimeline.jsx
**Vị trí:** `frontend/src/components/tasks/ProgressTimeline.jsx`

Hiển thị lịch sử báo cáo tiến độ dưới dạng timeline với:
- Ngày, độ ưu tiên, tiến độ
- Thanh progress bar
- Công việc đã làm
- Thông tin giờ làm việc
- Kế hoạch ngày mai
- Vấn đề/cản trở (highlighted)
- Feedback từ reviewer
- Trạng thái (DRAFT, SUBMITTED, REVIEWED, APPROVED)

### 3. Integration

#### TaskDetails.jsx Updates
- Import DailyProgressForm, ProgressTimeline, getTaskProgress
- Thêm state `showProgressForm`
- Fetch progress khi load task
- Render progress form và timeline khi user là assignee
- Hiển thị toggle button để show/hide form

#### Store Updates
- Thêm progressReducer vào store

## Quy Trình Sử Dụng

### Cho Assignee (Người Được Giao Việc)

1. **Mở Task Details**
   - Vào chi tiết một task được giao cho mình
   - Thấy section "Báo Cáo Tiến Độ Hằng Ngày"

2. **Báo Cáo Tiến Độ**
   - Bấm nút "Báo cáo tiến độ"
   - Điền form với thông tin:
     - Ngày
     - Phần trăm hoàn thành
     - Công việc đã làm (bắt buộc)
     - Giờ làm việc
     - Kế hoạch ngày mai
     - Vấn đề gặp phải
     - Độ ưu tiên
   - Bấm "Gửi báo cáo"
   - Form được submit với status SUBMITTED

3. **Xem Lịch Sử**
   - Thấy timeline của tất cả báo cáo
   - Xem feedback từ team lead/admin

### Cho Team Lead / Workspace Admin

1. **Xem Tiến Độ**
   - Vào task detail
   - Xem timeline báo cáo (read-only)
   - Xem tất cả thông tin tiến độ

2. **Review Báo Cáo** (Future)
   - Có thể review và comment
   - Cung cấp feedback

## Quyền Hạn

| Role | Tạo | Xem | Update | Delete | Review |
|------|-----|-----|--------|--------|--------|
| Assignee | ✅ | ✅ | ✅ | ✅ | ❌ |
| Team Lead | ❌ | ✅ | ❌ | ❌ | ✅ |
| Workspace Admin | ❌ | ✅ | ❌ | ❌ | ✅ |

## API Endpoints

### 1. Tạo/Cập Nhật Báo Cáo Tiến Độ
```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task123",
  "date": "2026-01-03",
  "percentage": 75,
  "workDone": "Hoàn thành UI cho trang dashboard",
  "planForTomorrow": "Fix bugs cho trang dashboard",
  "blockers": "Chưa nhận được assets từ design team",
  "priority": "HIGH",
  "hoursSpent": 8,
  "estimatedHoursRemaining": 4
}
```

### 2. Lấy Báo Cáo Của Task
```http
GET /api/progress?taskId=task123&startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

### 3. Lấy Báo Cáo Của Tôi
```http
GET /api/progress/my-progress?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

### 4. Lấy Tiến Độ Dự Án (Team Lead/Admin)
```http
GET /api/progress/project/project123?startDate=2026-01-01&endDate=2026-01-31&userId=user456
Authorization: Bearer <token>
```

### 5. Review Báo Cáo
```http
PUT /api/progress/progress123/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED",
  "feedback": "Tuyệt vời! Tiến độ tốt. Tiếp tục duy trì"
}
```

## Files Được Tạo/Sửa

### Backend
- ✅ `backend/models/Progress.js` - Model mới
- ✅ `backend/controllers/progressController.js` - Controller mới
- ✅ `backend/routes/progressRoutes.js` - Routes mới
- ✅ `backend/server.js` - Thêm progress route

### Frontend
- ✅ `frontend/src/api/services/progress.service.js` - API service mới
- ✅ `frontend/src/features/progressSlice.js` - Redux slice mới
- ✅ `frontend/src/components/tasks/DailyProgressForm.jsx` - Component mới
- ✅ `frontend/src/components/tasks/ProgressTimeline.jsx` - Component mới
- ✅ `frontend/src/api/index.js` - Export progressAPI
- ✅ `frontend/src/app/store.js` - Thêm progress reducer
- ✅ `frontend/src/pages/tasks/TaskDetails.jsx` - Thêm progress sections

## Lợi Ích

✅ **Tracking Tốt:** Team Lead nắm được tiến độ chi tiết từng ngày
✅ **Transparency:** Mọi người hiểu rõ ai đang làm gì
✅ **Communication:** Dễ xác định vấn đề sớm và giải quyết
✅ **History:** Giữ lại lịch sử báo cáo để reference sau
✅ **Feedback:** Team Lead có thể feedback trực tiếp trên báo cáo

## Future Enhancements

- 📊 Dashboard để xem tổng quan tiến độ toàn dự án
- 📧 Notification khi có feedback từ team lead
- 📄 Export báo cáo thành PDF/Excel
- 🔔 Reminder hôm nay chưa báo cáo
- 📈 Thống kê tiến độ (trends, averages, etc)
- 🏷️ Tags/categories để phân loại công việc

---
**Ngày tạo:** 2026-01-03
**Phiên bản:** 1.0
**Status:** ✅ Hoàn thành
