# Project Management Backend API

Backend REST API cho ứng dụng quản lý dự án, được xây dựng với Node.js, Express, và MongoDB.

## 🚀 Công Nghệ Sử Dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

## 📋 Yêu Cầu Hệ Thống

- Node.js >= 16.x
- MongoDB >= 5.x (hoặc MongoDB Atlas)
- npm hoặc yarn

## ⚙️ Cài Đặt

### 1. Clone repository (nếu chưa có)
```bash
cd backend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
NODE_ENV=development
PORT=5000

# MongoDB - Local
MONGODB_URI=mongodb://localhost:27017/project-management

# MongoDB - Atlas (production)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/project-management?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

CLIENT_URL=http://localhost:5173
```

### 4. Khởi chạy MongoDB

**Local MongoDB:**
```bash
mongod
```

**Hoặc sử dụng MongoDB Atlas** (cloud) - chỉ cần update MONGODB_URI

### 5. Seed database (optional)

Tạo dữ liệu mẫu để test:
```bash
npm run seed
```

Test accounts được tạo:
- `alex@example.com` - Admin (password: `password123`)
- `john@example.com` - Member (password: `password123`)
- `oliver@example.com` - Member (password: `password123`)

### 6. Khởi chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "image": "https://avatar.com/john.jpg" // optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

### Users

#### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com",
  "image": "https://newavatar.com",
  "password": "newpassword123" // optional
}
```

---

### Workspaces

#### Get My Workspaces
```http
GET /api/workspaces
Authorization: Bearer <token>
```

#### Get Workspace Details
```http
GET /api/workspaces/:id
Authorization: Bearer <token>
```

#### Create Workspace
```http
POST /api/workspaces
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Workspace",
  "slug": "my-workspace", // optional, auto-generated
  "description": "Workspace description",
  "image_url": "https://image.com/workspace.jpg"
}
```

#### Update Workspace (Admin only)
```http
PUT /api/workspaces/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Workspace (Owner only)
```http
DELETE /api/workspaces/:id
Authorization: Bearer <token>
```

#### Add Member (Admin only)
```http
POST /api/workspaces/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "role": "MEMBER", // or "ADMIN"
  "message": "Welcome message"
}
```

#### Remove Member (Admin only)
```http
DELETE /api/workspaces/:id/members/:memberId
Authorization: Bearer <token>
```

---

### Projects

#### Get Projects in Workspace
```http
GET /api/projects?workspaceId=<workspace_id>
Authorization: Bearer <token>
```

#### Get Project Details
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete website overhaul",
  "workspaceId": "workspace_id_here",
  "priority": "HIGH", // LOW, MEDIUM, HIGH
  "status": "ACTIVE", // ACTIVE, PLANNING, COMPLETED, ON_HOLD, CANCELLED
  "start_date": "2025-11-01",
  "end_date": "2025-12-31",
  "team_lead": "user_id_here" // optional, defaults to current user
}
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED",
  "progress": 100
}
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

#### Add Project Member
```http
POST /api/projects/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

#### Remove Project Member
```http
DELETE /api/projects/:id/members/:memberId
Authorization: Bearer <token>
```

---

### Tasks

#### Get My Tasks
```http
GET /api/tasks/my-tasks?status=TODO&priority=HIGH
Authorization: Bearer <token>
```

#### Get Tasks for Project
```http
GET /api/tasks?projectId=<project_id>&status=TODO&priority=HIGH
Authorization: Bearer <token>
```

#### Get Task Details
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project_id_here",
  "title": "Fix navigation bug",
  "description": "Bug in mobile menu",
  "status": "TODO", // TODO, IN_PROGRESS, DONE
  "type": "BUG", // TASK, BUG, FEATURE, IMPROVEMENT, OTHER
  "priority": "HIGH", // LOW, MEDIUM, HIGH
  "assigneeId": "user_id_here",
  "due_date": "2025-11-30"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

---

### Comments

#### Get Comments for Task
```http
GET /api/comments?taskId=<task_id>
Authorization: Bearer <token>
```

#### Add Comment
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task_id_here",
  "content": "This is my comment"
}
```

#### Update Comment (Owner only)
```http
PUT /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment"
}
```

#### Delete Comment (Owner only)
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

---

## 🔐 Authentication

Tất cả protected routes yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

Token được trả về khi login/register thành công.

## 📁 Cấu Trúc Project

```
backend/
├── config/
│   ├── database.js         # MongoDB connection
│   └── constants.js        # App constants & enums
├── controllers/            # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── workspaceController.js
│   ├── projectController.js
│   ├── taskController.js
│   └── commentController.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Error handling
│   └── validation.js      # Request validation
├── models/                # Mongoose schemas
│   ├── User.js
│   ├── Workspace.js
│   ├── WorkspaceMember.js
│   ├── Project.js
│   ├── ProjectMember.js
│   ├── Task.js
│   └── Comment.js
├── routes/                # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── workspaceRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   └── commentRoutes.js
├── seeds/
│   └── seedData.js        # Seed database
├── utils/
│   ├── apiResponse.js     # Response formatter
│   ├── asyncHandler.js    # Async error wrapper
│   └── generateToken.js   # JWT token generator
├── .env                   # Environment variables
├── .env.example          # Environment template
├── server.js             # Entry point
└── package.json
```

## 🐛 Error Handling

API trả về consistent error format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // optional validation errors
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

Test API với:
- **Postman** - Import collection từ documentation
- **Thunder Client** (VS Code extension)
- **curl** commands

Example với curl:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Môi trường Production

1. Set `NODE_ENV=production` trong `.env`
2. Sử dụng MongoDB Atlas cho database
3. Set secure JWT_SECRET
4. Deploy lên:
   - **Heroku**
   - **Railway**
   - **Render**
   - **DigitalOcean**
   - **AWS/GCP/Azure**

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Coding! 🎉**
