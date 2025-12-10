import api from './api';

// Test Gemini AI connection
export const testAI = async () => {
  const response = await api.get('/ai/test');
  return response.data;
};

// Gợi ý người được phân công
export const suggestAssignee = async (projectId, taskData) => {
  const response = await api.post('/ai/suggest-assignee', {
    projectId,
    taskData
  });
  return response.data;
};

// Dự đoán deadline
export const predictDeadline = async (projectId, taskData) => {
  const response = await api.post('/ai/predict-deadline', {
    projectId,
    taskData
  });
  return response.data;
};

// Lấy AI insights cho dự án
export const getProjectInsights = async (projectId) => {
  const response = await api.get(`/ai/project-insights/${projectId}`);
  return response.data;
};

// Phân tích sentiment từ comments
export const analyzeSentiment = async (comments) => {
  const response = await api.post('/ai/analyze-sentiment', {
    comments
  });
  return response.data;
};

// Chat với AI Assistant
export const chatWithAI = async (message, context = 'general') => {
  const response = await api.post('/ai/chat', {
    message,
    context
  });
  return response.data;
};
