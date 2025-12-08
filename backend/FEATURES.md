# New Features Documentation

This document outlines the new features added to the Project Management System based on the reference backend.

## Table of Contents
1. [Email Notification System](#email-notification-system)
2. [Activity Logging](#activity-logging)
3. [Dashboard Analytics](#dashboard-analytics)
4. [Event-Driven Architecture](#event-driven-architecture)

---

## Email Notification System

### Overview
Integrated nodemailer for automated email notifications to keep team members informed about important events.

### Configuration

Add the following to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@projectmanagement.com
FRONTEND_URL=http://localhost:5173
```

### Email Templates

The system includes the following email templates:

1. **Task Assignment** - Sent when a task is assigned to a user
2. **Task Completed** - Sent when a task is marked as complete
3. **Workspace Invitation** - Sent when a user is invited to a workspace
4. **Project Created** - Sent when a new project is created
5. **Comment Added** - Sent when someone comments on a task

### Usage Example

```javascript
import { sendEmail, emailTemplates } from '../config/nodemailer.js';

// Send task assignment email
const emailData = emailTemplates.taskAssigned(task, assignee, assignedBy);
await sendEmail({
  to: assignee.email,
  subject: emailData.subject,
  html: emailData.html,
});
```

### Email Services

**Development**: Uses Ethereal Email (test email service)
- Emails are not actually sent but can be viewed at https://ethereal.email
- No configuration required for testing

**Production**: Supports any SMTP service
- Gmail: `smtp.gmail.com` (port 587)
- SendGrid: `smtp.sendgrid.net` (port 587)
- AWS SES, Mailgun, etc.

---

## Activity Logging

### Overview
Tracks all user actions across the system for audit trails and activity feeds.

### Model Structure

```javascript
{
  userId: ObjectId,           // User who performed the action
  action: String,             // Action type (TASK_CREATED, PROJECT_UPDATED, etc.)
  entityType: String,         // Type of entity (TASK, PROJECT, WORKSPACE, etc.)
  entityId: ObjectId,         // ID of the affected entity
  entityName: String,         // Name of the affected entity
  workspaceId: ObjectId,      // Associated workspace
  projectId: ObjectId,        // Associated project
  metadata: Object,           // Additional data
  description: String,        // Human-readable description
  ipAddress: String,          // User's IP address
  userAgent: String,          // User's browser/device info
  timestamps: true            // createdAt, updatedAt
}
```

### Supported Actions

**Task Actions:**
- TASK_CREATED
- TASK_UPDATED
- TASK_DELETED
- TASK_ASSIGNED
- TASK_COMPLETED
- TASK_STATUS_CHANGED

**Project Actions:**
- PROJECT_CREATED
- PROJECT_UPDATED
- PROJECT_DELETED
- PROJECT_MEMBER_ADDED
- PROJECT_MEMBER_REMOVED

**Workspace Actions:**
- WORKSPACE_CREATED
- WORKSPACE_UPDATED
- WORKSPACE_DELETED
- WORKSPACE_MEMBER_ADDED
- WORKSPACE_MEMBER_REMOVED

**Comment Actions:**
- COMMENT_ADDED
- COMMENT_UPDATED
- COMMENT_DELETED

### Usage Example

```javascript
import ActivityLog from '../models/ActivityLog.js';

// Log an activity
await ActivityLog.logActivity({
  userId: req.user._id,
  action: 'TASK_CREATED',
  entityType: 'TASK',
  entityId: task._id,
  entityName: task.title,
  projectId: task.projectId,
  description: `Created task "${task.title}"`,
  ipAddress: req.ip,
  userAgent: req.get('user-agent'),
});
```

### Querying Activity Logs

```javascript
// Get user's recent activity
const activities = await ActivityLog.find({ userId })
  .sort({ createdAt: -1 })
  .limit(20);

// Get workspace activity
const workspaceActivity = await ActivityLog.find({ workspaceId })
  .populate('userId', 'name email image')
  .sort({ createdAt: -1 })
  .limit(50);
```

---

## Dashboard Analytics

### Overview
Provides comprehensive analytics and insights for users, workspaces, and projects.

### Endpoints

#### 1. User Dashboard
**GET** `/api/dashboard`

Returns:
- Task statistics (total, by status, by priority)
- Project statistics (total, by status)
- Workspace statistics
- Tasks due soon (next 7 days)
- Overdue tasks
- Recent activity
- Recent projects

**Response Example:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "taskStats": {
      "total": 45,
      "todo": 12,
      "inProgress": 18,
      "done": 15,
      "overdue": 3,
      "dueSoon": 7,
      "byPriority": {
        "high": 8,
        "medium": 15,
        "low": 7
      }
    },
    "projectStats": {
      "total": 10,
      "active": 7,
      "planning": 2,
      "completed": 1
    },
    "tasksDueSoon": [...],
    "overdueTasks": [...],
    "recentActivity": [...]
  }
}
```

#### 2. Workspace Dashboard
**GET** `/api/dashboard/workspace/:workspaceId`

Returns workspace-specific analytics:
- Task statistics (total, my tasks, by status)
- Project statistics
- Member statistics
- Recent projects
- Recent activity
- My tasks in workspace

#### 3. Project Dashboard
**GET** `/api/dashboard/project/:projectId`

Returns project-specific analytics:
- Task statistics (by status, priority, type)
- Completion rate
- Member task distribution
- Recent activity

### Usage in Frontend

```javascript
// Get user dashboard
const response = await axios.get('/api/dashboard');

// Get workspace dashboard
const workspaceData = await axios.get(`/api/dashboard/workspace/${workspaceId}`);

// Get project dashboard
const projectData = await axios.get(`/api/dashboard/project/${projectId}`);
```

---

## Event-Driven Architecture

### Overview
The system uses an event emitter pattern to decouple actions from their side effects (emails, notifications, logging).

### Event Flow

```
User Action → Controller → Event Emitted → Event Listeners → Side Effects
                                          ├─ Send Email
                                          ├─ Log Activity
                                          └─ Push Notification
```

### Available Events

```javascript
import eventEmitter, { Events } from '../utils/eventEmitter.js';

// Task events
eventEmitter.emit(Events.TASK_ASSIGNED, { task, assignee, assignedBy });
eventEmitter.emit(Events.TASK_COMPLETED, { task, completedBy });

// Project events
eventEmitter.emit(Events.PROJECT_CREATED, { project, creator });
eventEmitter.emit(Events.PROJECT_MEMBER_ADDED, { project, user, addedBy });

// Workspace events
eventEmitter.emit(Events.WORKSPACE_MEMBER_ADDED, { workspace, user, invitedBy });

// Comment events
eventEmitter.emit(Events.COMMENT_CREATED, { comment, task, commentBy });
```

### Adding Custom Event Listeners

```javascript
// In eventEmitter.js or a separate listeners file
eventEmitter.on(Events.TASK_ASSIGNED, async (data) => {
  // Send email
  await sendEmail({ ... });
  
  // Log activity
  await ActivityLog.logActivity({ ... });
  
  // Send push notification
  await sendPushNotification({ ... });
});
```

### Benefits

1. **Separation of Concerns**: Controllers focus on business logic, not side effects
2. **Flexibility**: Easy to add/remove notifications without changing controllers
3. **Testability**: Can disable event listeners in tests
4. **Scalability**: Can move to message queues (Redis, RabbitMQ) later
5. **Reliability**: Errors in event listeners don't crash the main request

---

## API Changes Summary

### New Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get user's main dashboard |
| GET | `/api/dashboard/workspace/:id` | Get workspace dashboard |
| GET | `/api/dashboard/project/:id` | Get project dashboard |

### Enhanced Endpoints

All existing endpoints now:
- ✅ Send email notifications for relevant actions
- ✅ Log activities to ActivityLog
- ✅ Emit events for side effects

### No Breaking Changes

All existing API endpoints remain fully compatible. New features are additive.

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install nodemailer
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Update email settings in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### 3. Test Email Configuration

For development, use Ethereal Email:
1. Go to https://ethereal.email
2. Create a test account
3. Copy credentials to `.env`

All emails will be caught and viewable at ethereal.email.

### 4. Restart Server

```bash
npm run dev
```

### 5. Verify Features

Test the new endpoints:

```bash
# Get dashboard
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get workspace dashboard
curl http://localhost:5000/api/dashboard/workspace/WORKSPACE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Migration Notes

### From Previous Version

No database migration required! The ActivityLog collection will be created automatically.

### Email Opt-Out

To disable emails in development:
```env
# Don't set EMAIL_USER in .env
# Emails will be logged to console instead
```

---

## Production Considerations

### Email Service

Choose a reliable email service:
- **SendGrid**: 100 free emails/day
- **Mailgun**: 5,000 free emails/month
- **AWS SES**: $0.10 per 1,000 emails
- **Gmail**: Free but has daily limits

### Activity Log Cleanup

Add a cron job to clean old logs:

```javascript
// Clean logs older than 90 days
await ActivityLog.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
});
```

### Performance

Activity logging is async and non-blocking. If needed:
1. Use background jobs (Bull, Agenda)
2. Batch insert logs
3. Use separate logging database

---

## Future Enhancements

Potential additions:
- [ ] In-app notification center
- [ ] User notification preferences
- [ ] Email templates customization UI
- [ ] Webhook support
- [ ] Slack/Teams integration
- [ ] SMS notifications
- [ ] Real-time notifications (Socket.IO)

---

## Support

For issues or questions:
1. Check the logs: `npm run dev` shows all events
2. Test email: Use Ethereal Email for debugging
3. Activity logs: Query ActivityLog collection

---

**Last Updated**: November 16, 2025
**Version**: 2.0.0
