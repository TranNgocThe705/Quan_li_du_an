import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a workspace name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image_url: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
workspaceSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Virtual for members
workspaceSchema.virtual('members', {
  ref: 'WorkspaceMember',
  localField: '_id',
  foreignField: 'workspaceId',
});

// Virtual for projects
workspaceSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'workspaceId',
});

// Enable virtuals in JSON
workspaceSchema.set('toJSON', { virtuals: true });
workspaceSchema.set('toObject', { virtuals: true });

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
