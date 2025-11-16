import mongoose from 'mongoose';
import { ProjectStatus, Priority } from '../config/constants.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ACTIVE,
    },
    start_date: {
      type: Date,
      default: null,
    },
    end_date: {
      type: Date,
      default: null,
    },
    team_lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for members
projectSchema.virtual('members', {
  ref: 'ProjectMember',
  localField: '_id',
  foreignField: 'projectId',
});

// Virtual for tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
});

// Enable virtuals in JSON
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
