# Sửa Lỗi: Không Thể Chọn Trạng Thái "Chờ Duyệt" Trực Tiếp

## Vấn Đề
Khi người dùng chọn trạng thái "Chờ duyệt" từ dropdown và bấm "Lưu", hệ thống báo lỗi **"Validation failed"**.

## Nguyên Nhân
Trạng thái `PENDING_APPROVAL` không thể được set trực tiếp qua dropdown vì:
- Yêu cầu phải có **approval policy** được cấu hình
- Cần có danh sách **approvers** được chỉ định
- Phải qua quy trình submit for approval đúng cách

## Giải Pháp Đã Áp Dụng

### 1. Frontend - TaskDetails.jsx
✅ **Ẩn option "Chờ duyệt"** khỏi dropdown khi edit task
- Chỉ hiển thị nếu task đã ở trạng thái PENDING_APPROVAL
- Thêm validation chặn việc chuyển sang/từ PENDING_APPROVAL

✅ **Thêm thông báo rõ ràng**:
- "Không thể chuyển trực tiếp sang 'Chờ duyệt'. Vui lòng sử dụng nút 'Đánh dấu hoàn thành'"
- "Công việc đang chờ duyệt. Vui lòng phê duyệt hoặc từ chối thay vì thay đổi trạng thái"

### 2. Frontend - ProjectTasks.jsx
✅ **Ẩn option "Chờ duyệt"** trong cả 2 view (table & card)
- Chỉ hiển thị khi task đã ở trạng thái PENDING_APPROVAL

✅ **Validation trong handleStatusChange**:
- Chặn chuyển TO PENDING_APPROVAL
- Chặn chuyển FROM PENDING_APPROVAL
- Hiển thị toast message hướng dẫn đúng cách

## Quy Trình Đúng

### Để Gửi Công Việc Chờ Duyệt:
1. Mở task details
2. Task phải ở trạng thái `IN_PROGRESS`
3. Click nút **"Đánh dấu hoàn thành"** (icon CheckCircle màu xanh)
4. Xác nhận trong dialog
5. Hệ thống sẽ:
   - Áp dụng approval policy
   - Tạo approval request
   - Chỉ định approvers
   - Chuyển status sang PENDING_APPROVAL
   - Gửi notification

### Để Thay Đổi Trạng Thái Từ Chờ Duyệt:
**KHÔNG** dùng dropdown status, thay vào đó:
- **Duyệt**: Click nút "Duyệt" (Team Lead/Approver) → Chuyển sang DONE
- **Từ chối**: Click nút "Từ chối" → Nhập lý do → Quay về IN_PROGRESS

## Code Changes

### TaskDetails.jsx
```jsx
// handleUpdate - Added validation
if (editedTask.status === 'PENDING_APPROVAL' && task.status !== 'PENDING_APPROVAL') {
    toast.error('Không thể chuyển trực tiếp sang "Chờ duyệt". Vui lòng sử dụng nút "Đánh dấu hoàn thành"');
    return;
}

// Status dropdown - Conditional rendering
{task?.status === 'PENDING_APPROVAL' && (
    <option value="PENDING_APPROVAL">Chờ duyệt</option>
)}
```

### ProjectTasks.jsx
```jsx
// handleStatusChange - Added validation
const task = tasks.find(t => t._id === taskId);

if (newStatus === 'PENDING_APPROVAL' && task?.status !== 'PENDING_APPROVAL') {
    toast.error('Không thể chuyển trực tiếp sang "Chờ duyệt"...');
    return;
}

// Dropdown - Conditional rendering
{task.status === 'PENDING_APPROVAL' && (
    <option value="PENDING_APPROVAL">Chờ Duyệt</option>
)}
```

## Kết Quả
✅ Không thể chọn "Chờ duyệt" từ dropdown nữa
✅ Phải sử dụng nút "Đánh dấu hoàn thành" để submit for approval
✅ Thông báo lỗi rõ ràng, hướng dẫn đúng cách
✅ Ngăn chặn validation error từ backend
✅ UX tốt hơn, quy trình approval đúng đắn
