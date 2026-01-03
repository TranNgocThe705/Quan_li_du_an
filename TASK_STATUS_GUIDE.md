# 📊 Hướng Dẫn Nhận Biết Trạng Thái Task

## 🎯 Tổng Quan Các Trạng Thái

### 1. ✅ **Đã Được Duyệt và Hoàn Thành**
```javascript
{
  status: "DONE",
  approvalStatus: "APPROVED",
  approvalRequests: [{
    status: "APPROVED",
    approvedBy: ObjectId("..."),
    approvedAt: Date
  }]
}
```
**Màu hiển thị:** 🟢 Xanh lá  
**Icon:** ✅ Checkmark  
**Label:** "Hoàn thành - Đã duyệt"

---

### 2. ⏳ **Đang Chờ Duyệt**
```javascript
{
  status: "PENDING_APPROVAL",
  approvalStatus: "PENDING",
  approvalRequests: [{
    status: "PENDING",
    approvers: [ObjectId("..."), ObjectId("...")],
    requestedAt: Date
  }]
}
```
**Màu hiển thị:** 🟡 Vàng cam  
**Icon:** ⏳ Hourglass  
**Label:** "Chờ phê duyệt"  
**Badge:** Hiển thị số giờ chờ

---

### 3. ❌ **Đã Duyệt Nhưng Cần Làm Lại (Rejected)**
```javascript
{
  status: "IN_PROGRESS",
  approvalStatus: "REJECTED",
  approvalRequests: [{
    status: "REJECTED",
    rejectedBy: ObjectId("..."),
    rejectedAt: Date,
    reason: "Lý do từ chối..."
  }]
}
```
**Màu hiển thị:** 🔴 Đỏ  
**Icon:** ❌ X Mark  
**Label:** "Cần làm lại"  
**Badge:** Hiển thị lý do từ chối

---

### 4. 🚀 **Đang Làm (Chưa Submit)**
```javascript
{
  status: "IN_PROGRESS",
  approvalStatus: null,
  approvalRequests: []
}
```
**Màu hiển thị:** 🔵 Xanh dương  
**Icon:** 🚀 Rocket  
**Label:** "Đang làm"

---

### 5. 📝 **Chưa Bắt Đầu**
```javascript
{
  status: "TODO",
  approvalStatus: null,
  approvalRequests: []
}
```
**Màu hiển thị:** ⚪ Xám  
**Icon:** 📝 Memo  
**Label:** "Chưa bắt đầu"

---

### 6. ⚡ **Đã Duyệt Tự Động**
```javascript
{
  status: "DONE",
  approvalStatus: "APPROVED",
  approvalRequests: [{
    status: "AUTO_APPROVED",
    autoApprovedAt: Date
  }]
}
```
**Màu hiển thị:** 🟢 Xanh lá nhạt  
**Icon:** ⚡ Lightning  
**Label:** "Tự động duyệt"  
**Badge:** "Auto-approved"

---

### 7. 🔓 **Bypass Approval**
```javascript
{
  status: "DONE",
  approvalStatus: "APPROVED",
  approvalRequests: [{
    status: "BYPASSED",
    bypassedBy: ObjectId("..."),
    bypassedAt: Date,
    reason: "Lý do bypass..."
  }]
}
```
**Màu hiển thị:** 🟠 Cam  
**Icon:** 🔓 Unlocked  
**Label:** "Bypass - Khẩn cấp"  
**Badge:** Hiển thị lý do bypass

---

## 🔍 Logic Nhận Biết Trạng Thái

### Helper Function cho Frontend

```javascript
/**
 * Lấy thông tin chi tiết về trạng thái task
 * @param {Object} task - Task object
 * @returns {Object} Status info
 */
export const getTaskStatusInfo = (task) => {
  // Lấy approval request mới nhất
  const latestRequest = task.approvalRequests?.length > 0 
    ? task.approvalRequests[task.approvalRequests.length - 1]
    : null;

  // 1. Hoàn thành - Đã duyệt
  if (task.status === 'DONE' && task.approvalStatus === 'APPROVED') {
    if (latestRequest?.status === 'BYPASSED') {
      return {
        key: 'BYPASSED',
        label: 'Bypass - Khẩn cấp',
        color: 'orange',
        icon: '🔓',
        badge: {
          text: latestRequest.reason,
          color: 'orange'
        },
        details: {
          bypassedBy: latestRequest.bypassedBy,
          bypassedAt: latestRequest.bypassedAt,
          reason: latestRequest.reason
        }
      };
    }
    
    if (latestRequest?.status === 'AUTO_APPROVED') {
      return {
        key: 'AUTO_APPROVED',
        label: 'Tự động duyệt',
        color: 'success-light',
        icon: '⚡',
        badge: {
          text: 'Auto-approved',
          color: 'green'
        },
        details: {
          autoApprovedAt: latestRequest.autoApprovedAt
        }
      };
    }
    
    return {
      key: 'APPROVED',
      label: 'Hoàn thành - Đã duyệt',
      color: 'success',
      icon: '✅',
      badge: null,
      details: {
        approvedBy: latestRequest?.approvedBy,
        approvedAt: latestRequest?.approvedAt
      }
    };
  }

  // 2. Chờ phê duyệt
  if (task.status === 'PENDING_APPROVAL' && task.approvalStatus === 'PENDING') {
    const waitingHours = latestRequest?.requestedAt 
      ? Math.floor((Date.now() - new Date(latestRequest.requestedAt).getTime()) / (1000 * 60 * 60))
      : 0;
      
    return {
      key: 'PENDING_APPROVAL',
      label: 'Chờ phê duyệt',
      color: 'warning',
      icon: '⏳',
      badge: {
        text: `${waitingHours}h`,
        color: waitingHours > 24 ? 'red' : 'yellow'
      },
      details: {
        approvers: latestRequest?.approvers,
        requestedAt: latestRequest?.requestedAt,
        waitingHours
      }
    };
  }

  // 3. Bị từ chối - Cần làm lại
  if (task.approvalStatus === 'REJECTED') {
    return {
      key: 'REJECTED',
      label: 'Cần làm lại',
      color: 'error',
      icon: '❌',
      badge: {
        text: 'Đã từ chối',
        color: 'red'
      },
      details: {
        rejectedBy: latestRequest?.rejectedBy,
        rejectedAt: latestRequest?.rejectedAt,
        reason: latestRequest?.reason || task.rejectionReason
      }
    };
  }

  // 4. Đang làm
  if (task.status === 'IN_PROGRESS') {
    return {
      key: 'IN_PROGRESS',
      label: 'Đang làm',
      color: 'info',
      icon: '🚀',
      badge: null,
      details: null
    };
  }

  // 5. Chưa bắt đầu
  if (task.status === 'TODO') {
    return {
      key: 'TODO',
      label: 'Chưa bắt đầu',
      color: 'default',
      icon: '📝',
      badge: null,
      details: null
    };
  }

  // Default
  return {
    key: 'UNKNOWN',
    label: task.status,
    color: 'default',
    icon: '❓',
    badge: null,
    details: null
  };
};
```

---

## 🎨 Component UI Suggestions

### 1. Task Card Component

```jsx
import { getTaskStatusInfo } from '@/utils/taskStatus';

const TaskCard = ({ task }) => {
  const statusInfo = getTaskStatusInfo(task);
  
  return (
    <div className={`task-card border-l-4 border-${statusInfo.color}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{statusInfo.icon}</span>
          <h3>{task.title}</h3>
        </div>
        
        {/* Status Badge */}
        <div className={`badge badge-${statusInfo.color}`}>
          {statusInfo.label}
        </div>
      </div>
      
      {/* Extra Badge */}
      {statusInfo.badge && (
        <div className={`mt-2 badge badge-${statusInfo.badge.color}`}>
          {statusInfo.badge.text}
        </div>
      )}
      
      {/* Details */}
      {statusInfo.details && (
        <div className="mt-2 text-sm text-gray-600">
          {/* Render details based on status */}
          {statusInfo.key === 'REJECTED' && (
            <div className="bg-red-50 p-2 rounded">
              <strong>Lý do từ chối:</strong> {statusInfo.details.reason}
            </div>
          )}
          
          {statusInfo.key === 'PENDING_APPROVAL' && (
            <div className="bg-yellow-50 p-2 rounded">
              <strong>Đang chờ:</strong> {statusInfo.details.approvers?.length} người duyệt
              <br />
              <strong>Thời gian chờ:</strong> {statusInfo.details.waitingHours} giờ
            </div>
          )}
          
          {statusInfo.key === 'BYPASSED' && (
            <div className="bg-orange-50 p-2 rounded">
              <strong>Lý do bypass:</strong> {statusInfo.details.reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

---

### 2. Status Filter Component

```jsx
const TaskStatusFilter = ({ onFilterChange }) => {
  const statusOptions = [
    { key: 'ALL', label: 'Tất cả', icon: '📋' },
    { key: 'TODO', label: 'Chưa bắt đầu', icon: '📝', color: 'gray' },
    { key: 'IN_PROGRESS', label: 'Đang làm', icon: '🚀', color: 'blue' },
    { key: 'PENDING_APPROVAL', label: 'Chờ duyệt', icon: '⏳', color: 'yellow' },
    { key: 'APPROVED', label: 'Đã duyệt', icon: '✅', color: 'green' },
    { key: 'REJECTED', label: 'Cần làm lại', icon: '❌', color: 'red' },
    { key: 'AUTO_APPROVED', label: 'Tự động duyệt', icon: '⚡', color: 'green-light' },
    { key: 'BYPASSED', label: 'Bypass', icon: '🔓', color: 'orange' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {statusOptions.map(option => (
        <button
          key={option.key}
          onClick={() => onFilterChange(option.key)}
          className={`btn btn-${option.color}`}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};
```

---

### 3. Task List với Grouping

```jsx
const TaskList = ({ tasks }) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    const statusInfo = getTaskStatusInfo(task);
    if (!acc[statusInfo.key]) {
      acc[statusInfo.key] = [];
    }
    acc[statusInfo.key].push(task);
    return acc;
  }, {});

  const statusOrder = [
    'REJECTED',          // Ưu tiên cao nhất - Cần làm lại ngay
    'PENDING_APPROVAL',  // Chờ duyệt
    'IN_PROGRESS',       // Đang làm
    'TODO',              // Chưa bắt đầu
    'APPROVED',          // Đã hoàn thành
    'AUTO_APPROVED',     // Tự động duyệt
    'BYPASSED',          // Bypass
  ];

  return (
    <div className="task-list">
      {statusOrder.map(status => {
        const tasksInGroup = groupedTasks[status] || [];
        if (tasksInGroup.length === 0) return null;
        
        return (
          <div key={status} className="task-group mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              {/* Group icon và label */}
              <span className="badge badge-lg">
                {tasksInGroup.length}
              </span>
              {status.replace('_', ' ')}
            </h3>
            
            <div className="grid gap-3">
              {tasksInGroup.map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

---

## 📱 Mobile View

### Compact Task Item
```jsx
const CompactTaskItem = ({ task }) => {
  const statusInfo = getTaskStatusInfo(task);
  
  return (
    <div className={`compact-task bg-${statusInfo.color}-50 rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{statusInfo.icon}</span>
        <div className="flex-1">
          <h4 className="font-medium">{task.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge-sm badge-${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {statusInfo.badge && (
              <span className={`badge-sm badge-${statusInfo.badge.color}`}>
                {statusInfo.badge.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔔 Notifications

### Notification Messages

```javascript
const getNotificationMessage = (task, action) => {
  const statusInfo = getTaskStatusInfo(task);
  
  const messages = {
    'APPROVED': `✅ Task "${task.title}" đã được phê duyệt`,
    'REJECTED': `❌ Task "${task.title}" bị từ chối. Vui lòng xem lại và sửa.`,
    'PENDING_APPROVAL': `⏳ Task "${task.title}" đang chờ bạn phê duyệt`,
    'AUTO_APPROVED': `⚡ Task "${task.title}" đã được tự động phê duyệt`,
    'BYPASSED': `🔓 Task "${task.title}" đã được bypass approval`,
  };
  
  return messages[statusInfo.key] || `Task "${task.title}" đã được cập nhật`;
};
```

---

## 🎯 Backend API Response Enhancement

### Thêm computed field vào Task

```javascript
// Trong Task model hoặc controller
taskSchema.virtual('statusInfo').get(function() {
  const latestRequest = this.approvalRequests?.length > 0
    ? this.approvalRequests[this.approvalRequests.length - 1]
    : null;
    
  return {
    status: this.status,
    approvalStatus: this.approvalStatus,
    latestApprovalRequest: latestRequest ? {
      status: latestRequest.status,
      requestedAt: latestRequest.requestedAt,
      approvers: latestRequest.approvers,
      approvedBy: latestRequest.approvedBy,
      approvedAt: latestRequest.approvedAt,
      rejectedBy: latestRequest.rejectedBy,
      rejectedAt: latestRequest.rejectedAt,
      reason: latestRequest.reason,
      autoApprovedAt: latestRequest.autoApprovedAt,
      bypassedBy: latestRequest.bypassedBy,
      bypassedAt: latestRequest.bypassedAt,
    } : null,
  };
});

// Ensure virtuals are included in JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });
```

---

## 📊 Statistics & Dashboard

### Task Statistics

```javascript
const getTaskStatistics = (tasks) => {
  return {
    total: tasks.length,
    todo: tasks.filter(t => getTaskStatusInfo(t).key === 'TODO').length,
    inProgress: tasks.filter(t => getTaskStatusInfo(t).key === 'IN_PROGRESS').length,
    pendingApproval: tasks.filter(t => getTaskStatusInfo(t).key === 'PENDING_APPROVAL').length,
    approved: tasks.filter(t => getTaskStatusInfo(t).key === 'APPROVED').length,
    rejected: tasks.filter(t => getTaskStatusInfo(t).key === 'REJECTED').length,
    autoApproved: tasks.filter(t => getTaskStatusInfo(t).key === 'AUTO_APPROVED').length,
    bypassed: tasks.filter(t => getTaskStatusInfo(t).key === 'BYPASSED').length,
  };
};
```

### Dashboard Cards

```jsx
const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon="❌"
        label="Cần làm lại"
        value={stats.rejected}
        color="red"
        urgent
      />
      <StatCard
        icon="⏳"
        label="Chờ duyệt"
        value={stats.pendingApproval}
        color="yellow"
      />
      <StatCard
        icon="🚀"
        label="Đang làm"
        value={stats.inProgress}
        color="blue"
      />
      <StatCard
        icon="✅"
        label="Hoàn thành"
        value={stats.approved + stats.autoApproved}
        color="green"
      />
    </div>
  );
};
```

---

## 🎨 CSS/Tailwind Classes

```css
/* Status Colors */
.status-todo { @apply bg-gray-100 text-gray-700 border-gray-300; }
.status-in-progress { @apply bg-blue-100 text-blue-700 border-blue-300; }
.status-pending-approval { @apply bg-yellow-100 text-yellow-700 border-yellow-300; }
.status-approved { @apply bg-green-100 text-green-700 border-green-300; }
.status-rejected { @apply bg-red-100 text-red-700 border-red-300; }
.status-auto-approved { @apply bg-green-50 text-green-600 border-green-200; }
.status-bypassed { @apply bg-orange-100 text-orange-700 border-orange-300; }

/* Badges */
.badge-urgent { @apply animate-pulse bg-red-500 text-white; }
.badge-warning { @apply bg-yellow-400 text-yellow-900; }
```

---

## 📋 Checklist Implementation

### Tích hợp vào component
- [ ] Tạo file `utils/taskStatus.js` với function `getTaskStatusInfo()`
- [ ] Update TaskCard component để hiển thị status
- [ ] Tạo TaskStatusFilter component
- [ ] Implement grouping trong TaskList
- [ ] Thêm virtual field `statusInfo` vào Task model
- [ ] Update notification messages
- [ ] Tạo dashboard statistics
- [ ] Test với các trạng thái khác nhau
- [ ] Mobile responsive
- [ ] Accessibility (ARIA labels)

---

## 🎉 Kết Luận

Hệ thống phân biệt trạng thái task:
- ✅ 7 trạng thái rõ ràng với màu sắc và icon khác nhau
- ⏳ Badge hiển thị thông tin chi tiết (giờ chờ, lý do từ chối, etc.)
- 🎯 Helper function dễ sử dụng cho frontend
- 📱 Responsive và accessible
- 🔔 Notification messages phù hợp với từng trạng thái
