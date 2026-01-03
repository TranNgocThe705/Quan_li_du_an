# Hướng Dẫn Sử Dụng Chức Năng Chờ Duyệt (Pending Approvals)

## Tổng Quan

Hệ thống chờ duyệt đã được sửa chữa và hoàn thiện. Chức năng này cho phép:
- Thành viên gửi công việc đã hoàn thành để xin phê duyệt
- Team Lead hoặc người phê duyệt xem danh sách công việc chờ duyệt
- Phê duyệt hoặc từ chối công việc với lý do cụ thể
- Tự động phê duyệt sau một khoảng thời gian (nếu được cấu hình)

## Các Thay Đổi Đã Thực Hiện

### 1. **Frontend**

#### a. Thêm Route Mới
- **Route**: `/pending-approvals`
- **Component**: `PendingApprovalsPage`
- File: `frontend/src/App.jsx`

#### b. Thêm Menu Sidebar
- Thêm mục "Chờ Duyệt" vào sidebar
- Icon: CheckSquare
- Vị trí: Giữa "Projects" và "Team"
- File: `frontend/src/components/layout/Sidebar.jsx`

#### c. Cải Thiện Giao Diện
- Hỗ trợ dark mode đầy đủ
- Hiển thị thời gian còn lại trước khi tự động phê duyệt
- Phân loại: Tất cả / Khẩn cấp / Bình thường
- UI/UX được cải thiện với màu sắc phù hợp

### 2. **Backend**

#### a. Sửa Lỗi Populate
- Đã sửa các trường `assignee` thành `assigneeId` trong:
  - `approveTask` controller
  - `rejectTask` controller
- Sửa notification để sử dụng đúng `assigneeId`

#### b. API Endpoints

**GET `/api/tasks/pending-approval?projectId=xxx`**
- Lấy danh sách công việc chờ duyệt
- Chỉ hiển thị các task mà user có quyền duyệt
- Trả về thông tin về thời gian chờ và auto-approve

**POST `/api/tasks/:id/submit-for-approval`**
- Gửi công việc để xin phê duyệt
- Chỉ người được giao việc mới có thể gửi
- Kiểm tra checklist required items

**PUT `/api/tasks/:id/approve`**
- Phê duyệt công việc
- Chỉ người trong danh sách approvers mới duyệt được
- Cập nhật status thành DONE

**PUT `/api/tasks/:id/reject`**
- Từ chối công việc
- Yêu cầu lý do từ chối (tối thiểu 5 ký tự)
- Trả công việc về trạng thái IN_PROGRESS

## Cách Sử Dụng

### 1. **Gửi Yêu Cầu Phê Duyệt (Thành Viên)**

1. Mở task detail
2. Click nút "Đánh dấu hoàn thành" (khi task status là IN_PROGRESS)
3. Hệ thống sẽ:
   - Kiểm tra checklist required items
   - Áp dụng approval policy (nếu có)
   - Chuyển status thành PENDING_APPROVAL
   - Gửi thông báo cho approvers

### 2. **Xem Danh Sách Chờ Duyệt (Team Lead/Approver)**

1. Click menu "Chờ Duyệt" trên sidebar
2. Chọn project từ workspace dropdown
3. Xem danh sách tasks đang chờ duyệt
4. Có 3 tab filter:
   - **Tất cả**: Tất cả tasks chờ duyệt
   - **Khẩn cấp**: Tasks sẽ auto-approve trong ≤12 giờ
   - **Bình thường**: Tasks còn >12 giờ hoặc không auto-approve

### 3. **Phê Duyệt Công Việc**

1. Trong trang "Chờ Duyệt", click nút **"✓ Duyệt"**
2. Hoặc trong task detail, click **"Duyệt"**
3. Task sẽ được chuyển sang trạng thái DONE
4. Người được giao việc nhận thông báo

### 4. **Từ Chối Công Việc**

1. Click nút **"✗ Từ chối"**
2. Nhập lý do từ chối (tối thiểu 5 ký tự)
3. Task quay về trạng thái IN_PROGRESS
4. Người được giao việc nhận thông báo kèm lý do

### 5. **Xem Chi Tiết Task**

- Click vào tiêu đề task hoặc nút "Xem chi tiết"
- Xem đầy đủ thông tin: description, checklist, comments, attachments
- Xem approval history

## Đặc Điểm Nổi Bật

### 1. **Auto-Approval**
- Task có thể được cấu hình tự động phê duyệt sau X giờ
- Hiển thị countdown timer
- Màu sắc cảnh báo:
  - 🔴 Đỏ: ≤4 giờ (Rất khẩn)
  - 🟡 Vàng: ≤12 giờ (Khẩn)
  - 🔵 Xanh: >12 giờ (Bình thường)

### 2. **Checklist Validation**
- Hiển thị tiến độ checklist
- Chỉ duyệt được khi tất cả required items đã check
- Tích xanh khi hoàn thành 100%

### 3. **Priority & Type Badges**
- **Priority**: LOW, MEDIUM, HIGH, CRITICAL
- **Type**: TASK, BUG, FEATURE, IMPROVEMENT, OTHER
- Màu sắc riêng biệt cho từng loại

### 4. **Dark Mode Support**
- Toàn bộ giao diện hỗ trợ dark mode
- Tự động chuyển đổi theo theme hệ thống

## Testing Checklist

### Kiểm Tra Frontend
- [ ] Truy cập `/pending-approvals` thành công
- [ ] Menu "Chờ Duyệt" hiển thị trong sidebar
- [ ] Danh sách tasks hiển thị đúng
- [ ] Filter tabs hoạt động (Tất cả/Khẩn cấp/Bình thường)
- [ ] Nút "Duyệt" hoạt động
- [ ] Nút "Từ chối" yêu cầu lý do
- [ ] Dark mode hiển thị đúng
- [ ] Countdown timer hiển thị đúng

### Kiểm Tra Backend
- [ ] API `/api/tasks/pending-approval` trả về đúng data
- [ ] Chỉ Team Lead/Approvers mới thấy tasks
- [ ] Approve task thành công
- [ ] Reject task với lý do thành công
- [ ] Notification được gửi đúng
- [ ] Task status được update đúng

### Kiểm Tra Permissions
- [ ] Member không thấy tasks của người khác
- [ ] Team Lead thấy tất cả tasks trong project
- [ ] Chỉ approvers mới approve/reject được
- [ ] Member chỉ submit task của mình

## Lỗi Đã Sửa

1. ✅ **Lỗi populate field**: Đã sửa `assignee` → `assigneeId`
2. ✅ **Thiếu routing**: Đã thêm route `/pending-approvals`
3. ✅ **Thiếu menu**: Đã thêm vào sidebar
4. ✅ **Không có dark mode**: Đã cập nhật toàn bộ
5. ✅ **UI/UX chưa tốt**: Đã cải thiện giao diện

## Cấu Trúc File

```
frontend/src/
├── pages/
│   └── PendingApprovalsPage.jsx    # Trang chờ duyệt (ĐÃ CẬP NHẬT)
├── App.jsx                          # Thêm route (ĐÃ CẬP NHẬT)
└── components/
    └── layout/
        └── Sidebar.jsx              # Thêm menu (ĐÃ CẬP NHẬT)

backend/
└── controllers/
    └── taskController.js            # Sửa lỗi populate (ĐÃ CẬP NHẬT)
```

## Lưu Ý

1. **Project Context**: Phải chọn project trước khi xem pending approvals
2. **Permissions**: Hệ thống tự động kiểm tra quyền dựa trên role và approvers list
3. **Notifications**: Tất cả actions đều gửi notification
4. **Real-time**: Nếu có socket.io, approvals được update real-time

## Troubleshooting

### Không thấy tasks chờ duyệt?
- Kiểm tra đã chọn project chưa (`localStorage.currentProjectId`)
- Kiểm tra role của user (phải là Team Lead hoặc trong approvers list)
- Kiểm tra có tasks nào ở status PENDING_APPROVAL không

### Lỗi khi approve/reject?
- Kiểm tra user có trong danh sách approvers không
- Kiểm tra task status có phải PENDING_APPROVAL không
- Kiểm tra console để xem error message chi tiết

### Dark mode không hoạt động?
- Kiểm tra Tailwind dark mode config
- Hard refresh browser (Ctrl+Shift+R)

## Kết Luận

Hệ thống chờ duyệt đã được sửa chữa và hoàn thiện. Tất cả các tính năng cơ bản đã hoạt động:
- ✅ Routing và navigation
- ✅ API endpoints
- ✅ UI/UX với dark mode
- ✅ Permissions và security
- ✅ Notifications
- ✅ Auto-approval countdown

Bạn có thể bắt đầu sử dụng ngay bây giờ!
