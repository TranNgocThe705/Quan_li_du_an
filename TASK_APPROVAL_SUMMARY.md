# Tóm Tắt: Hệ Thống Phê Duyệt Công Việc

## 📋 Mục Đích

Đảm bảo chất lượng công việc bằng cách yêu cầu Team Lead phê duyệt trước khi công việc được đánh dấu hoàn thành.

## 🔄 Workflow

```
TODO → IN_PROGRESS → PENDING_APPROVAL → DONE (Được duyệt)
                             ↓
                           TODO (Bị từ chối)
```

## ✅ Đã Triển Khai

### Backend

1. **Model Updates** ([Task.js](backend/models/Task.js))
   - Thêm `approvalStatus`: PENDING | APPROVED | REJECTED
   - Thêm `approvedBy`: ObjectId tham chiếu User
   - Thêm `approvedAt`: Thời gian duyệt
   - Thêm `rejectionReason`: Lý do từ chối

2. **Constants** ([constants.js](backend/config/constants.js))
   - Thêm trạng thái `PENDING_APPROVAL` vào TaskStatus
   - Thêm enum `ApprovalStatus`

3. **Controllers** ([taskController.js](backend/controllers/taskController.js))
   - `updateTask()`: Logic kiểm tra phê duyệt khi chuyển trạng thái
   - `approveTask()`: Team Lead duyệt công việc
   - `rejectTask()`: Team Lead từ chối công việc

4. **Routes** ([taskRoutes.js](backend/routes/taskRoutes.js))
   - `PUT /api/tasks/:id/approve` - Duyệt công việc
   - `PUT /api/tasks/:id/reject` - Từ chối công việc
   - Validation cho rejection reason

5. **Notifications**
   - Tự động gửi thông báo khi duyệt/từ chối
   - Type: `TASK_APPROVED`, `TASK_REJECTED`
   - Priority: HIGH cho rejection

## 🎯 Quy Tắc Nghiệp Vụ

### Người được giao việc (Assignee)
- ✅ Cập nhật trạng thái: TODO → IN_PROGRESS → PENDING_APPROVAL
- ❌ **Không thể** tự chuyển sang DONE
- ✅ Nhận thông báo khi được duyệt/từ chối

### Team Lead
- ✅ Duyệt: PENDING_APPROVAL → DONE
- ✅ Từ chối: PENDING_APPROVAL → TODO (bắt buộc có lý do)
- ✅ Xem tất cả công việc chờ duyệt

### Validation
- ❌ Không thể chuyển DONE → PENDING_APPROVAL
- ❌ Không thể chuyển sang DONE nếu `approvalStatus !== APPROVED`
- ✅ Chỉ duyệt task ở trạng thái PENDING_APPROVAL
- ✅ Rejection reason là bắt buộc

## 📝 API Examples

### Submit để duyệt
```bash
PUT /api/tasks/:id
{ "status": "PENDING_APPROVAL" }
```

### Duyệt công việc (Team Lead)
```bash
PUT /api/tasks/:id/approve
```

### Từ chối công việc (Team Lead)
```bash
PUT /api/tasks/:id/reject
{ "reason": "Lý do từ chối..." }
```

## 📚 Documentation

- **Chi tiết**: [task-approval-system.md](task-approval-system.md)
- **Frontend**: [frontend-approval-integration.md](frontend-approval-integration.md)

## 🚀 Bước Tiếp Theo

### Frontend (Cần làm)
1. Cập nhật TaskStatusBadge với trạng thái PENDING_APPROVAL
2. Thêm nút "Submit để duyệt" cho assignee
3. Thêm nút "Duyệt/Từ chối" cho Team Lead
4. Hiển thị thông tin approval trong TaskDetail
5. Xử lý notification types mới
6. Thêm filter cho PENDING_APPROVAL

### Testing
1. Test approve/reject APIs
2. Test permissions
3. Test notifications
4. Test validation rules

## ⚠️ Lưu Ý

1. **Migration**: Task cũ có status = DONE sẽ tự động có approvalStatus = APPROVED
2. **Quyền hạn**: Chỉ Team Lead và Workspace Admin mới có quyền duyệt
3. **Thông báo**: Priority = HIGH cho rejection để người được giao chú ý
4. **Lý do từ chối**: Bắt buộc và được lưu trong metadata notification

## 🔍 Kiểm Tra

```bash
# Test approve
curl -X PUT http://localhost:5000/api/tasks/TASK_ID/approve \
  -H "Authorization: Bearer TOKEN"

# Test reject  
curl -X PUT http://localhost:5000/api/tasks/TASK_ID/reject \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Test rejection"}'
```

## 📊 Database Changes

```javascript
// Trước
{
  status: 'DONE',
  completedAt: Date
}

// Sau
{
  status: 'DONE',
  completedAt: Date,
  approvalStatus: 'APPROVED',
  approvedBy: ObjectId,
  approvedAt: Date,
  rejectionReason: null
}
```

---

**Tạo bởi**: GitHub Copilot  
**Ngày**: ${new Date().toLocaleDateString('vi-VN')}  
**Version**: 1.0
