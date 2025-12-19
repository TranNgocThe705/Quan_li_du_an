import aiService from '../services/aiService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getModel } from '../config/gemini.js';

// @desc    Gợi ý người được phân công cho task
// @route   POST /api/ai/suggest-assignee
// @access  Private
export const suggestAssignee = asyncHandler(async (req, res) => {
  const { projectId, taskData } = req.body;

  if (!projectId || !taskData) {
    return errorResponse(res, 400, 'Thiếu thông tin projectId hoặc taskData');
  }

  const result = await aiService.suggestAssignee(projectId, taskData);

  if (!result.success) {
    return errorResponse(res, 400, result.message);
  }

  return successResponse(res, 200, 'Gợi ý assignee thành công', result.data);
});

// @desc    Dự đoán deadline cho task
// @route   POST /api/ai/predict-deadline
// @access  Private
export const predictDeadline = asyncHandler(async (req, res) => {
  const { projectId, taskData } = req.body;

  if (!projectId || !taskData) {
    return errorResponse(res, 400, 'Thiếu thông tin projectId hoặc taskData');
  }

  const result = await aiService.predictDeadline(projectId, taskData);

  if (!result.success) {
    return errorResponse(res, 400, result.message);
  }

  return successResponse(res, 200, 'Dự đoán deadline thành công', result.data);
});

// @desc    Phân tích tiến độ dự án
// @route   GET /api/ai/project-insights/:projectId
// @access  Private
export const getProjectInsights = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return errorResponse(res, 400, 'Thiếu projectId');
  }

  const result = await aiService.analyzeProjectProgress(projectId);

  if (!result.success) {
    return errorResponse(res, 400, result.message);
  }

  return successResponse(res, 200, 'Phân tích dự án thành công', result.data);
});

// @desc    Phân tích sentiment từ comments
// @route   POST /api/ai/analyze-sentiment
// @access  Private
export const analyzeSentiment = asyncHandler(async (req, res) => {
  const { comments } = req.body;

  if (!comments || !Array.isArray(comments)) {
    return errorResponse(res, 400, 'Thiếu dữ liệu comments');
  }

  const result = await aiService.analyzeSentiment(comments);

  if (!result.success) {
    return errorResponse(res, 400, result.message);
  }

  return successResponse(res, 200, 'Phân tích sentiment thành công', result.data);
});

// @desc    Test Gemini AI connection
// @route   GET /api/ai/test
// @access  Private
export const testAI = asyncHandler(async (req, res) => {
  try {
    const model = getModel();
    
    const result = await model.generateContent('Xin chào! Bạn có thể giúp tôi quản lý dự án không?');
    const response = await result.response;
    const text = response.text();

    return successResponse(res, 200, 'Gemini AI hoạt động tốt', { response: text });
  } catch (error) {
    return errorResponse(res, 500, 'Lỗi kết nối Gemini AI: ' + error.message);
  }
});

// @desc    Chat với AI Assistant
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = asyncHandler(async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return errorResponse(res, 400, 'Message is required');
  }

  try {
    console.log('🤖 AI Chat request:', { message: message.substring(0, 50), userId: req.user?._id });
    
    const model = getModel();
    
    if (!model) {
      console.error('❌ Gemini model not initialized');
      return errorResponse(res, 500, 'AI model chưa được khởi tạo. Vui lòng kiểm tra GEMINI_API_KEY.');
    }
    
    // Tạo system prompt với context
    const systemPrompt = `Bạn là AI Assistant thông minh cho hệ thống quản lý dự án.

NHIỆM VỤ:
- Trả lời câu hỏi về quản lý dự án, task, team
- Tư vấn về workflow, best practices
- Giúp người dùng hiểu và sử dụng hệ thống
- Nói chuyện thân thiện, hữu ích bằng tiếng Việt

QUY TẮC:
- Trả lời ngắn gọn, dễ hiểu (2-4 câu)
- Sử dụng emoji phù hợp
- Nếu không biết, hãy thừa nhận và đề xuất
- Tập trung vào giải pháp thực tế

TÍNH NĂNG HỆ THỐNG:
- Quản lý workspace, projects, tasks
- Phân quyền 3 cấp (Workspace → Project → Task)
- AI suggest assignee, predict deadline
- Thông báo real-time
- Comments, activity logs

User hỏi: ${message}

Hãy trả lời một cách hữu ích và thân thiện:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return successResponse(res, 200, 'Chat successful', {
      response: text,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return errorResponse(res, 500, 'Lỗi khi chat với AI: ' + error.message);
  }
});
