import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: {
        values: ['image', 'document', 'video', 'other'],
        message: '{VALUE} is not a valid file type',
      },
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      max: [10485760, 'File size cannot exceed 10MB'], // 10MB in bytes
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by user is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
attachmentSchema.index({ taskId: 1, createdAt: -1 });
attachmentSchema.index({ uploadedBy: 1 });

// Virtual for formatted file size
attachmentSchema.virtual('formattedSize').get(function () {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
});

// Method to determine file type from mime type
attachmentSchema.statics.getFileType = function (mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('text')
  ) {
    return 'document';
  }
  return 'other';
};

// Pre-remove middleware to delete file from storage
attachmentSchema.pre('remove', async function (next) {
  // TODO: Add logic to delete file from storage (local or cloud)
  // Example: await deleteFileFromStorage(this.fileUrl);
  next();
});

const Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;
