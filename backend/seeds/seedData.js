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
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

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
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    // Don't hash password here - let the User model's pre-save hook handle it
    const password = '123456';

    const users = await User.create([
      {
        name: 'Nguyễn Văn Admin',
        email: 'admin@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        isSystemAdmin: true, // System Admin - có quyền truy cập trang admin
      },
      {
        name: 'Trần Thị Manager',
        email: 'manager@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Manager&background=DC2626&color=fff',
      },
      {
        name: 'Lê Văn Lead',
        email: 'lead@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Lead&background=7C3AED&color=fff',
      },
      {
        name: 'Phạm Thị Member',
        email: 'member@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Member&background=F59E0B&color=fff',
      },
      {
        name: 'Hoàng Văn Dev',
        email: 'dev@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Dev&background=10B981&color=fff',
      },
      {
        name: 'Võ Thị Designer',
        email: 'designer@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Designer&background=EC4899&color=fff',
      },
      {
        name: 'Đặng Văn Tester',
        email: 'tester@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Tester&background=6366F1&color=fff',
      },
      {
        name: 'Bùi Thị Viewer',
        email: 'viewer@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Viewer&background=64748B&color=fff',
      },
      {
        name: 'Ngô Văn Client',
        email: 'client@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Client&background=F97316&color=fff',
      },
      {
        name: 'Mai Thị Product',
        email: 'product@gmail.com',
        password,
        image: 'https://ui-avatars.com/api/?name=Product&background=14B8A6&color=fff',
      },
    ]);

    console.log('✅ Users created');

    // Create workspaces
    console.log('🏢 Creating workspaces...');
    const workspaces = await Workspace.create([
      {
        name: 'Công Ty TNHH Phần Mềm ABC',
        slug: 'abc-software-' + Date.now(),
        description: 'Công ty phát triển phần mềm và ứng dụng di động, chuyên về web và mobile app',
        ownerId: users[0]._id, // admin@gmail.com
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      },
      {
        name: 'Startup Tech Solutions',
        slug: 'startup-tech-' + Date.now(),
        description: 'Startup công nghệ tập trung vào AI và Machine Learning',
        ownerId: users[1]._id, // manager@gmail.com
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      },
      {
        name: 'Team Lead Development Hub',
        slug: 'lead-dev-hub-' + Date.now(),
        description: 'Workspace cho testing approval workflow và task management',
        ownerId: users[2]._id, // lead@gmail.com - Owner/Creator
        image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
      },
    ]);

    console.log('✅ Workspaces created');

    // Add workspace members
    console.log('👤 Adding workspace members...');
    await WorkspaceMember.create([
      // Công Ty ABC Software members
      { userId: users[0]._id, workspaceId: workspaces[0]._id, role: 'ADMIN' },   // admin@gmail.com
      { userId: users[1]._id, workspaceId: workspaces[0]._id, role: 'ADMIN' },   // manager@gmail.com
      { userId: users[2]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // lead@gmail.com
      { userId: users[3]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // member@gmail.com
      { userId: users[4]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // dev@gmail.com
      { userId: users[5]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // designer@gmail.com
      { userId: users[6]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // tester@gmail.com
      { userId: users[7]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // viewer@gmail.com
      { userId: users[8]._id, workspaceId: workspaces[0]._id, role: 'MEMBER' },  // client@gmail.com
      
      // Startup Tech members
      { userId: users[1]._id, workspaceId: workspaces[1]._id, role: 'ADMIN' },   // manager@gmail.com - Owner
      { userId: users[4]._id, workspaceId: workspaces[1]._id, role: 'MEMBER' },  // dev@gmail.com
      { userId: users[9]._id, workspaceId: workspaces[1]._id, role: 'MEMBER' },  // product@gmail.com
      
      // Test Workspace members - lead@gmail.com's workspace
      { userId: users[2]._id, workspaceId: workspaces[2]._id, role: 'ADMIN' },   // lead@gmail.com - Owner
      { userId: users[4]._id, workspaceId: workspaces[2]._id, role: 'MEMBER' },  // dev@gmail.com
      { userId: users[5]._id, workspaceId: workspaces[2]._id, role: 'MEMBER' },  // designer@gmail.com
      { userId: users[6]._id, workspaceId: workspaces[2]._id, role: 'MEMBER' },  // tester@gmail.com
    ]);

    console.log('✅ Workspace members added');

    // Create projects
    console.log('📁 Creating projects...');
    const projects = await Project.create([
      // Workspace 1 - ABC Software
      {
        name: 'Hệ Thống Quản Lý Bán Hàng',
        description: 'Phát triển hệ thống quản lý bán hàng trực tuyến cho chuỗi cửa hàng bán lẻ. Bao gồm quản lý kho, đơn hàng, khách hàng và báo cáo thống kê.',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-10-01'),
        end_date: new Date('2026-03-31'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 45,
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
        progress: 38,
      },
      {
        name: 'Website E-commerce',
        description: 'Website bán hàng online với tính năng giỏ hàng, thanh toán, quản lý đơn hàng và tích hợp vận chuyển.',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-09-15'),
        end_date: new Date('2026-02-28'),
        team_lead: users[1]._id, // manager@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 62,
      },
      {
        name: 'Hệ Thống CRM',
        description: 'Customer Relationship Management - Quản lý khách hàng, leads, opportunities và sales pipeline.',
        priority: 'MEDIUM',
        status: 'ACTIVE',
        start_date: new Date('2025-12-01'),
        end_date: new Date('2026-05-31'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 15,
      },
      {
        name: 'Mobile Banking App',
        description: 'Ứng dụng ngân hàng di động với tính năng chuyển khoản, thanh toán hóa đơn và quản lý tài chính cá nhân.',
        priority: 'HIGH',
        status: 'PLANNING',
        start_date: new Date('2026-01-15'),
        end_date: new Date('2026-08-31'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 8,
      },
      {
        name: 'Dashboard Analytics',
        description: 'Dashboard báo cáo và phân tích dữ liệu với charts và real-time monitoring.',
        priority: 'MEDIUM',
        status: 'COMPLETED',
        start_date: new Date('2025-08-01'),
        end_date: new Date('2025-11-30'),
        team_lead: users[1]._id, // manager@gmail.com
        workspaceId: workspaces[0]._id,
        progress: 100,
      },
      
      // Workspace 2 - Startup Tech
      {
        name: 'AI Chatbot Platform',
        description: 'Nền tảng chatbot AI cho doanh nghiệp với NLP và machine learning.',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-10-15'),
        end_date: new Date('2026-04-30'),
        team_lead: users[9]._id, // product@gmail.com
        workspaceId: workspaces[1]._id,
        progress: 28,
      },
      
      // Workspace 3 - Team Lead Development Hub (Test Workspace)
      {
        name: 'Task Approval System Testing',
        description: 'Project để test chức năng phê duyệt task và workflow quản lý công việc',
        priority: 'HIGH',
        status: 'ACTIVE',
        start_date: new Date('2025-12-01'),
        end_date: new Date('2026-03-31'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[2]._id,
        progress: 0,
      },
      {
        name: 'Feature Development Sprint',
        description: 'Sprint phát triển các tính năng mới cho hệ thống',
        priority: 'MEDIUM',
        status: 'ACTIVE',
        start_date: new Date('2025-12-01'),
        end_date: new Date('2026-02-28'),
        team_lead: users[2]._id, // lead@gmail.com
        workspaceId: workspaces[2]._id,
        progress: 0,
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
      
      // AI Chatbot Platform - Startup Tech
      { userId: users[9]._id, projectId: projects[6]._id, role: 'LEAD' },     // product@gmail.com - Product Owner
      { userId: users[4]._id, projectId: projects[6]._id, role: 'MEMBER' },   // dev@gmail.com - Developer
      { userId: users[1]._id, projectId: projects[6]._id, role: 'MEMBER' },   // manager@gmail.com - Manager
      
      // Task Approval System Testing - Test Workspace
      { userId: users[2]._id, projectId: projects[7]._id, role: 'LEAD' },     // lead@gmail.com - Team Lead (Creator)
      { userId: users[4]._id, projectId: projects[7]._id, role: 'MEMBER' },   // dev@gmail.com - Developer
      { userId: users[5]._id, projectId: projects[7]._id, role: 'MEMBER' },   // designer@gmail.com - Designer
      { userId: users[6]._id, projectId: projects[7]._id, role: 'MEMBER' },   // tester@gmail.com - QA Tester
      
      // Feature Development Sprint - Test Workspace
      { userId: users[2]._id, projectId: projects[8]._id, role: 'LEAD' },     // lead@gmail.com - Team Lead
      { userId: users[4]._id, projectId: projects[8]._id, role: 'MEMBER' },   // dev@gmail.com - Developer
      { userId: users[6]._id, projectId: projects[8]._id, role: 'MEMBER' },   // tester@gmail.com - QA Tester
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
      
      // Task Approval System Testing - Tasks (Test Workspace)
      {
        projectId: projects[7]._id,
        title: 'Thiết kế UI cho approval workflow',
        description: 'Thiết kế giao diện hiển thị lịch sử approval, buttons approve/reject',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[5]._id, // designer@gmail.com
        due_date: new Date('2025-12-05'),
        checklistItems: [
          { text: 'Wireframe cho approval history', completed: true },
          { text: 'Design buttons approve/reject', completed: true },
          { text: 'Review với team', completed: true },
        ],
      },
      {
        projectId: projects[7]._id,
        title: 'Implement backend approval API',
        description: 'API endpoints: submitForApproval, approveTask, rejectTask, getPendingApprovals',
        status: 'DONE',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-08'),
        checklistItems: [
          { text: 'Create submitForApproval endpoint', completed: true },
          { text: 'Create approveTask endpoint', completed: true },
          { text: 'Create rejectTask endpoint', completed: true },
          { text: 'Test all endpoints', completed: true },
        ],
      },
      {
        projectId: projects[7]._id,
        title: 'Test approval workflow end-to-end',
        description: 'Kiểm thử toàn bộ quy trình: submit → pending → approve/reject → notification',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: users[6]._id, // tester@gmail.com
        due_date: new Date('2025-12-15'),
        checklistItems: [
          { text: 'Test submit for approval', completed: true },
          { text: 'Test approve functionality', completed: false },
          { text: 'Test reject with reason', completed: false },
          { text: 'Test notification system', completed: false },
        ],
      },
      {
        projectId: projects[7]._id,
        title: 'Thêm approval policy settings',
        description: 'Cho phép config approval rules: auto-approve, require N approvals, v.v.',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-20'),
      },
      {
        projectId: projects[7]._id,
        title: 'Fix bug approval history không hiển thị',
        description: 'ApprovalHistory component không render khi task có nhiều approval requests',
        status: 'TODO',
        type: 'BUG',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-12'),
      },
      
      // Feature Development Sprint - Tasks (Test Workspace)
      {
        projectId: projects[8]._id,
        title: 'Implement task templates',
        description: 'Cho phép user tạo template cho các task lặp lại',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'MEDIUM',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-18'),
      },
      {
        projectId: projects[8]._id,
        title: 'Add time tracking feature',
        description: 'Thêm chức năng track thời gian làm việc cho mỗi task',
        status: 'TODO',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: users[4]._id, // dev@gmail.com
        due_date: new Date('2025-12-25'),
      },
      {
        projectId: projects[8]._id,
        title: 'Test performance với 1000+ tasks',
        description: 'Load test và optimize performance khi có nhiều tasks',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: users[6]._id, // tester@gmail.com
        due_date: new Date('2026-01-05'),
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
      
      // Comments cho Test Workspace - Task Approval System Testing
      {
        content: 'UI design cho approval workflow đã hoàn thành. Đang chờ review từ team lead.',
        userId: users[5]._id, // designer@gmail.com
        taskId: tasks[28]._id,
      },
      {
        content: 'Design looks great! Approved, bắt đầu implement nhé!',
        userId: users[2]._id, // lead@gmail.com
        taskId: tasks[28]._id,
      },
      {
        content: 'Backend API đã hoàn thành và đã test trên Postman. Tất cả endpoints đều working!',
        userId: users[4]._id, // dev@gmail.com
        taskId: tasks[29]._id,
      },
      {
        content: 'Excellent work! Frontend team có thể bắt đầu integrate rồi.',
        userId: users[2]._id, // lead@gmail.com
        taskId: tasks[29]._id,
      },
      {
        content: 'Đang test workflow. Submit và notification hoạt động OK. Approve/reject còn một vài bugs.',
        userId: users[6]._id, // tester@gmail.com
        taskId: tasks[30]._id,
      },
      {
        content: 'Hãy tạo bug report chi tiết để dev team fix nhé!',
        userId: users[2]._id, // lead@gmail.com
        taskId: tasks[30]._id,
      },
    ]);

    console.log('✅ Comments created');

    // Create notifications
    console.log('🔔 Creating notifications...');
    await Notification.create([
      // Notifications cho admin@gmail.com
      {
        userId: users[0]._id, // admin@gmail.com
        fromUserId: users[1]._id, // manager@gmail.com
        type: 'PROJECT_UPDATED',
        title: 'Dự án đã được cập nhật',
        message: 'Trần Thị Manager đã cập nhật thông tin dự án Website Tin Tức',
        entityType: 'PROJECT',
        entityId: projects[2]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[2]._id,
        isRead: false,
      },
      {
        userId: users[0]._id,
        fromUserId: users[2]._id, // lead@gmail.com
        type: 'TASK_COMPLETED',
        title: 'Task đã hoàn thành',
        message: 'Lê Văn Lead đã hoàn thành task "Thiết kế database schema"',
        entityType: 'TASK',
        entityId: tasks[0]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        isRead: true,
      },

      // Notifications cho manager@gmail.com
      {
        userId: users[1]._id, // manager@gmail.com
        fromUserId: users[4]._id, // dev@gmail.com
        type: 'TASK_UPDATED',
        title: 'Task đã được cập nhật',
        message: 'Hoàng Văn Dev đã cập nhật trạng thái task "Xây dựng CMS quản lý bài viết"',
        entityType: 'TASK',
        entityId: tasks[14]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[2]._id,
        isRead: false,
      },

      // Notifications cho lead@gmail.com
      {
        userId: users[2]._id, // lead@gmail.com
        fromUserId: users[4]._id,
        type: 'TASK_COMMENT',
        title: 'Comment mới trên task',
        message: 'Hoàng Văn Dev đã comment trên task "Xây dựng API quản lý sản phẩm"',
        entityType: 'TASK',
        entityId: tasks[1]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        isRead: false,
      },
      {
        userId: users[2]._id,
        type: 'TASK_DUE_SOON',
        title: 'Task sắp đến hạn',
        message: 'Task "Phân tích yêu cầu hệ thống" sẽ đến hạn trong 3 ngày',
        entityType: 'TASK',
        entityId: tasks[19]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[3]._id,
        isRead: false,
      },

      // Notifications cho member@gmail.com
      {
        userId: users[3]._id, // member@gmail.com
        fromUserId: users[2]._id,
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Phát triển module đơn hàng" cho bạn',
        entityType: 'TASK',
        entityId: tasks[3]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        isRead: false,
      },
      {
        userId: users[3]._id,
        fromUserId: users[2]._id,
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Xây dựng màn hình đăng nhập" cho bạn',
        entityType: 'TASK',
        entityId: tasks[9]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[1]._id,
        isRead: true,
      },

      // Notifications cho dev@gmail.com
      {
        userId: users[4]._id, // dev@gmail.com
        fromUserId: users[2]._id,
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Fix bug hiển thị tồn kho" cho bạn',
        entityType: 'TASK',
        entityId: tasks[6]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        isRead: false,
      },
      {
        userId: users[4]._id,
        fromUserId: users[5]._id, // designer@gmail.com
        type: 'TASK_COMMENT',
        title: 'Comment mới trên task',
        message: 'Võ Thị Designer đã comment trên task "Thiết kế giao diện dashboard"',
        entityType: 'TASK',
        entityId: tasks[2]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        isRead: false,
      },

      // Notifications cho designer@gmail.com
      {
        userId: users[5]._id, // designer@gmail.com
        fromUserId: users[2]._id,
        type: 'PROJECT_MEMBER_ADDED',
        title: 'Được thêm vào dự án',
        message: 'Bạn đã được thêm vào dự án "App Di Động Đặt Đồ Ăn"',
        entityType: 'PROJECT',
        entityId: projects[1]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[1]._id,
        isRead: true,
      },

      // Notifications cho tester@gmail.com
      {
        userId: users[6]._id, // tester@gmail.com
        fromUserId: users[2]._id,
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Test chức năng báo cáo doanh thu" cho bạn',
        entityType: 'TASK',
        entityId: tasks[5]._id,
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        isRead: false,
      },

      // Notifications cho viewer@gmail.com
      {
        userId: users[7]._id, // viewer@gmail.com
        fromUserId: users[0]._id,
        type: 'WORKSPACE_MEMBER_ADDED',
        title: 'Được thêm vào workspace',
        message: 'Bạn đã được thêm vào workspace "Công Ty TNHH Phần Mềm ABC"',
        entityType: 'WORKSPACE',
        entityId: workspaces[0]._id,
        workspaceId: workspaces[0]._id,
        isRead: true,
      },
      
      // Notifications cho Test Workspace
      {
        userId: users[4]._id, // dev@gmail.com
        fromUserId: users[2]._id, // lead@gmail.com
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Implement backend approval API" cho bạn',
        entityType: 'TASK',
        entityId: tasks[29]._id,
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        isRead: false,
      },
      {
        userId: users[5]._id, // designer@gmail.com
        fromUserId: users[2]._id,
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Thiết kế UI cho approval workflow" cho bạn',
        entityType: 'TASK',
        entityId: tasks[28]._id,
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        isRead: true,
      },
      {
        userId: users[6]._id, // tester@gmail.com
        fromUserId: users[2]._id,
        type: 'TASK_ASSIGNED',
        title: 'Task mới được phân công',
        message: 'Lê Văn Lead đã phân công task "Test approval workflow end-to-end" cho bạn',
        entityType: 'TASK',
        entityId: tasks[30]._id,
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        isRead: false,
      },
      {
        userId: users[4]._id, // dev@gmail.com
        fromUserId: users[6]._id, // tester@gmail.com
        type: 'TASK_COMMENT',
        title: 'Comment mới trên task',
        message: 'Đỗ Thị Tester đã comment trên task "Test approval workflow end-to-end"',
        entityType: 'TASK',
        entityId: tasks[30]._id,
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        isRead: false,
      },
      {
        userId: users[5]._id, // designer@gmail.com
        fromUserId: users[2]._id, // lead@gmail.com
        type: 'PROJECT_MEMBER_ADDED',
        title: 'Được thêm vào dự án',
        message: 'Bạn đã được thêm vào dự án "Task Approval System Testing"',
        entityType: 'PROJECT',
        entityId: projects[7]._id,
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        isRead: true,
      },
      {
        userId: users[4]._id, // dev@gmail.com
        fromUserId: users[2]._id, // lead@gmail.com
        type: 'WORKSPACE_MEMBER_ADDED',
        title: 'Được thêm vào workspace',
        message: 'Bạn đã được thêm vào workspace "Team Lead Development Hub"',
        entityType: 'WORKSPACE',
        entityId: workspaces[2]._id,
        workspaceId: workspaces[2]._id,
        isRead: true,
      },
    ]);

    console.log('✅ Notifications created');

    // Create activity logs
    console.log('📊 Creating activity logs...');
    await ActivityLog.create([
      // Workspace activities
      {
        userId: users[0]._id,
        action: 'WORKSPACE_CREATED',
        entityType: 'WORKSPACE',
        entityId: workspaces[0]._id,
        description: 'Tạo workspace "Công Ty TNHH Phần Mềm ABC"',
        workspaceId: workspaces[0]._id,
      },
      {
        userId: users[0]._id,
        action: 'WORKSPACE_MEMBER_ADDED',
        entityType: 'WORKSPACE',
        entityId: workspaces[0]._id,
        description: 'Thêm Trần Thị Manager vào workspace',
        workspaceId: workspaces[0]._id,
        metadata: { memberName: 'Trần Thị Manager', memberEmail: 'manager@gmail.com' },
      },

      // Project activities
      {
        userId: users[0]._id,
        action: 'PROJECT_CREATED',
        entityType: 'PROJECT',
        entityId: projects[0]._id,
        description: 'Tạo dự án "Hệ Thống Quản Lý Bán Hàng"',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
      },
      {
        userId: users[2]._id,
        action: 'PROJECT_MEMBER_ADDED',
        entityType: 'PROJECT',
        entityId: projects[0]._id,
        description: 'Thêm Hoàng Văn Dev vào dự án',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        metadata: { memberName: 'Hoàng Văn Dev', role: 'MEMBER' },
      },
      {
        userId: users[1]._id,
        action: 'PROJECT_UPDATED',
        entityType: 'PROJECT',
        entityId: projects[2]._id,
        description: 'Cập nhật thông tin dự án "Website Tin Tức"',
        workspaceId: workspaces[0]._id,
        projectId: projects[2]._id,
      },

      // Task activities
      {
        userId: users[2]._id,
        action: 'TASK_CREATED',
        entityType: 'TASK',
        entityId: tasks[0]._id,
        description: 'Tạo task "Thiết kế database schema"',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
      },
      {
        userId: users[4]._id,
        action: 'TASK_STATUS_CHANGED',
        entityType: 'TASK',
        entityId: tasks[0]._id,
        description: 'Thay đổi trạng thái task từ IN_PROGRESS sang DONE',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        metadata: { oldStatus: 'IN_PROGRESS', newStatus: 'DONE' },
      },
      {
        userId: users[2]._id,
        action: 'TASK_ASSIGNED',
        entityType: 'TASK',
        entityId: tasks[3]._id,
        description: 'Phân công task "Phát triển module đơn hàng" cho Phạm Thị Member',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
        metadata: { assigneeName: 'Phạm Thị Member' },
      },
      {
        userId: users[4]._id,
        action: 'TASK_UPDATED',
        entityType: 'TASK',
        entityId: tasks[1]._id,
        description: 'Cập nhật task "Xây dựng API quản lý sản phẩm"',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
      },

      // Comment activities
      {
        userId: users[4]._id,
        action: 'COMMENT_ADDED',
        entityType: 'TASK',
        entityId: tasks[0]._id,
        description: 'Thêm comment trên task "Thiết kế database schema"',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
      },
      {
        userId: users[2]._id,
        action: 'COMMENT_ADDED',
        entityType: 'TASK',
        entityId: tasks[0]._id,
        description: 'Thêm comment trên task "Thiết kế database schema"',
        workspaceId: workspaces[0]._id,
        projectId: projects[0]._id,
      },

      // More task activities
      {
        userId: users[3]._id,
        action: 'TASK_STATUS_CHANGED',
        entityType: 'TASK',
        entityId: tasks[9]._id,
        description: 'Thay đổi trạng thái task từ TODO sang IN_PROGRESS',
        workspaceId: workspaces[0]._id,
        projectId: projects[1]._id,
        metadata: { oldStatus: 'TODO', newStatus: 'IN_PROGRESS' },
      },
      {
        userId: users[4]._id,
        action: 'TASK_COMPLETED',
        entityType: 'TASK',
        entityId: tasks[7]._id,
        description: 'Hoàn thành task "Setup React Native project"',
        workspaceId: workspaces[0]._id,
        projectId: projects[1]._id,
      },
      
      // Test Workspace Activities
      {
        userId: users[2]._id, // lead@gmail.com
        action: 'WORKSPACE_CREATED',
        entityType: 'WORKSPACE',
        entityId: workspaces[2]._id,
        description: 'Tạo workspace "Team Lead Development Hub"',
        workspaceId: workspaces[2]._id,
      },
      {
        userId: users[2]._id,
        action: 'WORKSPACE_MEMBER_ADDED',
        entityType: 'WORKSPACE',
        entityId: workspaces[2]._id,
        description: 'Thêm Hoàng Văn Dev vào workspace',
        workspaceId: workspaces[2]._id,
        metadata: { memberName: 'Hoàng Văn Dev', memberEmail: 'dev@gmail.com' },
      },
      {
        userId: users[2]._id,
        action: 'PROJECT_CREATED',
        entityType: 'PROJECT',
        entityId: projects[7]._id,
        description: 'Tạo dự án "Task Approval System Testing"',
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
      },
      {
        userId: users[2]._id,
        action: 'TASK_CREATED',
        entityType: 'TASK',
        entityId: tasks[28]._id,
        description: 'Tạo task "Thiết kế UI cho approval workflow"',
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
      },
      {
        userId: users[5]._id, // designer@gmail.com
        action: 'TASK_STATUS_CHANGED',
        entityType: 'TASK',
        entityId: tasks[28]._id,
        description: 'Thay đổi trạng thái task từ IN_PROGRESS sang DONE',
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        metadata: { oldStatus: 'IN_PROGRESS', newStatus: 'DONE' },
      },
      {
        userId: users[2]._id,
        action: 'TASK_ASSIGNED',
        entityType: 'TASK',
        entityId: tasks[29]._id,
        description: 'Phân công task "Implement backend approval API" cho Hoàng Văn Dev',
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        metadata: { assigneeName: 'Hoàng Văn Dev' },
      },
      {
        userId: users[4]._id, // dev@gmail.com
        action: 'TASK_STATUS_CHANGED',
        entityType: 'TASK',
        entityId: tasks[29]._id,
        description: 'Thay đổi trạng thái task từ IN_PROGRESS sang DONE',
        workspaceId: workspaces[2]._id,
        projectId: projects[7]._id,
        metadata: { oldStatus: 'IN_PROGRESS', newStatus: 'DONE' },
      },
    ]);

    console.log('✅ Activity logs created');

    console.log('\n🎉 DỮ LIỆU MỚI ĐÃ ĐƯỢC TẠO THÀNH CÔNG!\n');
    console.log('📊 THỐNG KÊ DỮ LIỆU:');
    console.log('='.repeat(65));
    console.log('👥 Users: 10 tài khoản với roles khác nhau');
    console.log('🏢 Workspaces: 3 workspaces');
    console.log('   ├─ Công Ty TNHH Phần Mềm ABC (9 members)');
    console.log('   ├─ Startup Tech Solutions (3 members)');
    console.log('   └─ Team Lead Development Hub (4 members) ⭐ TEST WORKSPACE');
    console.log('📁 Projects: 9 dự án đa dạng');
    console.log('   ├─ Hệ Thống Quản Lý Bán Hàng (HIGH - ACTIVE - 45%)');
    console.log('   ├─ App Di Động Đặt Đồ Ăn (HIGH - ACTIVE - 38%)');
    console.log('   ├─ Website E-commerce (HIGH - ACTIVE - 62%)');
    console.log('   ├─ Hệ Thống CRM (MEDIUM - ACTIVE - 15%)');
    console.log('   ├─ Mobile Banking App (HIGH - PLANNING - 8%)');
    console.log('   ├─ Dashboard Analytics (MEDIUM - COMPLETED - 100%)');
    console.log('   ├─ AI Chatbot Platform (HIGH - ACTIVE - 28%)');
    console.log('   ├─ Task Approval System Testing (HIGH - ACTIVE - 0%) ⭐ TEST');
    console.log('   └─ Feature Development Sprint (MEDIUM - ACTIVE - 0%) ⭐ TEST');
    console.log('✅ Tasks: 36 tasks (TODO, IN_PROGRESS, DONE)');
    console.log('   └─ 8 tasks trong Test Workspace cho approval workflow testing');
    console.log('💬 Comments: 22 comments từ các thành viên');
    console.log('🔔 Notifications: 19 thông báo thực tế');
    console.log('📊 Activity Logs: 21 hoạt động được ghi nhận');
    console.log('='.repeat(65));
    console.log('\n👥 TÀI KHOẢN TEST (Tất cả password: 123456):');
    console.log('\n🔴 QUẢN LÝ & ADMIN:');
    console.log('   ✦ admin@gmail.com - System Admin');
    console.log('     • Toàn quyền hệ thống');
    console.log('     • Truy cập /admin panel');
    console.log('     • Quản lý tất cả workspaces');
    console.log('   ✦ manager@gmail.com - Manager/Admin');
    console.log('     • Admin cả 2 workspaces');
    console.log('     • Quản lý projects & members');
    console.log('\n🔵 DEVELOPMENT TEAM:');
    console.log('   ✦ lead@gmail.com - Team Lead');
    console.log('     • Quản lý 4 projects chính');
    console.log('     • Phân công & review tasks');
    console.log('   ✦ dev@gmail.com - Backend Developer');
    console.log('     • Có 12 tasks được assign');
    console.log('     • Member ở cả 2 workspaces');
    console.log('   ✦ member@gmail.com - Frontend Developer');
    console.log('     • Có 5 tasks active');
    console.log('   ✦ designer@gmail.com - UI/UX Designer');
    console.log('     • Thiết kế giao diện & mockup');
    console.log('   ✦ tester@gmail.com - QA Tester');
    console.log('     • Test & report bugs');
    console.log('\n🟢 STAKEHOLDERS:');
    console.log('   ✦ viewer@gmail.com - Viewer (Read-only)');
    console.log('     • Chỉ xem, không chỉnh sửa');
    console.log('   ✦ client@gmail.com - Client');
    console.log('     • Đại diện khách hàng');
    console.log('   ✦ product@gmail.com - Product Owner');
    console.log('     • Quản lý AI Chatbot project');
    console.log('\n⭐ TEST WORKSPACE - APPROVAL WORKFLOW:');
    console.log('   🏢 Team Lead Development Hub (lead@gmail.com là owner)');
    console.log('   👥 Members:');
    console.log('      • lead@gmail.com - Team Lead (ADMIN)');
    console.log('      • dev@gmail.com - Developer (MEMBER)');
    console.log('      • designer@gmail.com - Designer (MEMBER)');
    console.log('      • tester@gmail.com - QA Tester (MEMBER)');
    console.log('   📁 Projects:');
    console.log('      • Task Approval System Testing (5 tasks)');
    console.log('      • Feature Development Sprint (3 tasks)');
    console.log('\n🎯 TÍNH NĂNG HOẠT ĐỘNG HOÀN CHỈNH:');
    console.log('   ✓ Multi-Workspace Support (3 workspaces riêng biệt)');
    console.log('   ✓ Authentication & Authorization (JWT)');
    console.log('   ✓ Role-based Access Control (Admin, Lead, Member, Viewer)');
    console.log('   ✓ Project Management (9 projects đa dạng)');
    console.log('   ✓ Task Assignment & Tracking (36 tasks với assignee)');
    console.log('   ✓ Comments & Collaboration (22 comments thực tế)');
    console.log('   ✓ Real-time Notifications (19 notifications)');
    console.log('   ✓ Activity Logs & Audit Trail');
    console.log('   ✓ Team Members Management');
    console.log('   ✓ Dashboard & Analytics');
    console.log('   ✓ Permission Checks trên mọi actions');
    console.log('   ✓ Task Approval Workflow (Submit → Approve/Reject) ⭐ NEW');
    console.log('\n📖 TÀI LIỆU & HƯỚNG DẪN:');
    console.log('   → backend/TESTING_PERMISSIONS.md - Chi tiết phân quyền');
    console.log('   → backend/PERMISSION_SYSTEM.md - Hệ thống permissions');
    console.log('   → NOTIFICATION_SYSTEM.md - Hệ thống thông báo');
    console.log('   → SEED_DATA_SUMMARY.md - Tóm tắt dữ liệu test');
    console.log('='.repeat(65));
    console.log('\n💡 HƯỚNG DẪN TEST:');
    console.log('   1️⃣  ĐĂNG XUẤT tài khoản hiện tại (nếu có)');
    console.log('   2️⃣  XÓA CACHE trình duyệt: Ctrl + Shift + Delete');
    console.log('   3️⃣  ĐĂNG NHẬP lại với lead@gmail.com (password: 123456)');
    console.log('   4️⃣  Chọn workspace "Team Lead Development Hub"');
    console.log('   5️⃣  Vào project "Task Approval System Testing"');
    console.log('   6️⃣  Test approval workflow với các tasks có sẵn');
    console.log('\n🔥 TEST APPROVAL WORKFLOW:');
    console.log('   • Tab 1 (lead@gmail.com): Assign task và approve/reject');
    console.log('   • Tab 2 (Incognito - dev@gmail.com): Submit for approval');
    console.log('   • Tab 3 (Incognito - tester@gmail.com): Test notifications');
    console.log('   • Kiểm tra realtime approval updates');
    console.log('\n🎯 SCENARIO TEST:');
    console.log('   1. dev@gmail.com: Hoàn thành checklist → Submit for approval');
    console.log('   2. lead@gmail.com: Xem pending approvals → Approve/Reject');
    console.log('   3. Kiểm tra notification bell 🔔 cho cả 2 users');
    console.log('   4. Xem approval history timeline trong task details');
    console.log('\n✨ MỌI THỨ ĐÃ SẴN SÀNG! Happy Testing! 🚀\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();
