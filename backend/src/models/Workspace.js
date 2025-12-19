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

// Cascade delete: Xóa tất cả dữ liệu liên quan khi xóa workspace
workspaceSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const workspaceId = this._id;
  console.log(`🗑️  Cascade deleting workspace: ${workspaceId}`);
  
  try {
    // Import models
    const Project = mongoose.model('Project');
    const WorkspaceMember = mongoose.model('WorkspaceMember');
    const Notification = mongoose.model('Notification');
    const ActivityLog = mongoose.model('ActivityLog');
    
    // 1. Delete all projects (sẽ trigger cascade delete của projects)
    const projects = await Project.find({ workspaceId });
    console.log(`  → Deleting ${projects.length} projects...`);
    for (const project of projects) {
      await project.deleteOne(); // Trigger cascade on each project
    }
    
    // 2. Delete all workspace members
    const membersCount = await WorkspaceMember.countDocuments({ workspaceId });
    await WorkspaceMember.deleteMany({ workspaceId });
    console.log(`  → Deleted ${membersCount} workspace members`);
    
    // 3. Delete all notifications
    const notifCount = await Notification.countDocuments({ workspaceId });
    await Notification.deleteMany({ workspaceId });
    console.log(`  → Deleted ${notifCount} notifications`);
    
    // 4. Delete all activity logs
    const logsCount = await ActivityLog.countDocuments({ workspaceId });
    await ActivityLog.deleteMany({ workspaceId });
    console.log(`  → Deleted ${logsCount} activity logs`);
    
    console.log(`✅ Workspace cascade delete complete`);
  } catch (error) {
    console.error('❌ Cascade delete error:', error);
    throw error;
  }
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
