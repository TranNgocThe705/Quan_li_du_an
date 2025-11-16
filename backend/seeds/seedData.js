import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Import models
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await WorkspaceMember.deleteMany({});
    await Project.deleteMany({});
    await ProjectMember.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    // Don't hash password here - let the User model's pre-save hook handle it
    const password = 'password123';

    const users = await User.create([
      {
        name: 'Alex Smith',
        email: 'alex@example.com',
        password,
        image: 'https://i.pravatar.cc/150?img=1',
      },
      {
        name: 'John Warrel',
        email: 'john@example.com',
        password,
        image: 'https://i.pravatar.cc/150?img=2',
      },
      {
        name: 'Oliver Watts',
        email: 'oliver@example.com',
        password,
        image: 'https://i.pravatar.cc/150?img=3',
      },
    ]);

    console.log('✅ Users created');

    // Create workspaces
    console.log('🏢 Creating workspaces...');
    const workspaces = await Workspace.create([
      {
        name: 'Tech Startup Inc',
        slug: 'tech-startup-inc',
        description: 'Workspace chính cho các dự án công nghệ',
        ownerId: users[0]._id,
        image_url: 'https://via.placeholder.com/300x200?text=Tech+Startup',
      },
      {
        name: 'Marketing Team',
        slug: 'marketing-team',
        description: 'Workspace cho đội marketing và truyền thông',
        ownerId: users[0]._id,
        image_url: 'https://via.placeholder.com/300x200?text=Marketing',
      },
    ]);

    console.log('✅ Workspaces created');

    // Add workspace members
    console.log('👤 Adding workspace members...');
    await WorkspaceMember.create([
      // Tech Startup Inc members
      { userId: users[0]._id, workspaceId: workspaces[0]._id, role: 'ADMIN' },
      { userId: users[1]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },
      { userId: users[2]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },
      // Marketing Team members
      { userId: users[0]._id, workspaceId: workspaces[1]._id, role: 'ADMIN' },
      { userId: users[1]._id, workspaceId: workspaces[1]._id, role: 'MEMBER' },
    ]);

    console.log('✅ Workspace members added');

    // Create projects
    console.log('📁 Creating projects...');
    const projects = await Project.create([
      // Tech Startup Inc projects
      {
        name: 'Website Redesign',
        description: 'Thiết kế lại website công ty với giao diện hiện đại và responsive',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-11-01'),
        end_date: new Date('2025-12-31'),
        team_lead: users[0]._id,
        workspaceId: workspaces[0]._id,
        progress: 45,
      },
      {
        name: 'Mobile App Development',
        description: 'Phát triển ứng dụng di động iOS và Android với React Native',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-11-15'),
        end_date: new Date('2026-03-31'),
        team_lead: users[1]._id,
        workspaceId: workspaces[0]._id,
        progress: 25,
      },
      {
        name: 'API Development',
        description: 'Xây dựng RESTful API với Node.js và Express',
        priority: 'MEDIUM',
        status: 'PLANNING',
        start_date: new Date('2025-12-01'),
        end_date: new Date('2026-02-28'),
        team_lead: users[2]._id,
        workspaceId: workspaces[0]._id,
        progress: 10,
      },
      {
        name: 'Database Optimization',
        description: 'Tối ưu hóa database và cải thiện performance',
        priority: 'MEDIUM',
        status: 'COMPLETED',
        start_date: new Date('2025-10-01'),
        end_date: new Date('2025-10-31'),
        team_lead: users[0]._id,
        workspaceId: workspaces[0]._id,
        progress: 100,
      },
      // Marketing Team projects
      {
        name: 'Q4 Marketing Campaign',
        description: 'Chiến dịch marketing quý 4 trên social media',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-10-01'),
        end_date: new Date('2025-12-31'),
        team_lead: users[1]._id,
        workspaceId: workspaces[1]._id,
        progress: 60,
      },
      {
        name: 'Content Strategy 2026',
        description: 'Lập kế hoạch content marketing cho năm 2026',
        priority: 'MEDIUM',
        status: 'PLANNING',
        start_date: new Date('2025-11-20'),
        end_date: new Date('2026-01-15'),
        team_lead: users[0]._id,
        workspaceId: workspaces[1]._id,
        progress: 15,
      },
    ]);

    console.log('✅ Projects created');

    // Add project members
    console.log('👥 Adding project members...');
    await ProjectMember.create([
      // Website Redesign team
      { userId: users[0]._id, projectId: projects[0]._id },
      { userId: users[1]._id, projectId: projects[0]._id },
      { userId: users[2]._id, projectId: projects[0]._id },
      // Mobile App team
      { userId: users[1]._id, projectId: projects[1]._id },
      { userId: users[2]._id, projectId: projects[1]._id },
      // API Development team
      { userId: users[0]._id, projectId: projects[2]._id },
      { userId: users[2]._id, projectId: projects[2]._id },
      // Database Optimization team
      { userId: users[0]._id, projectId: projects[3]._id },
      { userId: users[1]._id, projectId: projects[3]._id },
      // Q4 Marketing Campaign team
      { userId: users[0]._id, projectId: projects[4]._id },
      { userId: users[1]._id, projectId: projects[4]._id },
      // Content Strategy 2026 team
      { userId: users[0]._id, projectId: projects[5]._id },
      { userId: users[1]._id, projectId: projects[5]._id },
    ]);

    console.log('✅ Project members added');

    // Create tasks
    console.log('✅ Creating tasks...');
    const tasks = await Task.create([
      // Website Redesign tasks
      {
        projectId: projects[0]._id,
        title: 'Thiết kế trang chủ mới',
        description: 'Tạo mockup và wireframe cho trang chủ với giao diện hiện đại',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[1]._id,
        due_date: new Date('2025-11-20'),
      },
      {
        projectId: projects[0]._id,
        title: 'Fix lỗi navigation mobile',
        description: 'Menu navigation không hoạt động đúng trên mobile devices',
        status: 'TODO',
        type: 'BUG',
        priority: 'HIGH',
        assigneeId: users[0]._id,
        due_date: new Date('2025-11-15'),
      },
      {
        projectId: projects[0]._id,
        title: 'Tối ưu hóa SEO',
        description: 'Cải thiện SEO cho tất cả các trang',
        status: 'TODO',
        type: 'IMPROVEMENT',
        priority: 'MEDIUM',
        assigneeId: users[2]._id,
        due_date: new Date('2025-11-25'),
      },
      {
        projectId: projects[0]._id,
        title: 'Implement dark mode',
        description: 'Thêm chế độ dark mode cho website',
        status: 'DONE',
        type: 'FEATURE',
        priority: 'LOW',
        assigneeId: users[1]._id,
        due_date: new Date('2025-11-10'),
      },
      {
        projectId: projects[0]._id,
        title: 'Setup analytics',
        description: 'Tích hợp Google Analytics và tracking',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[0]._id,
        due_date: new Date('2025-11-18'),
      },
      // Mobile App tasks
      {
        projectId: projects[1]._id,
        title: 'Setup development environment',
        description: 'Cài đặt React Native và configure dependencies',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[2]._id,
        due_date: new Date('2025-11-10'),
      },
      {
        projectId: projects[1]._id,
        title: 'Design app UI/UX',
        description: 'Thiết kế giao diện người dùng cho app',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[1]._id,
        due_date: new Date('2025-11-22'),
      },
      {
        projectId: projects[1]._id,
        title: 'Implement authentication',
        description: 'Xây dựng hệ thống đăng nhập/đăng ký',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[2]._id,
        due_date: new Date('2025-11-28'),
      },
      {
        projectId: projects[1]._id,
        title: 'Setup push notifications',
        description: 'Tích hợp Firebase push notifications',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[1]._id,
        due_date: new Date('2025-12-05'),
      },
      // API Development tasks
      {
        projectId: projects[2]._id,
        title: 'Design API schema',
        description: 'Thiết kế database schema và API endpoints',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[2]._id,
        due_date: new Date('2025-12-10'),
      },
      {
        projectId: projects[2]._id,
        title: 'Setup authentication middleware',
        description: 'Implement JWT authentication',
        status: 'TODO',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[0]._id,
        due_date: new Date('2025-12-15'),
      },
      {
        projectId: projects[2]._id,
        title: 'Write API documentation',
        description: 'Tạo documentation với Swagger',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[2]._id,
        due_date: new Date('2025-12-20'),
      },
      // Database Optimization tasks (completed)
      {
        projectId: projects[3]._id,
        title: 'Analyze slow queries',
        description: 'Phân tích và tối ưu các query chậm',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[0]._id,
        due_date: new Date('2025-10-20'),
      },
      {
        projectId: projects[3]._id,
        title: 'Add database indexes',
        description: 'Thêm indexes để cải thiện performance',
        status: 'DONE',
        type: 'IMPROVEMENT',
        priority: 'HIGH',
        assigneeId: users[0]._id,
        due_date: new Date('2025-10-25'),
      },
      // Marketing Campaign tasks
      {
        projectId: projects[4]._id,
        title: 'Create content calendar',
        description: 'Lập lịch đăng content cho Q4',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[1]._id,
        due_date: new Date('2025-10-15'),
      },
      {
        projectId: projects[4]._id,
        title: 'Design social media posts',
        description: 'Thiết kế hình ảnh cho các bài đăng',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[1]._id,
        due_date: new Date('2025-11-20'),
      },
      {
        projectId: projects[4]._id,
        title: 'Run Facebook ads campaign',
        description: 'Setup và chạy quảng cáo Facebook',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[0]._id,
        due_date: new Date('2025-11-25'),
      },
      // Content Strategy tasks
      {
        projectId: projects[5]._id,
        title: 'Research target audience',
        description: 'Nghiên cứu đối tượng khách hàng mục tiêu',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[0]._id,
        due_date: new Date('2025-11-30'),
      },
      {
        projectId: projects[5]._id,
        title: 'Define content pillars',
        description: 'Xác định các trụ cột nội dung chính',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[1]._id,
        due_date: new Date('2025-12-10'),
      },
    ]);

    console.log('✅ Tasks created');

    // Create comments
    console.log('💬 Creating comments...');
    await Comment.create([
      // Comments for Website Redesign tasks
      {
        content: 'Tôi đã bắt đầu làm mockup. Sẽ chia sẻ trước cuối ngày.',
        userId: users[1]._id,
        taskId: tasks[0]._id,
      },
      {
        content: 'Tuyệt vời! Mong được xem thiết kế mới.',
        userId: users[0]._id,
        taskId: tasks[0]._id,
      },
      {
        content: 'Đã hoàn thành 70% mockup. Đang chờ feedback từ team.',
        userId: users[1]._id,
        taskId: tasks[0]._id,
      },
      {
        content: 'Bug này khá nghiêm trọng. Cần ưu tiên xử lý ngay.',
        userId: users[0]._id,
        taskId: tasks[1]._id,
      },
      {
        content: 'Tôi sẽ fix trong ngày hôm nay.',
        userId: users[0]._id,
        taskId: tasks[1]._id,
      },
      {
        content: 'Dark mode đã hoàn thành và test thành công!',
        userId: users[1]._id,
        taskId: tasks[3]._id,
      },
      // Comments for Mobile App tasks
      {
        content: 'Development environment đã setup xong. Sẵn sàng bắt đầu code.',
        userId: users[2]._id,
        taskId: tasks[5]._id,
      },
      {
        content: 'UI design đang được làm theo Material Design guidelines.',
        userId: users[1]._id,
        taskId: tasks[6]._id,
      },
      {
        content: 'Cần review design trước khi implement.',
        userId: users[2]._id,
        taskId: tasks[6]._id,
      },
      // Comments for API tasks
      {
        content: 'Database schema đã được thiết kế. Cần review từ senior dev.',
        userId: users[2]._id,
        taskId: tasks[9]._id,
      },
      {
        content: 'Schema trông ổn. Approved!',
        userId: users[0]._id,
        taskId: tasks[9]._id,
      },
      // Comments for Marketing tasks
      {
        content: 'Content calendar đã hoàn thành và được approve.',
        userId: users[1]._id,
        taskId: tasks[14]._id,
      },
      {
        content: 'Đang design posts theo brand guidelines mới.',
        userId: users[1]._id,
        taskId: tasks[15]._id,
      },
      {
        content: 'Cần budget approval cho Facebook ads.',
        userId: users[0]._id,
        taskId: tasks[16]._id,
      },
    ]);

    console.log('✅ Comments created');

    console.log('\n🎉 Seed data created successfully!\n');
    console.log('📧 Test accounts (all with password: password123):');
    console.log('   - alex@example.com (Admin)');
    console.log('   - john@example.com (Member)');
    console.log('   - oliver@example.com (Member)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();
