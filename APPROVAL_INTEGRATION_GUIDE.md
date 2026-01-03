# Smart Approval System - Integration Guide

## Quick Integration Steps

### 1. Integrate into Task Details Page

Update your TaskDetails component to include the new approval components:

```jsx
import ChecklistPanel from '../../components/Task/ChecklistPanel';
import AutoApproveCountdown from '../../components/Task/AutoApproveCountdown';

function TaskDetails({ taskId }) {
  const [task, setTask] = useState(null);

  // ... existing code ...

  return (
    <div className="task-details">
      {/* Existing task info */}
      
      {/* Add Auto-Approve Countdown */}
      <AutoApproveCountdown task={task} />
      
      {/* Add Checklist Panel */}
      <ChecklistPanel 
        task={task} 
        onUpdate={(updatedTask) => setTask(updatedTask)}
      />
      
      {/* Existing approval buttons */}
      {task.status === 'PENDING_APPROVAL' && canApprove && (
        <div className="approval-actions">
          <button onClick={() => handleApprove(task._id)}>
            Approve
          </button>
          <button onClick={() => handleReject(task._id)}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### 2. Add Policy Settings to Project Settings

Add the PolicySettings component to your Project Settings page:

```jsx
import PolicySettings from '../../components/ApprovalPolicy/PolicySettings';

function ProjectSettings({ projectId }) {
  return (
    <Tabs>
      <Tab label="General">
        {/* Existing general settings */}
      </Tab>
      
      <Tab label="Members">
        {/* Existing member management */}
      </Tab>
      
      {/* Add Approval Policy Tab */}
      <Tab label="Approval Policy">
        <PolicySettings projectId={projectId} />
      </Tab>
    </Tabs>
  );
}
```

---

### 3. Add Pending Approvals to Navigation

Add a navigation link to the Pending Approvals page:

**In your App Router (e.g., `src/App.jsx` or `src/routes/index.jsx`):**

```jsx
import PendingApprovalsPage from './pages/PendingApprovalsPage';

// Add route
<Route path="/pending-approvals" element={<PendingApprovalsPage />} />
```

**In your Navigation Menu:**

```jsx
<nav>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/projects">Projects</Link>
  <Link to="/my-tasks">My Tasks</Link>
  
  {/* Add for Team Leads/Managers */}
  {userRole === 'Team Lead' && (
    <Link to="/pending-approvals">
      Pending Approvals
      {pendingCount > 0 && (
        <span className="badge">{pendingCount}</span>
      )}
    </Link>
  )}
</nav>
```

---

### 4. Update Task Update Handler

Ensure your task update handler triggers the approval workflow:

```jsx
const handleStatusChange = async (taskId, newStatus) => {
  try {
    // When moving to PENDING_APPROVAL, the backend will:
    // 1. Apply approval policy
    // 2. Create checklist
    // 3. Set auto-approve timer
    // 4. Notify approvers
    
    const response = await api.put(`/tasks/${taskId}`, {
      status: newStatus
    });
    
    const updatedTask = response.data.data;
    
    // If approval was triggered, show message
    if (newStatus === 'PENDING_APPROVAL' && updatedTask.approvalRequests?.length > 0) {
      toast.success('Approval request sent to Team Lead');
    }
    
    // Update UI
    setTask(updatedTask);
  } catch (error) {
    toast.error('Failed to update task');
  }
};
```

---

### 5. Show Checklist in Task Cards (Optional)

Add checklist progress to task cards for quick visibility:

```jsx
function TaskCard({ task }) {
  const checklistProgress = task.checklist?.length
    ? {
        completed: task.checklist.filter(item => item.checked).length,
        total: task.checklist.length,
        percentage: Math.round(
          (task.checklist.filter(item => item.checked).length / task.checklist.length) * 100
        )
      }
    : null;

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      
      {/* Add checklist indicator */}
      {checklistProgress && (
        <div className="checklist-mini">
          <svg className="icon" />
          <span>{checklistProgress.completed}/{checklistProgress.total}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${checklistProgress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 6. Add Approval Notification Badge

Show pending approval count in header/sidebar:

```jsx
function Header() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await api.get('/tasks/pending-approval');
        setPendingCount(response.data.data.length);
      } catch (error) {
        console.error('Failed to fetch pending count', error);
      }
    };

    fetchPendingCount();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPendingCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <nav>
        <Link to="/pending-approvals">
          <bell-icon />
          {pendingCount > 0 && (
            <span className="badge bg-red-500">{pendingCount}</span>
          )}
        </Link>
      </nav>
    </header>
  );
}
```

---

### 7. Bypass Approval (Emergency)

Add bypass button for emergencies (restricted to authorized users):

```jsx
function TaskDetails({ task }) {
  const canBypass = hasPermission('TASK_MANAGE'); // Check permission

  const handleBypassApproval = async () => {
    const reason = prompt('Enter reason for bypassing approval (required):');
    
    if (!reason || reason.trim().length < 5) {
      toast.error('Please provide a detailed reason (min 5 characters)');
      return;
    }

    if (!confirm(`Are you sure you want to bypass approval? This action will be logged.`)) {
      return;
    }

    try {
      await api.post(`/tasks/${task._id}/bypass-approval`, { reason });
      toast.success('Approval bypassed - task is now completed');
      // Refresh task
      fetchTask();
    } catch (error) {
      toast.error('Failed to bypass approval');
      console.error(error);
    }
  };

  return (
    <div>
      {task.status === 'PENDING_APPROVAL' && canBypass && (
        <button 
          onClick={handleBypassApproval}
          className="btn-danger"
        >
          ⚠️ Emergency Bypass
        </button>
      )}
    </div>
  );
}
```

---

## API Client Helper Functions

Create helper functions for easier API integration:

```javascript
// src/api/approvalApi.js

export const approvalApi = {
  // Get approval policy for project
  getPolicy: (projectId) => api.get(`/approval-policies/${projectId}`),
  
  // Update approval policy
  updatePolicy: (projectId, policy) => api.put(`/approval-policies/${projectId}`, policy),
  
  // Toggle policy
  togglePolicy: (projectId, enabled) => 
    api.patch(`/approval-policies/${projectId}/toggle`, { enabled }),
  
  // Apply template
  applyTemplate: (projectId, template) => 
    api.post(`/approval-policies/${projectId}/apply-template`, { template }),
  
  // Get templates
  getTemplates: () => api.get('/approval-policies/templates'),
  
  // Update checklist item
  updateChecklistItem: (taskId, itemId, checked) =>
    api.patch(`/tasks/${taskId}/checklist/${itemId}`, { checked }),
  
  // Get checklist progress
  getChecklistProgress: (taskId) => 
    api.get(`/tasks/${taskId}/checklist/progress`),
  
  // Get pending approvals
  getPendingApprovals: () => api.get('/tasks/pending-approval'),
  
  // Approve task
  approveTask: (taskId) => api.put(`/tasks/${taskId}/approve`),
  
  // Reject task
  rejectTask: (taskId, reason) => 
    api.put(`/tasks/${taskId}/reject`, { reason }),
  
  // Bypass approval
  bypassApproval: (taskId, reason) =>
    api.post(`/tasks/${taskId}/bypass-approval`, { reason })
};
```

**Usage:**

```jsx
import { approvalApi } from '../../api/approvalApi';

// In your component
const handleApprove = async (taskId) => {
  try {
    await approvalApi.approveTask(taskId);
    toast.success('Task approved');
  } catch (error) {
    toast.error('Failed to approve task');
  }
};
```

---

## Real-Time Updates with Socket.IO

If you're using Socket.IO for real-time updates, emit events when approval state changes:

**Backend (in taskController.js):**

```javascript
// After approving task
io.to(task.projectId.toString()).emit('taskApproved', {
  taskId: task._id,
  approvedBy: req.user._id
});

// After rejecting task
io.to(task.projectId.toString()).emit('taskRejected', {
  taskId: task._id,
  rejectedBy: req.user._id,
  reason: req.body.reason
});
```

**Frontend:**

```jsx
useEffect(() => {
  socket.on('taskApproved', ({ taskId }) => {
    // Refresh task or remove from pending list
    if (taskId === currentTaskId) {
      fetchTask();
    }
  });

  socket.on('taskRejected', ({ taskId, reason }) => {
    // Show rejection notification
    if (taskId === currentTaskId) {
      toast.error(`Task rejected: ${reason}`);
      fetchTask();
    }
  });

  return () => {
    socket.off('taskApproved');
    socket.off('taskRejected');
  };
}, [currentTaskId]);
```

---

## Testing Checklist

Before deploying, test these scenarios:

### ✅ Policy Configuration
- [ ] Enable/disable policy
- [ ] Apply each template (Simple/Moderate/Strict)
- [ ] Create custom rule
- [ ] Update rule conditions
- [ ] Delete rule
- [ ] Update checklist template

### ✅ Task Approval Flow
- [ ] Move task to PENDING_APPROVAL
- [ ] Verify checklist created from template
- [ ] Verify approvers notified
- [ ] Verify auto-approve timer set
- [ ] Check countdown timer displays

### ✅ Checklist Interaction
- [ ] Toggle checklist items
- [ ] Verify progress updates
- [ ] Complete required items
- [ ] Try to approve with incomplete required items

### ✅ Approval Actions
- [ ] Approve task as Team Lead
- [ ] Reject task with reason
- [ ] Verify notifications sent
- [ ] Test bypass approval (if authorized)

### ✅ Auto-Approval
- [ ] Create task with auto-approve enabled
- [ ] Manually update auto-approve time to 1 minute from now (in DB)
- [ ] Wait for cron job to run (or trigger manually)
- [ ] Verify task auto-approved

### ✅ Pending Approvals Page
- [ ] View all pending tasks
- [ ] Filter by urgency
- [ ] Approve from dashboard
- [ ] Reject from dashboard
- [ ] Navigate to task details

---

## Troubleshooting

### Checklist Not Showing
**Problem:** Checklist is empty when task moves to PENDING_APPROVAL  
**Solution:** Ensure approval policy has checklist template configured for that task type

### Auto-Approve Not Working
**Problem:** Tasks not auto-approved after timer expires  
**Solution:** 
1. Check cron job is running (`CronService.getStatus()`)
2. Verify `approvalConfig.autoApproveAt` is set in task
3. Check server logs for cron job execution

### Countdown Timer Not Updating
**Problem:** Timer shows wrong time or doesn't update  
**Solution:** Ensure `task.approvalConfig.autoApproveAt` is a valid Date string

### Notifications Not Sent
**Problem:** Approvers not receiving notifications  
**Solution:** 
1. Check `task.approvalRequests[].approvers` contains correct user IDs
2. Verify notification creation in `AutoApprovalService.notifyApprovers()`
3. Check notification settings in user profile

---

## Performance Tips

1. **Lazy Load Components:** Import approval components only when needed
2. **Debounce Checklist Updates:** Don't call API on every checkbox click
3. **Cache Policy Data:** Store policy in Redux/Context to avoid re-fetching
4. **Optimize Pending Count:** Use polling interval (5-10 minutes) instead of real-time

---

## Next Steps

1. **Analytics Dashboard:** Track approval metrics (average time, rejection rate)
2. **Approval History:** Show timeline of all approval actions
3. **Bulk Approve:** Allow approving multiple tasks at once
4. **Custom Notifications:** Configure notification preferences per user
5. **Approval Delegation:** Allow Team Lead to delegate approval authority

---

**Happy Coding! 🚀**
