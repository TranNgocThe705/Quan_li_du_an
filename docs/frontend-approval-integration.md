# Tích Hợp Frontend - Hệ Thống Phê Duyệt Công Việc

## Components Cần Cập Nhật

### 1. Task Status Badge

Thêm trạng thái mới `PENDING_APPROVAL`:

```jsx
// src/components/TaskStatusBadge.jsx
const getStatusConfig = (status) => {
  const configs = {
    TODO: {
      label: 'Cần làm',
      color: 'gray',
      icon: 'circle'
    },
    IN_PROGRESS: {
      label: 'Đang làm',
      color: 'blue',
      icon: 'clock'
    },
    PENDING_APPROVAL: {
      label: 'Chờ duyệt',
      color: 'yellow',
      icon: 'hourglass'
    },
    DONE: {
      label: 'Hoàn thành',
      color: 'green',
      icon: 'check-circle'
    }
  };
  return configs[status] || configs.TODO;
};
```

### 2. Task Actions

Thêm nút Submit/Approve/Reject:

```jsx
// src/components/TaskActions.jsx
import { useState } from 'react';
import { submitTaskForApproval, approveTask, rejectTask } from '@/api/taskApi';

export const TaskActions = ({ task, currentUser, onUpdate }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const isAssignee = task.assigneeId?._id === currentUser._id;
  const isTeamLead = currentUser.projectRole === 'LEAD';

  // Người được giao việc submit để duyệt
  const handleSubmitForApproval = async () => {
    try {
      await submitTaskForApproval(task._id);
      onUpdate();
      toast.success('Đã gửi yêu cầu duyệt công việc');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Team Lead duyệt
  const handleApprove = async () => {
    try {
      await approveTask(task._id);
      onUpdate();
      toast.success('Công việc đã được duyệt');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Team Lead từ chối
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await rejectTask(task._id, rejectionReason);
      onUpdate();
      setShowRejectModal(false);
      toast.success('Công việc đã bị từ chối');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Nút Submit (cho assignee) */}
      {isAssignee && task.status === 'IN_PROGRESS' && (
        <button
          onClick={handleSubmitForApproval}
          className="btn btn-primary"
        >
          <CheckIcon /> Submit để duyệt
        </button>
      )}

      {/* Nút Approve/Reject (cho Team Lead) */}
      {isTeamLead && task.status === 'PENDING_APPROVAL' && (
        <>
          <button
            onClick={handleApprove}
            className="btn btn-success"
          >
            <ThumbsUpIcon /> Duyệt
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="btn btn-danger"
          >
            <ThumbsDownIcon /> Từ chối
          </button>
        </>
      )}

      {/* Modal từ chối */}
      {showRejectModal && (
        <Modal
          title="Từ chối công việc"
          onClose={() => setShowRejectModal(false)}
        >
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            className="w-full h-32 p-2 border rounded"
          />
          <div className="flex gap-2 mt-4">
            <button onClick={handleReject} className="btn btn-danger">
              Xác nhận từ chối
            </button>
            <button
              onClick={() => setShowRejectModal(false)}
              className="btn btn-secondary"
            >
              Hủy
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
```

### 3. Task Detail View

Hiển thị thông tin phê duyệt:

```jsx
// src/components/TaskDetail.jsx
export const TaskDetail = ({ task }) => {
  return (
    <div className="task-detail">
      {/* ... existing fields */}

      {/* Approval Status */}
      {task.status === 'PENDING_APPROVAL' && (
        <div className="approval-section">
          <div className="alert alert-warning">
            <ClockIcon />
            <span>Công việc đang chờ Team Lead duyệt</span>
          </div>
        </div>
      )}

      {/* Approved Info */}
      {task.approvalStatus === 'APPROVED' && task.approvedBy && (
        <div className="approval-info">
          <CheckCircleIcon className="text-green-500" />
          <div>
            <p className="font-semibold">Đã được duyệt</p>
            <p className="text-sm text-gray-600">
              Bởi {task.approvedBy.name} vào{' '}
              {formatDate(task.approvedAt)}
            </p>
          </div>
        </div>
      )}

      {/* Rejected Info */}
      {task.approvalStatus === 'REJECTED' && (
        <div className="rejection-info">
          <div className="alert alert-danger">
            <XCircleIcon />
            <div>
              <p className="font-semibold">Công việc bị từ chối</p>
              <p className="text-sm">
                Bởi {task.approvedBy?.name} vào{' '}
                {formatDate(task.approvedAt)}
              </p>
              {task.rejectionReason && (
                <div className="mt-2 p-2 bg-red-50 rounded">
                  <p className="font-semibold">Lý do:</p>
                  <p>{task.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

## API Service

```javascript
// src/api/taskApi.js

export const taskApi = {
  // Submit task for approval
  submitTaskForApproval: async (taskId) => {
    const response = await api.put(`/tasks/${taskId}`, {
      status: 'PENDING_APPROVAL'
    });
    return response.data;
  },

  // Approve task (Team Lead only)
  approveTask: async (taskId) => {
    const response = await api.put(`/tasks/${taskId}/approve`);
    return response.data;
  },

  // Reject task (Team Lead only)
  rejectTask: async (taskId, reason) => {
    const response = await api.put(`/tasks/${taskId}/reject`, {
      reason
    });
    return response.data;
  },

  // Get tasks pending approval (for Team Lead)
  getPendingApprovalTasks: async (projectId) => {
    const response = await api.get(`/tasks?projectId=${projectId}&status=PENDING_APPROVAL`);
    return response.data;
  }
};
```

## Redux/State Management

```javascript
// src/features/tasks/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const approveTask = createAsyncThunk(
  'tasks/approve',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await taskApi.approveTask(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectTask = createAsyncThunk(
  'tasks/reject',
  async ({ taskId, reason }, { rejectWithValue }) => {
    try {
      const response = await taskApi.rejectTask(taskId, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    pendingApprovalCount: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approveTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.pendingApprovalCount--;
      })
      .addCase(rejectTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.pendingApprovalCount--;
      });
  }
});
```

## Notification Handler

```javascript
// src/components/NotificationItem.jsx
const getNotificationConfig = (type) => {
  const configs = {
    TASK_APPROVED: {
      icon: <CheckCircleIcon className="text-green-500" />,
      color: 'bg-green-50',
      action: 'đã duyệt'
    },
    TASK_REJECTED: {
      icon: <XCircleIcon className="text-red-500" />,
      color: 'bg-red-50',
      action: 'đã từ chối'
    },
    // ... other types
  };
  return configs[type];
};

export const NotificationItem = ({ notification }) => {
  const config = getNotificationConfig(notification.type);

  return (
    <div className={`notification-item ${config.color}`}>
      {config.icon}
      <div>
        <p>{notification.message}</p>
        {notification.metadata?.rejectionReason && (
          <p className="text-sm text-gray-600 mt-1">
            Lý do: {notification.metadata.rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
};
```

## Task Filter

Thêm filter cho công việc chờ duyệt:

```jsx
// src/components/TaskFilter.jsx
export const TaskFilter = ({ onFilterChange }) => {
  return (
    <div className="task-filters">
      <select onChange={(e) => onFilterChange('status', e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="TODO">Cần làm</option>
        <option value="IN_PROGRESS">Đang làm</option>
        <option value="PENDING_APPROVAL">Chờ duyệt</option>
        <option value="DONE">Hoàn thành</option>
      </select>
    </div>
  );
};
```

## Dashboard Widget

Widget hiển thị số công việc chờ duyệt (cho Team Lead):

```jsx
// src/components/PendingApprovalWidget.jsx
export const PendingApprovalWidget = ({ projectId }) => {
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      const data = await taskApi.getPendingApprovalTasks(projectId);
      setPendingTasks(data);
    };
    fetchPendingTasks();
  }, [projectId]);

  return (
    <div className="widget">
      <div className="widget-header">
        <h3>Công việc chờ duyệt</h3>
        <span className="badge badge-warning">{pendingTasks.length}</span>
      </div>
      <div className="widget-body">
        {pendingTasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};
```

## Permission Guard

Kiểm tra quyền hiển thị nút approve/reject:

```javascript
// src/utils/permissions.js
export const canApproveTask = (user, project) => {
  const member = project.members.find(m => m.userId === user._id);
  return member?.role === 'LEAD' || user.workspaceRole === 'ADMIN';
};

export const canSubmitForApproval = (user, task) => {
  return task.assigneeId?._id === user._id && 
         task.status === 'IN_PROGRESS';
};
```

## Toast Messages

```javascript
// src/utils/toastMessages.js
export const APPROVAL_MESSAGES = {
  SUBMIT_SUCCESS: 'Đã gửi yêu cầu duyệt công việc',
  SUBMIT_ERROR: 'Không thể gửi yêu cầu duyệt',
  
  APPROVE_SUCCESS: 'Công việc đã được duyệt',
  APPROVE_ERROR: 'Không thể duyệt công việc',
  
  REJECT_SUCCESS: 'Công việc đã bị từ chối',
  REJECT_ERROR: 'Không thể từ chối công việc',
  REJECT_NO_REASON: 'Vui lòng nhập lý do từ chối'
};
```

## TypeScript Types

```typescript
// src/types/task.ts
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  DONE = 'DONE'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Task {
  _id: string;
  title: string;
  status: TaskStatus;
  approvalStatus?: ApprovalStatus;
  approvedBy?: User;
  approvedAt?: Date;
  rejectionReason?: string;
  // ... other fields
}
```

## Testing

```javascript
// src/__tests__/TaskApproval.test.jsx
describe('Task Approval', () => {
  it('should show submit button for assignee', () => {
    const task = { status: 'IN_PROGRESS', assigneeId: { _id: 'user1' } };
    const { getByText } = render(
      <TaskActions task={task} currentUser={{ _id: 'user1' }} />
    );
    expect(getByText('Submit để duyệt')).toBeInTheDocument();
  });

  it('should show approve/reject buttons for team lead', () => {
    const task = { status: 'PENDING_APPROVAL' };
    const { getByText } = render(
      <TaskActions 
        task={task} 
        currentUser={{ _id: 'lead1', projectRole: 'LEAD' }} 
      />
    );
    expect(getByText('Duyệt')).toBeInTheDocument();
    expect(getByText('Từ chối')).toBeInTheDocument();
  });
});
```

## Checklist Tích Hợp

- [ ] Cập nhật constants cho TaskStatus
- [ ] Thêm API calls (approve, reject)
- [ ] Cập nhật TaskStatusBadge component
- [ ] Thêm TaskActions component với nút approve/reject
- [ ] Hiển thị thông tin approval trong TaskDetail
- [ ] Thêm modal từ chối với textarea lý do
- [ ] Cập nhật notification handler
- [ ] Thêm filter cho PENDING_APPROVAL
- [ ] Thêm widget pending approval cho Team Lead
- [ ] Kiểm tra permissions
- [ ] Viết tests
- [ ] Cập nhật documentation
