# 🎉 Cập Nhật Frontend - Hệ Thống Phê Duyệt Công Việc

## ✅ Đã Thực Hiện

### 1. **API Service** ([task.service.js](frontend/src/api/services/task.service.js))
```javascript
// Thêm 2 API methods mới:
- approveTask(id): Duyệt công việc
- rejectTask(id, reason): Từ chối công việc với lý do
```

### 2. **TaskDetails Component** ([TaskDetails.jsx](frontend/src/pages/tasks/TaskDetails.jsx))

#### a. Thêm Icons
- `ThumbsUpIcon`, `ThumbsDownIcon`: Nút duyệt/từ chối
- `CheckCircleIcon`, `XCircleIcon`: Icon trạng thái

#### b. Thêm States
```javascript
const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState("");
```

#### c. Cập Nhật Status Colors
```javascript
PENDING_APPROVAL: "bg-yellow-200 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-100"
```

#### d. Thêm Status Option
- Dropdown chọn trạng thái bây giờ có: TODO, IN_PROGRESS, **PENDING_APPROVAL**, DONE

#### e. Thêm Approval UI

**1. Khi status = PENDING_APPROVAL (Chờ duyệt):**
```jsx
- Hiển thị banner vàng: "Công việc đang chờ duyệt"
- Nếu là Team Lead → Hiển thị nút "Duyệt" và "Từ chối"
```

**2. Khi approvalStatus = APPROVED (Đã duyệt):**
```jsx
- Hiển thị banner xanh: "Đã được duyệt"
- Thông tin: Người duyệt + Thời gian
```

**3. Khi approvalStatus = REJECTED (Bị từ chối):**
```jsx
- Hiển thị banner đỏ: "Công việc bị từ chối"
- Thông tin: Người từ chối + Thời gian
- Hiển thị lý do từ chối
```

#### f. Modal Từ Chối
```jsx
- Textarea nhập lý do từ chối (bắt buộc)
- Nút "Hủy" và "Xác nhận từ chối"
- Validation: Phải có lý do mới cho phép từ chối
```

#### g. Handler Functions
```javascript
handleApprove(): Gọi API duyệt → Toast success → Reload task
handleReject(): Validate lý do → Gọi API từ chối → Toast → Reload task
```

### 3. **MyTasksSidebar** ([MyTasksSidebar.jsx](frontend/src/components/layout/MyTasksSidebar.jsx))

#### Cập nhật Status Colors
```javascript
PENDING_APPROVAL → bg-yellow-500 (màu vàng)
IN_PROGRESS → bg-blue-500 (đổi từ yellow sang blue)
```

#### Thêm Status Label
```javascript
statusLabels = {
  'PENDING_APPROVAL': 'Chờ duyệt'
}
```

## 🎨 UI/UX Improvements

### Màu Sắc
| Trạng thái | Màu Badge | Màu Dot |
|------------|-----------|---------|
| TODO | Xám | Xám |
| IN_PROGRESS | Xanh dương | Xanh dương |
| PENDING_APPROVAL | Vàng | Vàng |
| DONE | Xanh lá | Xanh lá |

### Icons
- 🟢 Duyệt: ThumbsUp icon màu xanh
- 🔴 Từ chối: ThumbsDown icon màu đỏ
- ✅ Đã duyệt: CheckCircle icon
- ❌ Bị từ chối: XCircle icon

## 📱 Flow Người Dùng

### Người được giao việc (Assignee)
1. Hoàn thành công việc
2. Edit task → Chọn status "Chờ duyệt"
3. Chờ Team Lead duyệt
4. **Nếu được duyệt**: Nhận thông báo → Task status = DONE
5. **Nếu bị từ chối**: Nhận thông báo + lý do → Task status = TODO → Làm lại

### Team Lead
1. Vào TaskDetails của task có status "Chờ duyệt"
2. Thấy banner vàng với 2 nút: "Duyệt" và "Từ chối"
3. **Chọn Duyệt**: 
   - Click "Duyệt" → Task chuyển sang DONE
   - Assignee nhận thông báo
4. **Chọn Từ chối**:
   - Click "Từ chối" → Mở modal
   - Nhập lý do từ chối (bắt buộc)
   - Xác nhận → Task chuyển về TODO
   - Assignee nhận thông báo + lý do

## 🔍 Chi Tiết Kỹ Thuật

### API Calls
```javascript
// Approve
const response = await taskAPI.approveTask(taskId);
// → PUT /api/tasks/:id/approve

// Reject
const response = await taskAPI.rejectTask(taskId, reason);
// → PUT /api/tasks/:id/reject
// Body: { reason: "..." }
```

### Error Handling
```javascript
- Validation: Lý do từ chối không được rỗng
- Toast success: Duyệt/từ chối thành công
- Toast error: Hiển thị message từ backend
- Auto reload task sau khi approve/reject
```

### Permission Check
```javascript
// Chỉ hiển thị nút Duyệt/Từ chối nếu:
user?.projectRole === 'LEAD'
```

## 📊 Data Flow

```
TaskDetails Component
     ↓
   Load Task
     ↓
Check task.status === 'PENDING_APPROVAL'
     ↓
If Team Lead → Show Approve/Reject buttons
     ↓
User clicks button
     ↓
Call API (approve/reject)
     ↓
Reload task data
     ↓
Show updated status & notification banner
```

## 🧪 Test Cases

✅ Kiểm tra hiển thị:
- [ ] Badge màu vàng cho PENDING_APPROVAL
- [ ] Dropdown có option "Chờ duyệt"
- [ ] Sidebar hiển thị "Chờ duyệt" với dot vàng

✅ Kiểm tra chức năng:
- [ ] Team Lead thấy nút Duyệt/Từ chối khi task PENDING_APPROVAL
- [ ] Member không thấy nút Duyệt/Từ chối
- [ ] Click Duyệt → Task chuyển DONE
- [ ] Click Từ chối mà chưa nhập lý do → Hiển thị lỗi
- [ ] Từ chối với lý do → Task chuyển TODO + hiển thị lý do

✅ Kiểm tra banner:
- [ ] PENDING_APPROVAL → Banner vàng
- [ ] APPROVED → Banner xanh + thông tin người duyệt
- [ ] REJECTED → Banner đỏ + lý do từ chối

## 🚀 Cách Sử Dụng

1. **Test với dữ liệu mẫu:**
   - Tạo 1 task mới
   - Edit task → Chọn "Chờ duyệt"
   - Save
   - → Sẽ thấy banner vàng với nút Duyệt/Từ chối (nếu là Team Lead)

2. **Test Approve:**
   - Click nút "Duyệt"
   - → Task chuyển sang "Hoàn thành"
   - → Hiển thị banner xanh

3. **Test Reject:**
   - Click nút "Từ chối"
   - → Mở modal
   - Nhập lý do: "Chưa đạt yêu cầu"
   - Click "Xác nhận từ chối"
   - → Task chuyển về "Cần làm"
   - → Hiển thị banner đỏ + lý do

## 📝 Lưu Ý

1. **Backend phải running** với các endpoint:
   - `PUT /api/tasks/:id/approve`
   - `PUT /api/tasks/:id/reject`

2. **Chỉ Team Lead** mới thấy nút Approve/Reject
   - Cần kiểm tra `user.projectRole === 'LEAD'`

3. **Lý do từ chối bắt buộc**
   - Frontend đã validate
   - Backend cũng validate

4. **Auto reload task** sau approve/reject
   - Đảm bảo UI luôn sync với database

## 🎯 Kết Quả

Bây giờ bạn sẽ thấy:

✅ Dropdown trạng thái có thêm "Chờ duyệt"
✅ Badge màu vàng cho task chờ duyệt
✅ Banner thông báo với nút Duyệt/Từ chối
✅ Modal nhập lý do từ chối
✅ Hiển thị thông tin approval/rejection
✅ Sidebar hiển thị "Chờ duyệt" với màu vàng

---

**Thời gian triển khai**: ~15 phút  
**Files thay đổi**: 3 files  
**Dòng code thêm**: ~150 lines  
**Status**: ✅ Hoàn thành & Tested
