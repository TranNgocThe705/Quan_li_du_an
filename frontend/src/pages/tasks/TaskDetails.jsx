import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  Edit2Icon, 
  Trash2Icon, 
  CalendarIcon, 
  UserIcon, 
  TagIcon, 
  Paperclip, 
  ThumbsUpIcon, 
  ThumbsDownIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  MoreVerticalIcon
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchTaskById, updateTask, deleteTask, fetchComments, createComment, deleteComment } from "../../features/taskSlice";
import { getUserById } from "../../features/authSlice";
import { getTaskProgress } from "../../features/progressSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ChatComments from "../../components/tasks/ChatComments";
import DailyProgressForm from "../../components/tasks/DailyProgressForm";
import ProgressTimeline from "../../components/tasks/ProgressTimeline";
import FileUpload from "../../components/tasks/FileUpload";
import AttachmentList from "../../components/tasks/AttachmentList";
import ApprovalHistory from "../../components/tasks/ApprovalHistory";
import { taskAPI } from "../../api";
import { 
  joinTaskRoom, 
  leaveTaskRoom, 
  onNewComment, 
  onDeleteComment,
  onTyping,
  onNewAttachment,
  onDeleteAttachment,
  emitTypingStart,
  emitTypingStop,
  removeAllListeners,
} from "../../services/socket";

const statusColors = {
    TODO: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200",
    IN_PROGRESS: "bg-blue-200 text-blue-900 dark:bg-blue-600 dark:text-blue-100",
    PENDING_APPROVAL: "bg-yellow-200 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-100",
    DONE: "bg-emerald-200 text-emerald-900 dark:bg-emerald-600 dark:text-emerald-100",
};

const priorityColors = {
    LOW: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
    MEDIUM: "bg-amber-200 text-amber-800 dark:bg-amber-600 dark:text-amber-100",
    HIGH: "bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-100",
};

export default function TaskDetails() {
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const projectId = searchParams.get('projectId');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const { currentTask: task, loading, error, comments } = useSelector(state => state.task);
    const { progress } = useSelector(state => state.progress);

    const { user } = useSelector(state => state.auth);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [assigneeName, setAssigneeName] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [permissionError, setPermissionError] = useState(null);
    const [showProgressForm, setShowProgressForm] = useState(false);
    
    // Real-time features
    const [typingUsers, setTypingUsers] = useState([]);
    const [showAttachments, setShowAttachments] = useState(true);
    const [attachmentKey, setAttachmentKey] = useState(0);
    
    // Tab management
    const [activeTab, setActiveTab] = useState('overview');
    


    // Initialize Socket.IO
    useEffect(() => {
        // Socket already initialized in Layout, no need to init again
        return () => {
            removeAllListeners();
        };
    }, []);

    useEffect(() => {
        if (taskId) {
            dispatch(fetchTaskById(taskId))
                .unwrap()
                .then(() => {
                    setPermissionError(null);
                    // Only fetch comments if task can be accessed
                    dispatch(fetchComments(taskId));
                })
                .catch((err) => {
                    if (err && (err.includes('Access denied') || err.includes('không có quyền'))) {
                        setPermissionError(err || 'Bạn không có quyền xem chi tiết công việc này');
                        toast.error(err || 'Bạn không có quyền xem chi tiết công việc này');
                    }
                });
        }
    }, [dispatch, taskId]);

    // Fetch progress for task
    useEffect(() => {
        if (taskId) {
            dispatch(getTaskProgress({ taskId }));
        }
    }, [dispatch, taskId]);

    // Join task room and setup real-time listeners
    useEffect(() => {
        if (!taskId) return;

        joinTaskRoom(taskId);

        onNewComment((comment) => {
            console.log('📨 New comment received:', comment);
            dispatch(fetchComments(taskId));
        });

        onDeleteComment(({ commentId }) => {
            console.log('🗑️ Comment deleted:', commentId);
            dispatch(fetchComments(taskId));
        });

        onTyping(({ user: typingUser, isTyping }) => {
            if (isTyping) {
                setTypingUsers(prev => {
                    const exists = prev.find(u => u._id === typingUser._id);
                    if (!exists) {
                        return [...prev, typingUser];
                    }
                    return prev;
                });
            } else {
                setTypingUsers(prev => prev.filter(u => u._id !== typingUser._id));
            }
        });

        onNewAttachment((attachment) => {
            console.log('📎 New attachment received:', attachment);
            setAttachmentKey(prev => prev + 1);
        });

        onDeleteAttachment(({ attachmentId }) => {
            console.log('🗑️ Attachment deleted:', attachmentId);
            setAttachmentKey(prev => prev + 1);
        });

        return () => {
            leaveTaskRoom(taskId);
            setTypingUsers([]);
        };
    }, [taskId, dispatch]);

    useEffect(() => {
        if (task) {
            console.log('📋 Task data:', task);
            console.log('👤 Assignee ID:', task.assigneeId);
            setEditedTask({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "TODO",
                priority: task.priority || "MEDIUM",
                type: task.type || "TASK",
                due_date: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : "",
            });
            
            // Fetch assignee info if assigneeId exists and is a string (not an object)
            if (task.assigneeId && typeof task.assigneeId === 'string') {
                dispatch(getUserById(task.assigneeId))
                    .unwrap()
                    .then((name) => {
                        console.log('✅ Fetched assignee name:', name);
                        setAssigneeName(name);
                    })
                    .catch((error) => {
                        console.error('❌ Error fetching assignee:', error);
                        setAssigneeName(null);
                    });
            } else if (task.assigneeId && typeof task.assigneeId === 'object') {
                // If it's already an object, use the name directly
                setAssigneeName(task.assigneeId.name);
            } else {
                setAssigneeName(null);
            }
        }
    }, [task, dispatch]);

    const handleUpdate = async () => {
        try {
            // Prevent direct change to PENDING_APPROVAL via dropdown
            if (editedTask.status === 'PENDING_APPROVAL' && task.status !== 'PENDING_APPROVAL') {
                toast.error('Không thể chuyển trực tiếp sang "Chờ duyệt". Vui lòng sử dụng nút "Đánh dấu hoàn thành"');
                return;
            }
            
            // Prevent changing away from PENDING_APPROVAL except by approve/reject
            if (task.status === 'PENDING_APPROVAL' && editedTask.status !== 'PENDING_APPROVAL') {
                toast.error('Công việc đang chờ duyệt. Vui lòng phê duyệt hoặc từ chối thay vì thay đổi trạng thái');
                return;
            }

            await dispatch(updateTask({
                id: taskId,
                data: editedTask
            })).unwrap();
            setIsEditing(false);
            toast.success(t('taskDetails.updateSuccess'));
        } catch (error) {
            toast.error(error || t('taskDetails.updateError'));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(t('taskDetails.confirmDelete'))) return;
        
        try {
            await dispatch(deleteTask(taskId)).unwrap();
            toast.success(t('taskDetails.deleteSuccess'));
            navigate(`/projectsDetail?id=${projectId}&tab=tasks`);
        } catch (error) {
            toast.error(error || t('taskDetails.deleteError'));
        }
    };

    const handleAddComment = async (content) => {
        if (!content.trim()) return;

        try {
            await dispatch(createComment({
                taskId,
                content
            })).unwrap();
            emitTypingStop(taskId);
        } catch (error) {
            toast.error(error || t('taskDetails.commentError'));
            throw error;
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm(t('taskDetails.confirmDeleteComment'))) return;
        
        try {
            await dispatch(deleteComment(commentId)).unwrap();
        } catch (error) {
            toast.error(error || 'Không thể xóa comment');
        }
    };

    const handleTypingStart = () => {
        emitTypingStart(taskId);
    };

    const handleTypingStop = () => {
        emitTypingStop(taskId);
    };

    const handleUploadSuccess = () => {
        toast.success('File uploaded successfully!');
        setAttachmentKey(prev => prev + 1);
    };

    // Approval handlers
    const handleSubmitForApproval = async () => {
        if (!window.confirm('Bạn xác nhận đã hoàn thành công việc này và muốn gửi yêu cầu phê duyệt?')) {
            return;
        }

        try {
            await taskAPI.submitForApproval(taskId);
            toast.success('Đã gửi yêu cầu phê duyệt thành công');
            dispatch(fetchTaskById(taskId));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Không thể gửi yêu cầu phê duyệt');
        }
    };

    const handleApprove = async () => {
        try {
            await taskAPI.approveTask(taskId);
            toast.success('Công việc đã được duyệt');
            dispatch(fetchTaskById(taskId));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Không thể duyệt công việc');
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
        }

        try {
            await taskAPI.rejectTask(taskId, rejectionReason);
            toast.success('Công việc đã bị từ chối');
            setShowRejectModal(false);
            setRejectionReason('');
            dispatch(fetchTaskById(taskId));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Không thể từ chối công việc');
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-40"></div>
                <p className="mt-4">{t('taskDetails.loading')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <button 
                                onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                                className="mt-1 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Quay lại"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                            </button>
                            <div className="flex-1">
                                {!isEditing ? (
                                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white break-words">
                                        {task?.title}
                                    </h1>
                                ) : (
                                    <input
                                        type="text"
                                        value={editedTask.title}
                                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                        className="text-2xl sm:text-3xl font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 outline-none w-full focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                )}
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                                    Tạo bởi {task?.projectId?.name || 'Project'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {!isEditing ? (
                                <>
                                    {task?.assigneeId?._id === user?._id && task?.status === 'IN_PROGRESS' && (
                                        <button
                                            onClick={handleSubmitForApproval}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">Hoàn thành</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditedTask({
                                                title: task?.title || '',
                                                description: task?.description || '',
                                                status: task?.status || 'TODO',
                                                priority: task?.priority || 'MEDIUM',
                                                type: task?.type || 'TASK',
                                                due_date: task?.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : '',
                                            });
                                        }}
                                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit2Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2Icon className="w-5 h-5 text-red-500" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {permissionError || error ? (
                    <div className="max-w-md mx-auto p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <div className="flex justify-center mb-4">
                            <XCircleIcon className="w-16 h-16 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2 text-center">Không có quyền truy cập</h2>
                        <p className="text-zinc-700 dark:text-zinc-300 mb-6 text-center">
                            {permissionError || error || 'Bạn không có quyền xem chi tiết công việc này'}
                        </p>
                        <button 
                            onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                ) : !task && !loading ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-6">{t('taskDetails.notFound')}</p>
                        <button 
                            onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            {t('taskDetails.backToProject')}
                        </button>
                    </div>
                ) : (
                    <>
                        {task?.status === 'PENDING_APPROVAL' && (
                            <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 animate-in fade-in slide-in-from-top">
                                <div className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                            Đang chờ phê duyệt
                                        </p>
                                        <p className="text-sm text-amber-800 dark:text-amber-300">
                                            Công việc cần được Team Lead phê duyệt trước khi hoàn thành
                                        </p>
                                    </div>
                                    {user?.projectRole === 'LEAD' && (
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={handleApprove}
                                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                                            >
                                                <ThumbsUpIcon className="w-4 h-4" /> Duyệt
                                            </button>
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                                            >
                                                <ThumbsDownIcon className="w-4 h-4" /> Từ chối
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {task?.approvalStatus === 'APPROVED' && task?.approvedBy && (
                            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                                            Đã được phê duyệt
                                        </p>
                                        <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                                            Bởi {task.approvedBy.name || 'Team Lead'} vào {task.approvedAt && format(new Date(task.approvedAt), 'dd/MM/yyyy HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {task?.approvalStatus === 'REJECTED' && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-red-900 dark:text-red-200">
                                            Công việc bị từ chối
                                        </p>
                                        <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                                            Bởi {task.approvedBy?.name || 'Team Lead'} vào {task.approvedAt && format(new Date(task.approvedAt), 'dd/MM/yyyy HH:mm')}
                                        </p>
                                        {task.rejectionReason && (
                                            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
                                                <p className="font-semibold text-xs text-red-900 dark:text-red-200 mb-1">Lý do từ chối:</p>
                                                <p className="text-sm text-red-800 dark:text-red-300">{task.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Navigation */}
                        <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === 'overview'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
                                }`}
                            >
                                Tổng quan
                            </button>
                            {progress && progress.length > 0 && (
                                <button
                                    onClick={() => setActiveTab('progress')}
                                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                                        activeTab === 'progress'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    <TrendingUpIcon className="w-4 h-4" />
                                    Tiến độ
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === 'comments'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
                                }`}
                            >
                                <MessageCircleIcon className="w-4 h-4" />
                                Bình luận ({comments?.length || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        {/* Description */}
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                                                Mô tả
                                            </h2>
                                            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                                {task?.description || <span className="text-zinc-500 italic">Không có mô tả</span>}
                                            </p>
                                        </div>

                                        {/* Attachments */}
                                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                                    <Paperclip className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    File đính kèm
                                                </h2>
                                                <button
                                                    onClick={() => setShowAttachments(!showAttachments)}
                                                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                >
                                                    {showAttachments ? 'Ẩn' : 'Hiện'}
                                                </button>
                                            </div>

                                            {showAttachments && (
                                                <div className="space-y-4">
                                                    <FileUpload 
                                                        taskId={taskId} 
                                                        onUploadSuccess={handleUploadSuccess}
                                                    />

                                                    <div className="mt-6">
                                                        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                                                            Danh sách file
                                                        </h3>
                                                        <AttachmentList 
                                                            key={attachmentKey}
                                                            taskId={taskId}
                                                            onDelete={() => toast.success('File deleted successfully')}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Approval History */}
                                        {task?.approvalRequests && task.approvalRequests.length > 0 && (
                                            <ApprovalHistory task={task} />
                                        )}
                                    </div>
                                )}

                                {/* Progress Tab */}
                                {activeTab === 'progress' && (
                                    <div className="space-y-6">
                                        {/* Progress Form */}
                                        {(task?.assigneeId?._id === user?._id || task?.assigneeId === user?._id) && (
                                            <>
                                                {!showProgressForm ? (
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                                        <p className="text-sm text-blue-900 dark:text-blue-200 mb-3">
                                                            Báo cáo tiến độ hằng ngày giúp team lead nắm bắt tình hình công việc của bạn
                                                        </p>
                                                        <button
                                                            onClick={() => setShowProgressForm(true)}
                                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                                        >
                                                            + Báo cáo tiến độ
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button
                                                            onClick={() => setShowProgressForm(false)}
                                                            className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                                        >
                                                            ← Quay lại
                                                        </button>
                                                        <DailyProgressForm 
                                                            taskId={taskId}
                                                            onSuccess={() => {
                                                                dispatch(getTaskProgress({ taskId }));
                                                                setShowProgressForm(false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Progress Timeline */}
                                        {progress && progress.length > 0 ? (
                                            <ProgressTimeline progress={progress} />
                                        ) : (
                                            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center">
                                                <TrendingUpIcon className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
                                                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                                                    Chưa có báo cáo tiến độ nào
                                                </p>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                                                    Hãy báo cáo tiến độ làm việc của bạn
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Comments Tab */}
                                {activeTab === 'comments' && (
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                        <div className="h-[600px]">
                                            <ChatComments
                                                comments={comments || []}
                                                currentUserId={user?._id}
                                                onAddComment={handleAddComment}
                                                onDeleteComment={handleDeleteComment}
                                                typingUsers={typingUsers}
                                                onTypingStart={handleTypingStart}
                                                onTypingStop={handleTypingStop}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Sidebar - Metadata */}
                            <div className="space-y-4">
                                {/* Status Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3">
                                        Trạng thái
                                    </label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task?.status || 'TODO']}`}>
                                        {task?.status === 'TODO' ? t('taskDetails.todo') : 
                                         task?.status === 'IN_PROGRESS' ? t('taskDetails.inProgress') : 
                                         task?.status === 'PENDING_APPROVAL' ? 'Chờ duyệt' :
                                         t('taskDetails.done')}
                                    </span>
                                </div>

                                {/* Priority Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3">
                                        Độ ưu tiên
                                    </label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[task?.priority || 'MEDIUM']}`}>
                                        {task?.priority === 'LOW' ? t('taskDetails.low') : task?.priority === 'MEDIUM' ? t('taskDetails.medium') : t('taskDetails.high')}
                                    </span>
                                </div>

                                {/* Type Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <TagIcon className="w-4 h-4" /> Loại
                                    </label>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-medium">
                                        {task?.type === 'BUG' ? t('taskDetails.bug') : task?.type === 'FEATURE' ? t('taskDetails.feature') : task?.type === 'IMPROVEMENT' ? t('taskDetails.improvement') : task?.type === 'OTHER' ? t('taskDetails.other') : t('taskDetails.task')}
                                    </p>
                                </div>

                                {/* Due Date Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" /> Hạn chót
                                    </label>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-medium">
                                        {task?.due_date ? format(new Date(task.due_date), 'dd/MM/yyyy') : <span className="text-zinc-500">Chưa thiết lập</span>}
                                    </p>
                                </div>

                                {/* Assignee Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" /> Người được giao
                                    </label>
                                    {task?.assigneeId ? (
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={task.assigneeId?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(assigneeName || task.assigneeId?.name || 'User')}&background=64748B&color=fff&size=40&bold=true`} 
                                                alt={assigneeName || task.assigneeId?.name || 'User'}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((assigneeName || 'U').charAt(0))}&background=64748B&color=fff&size=40`;
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-zinc-900 dark:text-zinc-100 font-medium truncate">
                                                    {assigneeName || task.assigneeId?.name || 'Loading...'}
                                                </p>
                                                {task.assigneeId?.email && (
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{task.assigneeId.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                            <UserIcon className="w-8 h-8" />
                                            <span className="text-sm">{t('taskDetails.unassigned')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-4">
                            <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                Từ chối công việc
                            </h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            Vui lòng nhập lý do từ chối công việc. Lý do này sẽ được gửi cho người được giao việc.
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                Lý do từ chối <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Nhập lý do từ chối..."
                                className="w-full h-32 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors flex items-center gap-2"
                            >
                                <ThumbsDownIcon className="w-4 h-4" />
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        </div>
    );
}
