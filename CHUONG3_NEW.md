CHƯƠNG 4: TRIỂN KHAI XÂY DỰNG HỆ THỐNG 
4.1. Cấu trúc xây dựng hệ thống
Sau khi hoàn tất giai đoạn phân tích và thiết kế, em đã tiến hành triển khai hệ thống dựa trên kiến trúc nhiều tầng (web frontend, backend services, database). Hệ thống Project Management được triển khai theo các thành phần chính như sau:
- Giao diện ứng dụng (React + Vite): mã nguồn chính nằm trong `frontend/src/` theo cấu trúc module-based (ví dụ `src/pages/`, `src/components/features/`, `src/components/common/`, `src/components/layout/`), `src/routes/` và `src/features/` để quản lý trạng thái bằng Redux Toolkit.
- Backend (Node.js + Express): xử lý các API requests, xác thực JWT, quản lý phân quyền, upload file đính kèm (với Multer middleware), và tích hợp Socket.IO để cung cấp tính năng real-time như comments và notifications. Backend hỗ trợ RESTful API cho tất cả các module chính của hệ thống.
- Database (MongoDB + Mongoose): lưu trữ các collection chính của hệ thống (ví dụ: `users`, `workspaces`, `workspace_members`, `projects`, `project_members`, `tasks`, `comments`, `notifications`, `activity_logs`, `attachments`). Schema và logic thao tác nằm trong các model và controller dưới `backend/src/`.
- Lưu trữ file (Local Storage): lưu trữ file đính kèm trong thư mục `backend/uploads/attachments/`; Multer middleware chịu trách nhiệm xử lý upload, validation (file size, file type) và trả về URL cho client.
- Tích hợp AI (Gemini AI): tích hợp Google Gemini AI để cung cấp insights và phân tích thông minh cho dự án và task thông qua API service.
4.1.1. Thành phần chính và mã nguồn 
frontend/src/pages/: các module chính của hệ thống (ví dụ auth, workspaces, projects, tasks, dashboard, admin, profile), mỗi module chứa các trang và logic liên quan.
frontend/src/components/: component giao diện được tổ chức theo common/ (components tái sử dụng như Button, Input, Modal), layout/ (Navbar, Sidebar), features/ (components theo từng tính năng như projects/, workspaces/, tasks/, notifications/, ai/).
frontend/src/api/services/: các API service xử lý tương tác với backend (ví dụ authService, workspaceService, projectService, taskService, commentService, notificationService, aiService).
frontend/src/features/: Redux Toolkit slices quản lý state toàn cục (authSlice, workspaceSlice, projectSlice, taskSlice, notificationSlice).
backend/src/: cấu trúc backend với controllers/ (xử lý request), models/ (MongoDB schemas), routes/ (API endpoints), middleware/ (auth, validation, error handling), services/ (business logic), utils/ (helper functions).
backend/uploads/: thư mục lưu trữ file đính kèm được upload từ client qua Multer middleware.
4.1.2. Tầng Service và API 
Xác thực: Sử dụng JWT (JSON Web Token) cho authentication và authorization. Hệ thống hỗ trợ đăng ký/đăng nhập bằng email/password và Google OAuth thông qua Passport.js. Các kiểm tra phân quyền (role-based permission) được thực hiện ở middleware với các vai trò: owner, admin, member.
Truy cập dữ liệu: Thao tác CRUD trên MongoDB thông qua Mongoose ODM; logic nghiệp vụ và validation được đặt trong controllers và middleware (backend/src/controllers/*, backend/src/middleware/validation.middleware.js).
Upload file: Multer middleware cung cấp chức năng upload file đính kèm với validation (file size max 10MB, allowed types: images, pdf, docs, videos); backend/src/middleware/upload.middleware.js xử lý upload và lưu trữ file vào thư mục uploads/attachments/.
Thông báo: notificationController quản lý thông báo trong ứng dụng; Socket.IO cung cấp real-time notifications khi có hoạt động mới (task updates, comments, mentions).
Real-time Communication: Socket.IO server (backend/src/config/socket.js) cung cấp real-time chat comments, typing indicators, và các sự kiện task/project updates; client kết nối qua socket.io-client và join/leave rooms theo taskId.
Admin và Quản lý người dùng: adminController cung cấp các API để quản lý users, workspaces, projects; Admin Panel có dashboard với thống kê và công cụ moderation.
Tích hợp AI: aiService tích hợp Google Gemini AI API để cung cấp project insights, task suggestions, và phân tích thông minh dựa trên dữ liệu dự án.
4.2. Giao diện và trải nghiệm người dùng (UI/UX) 
4.2.1. Màn hình chính và luồng chính
4.2.1.1. Màn hình đăng ký (Register), đăng nhập (Login) và trang Dashboard
   

Hình 4.1. Giao diện Login và Register.
Giao diện đăng nhập và đăng ký được thiết kế đơn giản, hiện đại với validation form đầy đủ. Hỗ trợ đăng nhập bằng email/password hoặc Google OAuth. Sau khi đăng nhập thành công, người dùng được chuyển đến Dashboard với tổng quan về các workspace, projects và tasks.

4.2.1.2. Màn hình Workspace và quản lý Projects
  
Hình 4.2. Giao diện Workspace List và Project Management.
Giao diện Workspace cho phép người dùng xem danh sách các workspace mà họ tham gia, tạo workspace mới, và mời thành viên. Trong mỗi workspace, người dùng có thể tạo và quản lý nhiều projects với thông tin chi tiết như tên, mô tả, timeline, và danh sách thành viên. Hệ thống hỗ trợ phân quyền theo vai trò (owner, admin, member) cho từng workspace và project.
4.2.1.3. Màn hình Task Management và Task Details
   
Hình 4.3. Giao diện Task List và Task Details.
Giao diện Task List hiển thị danh sách các tasks trong project với khả năng filter theo status, priority, assignee. Người dùng có thể tạo task mới với đầy đủ thông tin: title, description, assignee, due date, priority, status. Task Details hiển thị thông tin chi tiết của task, danh sách comments real-time (chat-style), file attachments với preview và download, cùng activity logs. Hệ thống hỗ trợ drag-and-drop để upload files và typing indicator khi có người đang gõ comment.
4.2.1.4. Màn hình Project Details và Analytics
   
Hình 4.4. Giao diện Project Overview và Analytics.
Giao diện Project Details hiển thị tổng quan về project với các tab: Overview (thông tin chung, progress), Tasks (danh sách tasks), Members (quản lý thành viên), Calendar (lịch deadline), Analytics (biểu đồ phân tích), Settings (cài đặt project). Project Analytics cung cấp các biểu đồ về task distribution, completion rate, member workload, và timeline progress sử dụng Recharts library.
4.2.1.5. Màn hình Dashboard và Thống kê
  
Hình 4.5. Giao diện Dashboard.
Dashboard hiển thị tổng quan về toàn bộ hệ thống với các cards thống kê: tổng số workspaces, projects, tasks (theo status), members. Phần Recent Activities hiển thị các hoạt động gần đây của team. Dashboard còn có biểu đồ phân tích project progress và task distribution theo thời gian.
  
Hình 4.6. Giao diện My Tasks và Notifications.
My Tasks hiển thị tất cả tasks được assign cho người dùng hiện tại từ các projects khác nhau, với filter theo status và priority. Notifications Center hiển thị danh sách thông báo real-time về task assignments, comments, mentions, project updates, với khả năng mark as read/unread và filter theo loại.

4.2.1.6. Màn hình tạo Project và Task
  
Hình 4.7. Giao diện Create Project Dialog và Create Task Dialog.
Dialog tạo Project cho phép nhập thông tin: tên, mô tả, start date, end date, và chọn members từ workspace. Validation đảm bảo các trường bắt buộc được điền đầy đủ. Dialog tạo Task cung cấp form với các trường: title, description, assignee, due date, priority (Low/Medium/High), status (Todo/In Progress/Review/Done), và có thể upload file đính kèm ngay khi tạo.
4.2.1.7. Màn hình AI Insights và Chat Widget
 
Hình 4.8. Giao diện AI Chat Widget và Project Insights.
AI Chat Widget (powered by Gemini AI) cho phép người dùng đặt câu hỏi về project, task, hoặc yêu cầu suggestions. AI phân tích dữ liệu project hiện tại (tasks, members, timeline) và đưa ra các insights như: task bottlenecks, workload balance, timeline risks, và đề xuất cải thiện. Widget có giao diện chat đơn giản, luôn sẵn sàng ở góc màn hình.

4.2.1.8. Màn hình Profile và Settings
   
Hình 4.9. Giao diện User Profile.
Giao diện Profile hiển thị thông tin cá nhân của người dùng: avatar, name, email, role, joined date. Người dùng có thể chỉnh sửa thông tin cá nhân, đổi password, và xem danh sách workspaces/projects mà họ tham gia. Tab Activity History hiển thị các hoạt động gần đây của người dùng trong hệ thống.
   
Hình 4.10. Giao diện Settings.
Settings page cho phép người dùng tùy chỉnh: Theme (Light/Dark mode với Tailwind CSS), Language (English/Vietnamese sử dụng i18next), Notification preferences (email notifications, in-app notifications), và các cài đặt khác như timezone, date format.
4.2.2. Giao diện quản trị (Admin)
4.2.2.1. Màn hình quản lý người dùng (User Management)
 
Hình 4.11. Giao diện User Management trong Admin Panel.
Admin Panel cung cấp màn hình User Management để quản lý toàn bộ người dùng trong hệ thống với các tính năng: xem danh sách users, filter theo role/status, chỉnh sửa thông tin user, vô hiệu hóa/kích hoạt tài khoản, và xem activity logs của từng user. Admin có thể thay đổi role của user (user/admin) và quản lý quyền truy cập workspace/project.
4.2.2.2. Màn hình Dashboard và Analytics cho Admin
 
Hình 4.12. Giao diện Admin Dashboard.
Admin Dashboard cung cấp tổng quan về toàn hệ thống với các metrics: total users, workspaces, projects, tasks, và activity statistics. Biểu đồ hiển thị growth trends, user engagement, project completion rates theo thời gian.
 
Hình 4.13. Giao diện quản lý Workspaces và Projects.
Admin có quyền xem và quản lý tất cả workspaces và projects trong hệ thống, bao gồm: chỉnh sửa thông tin, xóa workspace/project, quản lý members, và xem detailed analytics cho từng workspace/project.
 
Hình 4.14. Giao diện Activity Logs và Monitoring.
Activity Logs screen hiển thị tất cả hoạt động trong hệ thống với filter theo: user, action type, date range, resource type. Admin có thể track user actions, system events, và security-related activities để đảm bảo compliance và troubleshooting.
4.3. Triển khai, CI/CD và vận hành
4.3.1. Xây dựng và CI
Repository có các script npm (lint, build, test) được định nghĩa trong package.json của cả frontend và backend. Khuyến nghị thiết lập pipeline CI tự động (ví dụ: GitHub Actions) để chạy npm install → npm run lint → npm test cho mỗi Pull Request; pipeline có thể được mở rộng để build production và deploy tự động.
Frontend: xây dựng bằng Vite với output static files, có thể deploy lên Vercel, Netlify, hoặc hosting tĩnh khác. Build command: npm run build, output folder: dist/.
Backend: Node.js application có thể đóng gói dưới dạng container (Docker) và deploy lên các nền tảng như Heroku, Railway, AWS EC2/ECS, hoặc Google Cloud Run. Cần cấu hình environment variables (.env) cho production.
4.3.2. Triển khai Backend và Database
Backend server có thể triển khai lên cloud platform với các tùy chọn:
- Docker container: Tạo Dockerfile để containerize Node.js app và deploy lên container orchestration platforms (Kubernetes, Docker Swarm, AWS ECS).
- Platform-as-a-Service (PaaS): Deploy trực tiếp lên Heroku, Railway, hoặc Render với Git integration.
- Virtual Private Server (VPS): Deploy lên DigitalOcean, Linode, hoặc AWS EC2 với PM2 process manager.
MongoDB Database: Sử dụng MongoDB Atlas (managed cloud database) để đảm bảo high availability, automatic backups, và scalability. Cấu hình replica sets cho production và thiết lập monitoring alerts.
File Storage: Đối với production, nên migrate từ local storage sang cloud storage như AWS S3, Google Cloud Storage, hoặc Cloudinary để lưu trữ attachments với CDN support.
4.3.3. Logging, Monitoring, Backup
Application Logging: Sử dụng Winston hoặc Morgan để log requests, errors, và system events. Logs có thể được gửi tới centralized logging service như Loggly, Papertrail, hoặc ELK Stack (Elasticsearch, Logstash, Kibana).
Performance Monitoring: Tích hợp APM tools như New Relic, Datadog, hoặc Google Cloud Monitoring để theo dõi response times, error rates, database query performance, và resource utilization.
Error Tracking: Sử dụng Sentry hoặc Rollbar để track và alert về errors/exceptions trong cả frontend và backend applications.
Database Backup: MongoDB Atlas cung cấp automatic backups với point-in-time recovery. Đối với self-hosted MongoDB, thiết lập scheduled backups (mongodump) và lưu trữ backups ở off-site location (S3, Google Cloud Storage).
4.3.4. Security và Data Privacy
Authentication Security: JWT tokens với expiration time hợp lý, refresh token mechanism, và secure cookie storage. Implement rate limiting để chống brute-force attacks trên login endpoints.
Authorization: Role-based access control (RBAC) được enforced ở cả client-side (UI/UX) và server-side (API middleware). Validate permissions cho mọi API request dựa trên user role và resource ownership.
Data Encryption: HTTPS/TLS cho tất cả communications. Mật khẩu được hash bằng bcrypt với appropriate salt rounds. Sensitive data trong database có thể được encrypt at rest.
File Upload Security: Validate file types, sizes, và scan uploaded files cho malware. Sử dụng unique filenames và restrict direct file access thông qua signed URLs hoặc authorization checks.
Environment Variables: Không commit sensitive data (API keys, database credentials, JWT secrets) vào Git. Sử dụng .env files và secret management services (AWS Secrets Manager, HashiCorp Vault) cho production.
CORS Configuration: Cấu hình CORS policies chặt chẽ, chỉ allow requests từ trusted origins. Implement CSRF protection cho state-changing operations.
4.4. Kiểm thử và xác nhận chất lượng
Kiểm thử đơn vị (Unit Testing): Sử dụng Jest cho testing JavaScript code. Test các functions, utilities, services, và Redux reducers. Maintain code coverage >= 70% cho critical paths.
Kiểm thử tích hợp (Integration Testing): Test API endpoints với Supertest, verify database operations, authentication flows, và permission checks. Sử dụng test database hoặc MongoDB Memory Server để isolate tests.
Kiểm thử end-to-end (E2E): Sử dụng Cypress hoặc Playwright để test complete user flows: đăng nhập → tạo workspace → tạo project → tạo tasks → assign members → add comments → upload attachments. Verify real-time features (Socket.IO events) và AI integrations.
API Testing: Sử dụng Postman hoặc Insomnia collections để test RESTful APIs, verify responses, status codes, error handling, và edge cases.
Performance Testing: Load testing với tools như Apache JMeter hoặc k6 để verify system performance dưới high concurrent users. Monitor response times, database query performance, và identify bottlenecks.
Security Testing: Penetration testing cho common vulnerabilities (SQL injection, XSS, CSRF). Verify authentication/authorization mechanisms, input validation, và file upload security.
4.5. Hướng phát triển và mô tả vận hành
Tính năng mở rộng: 
- Mobile Application: Phát triển React Native mobile app để truy cập hệ thống trên iOS/Android.
- Advanced Analytics: Machine learning models để predict project risks, suggest optimal task assignments, và analyze team productivity patterns.
- Third-party Integrations: Tích hợp với Slack, Microsoft Teams, Google Calendar, Jira, GitHub để sync data và notifications.
- Advanced Permissions: Fine-grained permissions system với custom roles, department-based access, và field-level security.
- Time Tracking: Tích hợp time tracking cho tasks, generate timesheets, và billable hours reports.
- Gantt Charts: Interactive Gantt chart visualization cho project timeline planning và dependencies management.
- Document Management: Version control cho documents, collaborative editing, và template library.

Tối ưu hóa hiệu năng:
- Implement caching strategies (Redis) cho frequently accessed data (users, workspaces, projects).
- Database indexing optimization cho MongoDB queries.
- Lazy loading và code splitting cho frontend để reduce initial bundle size.
- WebSocket connection pooling và optimization cho real-time features.
- CDN implementation cho static assets và file attachments.

Sổ tay vận hành (Operations Runbook):
- User onboarding process và training materials.
- Incident response procedures: system downtime, data loss, security breaches.
- Database maintenance tasks: backups verification, index optimization, cleanup old data.
- Monitoring và alerting setup: define critical metrics và thresholds.
- Scaling strategies: horizontal scaling cho backend, database sharding, load balancing.
- Disaster recovery plan: backup restoration procedures, failover mechanisms.
- Regular maintenance windows: scheduled updates, patches, và dependency upgrades.
