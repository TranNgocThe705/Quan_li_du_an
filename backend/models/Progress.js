import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    // Báo cáo ngày
    date: {
      type: Date,
      required: true,
    },
    // Phần trăm hoàn thành (0-100)
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Mô tả công việc đã làm
    workDone: {
      type: String,
      required: true,
      trim: true,
    },
    // Công việc sẽ làm
    planForTomorrow: {
      type: String,
      default: '',
      trim: true,
    },
    // Vấn đề gặp phải
    blockers: {
      type: String,
      default: '',
      trim: true,
    },
    // Mức độ ưu tiên của tác vụ
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    // Thời gian làm việc (giờ)
    hoursSpent: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Ước tính giờ còn lại
    estimatedHoursRemaining: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Trạng thái: draft, submitted, reviewed, approved
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED'],
      default: 'DRAFT',
    },
    // Feedback từ manager/team lead
    feedback: {
      type: String,
      default: '',
    },
    // Người review
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    // Tags để phân loại
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh
progressSchema.index({ taskId: 1, date: -1 });
progressSchema.index({ userId: 1, date: -1 });
progressSchema.index({ projectId: 1, date: -1 });
progressSchema.index({ taskId: 1, userId: 1, date: 1 }, { unique: true }); // Một progress mỗi ngày cho mỗi user trên mỗi task

export default mongoose.model('Progress', progressSchema);
