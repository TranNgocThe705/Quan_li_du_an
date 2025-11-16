import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
commentSchema.index({ taskId: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
