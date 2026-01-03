# Luồng Hoạt Động Hệ Thống Phê Duyệt Thông Minh

## 📋 Tổng Quan

Hệ thống phê duyệt thông minh (Smart Approval System) tự động hóa quy trình phê duyệt công việc với các tính năng:
- ✅ Phê duyệt dựa theo chính sách (Policy-based)
- ⏰ Tự động phê duyệt sau thời gian chờ
- 📝 Checklist kiểm tra chất lượng
- 📢 Leo thang khi quá hạn
- 🚨 Bỏ qua phê duyệt trong trường hợp khẩn cấp

---

## 🔄 Luồng 1: Phê Duyệt Thủ Công (Manual Approval)

### Bước 1: Developer Hoàn Thành Công Việc

**Hành động của Developer:**
```
1. Developer code xong tính năng
2. Chạy test, kiểm tra code
3. Vào chi tiết task
4. Thay đổi trạng thái từ "IN_PROGRESS" → "PENDING_APPROVAL"
```

**Điều kiện:**
- Task thuộc loại yêu cầu phê duyệt (STORY, TASK, BUG)
- Project đã bật tính năng phê duyệt
- Có chính sách phê duyệt (Approval Policy) được cấu hình

---

### Bước 2: Hệ Thống Áp Dụng Chính Sách Phê Duyệt

**Backend tự động thực hiện:**

```javascript
// File: backend/controllers/taskController.js
// Hàm: updateTask()

if (newStatus === 'PENDING_APPROVAL') {
  await AutoApprovalService.applyApprovalPolicy(task);
}
```

**Chi tiết xử lý trong `AutoApprovalService.applyApprovalPolicy()`:**

1. **Lấy chính sách phê duyệt:**
   ```javascript
   const policy = await ApprovalPolicy.findOne({ 
     projectId: task.projectId,
     enabled: true 
   });
   ```

2. **Tìm quy tắc phù hợp:**
   ```javascript
   const rule = policy.getApplicableRule(task);
   // Duyệt qua các rule theo thứ tự priority
   // Kiểm tra điều kiện: taskType, priority, storyPoints, assignee, labels
   ```

3. **Áp dụng quy tắc:**
   - Tạo checklist từ template
   - Xác định người phê duyệt (Team Lead, PM, Tech Lead...)
   - Thiết lập timer tự động phê duyệt (nếu có)
   - Thiết lập timer leo thang (nếu có)

4. **Tạo checklist:**
   ```javascript
   task.checklist = policy.checklistTemplates[task.type] || [];
   // Ví dụ cho STORY:
   // - Code review completed ✓ (Required)
   // - Unit tests written ✓ (Required)
   // - Documentation updated ☐ (Optional)
   ```

5. **Thiết lập auto-approve:**
   ```javascript
   if (rule.actions.autoApprove) {
     task.approvalConfig = {
       autoApprove: true,
       autoApproveAt: new Date(Date.now() + hours * 3600000)
       // Ví dụ: 48 giờ sau = 2025-12-27 10:00:00
     };
   }
   ```

6. **Xác định người phê duyệt:**
   ```javascript
   const approvers = await getApprovers(rule.actions.approvers, projectId);
   // Lấy danh sách users có role "Team Lead" trong project
   ```

7. **Gửi thông báo:**
   ```javascript
   task.approvalRequests = [{
     requestedAt: new Date(),
     approvers: [teamLeadId1, teamLeadId2],
     status: 'PENDING'
   }];
   
   // Gửi notification đến từng approver
   await notifyApprovers(task, approvers);
   ```

---

### Bước 3: Team Lead Nhận Thông Báo

**Thông báo được tạo:**
```javascript
{
  type: 'TASK_APPROVAL_REQUIRED',
  title: 'Task cần phê duyệt',
  message: 'Nguyễn Văn A yêu cầu phê duyệt task "Xây dựng API đăng nhập"',
  taskId: '...',
  projectId: '...',
  recipientId: teamLeadId
}
```

**Team Lead thấy:**
- 🔔 Thông báo trong notification bell
- 📊 Task xuất hiện trong trang "Pending Approvals" (/pending-approvals)
- ⏰ Countdown timer (nếu có auto-approve)

---

### Bước 4: Team Lead Xem Chi Tiết Task

**Team Lead truy cập vào:**
- Trang "Pending Approvals" → Click "View Details"
- Hoặc vào Project → Click vào task

**Thông tin hiển thị:**

1. **Thông tin cơ bản:**
   - Tiêu đề task
   - Mô tả
   - Priority (HIGH, MEDIUM, LOW...)
   - Story Points
   - Assignee (Developer phụ trách)

2. **Checklist Panel:**
   ```
   ✅ Code review completed (Required) - Completed by Nguyễn Văn A
   ✅ Unit tests written (Required) - Completed by Nguyễn Văn A
   ☐ Documentation updated (Optional)
   
   Progress: 2/3 (67%)
   ```

3. **Auto-Approve Countdown (nếu có):**
   ```
   ⏰ Auto-Approve Countdown
   
   [🕐] 1 days 14 hours 23 minutes
   
   Progress: ▓▓▓▓▓▓░░░░░░░░░░ 35%
   
   Task will be auto-approved on 27/12/2025 10:00:00
   ```

4. **Nút hành động:**
   - ✅ Approve (màu xanh)
   - ❌ Reject (màu đỏ)

---

### Bước 5A: Team Lead Phê Duyệt (Approve)

**Hành động:**
```
Team Lead click nút "Approve"
```

**Backend xử lý:**
```javascript
// File: backend/controllers/taskController.js
// API: PUT /api/tasks/:id/approve

1. Kiểm tra quyền:
   - User có trong danh sách approvers không?
   - Task đang ở trạng thái PENDING_APPROVAL?

2. Kiểm tra checklist:
   const allRequiredCompleted = task.checklist
     .filter(item => item.required)
     .every(item => item.checked);
   
   if (!allRequiredCompleted) {
     throw new Error('Các mục checklist bắt buộc chưa hoàn thành');
   }

3. Cập nhật task:
   task.status = 'DONE';
   task.approvalRequests[0].status = 'APPROVED';
   task.approvalRequests[0].approvedBy = teamLeadId;
   task.approvalRequests[0].approvedAt = new Date();

4. Gửi thông báo cho Developer:
   {
     type: 'TASK_APPROVED',
     message: 'Task "..." đã được phê duyệt bởi Team Lead'
   }

5. Ghi log hoạt động:
   ActivityLog.create({
     action: 'TASK_APPROVED',
     userId: teamLeadId,
     taskId: task._id,
     details: 'Task approved by Team Lead'
   });
```

**Kết quả:**
- ✅ Task chuyển sang trạng thái "DONE"
- 📧 Developer nhận thông báo
- 🎉 Task biến mất khỏi danh sách Pending Approvals

---

### Bước 5B: Team Lead Từ Chối (Reject)

**Hành động:**
```
1. Team Lead click nút "Reject"
2. Popup hiện lên yêu cầu nhập lý do
3. Team Lead nhập: "Code chưa đủ test case, cần thêm integration tests"
4. Click "Confirm"
```

**Backend xử lý:**
```javascript
// API: PUT /api/tasks/:id/reject
// Body: { reason: "Code chưa đủ test case..." }

1. Validate:
   - Reason không được rỗng (min 5 ký tự)
   - User có quyền reject

2. Cập nhật task:
   task.status = 'IN_PROGRESS'; // Trả về In Progress
   task.approvalRequests[0].status = 'REJECTED';
   task.approvalRequests[0].rejectedBy = teamLeadId;
   task.approvalRequests[0].rejectedAt = new Date();
   task.approvalRequests[0].reason = reason;

3. Gửi thông báo cho Developer:
   {
     type: 'TASK_REJECTED',
     message: 'Task "..." bị từ chối',
     reason: 'Code chưa đủ test case...'
   }
```

**Developer nhận được:**
- ❌ Thông báo task bị reject
- 📝 Lý do từ chối chi tiết
- 🔄 Task tự động về trạng thái IN_PROGRESS

**Developer tiếp tục:**
1. Đọc lý do từ chối
2. Fix theo yêu cầu
3. Hoàn thành checklist đầy đủ
4. Gửi lại phê duyệt (chuyển về PENDING_APPROVAL)

---

## ⏰ Luồng 2: Tự Động Phê Duyệt (Auto-Approval)

### Khi nào Auto-Approval kích hoạt?

**Điều kiện:**
1. Chính sách bật tính năng auto-approve
2. Task đang ở trạng thái PENDING_APPROVAL
3. Thời gian chờ đã hết (autoApproveAt <= now)
4. Tất cả mục checklist bắt buộc đã hoàn thành

---

### Quy Trình Auto-Approval

**Bước 1: Cron Job Chạy (Mỗi Giờ)**

```javascript
// File: backend/services/cronService.js
// Schedule: '0 * * * *' (Mỗi giờ đúng)

Cron Job → AutoApprovalService.processScheduledAutoApprovals()
```

**Bước 2: Tìm Tasks Đủ Điều Kiện**

```javascript
const tasks = await Task.find({
  status: 'PENDING_APPROVAL',
  'approvalConfig.autoApprove': true,
  'approvalConfig.autoApproveAt': { $lte: new Date() }
});

// Ví dụ tìm được:
// - Task A: autoApproveAt = 2025-12-25 08:00 (đã quá 2 giờ)
// - Task B: autoApproveAt = 2025-12-25 09:45 (đã quá 15 phút)
```

**Bước 3: Kiểm Tra Từng Task**

```javascript
for (const task of tasks) {
  // 1. Kiểm tra checklist
  const progress = await task.getChecklistProgress();
  
  if (!progress.allRequiredCompleted) {
    console.log(`Task ${task._id} không thể auto-approve: checklist chưa xong`);
    continue; // Bỏ qua task này
  }
  
  // 2. Auto-approve
  task.status = 'DONE';
  task.approvalRequests[0].status = 'AUTO_APPROVED';
  task.approvalRequests[0].autoApprovedAt = new Date();
  await task.save();
  
  // 3. Gửi thông báo
  await Notification.create({
    type: 'TASK_AUTO_APPROVED',
    message: `Task "${task.title}" đã được tự động phê duyệt`,
    recipientId: task.assignee,
    taskId: task._id
  });
  
  // 4. Thông báo cho approver
  for (const approverId of task.approvalRequests[0].approvers) {
    await Notification.create({
      type: 'TASK_AUTO_APPROVED',
      message: `Task "${task.title}" đã tự động phê duyệt do quá thời gian chờ`,
      recipientId: approverId
    });
  }
}
```

**Kết quả:**
- ✅ Task tự động chuyển sang DONE
- 📧 Developer nhận thông báo "Task đã được tự động phê duyệt"
- 📧 Team Lead nhận thông báo "Task đã tự động phê duyệt do hết thời gian chờ"
- 📊 Metrics ghi nhận: auto-approval rate

---

### Ví Dụ Timeline Auto-Approval

```
25/12/2025 08:00 - Developer chuyển task sang PENDING_APPROVAL
                  → autoApproveAt = 27/12/2025 08:00 (sau 48h)

25/12/2025 08:05 - Team Lead nhận thông báo
                  → Countdown: 1 day 23h 55m

26/12/2025 10:00 - Team Lead vẫn chưa phê duyệt
                  → Countdown: 22h (màu vàng - cảnh báo)

27/12/2025 04:00 - Team Lead vẫn chưa phê duyệt
                  → Countdown: 4h (màu đỏ - khẩn cấp)

27/12/2025 08:00 - Cron job chạy
                  → Kiểm tra: autoApproveAt <= now ✓
                  → Kiểm tra: checklist hoàn thành ✓
                  → Auto-approve task
                  → Gửi thông báo

27/12/2025 08:01 - Developer nhận thông báo: "Task đã được tự động phê duyệt"
```

---

## 📢 Luồng 3: Leo Thang (Escalation)

### Khi nào Escalation kích hoạt?

**Điều kiện:**
1. Chính sách bật tính năng escalation
2. Task đang PENDING_APPROVAL quá lâu
3. Team Lead chưa phê duyệt
4. Đã qua thời gian escalateAfterHours

---

### Quy Trình Escalation

**Bước 1: Thiết Lập Escalation Timer**

```javascript
// Khi task chuyển sang PENDING_APPROVAL:

if (rule.actions.escalate) {
  task.approvalConfig.escalate = true;
  task.approvalConfig.escalateAt = new Date(
    Date.now() + rule.actions.escalateAfterHours * 3600000
  );
  // Ví dụ: 24 giờ sau = 26/12/2025 08:00
}
```

**Bước 2: Cron Job Kiểm Tra (Hàng Ngày 9:00 AM)**

```javascript
// File: backend/services/cronService.js
// Schedule: '0 9 * * *' (9 AM mỗi ngày)

AutoApprovalService.sendEscalationReminders()
```

**Bước 3: Tìm Tasks Cần Leo Thang**

```javascript
const tasks = await Task.find({
  status: 'PENDING_APPROVAL',
  'approvalConfig.escalate': true,
  'approvalConfig.escalateAt': { $lte: new Date() },
  'approvalConfig.escalationNotificationSent': { $ne: true }
});
```

**Bước 4: Gửi Thông Báo Leo Thang**

```javascript
for (const task of tasks) {
  // Lấy danh sách người nhận escalation (PM, Tech Lead...)
  const escalationRecipients = await getApprovers(
    rule.actions.escalateTo,
    task.projectId
  );
  
  // Gửi thông báo cho managers
  for (const recipientId of escalationRecipients) {
    await Notification.create({
      type: 'TASK_APPROVAL_ESCALATED',
      priority: 'HIGH',
      title: '⚠️ Task chờ phê duyệt quá lâu',
      message: `Task "${task.title}" chờ phê duyệt từ Team Lead đã ${hours}h`,
      taskId: task._id,
      recipientId: recipientId
    });
  }
  
  // Đánh dấu đã gửi escalation
  task.approvalConfig.escalationNotificationSent = true;
  await task.save();
}
```

**Kết quả:**
- 📧 Project Manager nhận thông báo khẩn cấp
- 👀 PM có thể can thiệp, nhắc nhở Team Lead
- 📊 Metrics ghi nhận: escalation cases

---

### Ví Dụ Timeline Escalation

```
25/12/2025 08:00 - Task PENDING_APPROVAL
                  → escalateAt = 26/12/2025 08:00 (sau 24h)

25/12/2025 10:00 - Team Lead nhận thông báo (chưa xử lý)

26/12/2025 08:00 - Đã quá 24h, nhưng cron chưa chạy

26/12/2025 09:00 - Cron job escalation chạy
                  → Phát hiện task quá hạn
                  → Gửi thông báo cho PM

26/12/2025 09:01 - PM nhận email/notification:
                  "⚠️ Task 'API Login' chờ phê duyệt đã 25 giờ"

26/12/2025 10:00 - PM nhắc nhở Team Lead qua Slack/Email

26/12/2025 11:00 - Team Lead phê duyệt task
```

---

## 🚨 Luồng 4: Bỏ Qua Phê Duyệt (Bypass Approval)

### Khi nào cần Bypass?

**Tình huống khẩn cấp:**
- 🔥 Hotfix production đang lỗi
- 🚨 Security patch cần deploy gấp
- ⚡ Customer impact cao, không thể chờ
- 🆘 Team Lead đi vắng, không liên lạc được

---

### Quy Trình Bypass

**Bước 1: Developer/PM Click Bypass**

```javascript
// Frontend: TaskDetails.jsx

<button onClick={handleBypassApproval}>
  ⚠️ Emergency Bypass
</button>

// Chỉ hiện với users có quyền TASK_MANAGE
```

**Bước 2: Nhập Lý Do**

```javascript
const reason = prompt('Enter reason for bypassing approval (required):');

if (!reason || reason.trim().length < 5) {
  toast.error('Lý do phải ít nhất 5 ký tự');
  return;
}

// Confirm lại
if (!confirm('Bạn chắc chắn muốn bỏ qua phê duyệt? Hành động này sẽ được ghi log.')) {
  return;
}
```

**Bước 3: Backend Xử Lý Bypass**

```javascript
// API: POST /api/tasks/:id/bypass-approval
// Body: { reason: "Production hotfix - customer impact" }

1. Kiểm tra quyền:
   if (!hasPermission(user, 'TASK_MANAGE', project)) {
     throw new Error('Không có quyền bypass approval');
   }

2. Validate lý do:
   if (!reason || reason.trim().length < 5) {
     throw new Error('Lý do không hợp lệ');
   }

3. Cập nhật task:
   task.status = 'DONE';
   task.approvalRequests[0].status = 'BYPASSED';
   task.approvalRequests[0].bypassedBy = userId;
   task.approvalRequests[0].bypassedAt = new Date();
   task.approvalRequests[0].bypassReason = reason;

4. Ghi log audit:
   ActivityLog.create({
     action: 'APPROVAL_BYPASSED',
     userId: userId,
     taskId: task._id,
     details: reason,
     severity: 'HIGH'
   });

5. Gửi thông báo cho Team Lead & PM:
   {
     type: 'APPROVAL_BYPASSED',
     priority: 'HIGH',
     message: `Task "${task.title}" đã bỏ qua phê duyệt`,
     reason: reason,
     bypassedBy: user.name
   }
```

**Kết quả:**
- ✅ Task chuyển sang DONE ngay lập tức
- 📝 Lý do bypass được lưu vĩnh viễn
- 📧 Team Lead & PM nhận thông báo
- 🔍 Audit log ghi nhận hành động

---

## 📊 Sơ Đồ Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│  DEVELOPER HOÀN THÀNH TASK                                  │
│  Thay đổi status: IN_PROGRESS → PENDING_APPROVAL           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  HỆ THỐNG TỰ ĐỘNG XỬ LÝ                                    │
│  1. Lấy Approval Policy của project                         │
│  2. Tìm rule phù hợp với task                              │
│  3. Tạo checklist từ template                              │
│  4. Xác định approvers (Team Lead, PM...)                  │
│  5. Set timer: autoApproveAt, escalateAt                   │
│  6. Gửi notification cho approvers                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  TASK Ở TRẠNG THÁI PENDING_APPROVAL                        │
│  - Hiển thị trong Pending Approvals dashboard              │
│  - Countdown timer chạy (nếu có auto-approve)              │
│  - Checklist hiển thị trong task details                   │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┬─────────────┐
         │           │           │             │
         ▼           ▼           ▼             ▼
    ┌────────┐  ┌────────┐  ┌─────────┐  ┌─────────┐
    │APPROVE │  │REJECT  │  │AUTO-    │  │BYPASS   │
    │        │  │        │  │APPROVE  │  │(Khẩn cấp)│
    └───┬────┘  └───┬────┘  └────┬────┘  └────┬────┘
        │           │            │            │
        ▼           ▼            ▼            ▼
    ┌─────────────────────────────────────────────┐
    │  Task → DONE                                 │
    │  Gửi notification cho developer              │
    │  Ghi log hoạt động                          │
    └─────────────────────────────────────────────┘
```

---

## ⚙️ Cấu Hình Mẫu

### Template 1: Simple (Đơn Giản)

**Phù hợp:** Team nhỏ, quy trình đơn giản

```yaml
Áp dụng cho: STORY
Approvers: Team Lead
Auto-approve: Sau 72 giờ
Escalation: Không
Checklist:
  - Code review completed (Required)
  - Tests passed (Required)
```

**Timeline:**
```
T+0h:   Developer → PENDING_APPROVAL
T+1h:   Team Lead nhận thông báo
T+72h:  Auto-approve (nếu chưa review)
```

---

### Template 2: Moderate (Trung Bình)

**Phù hợp:** Team vừa, có nhiều loại task

```yaml
Rule 1 - High Priority Tasks:
  Điều kiện: Priority = HIGH hoặc CRITICAL
  Approvers: Team Lead + Project Manager
  Auto-approve: Sau 24 giờ
  Escalation: Sau 12 giờ → PM
  Checklist:
    - Code review (Required)
    - Integration tests (Required)
    - Security check (Required)

Rule 2 - Normal Tasks:
  Điều kiện: Priority = MEDIUM, LOW
  Approvers: Team Lead
  Auto-approve: Sau 48 giờ
  Escalation: Không
  Checklist:
    - Code review (Required)
    - Unit tests (Required)
```

**Timeline cho HIGH priority:**
```
T+0h:   Developer → PENDING_APPROVAL
T+1h:   Team Lead + PM nhận thông báo
T+12h:  Escalation (nếu chưa review) → Thông báo PM
T+24h:  Auto-approve (nếu checklist xong)
```

---

### Template 3: Strict (Nghiêm Ngặt)

**Phù hợp:** Team lớn, dự án quan trọng

```yaml
Rule 1 - Large Stories (>= 8 points):
  Approvers: Team Lead + PM + Tech Lead (3 người)
  Auto-approve: KHÔNG
  Escalation: Sau 12 giờ → CTO
  Checklist:
    - Code review (Required)
    - Unit tests 80%+ coverage (Required)
    - Integration tests (Required)
    - Performance test (Required)
    - Security audit (Required)
    - Documentation (Required)

Rule 2 - Critical/High:
  Approvers: Team Lead + PM
  Auto-approve: KHÔNG
  Escalation: Sau 12 giờ → PM
  
Rule 3 - Others:
  Approvers: Team Lead
  Auto-approve: KHÔNG
  Escalation: Sau 24 giờ
```

**Timeline cho Large Story:**
```
T+0h:   Developer → PENDING_APPROVAL
T+1h:   Team Lead + PM + Tech Lead nhận thông báo
T+12h:  Escalation → CTO nhận thông báo
T+∞:    Phải được approve thủ công (không auto-approve)
```

---

## 📱 Trải Nghiệm Người Dùng

### Developer

**Workflow hàng ngày:**
```
1. Mở task: "Xây dựng API đăng ký user"
2. Code + test
3. Complete checklist:
   ☑️ Code review với senior
   ☑️ Unit tests 90% coverage
   ☑️ Postman test thành công
   ☐ Documentation (Optional)
4. Click "Mark as Pending Approval"
5. Nhận thông báo: "Approval request sent to Team Lead"
6. Thấy countdown: "Auto-approve in 48 hours"
7. Chờ...
8. Nhận thông báo:
   - ✅ "Task approved by Team Lead" → DONE
   - ❌ "Task rejected: Please add error handling" → Fix
   - ⏰ "Task auto-approved" → DONE
```

---

### Team Lead

**Workflow review:**
```
1. Nhận notification: "3 tasks cần phê duyệt"
2. Vào trang "Pending Approvals"
3. Thấy 3 tasks:
   - Task A: 🔴 4h còn lại (Urgent)
   - Task B: 🟡 10h còn lại (Normal)
   - Task C: 🔵 2 ngày còn lại
   
4. Click vào Task A (ưu tiên)
5. Xem checklist:
   ✅ Code review (Required) - Done
   ✅ Tests (Required) - Done
   ✅ Documentation - Done
   Progress: 100%
   
6. Review code trên GitHub/GitLab
7. Quyết định:
   - Code OK → Click "Approve" → Task DONE
   - Có vấn đề → Click "Reject" → Nhập lý do → Task về IN_PROGRESS
```

---

### Project Manager

**Workflow giám sát:**
```
1. Nhận escalation: "⚠️ Task chờ phê duyệt 26 giờ"
2. Vào task xem chi tiết
3. Thấy: Team Lead chưa review
4. Hành động:
   - Nhắc Team Lead qua Slack
   - Hoặc tự approve (nếu urgent)
   - Hoặc bypass approval (emergency)
   
5. Xem dashboard metrics:
   - Approval rate: 85%
   - Average approval time: 6 hours
   - Auto-approve rate: 15%
   - Escalation cases: 2 this week
```

---

## 🎯 Best Practices

### Cho Team Lead

✅ **Nên:**
- Review task trong 24 giờ
- Kiểm tra checklist trước khi approve
- Đưa ra lý do cụ thể khi reject
- Cấu hình auto-approve timer hợp lý (48-72h)

❌ **Không nên:**
- Bỏ qua checklist chưa hoàn thành
- Reject không có lý do rõ ràng
- Để task chờ quá lâu (gây escalation)
- Auto-approve quá sớm (< 24h)

---

### Cho Developer

✅ **Nên:**
- Hoàn thành tất cả checklist required trước khi gửi
- Viết mô tả task rõ ràng
- Test kỹ trước khi gửi approve
- Theo dõi countdown timer

❌ **Không nên:**
- Gửi approve khi checklist chưa xong
- Dựa vào auto-approve cho task quan trọng
- Bỏ qua feedback từ rejection
- Spam approve nhiều lần

---

## 🔍 Monitoring & Metrics

### Dashboard Metrics

```javascript
// Metrics thu thập:
{
  totalApprovals: 245,
  approvedManually: 208,
  autoApproved: 37,
  rejected: 15,
  bypassed: 3,
  
  averageApprovalTime: "6.5 hours",
  approvalRate: "94%",
  
  escalationCases: 8,
  escalationRate: "3.2%",
  
  byPriority: {
    CRITICAL: { avg: "2h", rate: "98%" },
    HIGH: { avg: "5h", rate: "96%" },
    MEDIUM: { avg: "8h", rate: "92%" },
    LOW: { avg: "15h", rate: "88%" }
  }
}
```

---

## 🎓 Tổng Kết

Hệ thống phê duyệt thông minh hoạt động qua 4 luồng chính:

1. **Manual Approval** - Team Lead review và approve thủ công
2. **Auto-Approval** - Tự động approve sau thời gian chờ
3. **Escalation** - Leo thang khi quá hạn
4. **Bypass** - Bỏ qua khẩn cấp có audit trail

**Lợi ích:**
- ⚡ Giảm bottleneck trong quy trình
- 📊 Đảm bảo chất lượng với checklist
- ⏰ Tự động hóa giảm công việc thủ công
- 📢 Escalation đảm bảo không bỏ sót
- 🔍 Audit trail đầy đủ cho compliance

---

**Ngày cập nhật:** 25/12/2025  
**Phiên bản:** 1.0.0  
**Trạng thái:** ✅ Production Ready
