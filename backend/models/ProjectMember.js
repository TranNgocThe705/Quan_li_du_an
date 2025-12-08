import mongoose from 'mongoose';
import { ProjectRole } from '../config/constants.js';

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
    role: {
      type: String,
      enum: Object.values(ProjectRole),
      default: ProjectRole.MEMBER,
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
