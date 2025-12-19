import { getModel } from '../config/gemini.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';

class AIService {
  /**
   * Gợi ý người được phân công tốt nhất cho task
   */
  async suggestAssignee(projectId, taskData) {
    try {
      // Lấy danh sách thành viên trong dự án
      const members = await ProjectMember.find({ projectId })
        .populate('userId', 'name email role')
        .lean();

      if (members.length === 0) {
        return { success: false, message: 'Không có thành viên trong dự án' };
      }

      // Lấy thông tin task hiện tại của từng thành viên
      const memberStats = await Promise.all(
        members.map(async (member) => {
          const tasks = await Task.find({
            projectId,
            assigneeId: member.userId._id,
            status: { $ne: 'completed' }
          });

          const completedTasks = await Task.find({
            projectId,
            assigneeId: member.userId._id,
            status: 'completed'
          });

          return {
            userId: member.userId._id,
            name: member.userId.name,
            email: member.userId.email,
            role: member.userId.role,
            projectRole: member.role,
            currentTasks: tasks.length,
            completedTasks: completedTasks.length,
            taskPriorities: tasks.map(t => t.priority)
          };
        })
      );

      // Tạo prompt cho Gemini
      const prompt = `
Bạn là AI Assistant chuyên phân tích và gợi ý phân công công việc trong quản lý dự án.

THÔNG TIN TASK MỚI:
- Tiêu đề: ${taskData.title}
- Mô tả: ${taskData.description || 'Không có'}
- Độ ưu tiên: ${taskData.priority || 'medium'}
- Deadline: ${taskData.dueDate || 'Không xác định'}

DANH SÁCH THÀNH VIÊN:
${memberStats.map((m, idx) => `
${idx + 1}. ${m.name} (${m.email})
   - Vai trò: ${m.role}
   - Vai trò trong dự án: ${m.projectRole}
   - Số task đang làm: ${m.currentTasks}
   - Số task đã hoàn thành: ${m.completedTasks}
   - Độ ưu tiên task hiện tại: ${m.taskPriorities.join(', ') || 'Không có'}
`).join('\n')}

YÊU CẦU:
1. Phân tích và đề xuất TOP 3 người phù hợp nhất
2. Giải thích lý do cho mỗi người (1-2 câu ngắn gọn)
3. Xếp hạng từ phù hợp nhất đến ít phù hợp

ĐỊNH DẠNG TRẢ LỜI (JSON):
{
  "recommendations": [
    {
      "userId": "ObjectId của user",
      "name": "Tên user",
      "score": 95,
      "reason": "Lý do ngắn gọn"
    }
  ],
  "analysis": "Phân tích tổng quan ngắn gọn"
}

Chỉ trả về JSON, không thêm text nào khác.
`;

      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON từ response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI không trả về đúng định dạng JSON');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: aiResponse,
        memberStats
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        message: 'Lỗi khi gợi ý assignee: ' + error.message
      };
    }
  }

  /**
   * Dự đoán deadline cho task
   */
  async predictDeadline(projectId, taskData) {
    try {
      // Lấy dữ liệu lịch sử task tương tự (status DONE và có completedAt)
      const similarTasks = await Task.find({
        projectId,
        status: 'DONE',
        completedAt: { $ne: null },
        priority: taskData.priority
      })
        .select('title createdAt completedAt priority')
        .limit(10)
        .lean();

      // Nếu không có task cùng priority, lấy tất cả task DONE
      if (similarTasks.length === 0) {
        const allCompletedTasks = await Task.find({
          projectId,
          status: 'DONE',
          completedAt: { $ne: null }
        })
          .select('title createdAt completedAt priority')
          .limit(10)
          .lean();

        if (allCompletedTasks.length === 0) {
          // Nếu vẫn không có, trả về ước lượng mặc định
          return {
            success: true,
            data: {
              estimatedDays: taskData.priority === 'HIGH' ? 3 : taskData.priority === 'MEDIUM' ? 5 : 7,
              confidence: 'low',
              reasoning: 'Chưa có dữ liệu lịch sử. Ước lượng dựa trên độ ưu tiên.'
            }
          };
        }
        similarTasks.push(...allCompletedTasks);
      }

      const prompt = `
Bạn là AI Assistant chuyên dự đoán thời gian hoàn thành task.

TASK MỚI:
- Tiêu đề: ${taskData.title}
- Mô tả: ${taskData.description || 'Không có'}
- Độ ưu tiên: ${taskData.priority || 'MEDIUM'}

DỮ LIỆU LỊCH SỬ (${similarTasks.length} tasks tương tự):
${similarTasks.map((t, idx) => {
  const duration = t.completedAt && t.createdAt 
    ? Math.ceil((new Date(t.completedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24))
    : 5; // default 5 ngày nếu không tính được
  return `${idx + 1}. "${t.title}" - Hoàn thành trong ${duration} ngày (${t.priority})`;
}).join('\n')}

YÊU CẦU:
Dự đoán số ngày cần để hoàn thành task mới dựa trên:
1. Độ phức tạp của task (từ tiêu đề và mô tả)
2. Độ ưu tiên
3. Thời gian trung bình của các task tương tự

TRẢ LỜI JSON:
{
  "estimatedDays": <số ngày>,
  "confidence": "<low|medium|high>",
  "reasoning": "Giải thích ngắn gọn"
}
`;

      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI không trả về đúng định dạng JSON');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: aiResponse
      };
    } catch (error) {
      console.error('AI Deadline Prediction Error:', error);
      return {
        success: false,
        message: 'Lỗi khi dự đoán deadline: ' + error.message
      };
    }
  }

  /**
   * Phân tích tiến độ dự án và đưa ra insights
   */
  async analyzeProjectProgress(projectId) {
    try {
      console.log('🤖 AI analyzing project:', projectId);
      
      const tasks = await Task.find({ projectId })
        .populate('assigneeId', 'name')
        .lean();

      console.log(`📊 Found ${tasks.length} tasks for project`);

      if (tasks.length === 0) {
        console.log('⚠️ No tasks found, returning error');
        return {
          success: false,
          message: 'Dự án chưa có task nào'
        };
      }

      const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'DONE').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        todo: tasks.filter(t => t.status === 'TODO').length,
        overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE').length,
        byPriority: {
          high: tasks.filter(t => t.priority === 'HIGH').length,
          medium: tasks.filter(t => t.priority === 'MEDIUM').length,
          low: tasks.filter(t => t.priority === 'LOW').length
        }
      };

      const prompt = `
Bạn là AI Project Manager chuyên phân tích tiến độ dự án.

THỐNG KÊ DỰ ÁN:
- Tổng số task: ${stats.total}
- Đã hoàn thành: ${stats.completed} (${((stats.completed / stats.total) * 100).toFixed(1)}%)
- Đang làm: ${stats.inProgress}
- Chưa bắt đầu: ${stats.todo}
- Quá hạn: ${stats.overdue}

THEO ĐỘ ƯU TIÊN:
- High: ${stats.byPriority.high}
- Medium: ${stats.byPriority.medium}
- Low: ${stats.byPriority.low}

YÊU CẦU:
1. Đánh giá tình trạng dự án (1 đoạn ngắn)
2. Chỉ ra 3 rủi ro tiềm ẩn (nếu có)
3. Đưa ra 3 khuyến nghị cải thiện

TRẢ LỜI JSON:
{
  "status": "<on-track|at-risk|critical>",
  "summary": "Đánh giá tổng quan",
  "risks": ["Rủi ro 1", "Rủi ro 2", "Rủi ro 3"],
  "recommendations": ["Khuyến nghị 1", "Khuyến nghị 2", "Khuyến nghị 3"],
  "healthScore": <0-100>
}
`;

      console.log('📝 Sending prompt to Gemini AI...');
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('🤖 AI raw response:', text);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ AI response is not valid JSON');
        throw new Error('AI không trả về đúng định dạng JSON');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      console.log('✅ AI analysis complete:', aiResponse);

      return {
        success: true,
        data: aiResponse,
        stats
      };
    } catch (error) {
      console.error('❌ AI Project Analysis Error:', error);
      console.error('Error stack:', error.stack);
      return {
        success: false,
        message: 'Lỗi khi phân tích dự án: ' + error.message
      };
    }
  }

  /**
   * Phân tích sentiment từ comments
   */
  async analyzeSentiment(comments) {
    try {
      if (!comments || comments.length === 0) {
        return {
          success: false,
          message: 'Không có comment để phân tích'
        };
      }

      const commentTexts = comments.map((c, idx) => 
        `${idx + 1}. ${c.content} (${c.userId?.name || 'Anonymous'})`
      ).join('\n');

      const prompt = `
Bạn là AI chuyên phân tích cảm xúc và tâm trạng team.

COMMENTS:
${commentTexts}

YÊU CẦU:
Phân tích tâm trạng chung của team qua comments:
1. Sentiment tổng thể (positive/neutral/negative)
2. Điểm số từ 0-100
3. Những vấn đề đáng chú ý (nếu có)
4. Đề xuất cải thiện không khí làm việc

TRẢ LỜI JSON:
{
  "overall": "<positive|neutral|negative>",
  "score": <0-100>,
  "issues": ["Vấn đề 1", "Vấn đề 2"],
  "suggestions": ["Đề xuất 1", "Đề xuất 2"]
}
`;

      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI không trả về đúng định dạng JSON');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: aiResponse
      };
    } catch (error) {
      console.error('AI Sentiment Analysis Error:', error);
      return {
        success: false,
        message: 'Lỗi khi phân tích sentiment: ' + error.message
      };
    }
  }
}

export default new AIService();
