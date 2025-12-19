# 🔧 Utility Scripts

Các script tiện ích cho database và testing.

## 📁 Database Scripts

### check-task.js
Kiểm tra dữ liệu task trong database.

```bash
npm run db:check
# hoặc
node scripts/database/check-task.js
```

### clear-notifications.js
Xóa tất cả notifications cũ trong database.

```bash
npm run db:clear-notifications
# hoặc
node scripts/database/clear-notifications.js
```

## 🧪 Test Scripts

### test-server.js
Test kết nối và chức năng server.

```bash
node scripts/test/test-server.js
```

## 📝 Ghi Chú

- Tất cả scripts cần file `.env` được cấu hình đúng
- Scripts sẽ tự động kết nối MongoDB trước khi chạy
- Nhớ backup database trước khi chạy clear scripts
