# Hệ Thống Phê Duyệt Công Việc

## Tổng Quan

Hệ thống phê duyệt công việc cho phép Team Lead kiểm soát và đảm bảo chất lượng công việc trước khi đánh dấu hoàn thành. Công việc phải được người quản lý duyệt trước khi chuyển sang trạng thái "Đã hoàn thành".

## Workflow

```
┌─────────────┐
│   TODO      │ Công việc mới tạo
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ IN_PROGRESS │ Đang thực hiện
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ PENDING_APPROVAL │ Người được giao việc submit để xin duyệt
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────┐  ┌─────────┐
│ DONE │  │  TODO   │ Team Lead duyệt/từ chối
└──────┘  └─────────┘
          (+ Thông báo lý do từ chối)
```

## Trạng Thái Công Việc

### 1. **TODO** (Cần làm)
- Công việc mới được tạo hoặc bị từ chối
- Người được giao việc có thể bắt đầu làm

### 2. **IN_PROGRESS** (Đang thực hiện)
- Công việc đang được thực hiện
- Người được giao việc đang làm việc

### 3. **PENDING_APPROVAL** (Chờ duyệt)
- Người được giao việc đã hoàn thành và submit để xin duyệt
- Chờ Team Lead phê duyệt
- **Lưu ý**: Chỉ Team Lead mới có quyền duyệt/từ chối

### 4. **DONE** (Đã hoàn thành)
- Công việc đã được Team Lead duyệt
- Công việc hoàn tất

## Trạng Thái Phê Duyệt

### ApprovalStatus

- **PENDING**: Đang chờ duyệt
- **APPROVED**: Đã được duyệt
- **REJECTED**: Bị từ chối

## Quyền Hạn

### Người được giao việc (Assignee)
- ✅ Cập nhật trạng thái từ TODO → IN_PROGRESS
- ✅ Cập nhật trạng thái từ IN_PROGRESS → PENDING_APPROVAL
- ❌ Không thể tự chuyển sang DONE (phải được duyệt)

### Team Lead
- ✅ Duyệt công việc: PENDING_APPROVAL → DONE
- ✅ Từ chối công việc: PENDING_APPROVAL → TODO (kèm lý do)
- ✅ Xem tất cả công việc trong dự án

## API Endpoints

### 1. Submit công việc để duyệt

```http
PUT /api/tasks/:id
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "PENDING_APPROVAL"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "...",
    "title": "...",
    "status": "PENDING_APPROVAL",
    "approvalStatus": "PENDING"
  }
}
```

### 2. Duyệt công việc (Team Lead only)

```http
PUT /api/tasks/:id/approve
Authorization: Bearer {token}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Công việc đã được duyệt",
  "data": {
    "_id": "...",
    "title": "...",
    "status": "DONE",
    "approvalStatus": "APPROVED",
    "approvedBy": {
      "_id": "...",
      "name": "Team Lead Name",
      "email": "..."
    },
    "approvedAt": "2024-01-15T10:30:00.000Z",
    "completedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Chỉ Team Lead mới có quyền duyệt công việc"
}
```

### 3. Từ chối công việc (Team Lead only)

```http
PUT /api/tasks/:id/reject
Content-Type: application/json
Authorization: Bearer {token}

{
  "reason": "Công việc chưa đạt yêu cầu. Vui lòng kiểm tra lại phần X và Y."
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Công việc đã bị từ chối",
  "data": {
    "_id": "...",
    "title": "...",
    "status": "TODO",
    "approvalStatus": "REJECTED",
    "approvedBy": {
      "_id": "...",
      "name": "Team Lead Name"
    },
    "rejectionReason": "Công việc chưa đạt yêu cầu...",
    "approvedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Thông Báo

### 1. Khi công việc được duyệt
- **Người nhận**: Người được giao việc
- **Loại**: `TASK_APPROVED`
- **Nội dung**: "Công việc '{title}' đã được duyệt và hoàn thành"

### 2. Khi công việc bị từ chối
- **Người nhận**: Người được giao việc
- **Loại**: `TASK_REJECTED`
- **Nội dung**: "Công việc '{title}' bị từ chối. Lý do: {reason}"
- **Ưu tiên**: HIGH
- **Metadata**: Chứa lý do từ chối

## Ví Dụ Sử Dụng

### Kịch Bản 1: Công việc được duyệt

1. **Bước 1**: Người được giao việc hoàn thành và submit
   ```javascript
   // PUT /api/tasks/abc123
   { "status": "PENDING_APPROVAL" }
   ```

2. **Bước 2**: Team Lead duyệt
   ```javascript
   // PUT /api/tasks/abc123/approve
   // → Task status = DONE, approvalStatus = APPROVED
   ```

3. **Bước 3**: Người được giao việc nhận thông báo
   ```
   "Công việc 'Setup React Native project' đã được duyệt và hoàn thành"
   ```

### Kịch Bản 2: Công việc bị từ chối

1. **Bước 1**: Người được giao việc submit
   ```javascript
   { "status": "PENDING_APPROVAL" }
   ```

2. **Bước 2**: Team Lead từ chối
   ```javascript
   // PUT /api/tasks/abc123/reject
   {
     "reason": "Code chưa được test đầy đủ. Vui lòng thêm unit tests."
   }
   ```

3. **Bước 3**: Công việc chuyển về TODO
   - Status: TODO
   - approvalStatus: REJECTED
   - rejectionReason: "Code chưa được test đầy đủ..."

4. **Bước 4**: Người được giao việc nhận thông báo và làm lại

## Validation

### Quy Tắc Chuyển Trạng Thái

- ❌ Không thể chuyển DONE → PENDING_APPROVAL
- ❌ Không thể chuyển sang DONE nếu chưa được duyệt
- ✅ Chỉ có thể duyệt task ở trạng thái PENDING_APPROVAL
- ✅ Lý do từ chối là bắt buộc khi reject

### Quy Tắc Quyền Hạn

- ✅ Chỉ Team Lead mới có quyền approve/reject
- ✅ Workspace Admin có thể override (nếu cần)

## Database Schema

```javascript
// Task Model
{
  // ... existing fields
  
  // Approval fields
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: null
  },
  approvedBy: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  }
}
```

## Best Practices

1. **Luôn cung cấp lý do rõ ràng khi từ chối**
   - Giúp người được giao việc hiểu và cải thiện
   - Lưu lại lịch sử để tham khảo

2. **Xem xét kỹ trước khi duyệt**
   - Kiểm tra kết quả công việc
   - Đảm bảo đáp ứng yêu cầu

3. **Thông báo kịp thời**
   - Duyệt/từ chối càng sớm càng tốt
   - Giúp team member không bị trễ deadline

4. **Theo dõi công việc chờ duyệt**
   - Lọc theo status: PENDING_APPROVAL
   - Ưu tiên duyệt công việc gần deadline

## Migration

Nếu bạn đang nâng cấp từ phiên bản cũ:

```javascript
// Các task có status = DONE sẽ tự động có:
// - approvalStatus = APPROVED (giả định đã được duyệt)
// - approvedAt = completedAt

// Các task khác giữ nguyên
```

## Testing

### Test Cases Cần Kiểm Tra

1. ✅ Người được giao việc có thể submit PENDING_APPROVAL
2. ✅ Team Lead có thể approve task
3. ✅ Team Lead có thể reject task với lý do
4. ✅ Member thường không thể approve/reject
5. ✅ Không thể chuyển DONE nếu chưa approve
6. ✅ Thông báo được gửi đúng khi approve/reject
7. ✅ Lý do từ chối được lưu trong database

## Câu Hỏi Thường Gặp

**Q: Nếu Team Lead không online thì sao?**
A: Workspace Admin có thể thay thế Team Lead để duyệt công việc.

**Q: Có thể tự approve công việc của mình không?**
A: Không, phải có người khác (Team Lead) duyệt.

**Q: Công việc bị từ chối có thể submit lại không?**
A: Có, sau khi sửa lại theo yêu cầu, có thể submit lại PENDING_APPROVAL.

**Q: Có giới hạn số lần submit không?**
A: Không, nhưng nên đọc kỹ lý do từ chối để tránh submit nhiều lần.
