# Google OAuth Setup Guide

## 📋 Hướng dẫn cấu hình Google OAuth 2.0

### 1️⃣ Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable **Google+ API**:
   - Vào menu **APIs & Services** > **Library**
   - Tìm "Google+ API" và click **Enable**

### 2️⃣ Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Nếu chưa có OAuth consent screen:
   - Click **Configure Consent Screen**
   - Chọn **External** (cho test) hoặc **Internal** (cho tổ chức)
   - Điền thông tin:
     - App name: `Project Management System`
     - User support email: email của bạn
     - Developer contact: email của bạn
   - Click **Save and Continue**
   - Thêm scopes (optional): `email`, `profile`
   - Click **Save and Continue**
   - Thêm test users (nếu chọn External)

4. Quay lại **Credentials** và tạo OAuth client ID:
   - Application type: **Web application**
   - Name: `Project Management OAuth`
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:5000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click **Create**

5. Copy **Client ID** và **Client Secret**

### 3️⃣ Cấu hình Backend

1. Tạo file `.env` trong folder `backend/`:
   ```bash
   cp .env.example .env
   ```

2. Thêm Google OAuth credentials vào `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

3. Restart backend server:
   ```bash
   npm run dev
   ```

### 4️⃣ Test Google OAuth

1. Chạy frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Truy cập `http://localhost:5173/login`

3. Click nút **Continue with Google**

4. Chọn tài khoản Google để đăng nhập

5. Chấp nhận permissions

6. Bạn sẽ được redirect về dashboard

### 5️⃣ Production Setup

Khi deploy lên production:

1. Update **Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   ```

2. Update **Authorized redirect URIs**:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

3. Update `.env` với production URLs:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```

4. Publish OAuth consent screen (nếu dùng External):
   - Vào **OAuth consent screen**
   - Click **Publish App**
   - Submit for verification (nếu cần nhiều users)

### 🔧 Troubleshooting

#### Error: "redirect_uri_mismatch"
- Kiểm tra redirect URI trong Google Console khớp với `GOOGLE_CALLBACK_URL`
- Phải có `http://` hoặc `https://`
- Không có trailing slash

#### Error: "invalid_client"
- Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`
- Đảm bảo không có khoảng trắng thừa

#### User không được redirect về frontend
- Kiểm tra `FRONTEND_URL` trong `.env`
- Kiểm tra CORS settings trong `server.js`

### 📝 Flow hoạt động

```
User clicks "Continue with Google"
    ↓
Frontend redirects to: /api/auth/google
    ↓
Backend redirects to: Google OAuth consent screen
    ↓
User authenticates with Google
    ↓
Google redirects to: /api/auth/google/callback
    ↓
Backend generates JWT token
    ↓
Backend redirects to: /auth/google/success?token=xxx
    ↓
Frontend stores token and redirects to dashboard
```

### 🎯 Lưu ý quan trọng

1. **Không commit** file `.env` lên Git
2. Dùng **test users** cho development với External OAuth
3. Enable **Google+ API** trước khi test
4. Token JWT được generate sau khi OAuth thành công
5. User tự động tạo workspace khi đăng ký lần đầu

### 🔐 Security Best Practices

1. Luôn dùng HTTPS trong production
2. Validate redirect URIs nghiêm ngặt
3. Set `session: false` trong Passport (dùng JWT thay vì sessions)
4. Không expose sensitive errors cho client
5. Rate limit OAuth endpoints

---

✅ **Setup hoàn tất!** Bạn có thể đăng nhập bằng Gmail ngay bây giờ.
