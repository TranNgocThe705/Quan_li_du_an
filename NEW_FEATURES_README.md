# ✨ Tính Năng Mới: File Attachments & Real-time Chat Comments

## 📋 Tổng Quan

Đã implement 2 tính năng chính cho trang Task Detail:
1. **File Attachments**: Upload, preview, download, delete files đính kèm
2. **Real-time Chat Comments**: Comments theo style chat app với typing indicator

---

## 🎯 Tính Năng Đã Hoàn Thành

### ✅ Backend (Node.js + Express + Socket.IO)

#### 1. **Attachment System**
- **Model**: `Attachment.model.js`
  - Fields: taskId, fileName, originalName, fileUrl, fileType, mimeType, fileSize, uploadedBy
  - Validation: max 10MB, allowed types (images, pdf, docs, videos)
  - Virtual: formattedSize (KB/MB)
  - Pre-remove hook: auto delete file from disk

- **Middleware**: `upload.middleware.js` (Multer)
  - Storage: Local disk (`uploads/attachments/`)
  - File size limit: 10MB
  - Allowed types: images (jpg, png, gif, webp, svg), documents (pdf, doc, xls, ppt), text, archives, videos
  - Exports: uploadSingle, uploadMultiple, handleUploadError, deleteFile

- **Controller**: `attachment.controller.js`
  - `POST /tasks/:id/attachments` - Upload file
  - `GET /tasks/:id/attachments` - Lấy danh sách files
  - `DELETE /attachments/:id` - Xóa file (với permission check)
  - `GET /attachments/:id/download` - Download file

- **Routes**: `attachment.routes.js`
  - Tích hợp vào `/api/attachments`
  - Middleware: protect (auth), uploadSingle, handleUploadError

#### 2. **Socket.IO Real-time**
- **Config**: `socket.js`
  - JWT authentication cho socket connection
  - Room management: `task:{taskId}`
  - Events:
    - `task:join` / `task:leave` - Join/leave task room
    - `comment:new` - New comment added
    - `comment:update` - Comment edited
    - `comment:delete` - Comment deleted
    - `comment:typing:start` / `comment:typing:stop` - Typing indicator
    - `attachment:new` - New file uploaded
    - `attachment:delete` - File deleted
    - `user:online` / `user:offline` - User status

- **Server Integration**: `server.js`
  - Tạo HTTP server với `createServer(app)`
  - Initialize Socket.IO với CORS config
  - Graceful shutdown: close socket connections

#### 3. **Model Updates**
- **Task.model.js**: Thêm virtual field `attachments` (populate từ Attachment model)
- **Comment controller**: Emit socket events khi CRUD comments

---

### ✅ Frontend (React + Socket.IO Client)

#### 1. **Socket Service** (`services/socket.js`)
```javascript
// Functions:
- initializeSocket(token) - Khởi tạo connection
- joinTaskRoom(taskId) - Join room
- leaveTaskRoom(taskId) - Leave room
- emitTypingStart(taskId) - Emit typing
- emitTypingStop(taskId) - Stop typing
- onNewComment(callback) - Listen new comment
- onDeleteComment(callback) - Listen delete comment
- onTyping(callback) - Listen typing indicator
- onNewAttachment(callback) - Listen new attachment
- onDeleteAttachment(callback) - Listen delete attachment
```

#### 2. **FileUpload Component** (`components/tasks/FileUpload.jsx`)
Features:
- ✨ Drag & drop zone (react-dropzone)
- 📁 Multi-file selection
- 🎨 File icons theo loại (image, document, generic)
- 📊 Upload progress bar
- 🚫 File size validation (max 10MB)
- 🎯 File type filtering
- ❌ Remove file before upload
- ✅ Success callback

#### 3. **AttachmentList Component** (`components/tasks/AttachmentList.jsx`)
Features:
- 🖼️ Image preview (full width)
- 📄 File icons cho non-images
- 📥 Download button
- 🗑️ Delete button (với confirm)
- 📊 File size formatting (B/KB/MB)
- 🕒 Relative timestamps ("2 giờ trước")
- 👤 Uploader name display
- 🔄 Auto-refresh on real-time events

#### 4. **ChatComments Component** (`components/tasks/ChatComments.jsx`)
Features:
- 💬 Chat-style UI (message bubbles)
- 👤 Avatar images với fallback
- 🔵 Own messages: bên phải, màu xanh
- ⚪ Others' messages: bên trái, màu xám
- 🕒 Relative timestamps (date-fns)
- ⌨️ Typing indicator với animation (3 dots bounce)
- 📜 Auto-scroll to bottom on new messages
- ↩️ Enter to send, Shift+Enter for newline
- 🗑️ Delete own comments
- 🔄 Real-time updates

---

## 📦 Dependencies Đã Cài

### Backend
```json
{
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.0"
}
```

### Frontend
```json
{
  "socket.io-client": "^4.7.0",
  "react-dropzone": "^14.3.0",
  "date-fns": "^2.30.0"
}
```

---

## 🗂️ File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── socket.js ✨ NEW
│   ├── controllers/
│   │   ├── attachment.controller.js ✨ NEW
│   │   └── commentController.js (updated)
│   ├── middleware/
│   │   └── upload.middleware.js ✨ NEW
│   ├── models/
│   │   ├── Attachment.model.js ✨ NEW
│   │   └── Task.js (updated)
│   ├── routes/
│   │   ├── attachment.routes.js ✨ NEW
│   │   └── index.js (updated)
│   ├── server.js (updated)
│   └── app.js (unchanged)
└── uploads/
    └── attachments/ (auto-created)

frontend/
├── src/
│   ├── components/
│   │   └── tasks/
│   │       ├── ChatComments.jsx ✨ NEW
│   │       ├── FileUpload.jsx ✨ NEW
│   │       └── AttachmentList.jsx ✨ NEW
│   ├── services/
│   │   └── socket.js ✨ NEW
│   └── pages/
│       └── tasks/
│           └── TaskDetails.jsx (cần update - xem INTEGRATION_GUIDE.jsx)
└── INTEGRATION_GUIDE.jsx ✨ NEW (hướng dẫn tích hợp)
```

---

## 🚀 Cách Sử Dụng

### 1. Backend Setup
```bash
cd backend
npm install  # đã cài multer, socket.io

# Tạo thư mục uploads nếu chưa có
mkdir -p uploads/attachments

# Start server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install  # đã cài socket.io-client, react-dropzone, date-fns

# Start dev server
npm run dev
```

### 3. Tích Hợp vào TaskDetails Page
Xem file `INTEGRATION_GUIDE.jsx` để biết cách:
- Import components
- Setup Socket.IO
- Replace old comment UI
- Add attachment sections

---

## 🔌 API Endpoints

### Attachments
```
POST   /api/tasks/:taskId/attachments    Upload file (form-data: file)
GET    /api/tasks/:taskId/attachments    Lấy danh sách files
DELETE /api/attachments/:id              Xóa file
GET    /api/attachments/:id/download     Download file
```

### Comments (existing, updated với Socket.IO)
```
GET    /api/comments?taskId=xxx          Lấy comments
POST   /api/comments                     Tạo comment
PUT    /api/comments/:id                 Update comment
DELETE /api/comments/:id                 Xóa comment
```

---

## 🎨 UI/UX Features

### Chat-style Comments
- Own messages: blue bubble, right-aligned
- Other messages: gray bubble, left-aligned
- Avatar với fallback (ui-avatars.com)
- Relative time: "2 giờ trước", "Vừa xong"
- Auto-scroll to bottom
- Typing indicator với animated dots

### File Upload
- Drag & drop zone với hover effect
- File preview before upload
- Progress bar during upload
- File type icons (image, document, generic)
- Size validation với error messages
- Multi-file upload

### Attachments Display
- Image preview (full width, 192px height)
- File info: name, size, date, uploader
- Download button
- Delete button (confirm dialog)
- Empty state message

---

## 🔐 Security & Permissions

### Attachments
- ✅ Chỉ project members mới upload được
- ✅ Uploader/task owner/admin mới xóa được
- ✅ File size limit: 10MB
- ✅ File type whitelist

### Comments
- ✅ Chỉ project members mới comment
- ✅ Chỉ owner mới xóa/edit comment của mình
- ✅ Socket.IO authentication via JWT

### Socket.IO
- ✅ JWT verification trước khi connect
- ✅ User-specific rooms
- ✅ Task-specific rooms

---

## 🧪 Testing Checklist

### File Upload
- [ ] Upload single file
- [ ] Upload multiple files
- [ ] Drag & drop file
- [ ] Upload file > 10MB (should fail)
- [ ] Upload invalid file type (should fail)
- [ ] Download file
- [ ] Delete file (own)
- [ ] Delete file (others - should fail if not admin)
- [ ] Image preview hiển thị đúng

### Real-time Comments
- [ ] Gửi comment → hiện ngay ở user khác
- [ ] Xóa comment → biến mất real-time
- [ ] Typing indicator hiện khi đang gõ
- [ ] Typing indicator tắt sau 2s không gõ
- [ ] Auto-scroll khi có message mới
- [ ] Own vs others messages hiển thị đúng bên
- [ ] Avatar load đúng

### Socket.IO
- [ ] Connect thành công với JWT
- [ ] Join/leave room tự động
- [ ] Reconnect khi mất kết nối
- [ ] Multiple users cùng xem 1 task
- [ ] Events không leak sang task khác

---

## 🐛 Known Issues / TODO

1. **File Storage**: Hiện đang dùng local disk
   - TODO: Migrate to AWS S3 / Cloudinary cho production
   
2. **Image Optimization**: Chưa resize/compress images
   - TODO: Add sharp middleware để optimize images

3. **Notification**: Chưa gửi notification khi có file mới
   - TODO: Integrate với notification system

4. **Pagination**: Attachments chưa có pagination
   - TODO: Add lazy loading cho nhiều files

5. **Security**: Virus scan
   - TODO: Add ClamAV hoặc VirusTotal API

---

## 📝 Ghi Chú Quan Trọng

1. **Socket.IO Connection**: 
   - Tự động reconnect khi mất kết nối
   - JWT token lấy từ localStorage
   - Cần update token khi refresh

2. **File Paths**:
   - Backend serve files từ `/uploads/attachments/`
   - Frontend cần config VITE_API_BASE_URL
   - Production cần setup static file serving (Nginx)

3. **Performance**:
   - Socket rooms tự động cleanup khi user leave
   - Typing timeout 2s để tránh spam events
   - Attachment list dùng `key` prop để force re-render

4. **Styling**:
   - Sử dụng Tailwind CSS
   - Dark mode ready (dark:bg-zinc-800)
   - Responsive design

---

## 👨‍💻 Developer Tips

### Debug Socket.IO
```javascript
// Browser console
localStorage.setItem('debug', 'socket.io-client:*');
```

### Test File Upload với cURL
```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/attachments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.jpg"
```

### Check Socket Connections
```javascript
// Backend
io.sockets.sockets.size  // Số connections hiện tại
```

---

## 🎉 Kết Luận

Đã hoàn thành **11/12 tasks** trong todo list:

✅ Attachment Model  
✅ Multer Middleware  
✅ Attachment API  
✅ Task Model Update  
✅ Socket.IO Server  
✅ Comment API với Events  
✅ FileUpload Component  
✅ AttachmentList Component  
✅ Chat-style Comments UI  
✅ Socket.IO Client  
✅ Typing Indicator  
⏳ Testing (cần manual testing)

**Next Steps:**
1. Tích hợp code vào TaskDetails.jsx (xem INTEGRATION_GUIDE.jsx)
2. Test toàn bộ features
3. Fix bugs nếu có
4. Deploy lên staging/production

**Estimated Integration Time:** 30-45 phút

---

Made with ❤️ by GitHub Copilot
