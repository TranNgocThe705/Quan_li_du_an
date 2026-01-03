# 🚀 Hướng Dẫn Tích Hợp Hệ Thống Nhận Biết Trạng Thái Task

## 📋 Tổng Quan

Hệ thống nhận biết 7 trạng thái khác nhau của task với màu sắc và icon riêng biệt:

1. ❌ **Cần làm lại** (REJECTED) - Đỏ
2. ⏳ **Chờ phê duyệt** (PENDING_APPROVAL) - Vàng
3. 🚀 **Đang làm** (IN_PROGRESS) - Xanh dương
4. 📝 **Chưa bắt đầu** (TODO) - Xám
5. ✅ **Hoàn thành** (APPROVED) - Xanh lá
6. ⚡ **Tự động duyệt** (AUTO_APPROVED) - Xanh lá nhạt
7. 🔓 **Bypass** (BYPASSED) - Cam

---

## 📁 Files Đã Tạo

### Backend
- ✅ `backend/models/Task.js` - Đã thêm virtual field `statusInfo`

### Frontend
- ✅ `frontend/src/utils/taskStatus.js` - Helper functions
- ✅ `frontend/src/components/TaskStatusComponents.jsx` - React components
- ✅ `frontend/src/pages/TaskListExample.jsx` - Example page

### Documentation
- ✅ `TASK_STATUS_GUIDE.md` - Chi tiết về các trạng thái
- ✅ `INTEGRATION_GUIDE.md` - File này

---

## 🔧 Backend Integration

### 1. Task Model (Đã hoàn thành)

Virtual field `statusInfo` đã được thêm vào Task model:

```javascript
// Sử dụng trong controller
const task = await Task.findById(id)
  .populate('approvalRequests.approvers', 'name email image');

// Response sẽ tự động có field statusInfo
res.json({
  ...task.toJSON(),
  statusInfo: task.statusInfo // Virtual field
});
```

### 2. API Response Enhancement

Cập nhật controllers để populate đầy đủ:

```javascript
// taskController.js
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ projectId })
    .populate('assigneeId', 'name email image')
    .populate('approvalRequests.approvers', 'name email image')
    .populate('approvalRequests.approvedBy', 'name email image')
    .populate('approvalRequests.rejectedBy', 'name email image')
    .populate('approvalRequests.bypassedBy', 'name email image')
    .sort({ createdAt: -1 });

  // Tasks sẽ tự động có statusInfo từ virtual field
  return successResponse(res, 200, 'Success', tasks);
});
```

---

## 🎨 Frontend Integration

### 1. Cài Đặt Dependencies

```bash
cd frontend
npm install date-fns
```

### 2. Import và Sử dụng

#### Trong component thông thường:

```jsx
import React from 'react';
import { TaskCard, TaskStatusBadge } from '@/components/TaskStatusComponents';
import { getTaskStatusInfo } from '@/utils/taskStatus';

const MyTaskComponent = ({ task }) => {
  const statusInfo = getTaskStatusInfo(task);

  return (
    <div>
      {/* Cách 1: Sử dụng TaskCard component */}
      <TaskCard task={task} onClick={(t) => console.log(t)} />

      {/* Cách 2: Sử dụng TaskStatusBadge */}
      <TaskStatusBadge task={task} showIcon showDetails />

      {/* Cách 3: Tự custom */}
      <div className={statusInfo.bgColor}>
        <span>{statusInfo.icon}</span>
        <span>{statusInfo.label}</span>
      </div>
    </div>
  );
};
```

#### Trong TaskList page:

```jsx
import React, { useState, useEffect } from 'react';
import {
  TaskCard,
  TaskStatusFilter,
  TaskStatistics,
} from '@/components/TaskStatusComponents';
import {
  filterTasksByStatus,
  getTaskStatistics,
  sortTasksByStatusPriority,
} from '@/utils/taskStatus';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks?projectId=xxx');
    const data = await response.json();
    setTasks(data.data);
  };

  // Statistics
  const stats = getTaskStatistics(tasks);

  // Filter và sort
  const filteredTasks = filterTasksByStatus(tasks, selectedStatus);
  const sortedTasks = sortTasksByStatusPriority(filteredTasks);

  return (
    <div>
      {/* Statistics */}
      <TaskStatistics stats={stats} />

      {/* Filter */}
      <TaskStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Task List */}
      {sortedTasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};
```

---

## 🎯 Use Cases

### 1. Hiển thị Badge trong Table

```jsx
import { TaskStatusBadge } from '@/components/TaskStatusComponents';

const TaskTable = ({ tasks }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Trạng thái</th>
          <th>Ưu tiên</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task._id}>
            <td>{task.title}</td>
            <td>
              <TaskStatusBadge task={task} showIcon={false} />
            </td>
            <td>{task.priority}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### 2. Dashboard Statistics

```jsx
import { TaskStatistics } from '@/components/TaskStatusComponents';
import { getTaskStatistics } from '@/utils/taskStatus';

const Dashboard = ({ tasks }) => {
  const stats = getTaskStatistics(tasks);

  return (
    <div>
      <h1>Dashboard</h1>
      <TaskStatistics stats={stats} />
      
      {/* Custom alerts */}
      {stats.rejected > 0 && (
        <div className="alert alert-error">
          ⚠️ Có {stats.rejected} công việc cần làm lại!
        </div>
      )}
    </div>
  );
};
```

### 3. Kanban Board với Status

```jsx
import { getTaskStatusInfo, groupTasksByStatus } from '@/utils/taskStatus';
import { TaskCard } from '@/components/TaskStatusComponents';

const KanbanBoard = ({ tasks }) => {
  const groupedTasks = groupTasksByStatus(tasks);

  const columns = [
    'TODO',
    'IN_PROGRESS',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED'
  ];

  return (
    <div className="flex gap-4">
      {columns.map(column => (
        <div key={column} className="flex-1 bg-gray-50 p-4 rounded-lg">
          <h3>{getTaskStatusInfo({ status: column }).label}</h3>
          <div className="space-y-2 mt-4">
            {(groupedTasks[column]?.tasks || []).map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 4. Filter Sidebar

```jsx
import { STATUS_FILTER_OPTIONS } from '@/utils/taskStatus';

const FilterSidebar = ({ selectedStatus, onFilterChange }) => {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4">Lọc theo trạng thái</h3>
      <div className="space-y-2">
        {STATUS_FILTER_OPTIONS.map(option => (
          <button
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={`
              w-full text-left px-3 py-2 rounded flex items-center gap-2
              ${selectedStatus === option.key 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 5. Notifications

```jsx
import { getNotificationMessage } from '@/utils/taskStatus';

const NotificationList = ({ notifications }) => {
  return (
    <div className="space-y-2">
      {notifications.map(notif => (
        <div key={notif._id} className="bg-white p-3 rounded shadow">
          {getNotificationMessage(notif.task, notif.fromUser?.name)}
        </div>
      ))}
    </div>
  );
};
```

---

## 🎨 Customization

### Tùy Chỉnh Màu Sắc

Nếu bạn muốn thay đổi màu sắc, edit trong `taskStatus.js`:

```javascript
export const getTaskStatusInfo = (task) => {
  // ...
  return {
    key: 'APPROVED',
    label: 'Hoàn thành',
    color: 'success',
    bgColor: 'bg-emerald-100', // Thay đổi màu ở đây
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    icon: '🎉', // Thay đổi icon
    // ...
  };
};
```

### Thêm Trạng Thái Mới

Nếu cần thêm trạng thái mới:

1. Thêm vào `getTaskStatusInfo()` trong `taskStatus.js`
2. Thêm vào `STATUS_FILTER_OPTIONS`
3. Update `TaskStatusDetails` component nếu cần hiển thị chi tiết

---

## 📱 Responsive Design

Tất cả components đã được thiết kế responsive:

```jsx
// Desktop: 4 cột
// Tablet: 2 cột
// Mobile: 1 cột
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>

// Filter horizontal scroll trên mobile
<div className="flex gap-2 overflow-x-auto pb-2">
  {/* Filter buttons */}
</div>
```

---

## ♿ Accessibility

Components đã có basic accessibility:

```jsx
// Thêm ARIA labels
<button
  aria-label={`Filter by ${option.label}`}
  aria-pressed={selectedStatus === option.key}
>
  {option.label}
</button>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  {/* Content */}
</div>
```

---

## 🧪 Testing

### Test Helper Functions

```javascript
import { getTaskStatusInfo, filterTasksByStatus } from '@/utils/taskStatus';

describe('taskStatus helpers', () => {
  test('getTaskStatusInfo returns correct status for rejected task', () => {
    const task = {
      status: 'IN_PROGRESS',
      approvalStatus: 'REJECTED',
      approvalRequests: [{
        status: 'REJECTED',
        reason: 'Test reason'
      }]
    };

    const statusInfo = getTaskStatusInfo(task);
    expect(statusInfo.key).toBe('REJECTED');
    expect(statusInfo.label).toBe('Cần làm lại');
  });

  test('filterTasksByStatus filters correctly', () => {
    const tasks = [
      { status: 'TODO', approvalStatus: null },
      { status: 'IN_PROGRESS', approvalStatus: null },
      { status: 'DONE', approvalStatus: 'APPROVED' }
    ];

    const filtered = filterTasksByStatus(tasks, 'TODO');
    expect(filtered).toHaveLength(1);
  });
});
```

---

## 🔔 Best Practices

### 1. Luôn Populate Approval Requests

```javascript
// ❌ Bad
const task = await Task.findById(id);

// ✅ Good
const task = await Task.findById(id)
  .populate('approvalRequests.approvers', 'name email image')
  .populate('approvalRequests.approvedBy', 'name email image')
  .populate('approvalRequests.rejectedBy', 'name email image');
```

### 2. Sử dụng useMemo cho Performance

```javascript
const stats = useMemo(() => getTaskStatistics(tasks), [tasks]);
const filteredTasks = useMemo(() => 
  filterTasksByStatus(tasks, selectedStatus), 
  [tasks, selectedStatus]
);
```

### 3. Error Handling

```javascript
const statusInfo = getTaskStatusInfo(task);

// Luôn kiểm tra details trước khi sử dụng
if (statusInfo.details?.reason) {
  console.log(statusInfo.details.reason);
}
```

---

## 📊 Performance Tips

### 1. Lazy Load TaskStatusDetails

```jsx
import { lazy, Suspense } from 'react';

const TaskStatusDetails = lazy(() => 
  import('@/components/TaskStatusComponents').then(m => ({
    default: m.TaskStatusDetails
  }))
);

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <TaskStatusDetails task={task} />
</Suspense>
```

### 2. Virtualize Long Lists

```bash
npm install react-window
```

```jsx
import { FixedSizeList } from 'react-window';

const TaskList = ({ tasks }) => (
  <FixedSizeList
    height={600}
    itemCount={tasks.length}
    itemSize={120}
  >
    {({ index, style }) => (
      <div style={style}>
        <TaskCard task={tasks[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

---

## 🎉 Kết Luận

Hệ thống đã sẵn sàng sử dụng! Các bước tiếp theo:

1. ✅ Import components vào pages hiện tại
2. ✅ Replace task status displays cũ
3. ✅ Test với dữ liệu thật
4. ✅ Customize màu sắc/icon nếu cần
5. ✅ Deploy và monitor

Nếu cần hỗ trợ, xem [TASK_STATUS_GUIDE.md](./TASK_STATUS_GUIDE.md) để biết chi tiết về từng trạng thái.
