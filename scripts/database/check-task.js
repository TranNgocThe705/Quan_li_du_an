import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Notification from './models/Notification.js';

dotenv.config();

const checkTask = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Tìm task "Tích hợp Chart.js"
    const task = await Task.findOne({ title: 'Tích hợp Chart.js' })
      .populate('assigneeId', 'name email image')
      .populate('projectId', 'name workspaceId');

    if (!task) {
      console.log('❌ Task not found!');
      
      // List all tasks
      const allTasks = await Task.find().select('title');
      console.log('\n📋 All tasks in database:');
      allTasks.forEach((t, i) => {
        console.log(`${i + 1}. ${t.title}`);
      });
      
      process.exit(1);
    }

    console.log('\n📋 TASK DETAILS:');
    console.log('='.repeat(60));
    console.log('Task ID:', task._id.toString());
    console.log('Title:', task.title);
    console.log('Status:', task.status);
    console.log('Priority:', task.priority);
    console.log('\n👤 ASSIGNEE INFO:');
    console.log('assigneeId (raw):', task.assigneeId);
    console.log('assigneeId type:', typeof task.assigneeId);
    console.log('assigneeId exists:', !!task.assigneeId);
    console.log('assigneeId is null:', task.assigneeId === null);
    
    if (task.assigneeId) {
      console.log('✅ ASSIGNEE FOUND:');
      console.log('   Name:', task.assigneeId.name);
      console.log('   Email:', task.assigneeId.email);
      console.log('   Image:', task.assigneeId.image);
    } else {
      console.log('⚠️  ASSIGNEE IS NULL OR UNDEFINED!');
    }

    console.log('\n📁 PROJECT INFO:');
    console.log('projectId:', task.projectId?._id);
    console.log('Project Name:', task.projectId?.name);
    console.log('Workspace ID:', task.projectId?.workspaceId);
    console.log('='.repeat(60));

    // Kiểm tra tất cả tasks
    const allTasks = await Task.find().select('title assigneeId');
    console.log('\n📊 ALL TASKS SUMMARY:');
    console.log('Total tasks:', allTasks.length);
    
    const tasksWithoutAssignee = allTasks.filter(t => !t.assigneeId);
    console.log('Tasks without assignee:', tasksWithoutAssignee.length);
    
    if (tasksWithoutAssignee.length > 0) {
      console.log('\n⚠️  TASKS WITHOUT ASSIGNEE:');
      tasksWithoutAssignee.forEach(t => {
        console.log(`  - ${t.title} (ID: ${t._id})`);
      });
    }

    // Check notifications
    const notifications = await Notification.find({ entityId: task._id });
    
    console.log('\n🔔 NOTIFICATIONS FOR THIS TASK:');
    console.log('Found notifications:', notifications.length);
    notifications.forEach((notif, i) => {
      console.log(`\nNotification ${i + 1}:`);
      console.log('  Type:', notif.type);
      console.log('  Title:', notif.title);
      console.log('  entityId:', notif.entityId);
      console.log('  projectId:', notif.projectId);
      console.log('  workspaceId:', notif.workspaceId);
      console.log('  actionUrl:', notif.actionUrl);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkTask();
