import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For development, use ethereal email or console
  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@ethereal.email',
        pass: process.env.EMAIL_PASS || 'test_password',
      },
    });
  }

  // For production, use your email service (Gmail, SendGrid, etc.)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const transporter = createTransporter();

// Email templates
export const emailTemplates = {
  taskAssigned: (task, assignee, assignedBy) => ({
    subject: `New Task Assigned: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been assigned a new task</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${task.title}</h3>
          <p><strong>Description:</strong> ${task.description || 'No description'}</p>
          <p><strong>Priority:</strong> <span style="color: ${task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}">${task.priority}</span></p>
          <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
          <p><strong>Assigned by:</strong> ${assignedBy.name}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/tasks/${task._id}" 
           style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
          View Task
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This email was sent from Project Management System. If you don't want to receive these notifications, 
          you can update your preferences in settings.
        </p>
      </div>
    `,
  }),

  taskCompleted: (task, completedBy) => ({
    subject: `Task Completed: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>✅ Task Completed</h2>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0;">${task.title}</h3>
          <p><strong>Completed by:</strong> ${completedBy.name}</p>
          <p><strong>Project:</strong> ${task.projectId?.name || 'N/A'}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/tasks/${task._id}" 
           style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Task
        </a>
      </div>
    `,
  }),

  workspaceInvite: (workspace, invitedBy, inviteeEmail) => ({
    subject: `You've been invited to ${workspace.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Workspace Invitation</h2>
        <p>${invitedBy.name} has invited you to join <strong>${workspace.name}</strong></p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Workspace:</strong> ${workspace.name}</p>
          <p><strong>Description:</strong> ${workspace.description || 'No description'}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/workspaces/${workspace._id}" 
           style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Workspace
        </a>
      </div>
    `,
  }),

  projectCreated: (project, creator) => ({
    subject: `New Project Created: ${project.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Project Created</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${project.name}</h3>
          <p><strong>Description:</strong> ${project.description || 'No description'}</p>
          <p><strong>Created by:</strong> ${creator.name}</p>
          <p><strong>Status:</strong> ${project.status}</p>
          <p><strong>Priority:</strong> ${project.priority}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/projects/${project._id}" 
           style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Project
        </a>
      </div>
    `,
  }),

  commentAdded: (comment, task, commentBy) => ({
    subject: `New comment on: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Comment</h2>
        <p>${commentBy.name} commented on task <strong>${task.title}</strong></p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0;">${comment.content}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/tasks/${task._id}" 
           style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Task
        </a>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Skip sending emails if email is not configured
    if (!process.env.EMAIL_USER) {
      console.log('📧 Email not configured. Would send to:', to);
      console.log('Subject:', subject);
      return { success: true, message: 'Email not configured (dev mode)' };
    }

    const info = await transporter.sendMail({
      from: `"Project Management" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('📧 Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

export default { transporter, emailTemplates, sendEmail };
