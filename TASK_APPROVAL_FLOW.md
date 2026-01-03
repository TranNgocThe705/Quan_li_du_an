# 🎯 TASK APPROVAL WORKFLOW - HƯỚNG DẪN SỬ DỤNG

## 📋 TỔNG QUAN

Hệ thống phê duyệt công việc (Task Approval Workflow) cho phép kiểm soát chất lượng công việc trước khi đánh dấu hoàn thành. Quy trình bao gồm:

1. **Thành viên** hoàn thành task → Gửi yêu cầu phê duyệt
2. **Trưởng nhóm** nhận thông báo → Xem xét task
3. **Phê duyệt** ✅ hoặc **Từ chối** ❌
4. Nếu từ chối → Thành viên sửa lại → Gửi duyệt lại

---

## 🚀 LUỒNG HOẠT ĐỘNG CHI TIẾT

### 1️⃣ **THÀNH VIÊN - Hoàn thành công việc**

#### Bước 1: Làm việc và cập nhật tiến độ
- Mở task đang được giao
- Cập nhật trạng thái: `TODO` → `IN_PROGRESS` (Đang làm)
- Hoàn thành checklist (nếu có)
- Upload file đính kèm (nếu cần)

#### Bước 2: Gửi yêu cầu phê duyệt
- Khi hoàn thành xong, bấm nút **"Đánh dấu hoàn thành"** 
- Hệ thống kiểm tra:
  - ✅ Task phải ở trạng thái `IN_PROGRESS`
  - ✅ Tất cả checklist bắt buộc phải hoàn thành
- Task chuyển sang trạng thái: `PENDING_APPROVAL` (Chờ duyệt)
- Thông báo gửi đến **Trưởng nhóm** và **Approvers**

#### Thông báo nhận được:
```
✅ "Đã gửi yêu cầu phê duyệt thành công"
```

---

### 2️⃣ **TRƯỞNG NHÓM - Xem xét và phê duyệt**

#### Bước 1: Nhận thông báo
- Nhận thông báo realtime:
  > 🔔 "[Tên thành viên] đã hoàn thành công việc '[Task name]' và chờ bạn phê duyệt"

#### Bước 2: Xem danh sách chờ duyệt
- Vào trang **"Pending Approvals"** (Chờ phê duyệt)
- Xem danh sách tasks cần duyệt với thông tin:
  - Tiêu đề task
  - Người gửi
  - Thời gian chờ
  - Độ ưu tiên
  - Checklist progress

#### Bước 3: Xem chi tiết task
- Click vào task để xem chi tiết:
  - Mô tả công việc
  - Checklist đã hoàn thành
  - File đính kèm
  - Comments
  - Lịch sử phê duyệt

#### Bước 4: Ra quyết định

**OPTION A: ✅ PHÊ DUYỆT**
- Bấm nút **"Duyệt"**
- Task chuyển sang: `DONE` (Hoàn thành)
- Thông báo gửi cho thành viên:
  > ✅ "Công việc '[Task name]' đã được [Tên trưởng nhóm] phê duyệt"

**OPTION B: ❌ TỪ CHỐI**
- Bấm nút **"Từ chối"**
- Nhập **lý do từ chối** (bắt buộc, tối thiểu 5 ký tự)
- Task quay lại: `IN_PROGRESS` (Đang làm)
- Approval status: `REJECTED`
- Thông báo gửi cho thành viên:
  > ❌ "Công việc '[Task name]' cần làm lại. Lý do: [Rejection reason]"

---

### 3️⃣ **SAU KHI BỊ TỪ CHỐI - Sửa lại và gửi lại**

#### Thành viên nhận thông báo từ chối:
- Xem lý do từ chối trong task detail (banner màu đỏ)
- Đọc kỹ feedback từ trưởng nhóm
- Sửa lại công việc theo yêu cầu
- Gửi lại yêu cầu phê duyệt (bấm nút **"Đánh dấu hoàn thành"** lần nữa)
- Số lần sửa được tính trong **Approval Metrics**

---

## 🎨 GIAO DIỆN & CHỨC NĂNG

### 📱 **Task Detail Page**

#### 🟢 Khi task đang IN_PROGRESS (Thành viên)
```
┌─────────────────────────────────────────┐
│ [←] Task Title                          │
│                   [Đánh dấu hoàn thành] │
└─────────────────────────────────────────┘
```

#### 🟡 Khi task PENDING_APPROVAL (Trưởng nhóm)
```
┌─────────────────────────────────────────┐
│ ⏳ Công việc đang chờ duyệt              │
│ Công việc này cần được phê duyệt...     │
│                        [Duyệt] [Từ chối]│
└─────────────────────────────────────────┘
```

#### ✅ Khi task APPROVED
```
┌─────────────────────────────────────────┐
│ ✓ Đã được duyệt                         │
│ Bởi [Team Lead] vào 28/12/2025 14:30   │
└─────────────────────────────────────────┘
```

#### ❌ Khi task REJECTED
```
┌─────────────────────────────────────────┐
│ ✗ Công việc bị từ chối                  │
│ Bởi [Team Lead] vào 28/12/2025 14:30   │
│ ┌─────────────────────────────────────┐ │
│ │ Lý do:                               │ │
│ │ Code chưa pass unit test, cần sửa    │ │
│ │ bug ở function calculateTotal()      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 📊 **Approval History Timeline**

Hiển thị đầy đủ lịch sử phê duyệt của task:

```
┌──────────────────────────────────────────────┐
│ 🕐 Lịch sử phê duyệt                         │
├──────────────────────────────────────────────┤
│ ❌ Đã từ chối - 28/12/2025 14:30            │
│    Từ chối bởi: Lê Văn Lead                  │
│    Lý do: Code chưa pass unit test           │
├──────────────────────────────────────────────┤
│ ⏳ Đang chờ duyệt - 28/12/2025 10:00        │
│    Người phê duyệt: Lê Văn Lead              │
├──────────────────────────────────────────────┤
│ 📊 Thống kê                                  │
│    Gửi duyệt lần đầu: 28/12/2025 10:00      │
│    Số lần sửa: 2                             │
└──────────────────────────────────────────────┘
```

---

## 🔔 HỆ THỐNG THÔNG BÁO

### Thông báo khi Submit for Approval:
```
Người nhận: Team Lead, Approvers
Tiêu đề: "Công việc chờ phê duyệt"
Nội dung: "[Tên member] đã hoàn thành công việc '[Task]' và chờ bạn phê duyệt"
Priority: HIGH
```

### Thông báo khi Approve:
```
Người nhận: Assignee (Thành viên)
Tiêu đề: "Công việc được duyệt"
Nội dung: "Công việc '[Task]' đã được [Team Lead] phê duyệt ✅"
Priority: MEDIUM
```

### Thông báo khi Reject:
```
Người nhận: Assignee (Thành viên)
Tiêu đề: "Công việc bị từ chối"
Nội dung: "Công việc '[Task]' bị từ chối. Lý do: [Reason] ❌"
Priority: HIGH
```

---

## 🛡️ KIỂM SOÁT QUYỀN HẠN

### Thành viên (Member):
- ✅ Xem task được giao
- ✅ Cập nhật task (khi là assignee)
- ✅ Gửi yêu cầu phê duyệt (khi là assignee)
- ❌ KHÔNG THỂ tự duyệt task của mình
- ❌ KHÔNG THỂ chuyển PENDING_APPROVAL → DONE

### Trưởng nhóm (Team Lead):
- ✅ Tất cả quyền của Member
- ✅ Xem danh sách tasks chờ duyệt
- ✅ Phê duyệt task
- ✅ Từ chối task với lý do
- ✅ Bypass approval (khẩn cấp)

### Admin Workspace:
- ✅ Tất cả quyền của Team Lead
- ✅ Quản lý approval policies
- ✅ Xem báo cáo approval metrics

---

## 📊 APPROVAL METRICS & TRACKING

Hệ thống tự động theo dõi:

### Metrics được lưu:
- `submittedAt`: Thời điểm gửi duyệt lần đầu
- `firstReviewAt`: Thời điểm review lần đầu
- `totalReviewTime`: Tổng thời gian review (phút)
- `revisionCount`: Số lần phải sửa lại

### Hiển thị trong Task:
```javascript
{
  "approvalMetrics": {
    "submittedAt": "2025-12-28T10:00:00Z",
    "revisionCount": 2,
    "totalReviewTime": 45
  }
}
```

---

## ⚙️ CẤU HÌNH APPROVAL POLICY

### Auto-Approval (Tùy chọn):
- Tự động phê duyệt sau X giờ nếu không có phản hồi
- Cấu hình trong Project Settings

### Checklist Required:
- Thiết lập các mục bắt buộc phải hoàn thành
- Không thể submit nếu chưa hoàn thành checklist required

### Escalation:
- Tự động thông báo Admin nếu task chờ quá lâu
- Cấu hình thời gian escalation

---

## 🎯 BEST PRACTICES

### Cho Thành viên:
1. ✅ Hoàn thành đầy đủ checklist trước khi submit
2. ✅ Upload file minh chứng (screenshot, demo)
3. ✅ Viết comment giải thích những gì đã làm
4. ✅ Tự kiểm tra kỹ trước khi gửi duyệt
5. ✅ Đọc kỹ lý do từ chối và sửa đúng vấn đề

### Cho Trưởng nhóm:
1. ✅ Review task trong vòng 24h
2. ✅ Viết rõ ràng lý do từ chối
3. ✅ Provide constructive feedback
4. ✅ Kiểm tra kỹ checklist và file đính kèm
5. ✅ Ghi nhận những gì làm tốt trong comment

---

## 🔧 API ENDPOINTS

### Backend APIs:
```javascript
POST   /api/tasks/:id/submit-for-approval  // Thành viên gửi duyệt
PUT    /api/tasks/:id/approve               // Trưởng nhóm duyệt
PUT    /api/tasks/:id/reject                // Trưởng nhóm từ chối
GET    /api/tasks/pending-approval          // Lấy danh sách chờ duyệt
POST   /api/tasks/:id/bypass-approval       // Bypass (emergency)
```

### Frontend APIs:
```javascript
taskAPI.submitForApproval(taskId)           // Gửi duyệt
taskAPI.approveTask(taskId)                  // Duyệt
taskAPI.rejectTask(taskId, reason)           // Từ chối
taskAPI.getPendingApprovals(projectId)       // Lấy danh sách
```

---

## 📝 VÍ DỤ SỬ DỤNG

### Scenario 1: Thành công ngay lần đầu
```
1. Member: Làm task "Tích hợp thanh toán"
2. Member: Bấm "Đánh dấu hoàn thành"
   → Task: IN_PROGRESS → PENDING_APPROVAL
3. Team Lead: Nhận thông báo, review task
4. Team Lead: Bấm "Duyệt"
   → Task: PENDING_APPROVAL → DONE ✅
5. Member: Nhận thông báo "Đã được duyệt"
```

### Scenario 2: Bị từ chối và phải sửa lại
```
1. Member: Làm task "Fix bug login"
2. Member: Bấm "Đánh dấu hoàn thành"
   → Task: IN_PROGRESS → PENDING_APPROVAL
3. Team Lead: Review, thấy chưa pass test
4. Team Lead: Bấm "Từ chối"
   Lý do: "Unit test case 3 chưa pass"
   → Task: PENDING_APPROVAL → IN_PROGRESS
5. Member: Nhận thông báo, đọc lý do
6. Member: Sửa lại code, pass test
7. Member: Bấm "Đánh dấu hoàn thành" lần 2
   → Task: IN_PROGRESS → PENDING_APPROVAL
   → revisionCount = 2
8. Team Lead: Review lại, OK
9. Team Lead: Bấm "Duyệt"
   → Task: PENDING_APPROVAL → DONE ✅
```

---

## 🎓 TÓM TẮT

### Trạng thái Task:
```
TODO → IN_PROGRESS → PENDING_APPROVAL → DONE
                           ↓
                      REJECTED (quay lại IN_PROGRESS)
```

### Quyền hạn:
- **Member**: Làm việc + Submit
- **Team Lead**: Review + Approve/Reject
- **Admin**: Quản lý + Bypass

### Thông báo:
- Submit → Gửi Team Lead
- Approve → Gửi Member
- Reject → Gửi Member (có lý do)

---

## ✨ TÍNH NĂNG NỔI BẬT

✅ **Quy trình phê duyệt chặt chẽ**  
✅ **Thông báo realtime**  
✅ **Lịch sử phê duyệt đầy đủ**  
✅ **Metrics & tracking**  
✅ **Checklist validation**  
✅ **Rejection feedback**  
✅ **Auto-approval (optional)**  
✅ **Escalation support**  

---

**🎯 Hệ thống đã sẵn sàng sử dụng!**
