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
    const password = '123456';

    const users = await User.create([
      {
        name: 'Nguyễn Văn Admin',
        email: 'admin@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=1',
        isSystemAdmin: true, // System Admin - có quyền truy cập trang admin
      },
      {
        name: 'Trần Thị Manager',
        email: 'manager@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=2',
      },
      {
        name: 'Lê Văn Lead',
        email: 'lead@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=3',
      },
      {
        name: 'Phạm Thị Member',
        email: 'member@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=4',
      },
      {
        name: 'Hoàng Văn Dev',
        email: 'dev@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=5',
      },
      {
        name: 'Võ Thị Designer',
        email: 'designer@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=6',
      },
      {
        name: 'Đặng Văn Tester',
        email: 'tester@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=7',
      },
      {
        name: 'Bùi Thị Viewer',
        email: 'viewer@gmail.com',
        password,
        image: 'https://i.pravatar.cc/150?img=8',
      },
    ]);

    console.log('✅ Users created');

    // Create workspaces
    console.log('🏢 Creating workspaces...');
    const workspaces = await Workspace.create([
      {
        name: 'Công Ty TNHH Phần Mềm ABC',
        slug: 'abc-software',
        description: 'Công ty phát triển phần mềm và ứng dụng di động',
        ownerId: users[0]._id, // admin@gmail.com
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      },
    ]);

    console.log('✅ Workspaces created');

    // Add workspace members
    console.log('👤 Adding workspace members...');
    await WorkspaceMember.create([
      // Công Ty ABC Software members
      { userId: users[0]._id, workspaceId: workspaces[0]._id, role: 'ADMIN' },   // admin@gmail.com - Owner/Admin
      { userId: users[1]._id, workspaceId: workspaces[0]._id, role: 'ADMIN' },   // manager@gmail.com - Manager/Admin
      { userId: users[2]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // lead@gmail.com - Member (Team Lead ở project level)
      { userId: users[3]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // member@gmail.com - Member
      { userId: users[4]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // dev@gmail.com - Member
      { userId: users[5]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // designer@gmail.com - Member
      { userId: users[6]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // tester@gmail.com - Member
      { userId: users[7]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // viewer@gmail.com - Member (Viewer ở project level)
    ]);

    console.log('✅ Workspace members added');

    // Create projects
    console.log('📁 Creating projects...');
    const projects = await Project.create([
      {
        name: 'Hệ Thống Quản Lý Bán Hàng',
        description: 'Phát triển hệ thống quản lý bán hàng trực tuyến cho chuỗi cửa hàng bán lẻ. Bao gồm quản lý kho, đơn hàng, khách hàng và báo cáo thống kê.',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-10-01'),
        end_date: new Date('2026-03-31'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 35,
      },
      {
        name: 'App Di Động Đặt Đồ Ăn',
        description: 'Ứng dụng mobile cho phép người dùng đặt đồ ăn từ các nhà hàng địa phương. Tích hợp thanh toán online và tracking đơn hàng realtime.',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-11-01'),
        end_date: new Date('2026-04-30'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 25,
      },
      {
        name: 'Website Tin Tức',
        description: 'Website tin tức với CMS quản lý nội dung, hệ thống comment và phân quyền tác giả.',
        priority: 'MEDIUM',
        status: 'ACTIVE',
        start_date: new Date('2025-11-15'),
        end_date: new Date('2026-02-28'),
        team_lead: users[1]._id, // manager@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 50,
      },
      {
        name: 'Hệ Thống Nhân Sự (HRM)',
        description: 'Phần mềm quản lý nhân sự bao gồm chấm công, tính lương, quản lý phép và đánh giá nhân viên.',
        priority: 'MEDIUM',
        status: 'PLANNING',
        start_date: new Date('2025-12-15'),
        end_date: new Date('2026-06-30'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 5,
      },
      {
        name: 'Dashboard Analytics',
        description: 'Dashboard báo cáo và phân tích dữ liệu với charts và real-time monitoring.',
        priority: 'LOW',
        status: 'COMPLETED',
        start_date: new Date('2025-08-01'),
        end_date: new Date('2025-10-31'),
        team_lead: users[1]._id, // manager@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 100,
      },
    ]);

    console.log('✅ Projects created');

    // Add project members with roles
    console.log('👥 Adding project members...');
    await ProjectMember.create([
      // Hệ Thống Quản Lý Bán Hàng - Full team
      { userId: users[2]._id, projectId: projects[0]._id, role: 'LEAD' },     // lead@gmail.com - Team Lead
      { userId: users[4]._id, projectId: projects[0]._id, role: 'MEMBER' },   // dev@gmail.com - Backend Developer
      { userId: users[5]._id, projectId: projects[0]._id, role: 'MEMBER' },   // designer@gmail.com - UI/UX Designer
      { userId: users[3]._id, projectId: projects[0]._id, role: 'MEMBER' },   // member@gmail.com - Frontend Developer
      { userId: users[6]._id, projectId: projects[0]._id, role: 'MEMBER' },   // tester@gmail.com - QA Tester
      { userId: users[7]._id, projectId: projects[0]._id, role: 'VIEWER' },   // viewer@gmail.com - Stakeholder (chỉ xem)
      
      // App Di Động Đặt Đồ Ăn - Mobile team
      { userId: users[2]._id, projectId: projects[1]._id, role: 'LEAD' },     // lead@gmail.com - Team Lead
      { userId: users[4]._id, projectId: projects[1]._id, role: 'MEMBER' },   // dev@gmail.com - Mobile Developer
      { userId: users[3]._id, projectId: projects[1]._id, role: 'MEMBER' },   // member@gmail.com - Mobile Developer
      { userId: users[5]._id, projectId: projects[1]._id, role: 'MEMBER' },   // designer@gmail.com - UI/UX Designer
      { userId: users[6]._id, projectId: projects[1]._id, role: 'MEMBER' },   // tester@gmail.com - QA Tester
      
      // Website Tin Tức - Content team
      { userId: users[1]._id, projectId: projects[2]._id, role: 'LEAD' },     // manager@gmail.com - Project Manager
      { userId: users[4]._id, projectId: projects[2]._id, role: 'MEMBER' },   // dev@gmail.com - Full-stack Developer
      { userId: users[5]._id, projectId: projects[2]._id, role: 'MEMBER' },   // designer@gmail.com - Designer
      { userId: users[3]._id, projectId: projects[2]._id, role: 'MEMBER' },   // member@gmail.com - Content Writer
      
      // Hệ Thống Nhân Sự - Planning phase
      { userId: users[2]._id, projectId: projects[3]._id, role: 'LEAD' },     // lead@gmail.com - Team Lead
      { userId: users[4]._id, projectId: projects[3]._id, role: 'MEMBER' },   // dev@gmail.com - Developer
      { userId: users[7]._id, projectId: projects[3]._id, role: 'VIEWER' },   // viewer@gmail.com - HR Representative
      
      // Dashboard Analytics - Completed
      { userId: users[1]._id, projectId: projects[4]._id, role: 'LEAD' },     // manager@gmail.com - Project Manager
      { userId: users[4]._id, projectId: projects[4]._id, role: 'MEMBER' },   // dev@gmail.com - Developer
      { userId: users[5]._id, projectId: projects[4]._id, role: 'MEMBER' },   // designer@gmail.com - Designer
    ]);

    console.log('✅ Project members added');

    // Create tasks
    console.log('✅ Creating tasks...');
    const tasks = await Task.create([
      // Hệ Thống Quản Lý Bán Hàng - Tasks
      {
        projectId: projects[0]._id,
        title: 'Thiết kế database schema',
        description: 'Thiết kế cấu trúc database cho module quản lý sản phẩm, đơn hàng và khách hàng',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-10-15'),
      },
      {
        projectId: projects[0]._id,
        title: 'Xây dựng API quản lý sản phẩm',
        description: 'Phát triển REST API cho CRUD operations sản phẩm với phân trang và tìm kiếm',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-10'),
      },
      {
        projectId: projects[0]._id,
        title: 'Thiết kế giao diện dashboard',
        description: 'Mockup và wireframe cho dashboard quản lý bán hàng',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[5]._id, // designer@gmail.com
        due_date: new Date('2025-12-15'),
      },
      {
        projectId: projects[0]._id,
        title: 'Phát triển module đơn hàng',
        description: 'Frontend cho tạo, xem và quản lý đơn hàng',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[3]._id, // member@gmail.com
        due_date: new Date('2025-12-20'),
      },
      {
        projectId: projects[0]._id,
        title: 'Tích hợp thanh toán VNPay',
        description: 'Tích hợp cổng thanh toán VNPay cho đơn hàng online',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2026-01-10'),
      },
      {
        projectId: projects[0]._id,
        title: 'Test chức năng báo cáo doanh thu',
        description: 'Kiểm thử module báo cáo và thống kê doanh thu theo tháng/quý/năm',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[6]._id, // tester@gmail.com
        due_date: new Date('2026-01-15'),
      },
      {
        projectId: projects[0]._id,
        title: 'Fix bug hiển thị tồn kho',
        description: 'Số lượng tồn kho không cập nhật đúng sau khi nhập/xuất hàng',
        status: 'IN_PROGRESS',
        type: 'BUG',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-08'),
      },

      // App Di Động Đặt Đồ Ăn - Tasks
      {
        projectId: projects[1]._id,
        title: 'Setup React Native project',
        description: 'Khởi tạo project React Native với TypeScript và cấu hình ESLint',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-11-05'),
      },
      {
        projectId: projects[1]._id,
        title: 'Thiết kế UI/UX app',
        description: 'Design giao diện cho màn hình home, menu, giỏ hàng và thanh toán',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[5]._id, // designer@gmail.com
        due_date: new Date('2025-11-20'),
      },
      {
        projectId: projects[1]._id,
        title: 'Xây dựng màn hình đăng nhập',
        description: 'Implement authentication với Google và Facebook login',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[3]._id, // member@gmail.com
        due_date: new Date('2025-12-12'),
      },
      {
        projectId: projects[1]._id,
        title: 'Phát triển tính năng tìm kiếm nhà hàng',
        description: 'Tìm kiếm nhà hàng theo vị trí, loại món ăn và giá cả',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-18'),
      },
      {
        projectId: projects[1]._id,
        title: 'Tích hợp Google Maps',
        description: 'Hiển thị vị trí nhà hàng và tracking đơn hàng realtime',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2026-01-05'),
      },
      {
        projectId: projects[1]._id,
        title: 'Setup push notification',
        description: 'Cấu hình Firebase Cloud Messaging cho thông báo đơn hàng',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[3]._id, // member@gmail.com
        due_date: new Date('2026-01-15'),
      },
      {
        projectId: projects[1]._id,
        title: 'Test luồng đặt hàng end-to-end',
        description: 'Kiểm thử toàn bộ quy trình từ chọn món đến thanh toán',
        status: 'TODO',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[6]._id, // tester@gmail.com
        due_date: new Date('2026-01-20'),
      },

      // Website Tin Tức - Tasks
      {
        projectId: projects[2]._id,
        title: 'Xây dựng CMS quản lý bài viết',
        description: 'Admin panel cho tạo, sửa, xóa và publish bài viết',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-10'),
      },
      {
        projectId: projects[2]._id,
        title: 'Thiết kế giao diện trang chủ',
        description: 'Layout responsive cho trang chủ tin tức với các category',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[5]._id, // designer@gmail.com
        due_date: new Date('2025-11-25'),
      },
      {
        projectId: projects[2]._id,
        title: 'Implement hệ thống comment',
        description: 'Cho phép người dùng comment và reply trên bài viết',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-15'),
      },
      {
        projectId: projects[2]._id,
        title: 'Tối ưu SEO cho bài viết',
        description: 'Meta tags, sitemap và schema markup cho SEO',
        status: 'TODO',
        type: 'IMPROVEMENT',
        priority: 'MEDIUM',
        assigneeId: users[3]._id, // member@gmail.com
        due_date: new Date('2025-12-20'),
      },
      {
        projectId: projects[2]._id,
        title: 'Viết nội dung mẫu',
        description: 'Tạo 20 bài viết mẫu cho các chuyên mục khác nhau',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'LOW',
        assigneeId: users[3]._id, // member@gmail.com
        due_date: new Date('2025-12-25'),
      },

      // Hệ Thống Nhân Sự - Tasks
      {
        projectId: projects[3]._id,
        title: 'Phân tích yêu cầu hệ thống',
        description: 'Thu thập và phân tích requirements từ phòng nhân sự',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[2]._id, // lead@gmail.com
        due_date: new Date('2025-12-20'),
      },
      {
        projectId: projects[3]._id,
        title: 'Thiết kế database cho module chấm công',
        description: 'ERD và schema cho module attendance và timesheet',
        status: 'TODO',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-28'),
      },
      {
        projectId: projects[3]._id,
        title: 'Mockup giao diện quản lý nhân viên',
        description: 'Wireframe và prototype cho module HR management',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[2]._id, // lead@gmail.com
        due_date: new Date('2026-01-05'),
      },

      // Dashboard Analytics - Tasks (Completed project)
      {
        projectId: projects[4]._id,
        title: 'Tích hợp Chart.js',
        description: 'Thêm các loại biểu đồ: line, bar, pie, doughnut charts',
        status: 'DONE',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-09-15'),
      },
      {
        projectId: projects[4]._id,
        title: 'Real-time data updates',
        description: 'Cập nhật dữ liệu dashboard theo thời gian thực với WebSocket',
        status: 'DONE',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-10-01'),
      },
      {
        projectId: projects[4]._id,
        title: 'Export báo cáo PDF/Excel',
        description: 'Chức năng xuất báo cáo ra file PDF và Excel',
        status: 'DONE',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-10-20'),
      },
      {
        projectId: projects[4]._id,
        title: 'Responsive design cho mobile',
        description: 'Tối ưu giao diện dashboard cho thiết bị di động',
        status: 'DONE',
        type: 'IMPROVEMENT',
        priority: 'MEDIUM',
        assigneeId: users[5]._id, // designer@gmail.com
        due_date: new Date('2025-10-25'),
      },
    ]);

    console.log('✅ Tasks created');

    // Create comments
    console.log('💬 Creating comments...');
    await Comment.create([
      // Comments cho Hệ Thống Quản Lý Bán Hàng
      {
        content: 'Database schema đã được thiết kế xong. Đã tạo 8 tables chính.',
        userId: users[4]._id, // dev@gmail.com
        taskId: tasks[0]._id,
      },
      {
        content: 'Good job! Hãy bắt đầu implement API cho module sản phẩm.',
        userId: users[2]._id, // lead@gmail.com
        taskId: tasks[0]._id,
      },
      {
        content: 'API sản phẩm đã hoàn thành 60%. Đang implement chức năng search.',
        userId: users[4]._id,
        taskId: tasks[1]._id,
      },
      {
        content: 'Dashboard design đã hoàn thành mockup trên Figma. Mời mọi người review.',
        userId: users[5]._id, // designer@gmail.com
        taskId: tasks[2]._id,
      },
      {
        content: 'Design trông rất đẹp! Approve để bắt đầu code frontend.',
        userId: users[2]._id,
        taskId: tasks[2]._id,
      },
      {
        content: 'Bug tồn kho đã được fix. Vấn đề do race condition khi update đồng thời.',
        userId: users[4]._id,
        taskId: tasks[6]._id,
      },
      
      // Comments cho App Di Động Đặt Đồ Ăn
      {
        content: 'React Native project đã setup với TypeScript. Ready to code!',
        userId: users[4]._id,
        taskId: tasks[7]._id,
      },
      {
        content: 'UI design hoàn thành. Đã follow Material Design cho Android và Human Interface Guidelines cho iOS.',
        userId: users[5]._id,
        taskId: tasks[8]._id,
      },
      {
        content: 'Màn hình login đang implement Google OAuth. Facebook login sẽ làm sau.',
        userId: users[3]._id, // member@gmail.com
        taskId: tasks[9]._id,
      },
      {
        content: 'Search feature đã hoàn thành 70%. Đang optimize performance.',
        userId: users[4]._id,
        taskId: tasks[10]._id,
      },
      
      // Comments cho Website Tin Tức
      {
        content: 'CMS đang phát triển tốt. Đã có chức năng CRUD bài viết và rich text editor.',
        userId: users[4]._id,
        taskId: tasks[14]._id,
      },
      {
        content: 'Hệ thống comment đang implement với nested replies. Sẽ hoàn thành trong tuần này.',
        userId: users[4]._id,
        taskId: tasks[16]._id,
      },
      {
        content: 'Đã viết 10/20 bài viết mẫu. Đang viết các bài còn lại.',
        userId: users[3]._id,
        taskId: tasks[18]._id,
      },
      
      // Comments cho Hệ Thống Nhân Sự
      {
        content: 'Đã họp với phòng HR để thu thập requirements. Sẽ tổng hợp và gửi document.',
        userId: users[2]._id,
        taskId: tasks[19]._id,
      },
      
      // Comments cho Dashboard Analytics
      {
        content: 'Dashboard project đã hoàn thành và deploy lên production!',
        userId: users[1]._id, // manager@gmail.com
        taskId: tasks[23]._id,
      },
      {
        content: 'Real-time updates hoạt động rất mượt. Performance tốt!',
        userId: users[4]._id,
        taskId: tasks[24]._id,
      },
    ]);

    console.log('✅ Comments created');

    console.log('\n🎉 Dữ liệu đã được tạo thành công!\n');
    console.log('🏢 Workspace: Công Ty TNHH Phần Mềm ABC');
    console.log('📁 Projects: 5 dự án (Quản lý bán hàng, App đặt đồ ăn, Website tin tức, HRM, Dashboard)');
    console.log('✅ Tasks: 28 tasks với nhiều trạng thái khác nhau');
    console.log('💬 Comments: 16 comments từ các thành viên\n');
    console.log('👥 Tài khoản test (password: 123456):\n');
    console.log('   🔴 QUẢN LÝ:');
    console.log('   - admin@gmail.com (Admin - Chủ workspace)');
    console.log('   - manager@gmail.com (Manager - Admin workspace)\n');
    console.log('   🔵 TEAM MEMBERS:');
    console.log('   - lead@gmail.com (Team Lead - Quản lý projects)');
    console.log('   - member@gmail.com (Member - Frontend Dev)');
    console.log('   - dev@gmail.com (Member - Backend Dev)');
    console.log('   - designer@gmail.com (Member - UI/UX Designer)');
    console.log('   - tester@gmail.com (Member - QA Tester)');
    console.log('   - viewer@gmail.com (Viewer - Stakeholder)\n');
    console.log('📖 Chi tiết phân quyền: backend/TESTING_PERMISSIONS.md\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();
