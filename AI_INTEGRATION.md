# 🤖 Gemini AI Integration

## ✅ Các tính năng AI đã tích hợp

### 1. **AI Task Assistant**
- **Gợi ý người phân công thông minh**: AI phân tích kỹ năng, khối lượng công việc và hiệu suất của thành viên để đề xuất người phù hợp nhất
- **Dự đoán deadline tự động**: Dựa trên dữ liệu lịch sử để ước tính thời gian hoàn thành task
- **Vị trí**: Trong dialog "Tạo Task Mới" → Nút "✨ AI Gợi Ý" và "✨ AI Dự Đoán"

### 2. **AI Project Insights** 
- **Phân tích tiến độ dự án**: Đánh giá tình trạng dự án (On Track / At Risk / Critical)
- **Điểm sức khỏe dự án**: Tính toán health score từ 0-100
- **Phát hiện rủi ro**: Cảnh báo các rủi ro tiềm ẩn
- **Khuyến nghị cải thiện**: Đưa ra các gợi ý cụ thể để cải thiện
- **Vị trí**: Project Details → Tab "AI Insights"

### 3. **Sentiment Analysis** (Backend Ready)
- API endpoint sẵn sàng để phân tích cảm xúc team qua comments
- Endpoint: `POST /api/ai/analyze-sentiment`

---

## 🔧 Cấu trúc Code

### Backend
```
backend/
├── config/
│   └── gemini.js                    # Khởi tạo Gemini AI client
├── services/
│   └── aiService.js                 # Logic nghiệp vụ AI
├── controllers/
│   └── aiController.js              # Xử lý API requests
└── routes/
    └── aiRoutes.js                  # Định nghĩa endpoints
```

### Frontend
```
frontend/src/
├── services/
│   └── aiService.js                 # API client cho AI
├── components/
│   ├── CreateTaskDialog.jsx         # Tích hợp AI suggest/predict
│   └── AIProjectInsights.jsx        # Dashboard AI insights
└── pages/
    └── ProjectDetails.jsx           # Tab AI Insights
```

---

## 📡 API Endpoints

### 1. Test AI Connection
```http
GET /api/ai/test
Authorization: Bearer {token}
```

### 2. Suggest Assignee
```http
POST /api/ai/suggest-assignee
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": "6758...",
  "taskData": {
    "title": "Implement login feature",
    "description": "Build JWT authentication",
    "priority": "HIGH",
    "dueDate": "2025-12-20"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "userId": "6758abc...",
        "name": "Nguyễn Văn A",
        "score": 95,
        "reason": "Có kinh nghiệm về authentication và đang có ít task nhất"
      }
    ],
    "analysis": "Phân tích tổng quan..."
  }
}
```

### 3. Predict Deadline
```http
POST /api/ai/predict-deadline
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": "6758...",
  "taskData": {
    "title": "Design database schema",
    "description": "PostgreSQL schema for user management",
    "priority": "MEDIUM"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimatedDays": 5,
    "confidence": "high",
    "reasoning": "Dựa trên 8 task tương tự, trung bình 4-6 ngày"
  }
}
```

### 4. Get Project Insights
```http
GET /api/ai/project-insights/:projectId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "at-risk",
    "healthScore": 67,
    "summary": "Dự án có 3 task quá hạn...",
    "risks": [
      "30% task đang quá deadline",
      "Không có thành viên nào được assign task mới trong 5 ngày"
    ],
    "recommendations": [
      "Ưu tiên hoàn thành task có độ ưu tiên HIGH",
      "Phân công lại task để cân bằng workload"
    ]
  }
}
```

### 5. Analyze Sentiment
```http
POST /api/ai/analyze-sentiment
Authorization: Bearer {token}
Content-Type: application/json

{
  "comments": [
    {
      "content": "Great work team!",
      "userId": { "name": "John" }
    },
    {
      "content": "This is taking too long...",
      "userId": { "name": "Jane" }
    }
  ]
}
```

---

## 🎯 Cách sử dụng

### 1. Tạo Task với AI
1. Click "Tạo Task Mới" trong project
2. Nhập tiêu đề và mô tả task
3. Click **"✨ AI Gợi Ý"** → AI sẽ đề xuất người phù hợp nhất
4. Click **"✨ AI Dự Đoán"** → AI sẽ tính deadline tự động
5. Submit để tạo task

### 2. Xem AI Insights
1. Vào chi tiết dự án
2. Click tab **"AI Insights"**
3. Xem phân tích, rủi ro và khuyến nghị từ AI
4. Click "Làm mới" để cập nhật insights

---

## ⚙️ Configuration

**Gemini API Key** đã được cấu hình trong:
- File: `backend/config/gemini.js`
- Model: `gemini-1.5-flash` (nhanh, rẻ, phù hợp production)
- Temperature: 0.7 (cân bằng giữa sáng tạo và chính xác)

---

## 🚀 Testing

### Test backend:
```bash
cd backend
npm run dev
```

Gọi API test:
```bash
curl http://localhost:5000/api/ai/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test frontend:
```bash
cd frontend
npm run dev
```

1. Đăng nhập vào hệ thống
2. Vào một project
3. Click "Tạo Task Mới"
4. Thử nút "AI Gợi Ý"

---

## 📊 Chi phí Gemini API

- **gemini-1.5-flash**: $0.075 / 1M tokens (input), $0.30 / 1M tokens (output)
- Ước tính: ~500-1000 tokens/request
- **Chi phí dự kiến**: < $0.001/request (~23 VNĐ/request)

---

## 🔮 Tính năng AI tiếp theo (Roadmap)

1. **AI Chatbot**: Chat trực tiếp với AI trong workspace
2. **Natural Language Task Creation**: Tạo task bằng câu văn tự nhiên
3. **Smart Search**: Tìm kiếm semantic qua projects/tasks
4. **Code Review AI**: Tự động review code khi commit
5. **Auto-generate Reports**: Tạo báo cáo weekly/monthly tự động

---

## 🐛 Troubleshooting

### Lỗi "AI không trả về đúng định dạng JSON"
- **Nguyên nhân**: Gemini trả về text thừa ngoài JSON
- **Giải pháp**: Đã xử lý bằng regex extract JSON từ response

### Lỗi "Không có thành viên trong dự án"
- **Nguyên nhân**: Project chưa có member nào
- **Giải pháp**: Thêm member vào project trước khi dùng AI suggest

### Lỗi 429 (Rate Limit)
- **Nguyên nhân**: Gọi API quá nhiều lần
- **Giải pháp**: Implement caching hoặc nâng cấp Gemini plan

---

## 📝 Notes

- AI suggestions chỉ là gợi ý, user vẫn có quyền quyết định cuối cùng
- Để AI hoạt động tốt, cần có dữ liệu lịch sử (ít nhất 5-10 tasks đã hoàn thành)
- Health score được tính dựa trên nhiều yếu tố: completion rate, overdue tasks, workload balance
