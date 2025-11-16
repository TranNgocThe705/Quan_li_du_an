import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate membership
projectMemberSchema.index({ userId: 1, projectId: 1 }, { unique: true });

const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);

export default ProjectMember;
