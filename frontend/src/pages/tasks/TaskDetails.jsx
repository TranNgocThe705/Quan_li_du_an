import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, Edit2Icon, Trash2Icon, CalendarIcon, UserIcon, TagIcon, Paperclip, ThumbsUpIcon, ThumbsDownIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
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

    if (permissionError || error) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex justify-center mb-4">
                        <XCircleIcon className="w-16 h-16 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Không có quyền truy cập</h2>
                    <p className="text-zinc-700 dark:text-zinc-300 mb-6">
                        {permissionError || error || 'Bạn không có quyền xem chi tiết công việc này'}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                        Chỉ người được giao nhiệm vụ, Team Lead hoặc Workspace Admin mới có thể xem chi tiết công việc này.
                    </p>
                    <button 
                        onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Quay lại danh sách công việc
                    </button>
                </div>
            </div>
        );
    }

    if (!task && !loading) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <p className="text-3xl mb-4">{t('taskDetails.notFound')}</p>
                <button 
                    onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {t('taskDetails.backToProject')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 text-zinc-900 dark:text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(`/projectsDetail?id=${projectId}&tab=tasks`)} 
                        className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    {!isEditing ? (
                        <h1 className="text-2xl font-semibold">{task?.title}</h1>
                    ) : (
                        <input
                            type="text"
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            className="text-2xl font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-2 outline-none w-full"
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Submit for Approval Button - Only for assignee when task is IN_PROGRESS */}
                    {task?.assigneeId?._id === user?._id && task?.status === 'IN_PROGRESS' && (
                        <button
                            onClick={handleSubmitForApproval}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Đánh dấu hoàn thành
                        </button>
                    )}

                    {!isEditing ? (
                        <>
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
                                className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            >
                                <Edit2Icon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                            >
                                <Trash2Icon className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {t('taskDetails.save')}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
                            >
                                {t('taskDetails.cancel')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="md:col-span-2 space-y-6">                    {/* Approval Status */}
                    {task?.status === 'PENDING_APPROVAL' && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 flex items-start gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    <span className="font-semibold text-yellow-900 dark:text-yellow-200">
                                        Công việc đang chờ duyệt
                                    </span>
                                </div>
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    Công việc này cần được Team Lead phê duyệt trước khi hoàn thành
                                </p>
                            </div>
                            {/* Show approve/reject buttons only for Team Lead */}
                            {user?.projectRole === 'LEAD' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
                                    >
                                        <ThumbsUpIcon className="w-4 h-4" /> Duyệt
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 text-sm"
                                    >
                                        <ThumbsDownIcon className="w-4 h-4" /> Từ chối
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Approved Info */}
                    {task?.approvalStatus === 'APPROVED' && task?.approvedBy && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="font-semibold text-green-900 dark:text-green-200">
                                    Đã được duyệt
                                </span>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-300">
                                Bởi {task.approvedBy.name || 'Team Lead'} vào{' '}
                                {task.approvedAt && format(new Date(task.approvedAt), 'dd/MM/yyyy HH:mm')}
                            </p>
                        </div>
                    )}

                    {/* Rejected Info */}
                    {task?.approvalStatus === 'REJECTED' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="font-semibold text-red-900 dark:text-red-200">
                                    Công việc bị từ chối
                                </span>
                            </div>
                            <p className="text-sm text-red-800 dark:text-red-300 mb-2">
                                Bởi {task.approvedBy?.name || 'Team Lead'} vào{' '}
                                {task.approvedAt && format(new Date(task.approvedAt), 'dd/MM/yyyy HH:mm')}
                            </p>
                            {task.rejectionReason && (
                                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/40 rounded">
                                    <p className="font-semibold text-sm text-red-900 dark:text-red-200">Lý do:</p>
                                    <p className="text-sm text-red-800 dark:text-red-300">{task.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Description */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">{t('taskDetails.description')}</h2>
                        {!isEditing ? (
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {task?.description || t('taskDetails.noDescription')}
                            </p>
                        ) : (
                            <textarea
                                value={editedTask.description}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                rows={6}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('taskDetails.descriptionPlaceholder')}
                            />
                        )}
                    </div>

                    {/* Attachments */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Paperclip className="w-5 h-5" />
                                File đính kèm
                            </h2>
                            <button
                                onClick={() => setShowAttachments(!showAttachments)}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
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
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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

                    {/* Daily Progress Section - For Assignee to report, Team Lead/Admin to view */}
                    {task && (
                        (task?.assigneeId?._id === user?._id || task?.assigneeId === user?._id) || 
                        task?.projectId?.team_lead === user?._id
                    ) && (
                        <div className="space-y-4">
                            {/* Progress Form Toggle - Only for assignee */}
                            {(task?.assigneeId?._id === user?._id || task?.assigneeId === user?._id) && (
                                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-sm text-blue-900 dark:text-blue-200">
                                        Báo cáo tiến độ hằng ngày giúp team lead nắm bắt được tình hình công việc của bạn
                                    </p>
                                    <button
                                        onClick={() => setShowProgressForm(!showProgressForm)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                                    >
                                        {showProgressForm ? 'Ẩn form' : 'Báo cáo tiến độ'}
                                    </button>
                                </div>
                            )}

                            {/* Progress Form - Only for assignee */}
                            {showProgressForm && (task?.assigneeId?._id === user?._id || task?.assigneeId === user?._id) && (
                                <DailyProgressForm 
                                    taskId={taskId}
                                    onSuccess={() => {
                                        dispatch(getTaskProgress({ taskId }));
                                        setShowProgressForm(false);
                                    }}
                                />
                            )}

                            {/* Progress Timeline - For everyone who can access */}
                            {progress && progress.length > 0 && (
                                <ProgressTimeline progress={progress} />
                            )}
                            
                            {/* Show message if no progress yet */}
                            {(!progress || progress.length === 0) && (
                                <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Chưa có báo cáo tiến độ nào
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Comments */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                            <h2 className="text-lg font-semibold">{t('taskDetails.comments')} ({comments?.length || 0})</h2>
                        </div>

                        <div className="h-[500px]">
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
                </div>

                {/* Right Column - Metadata */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2">{t('taskDetails.status')}</label>
                        {!isEditing ? (
                            <span className={`px-3 py-1 rounded text-sm ${statusColors[task?.status || 'TODO']}`}>
                                {task?.status === 'TODO' ? t('taskDetails.todo') : 
                                 task?.status === 'IN_PROGRESS' ? t('taskDetails.inProgress') : 
                                 task?.status === 'PENDING_APPROVAL' ? 'Chờ duyệt' :
                                 t('taskDetails.done')}
                            </span>
                        ) : (
                            <select
                                value={editedTask.status}
                                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-2 outline-none"
                            >
                                <option value="TODO">{t('taskDetails.todo')}</option>
                                <option value="IN_PROGRESS">{t('taskDetails.inProgress')}</option>
                                {/* PENDING_APPROVAL can only be set via "Submit for Approval" button */}
                                {task?.status === 'PENDING_APPROVAL' && (
                                    <option value="PENDING_APPROVAL">Chờ duyệt</option>
                                )}
                                <option value="DONE">{t('taskDetails.done')}</option>
                            </select>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2">{t('taskDetails.priority')}</label>
                        {!isEditing ? (
                            <span className={`px-3 py-1 rounded text-sm ${priorityColors[task?.priority || 'MEDIUM']}`}>
                                {task?.priority === 'LOW' ? t('taskDetails.low') : task?.priority === 'MEDIUM' ? t('taskDetails.medium') : t('taskDetails.high')}
                            </span>
                        ) : (
                            <select
                                value={editedTask.priority}
                                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-2 outline-none"
                            >
                                <option value="LOW">{t('taskDetails.low')}</option>
                                <option value="MEDIUM">{t('taskDetails.medium')}</option>
                                <option value="HIGH">{t('taskDetails.high')}</option>
                            </select>
                        )}
                    </div>

                    {/* Type */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <TagIcon className="w-4 h-4" /> {t('taskDetails.type')}
                        </label>
                        {!isEditing ? (
                            <span className="text-zinc-700 dark:text-zinc-300">
                                {task?.type === 'BUG' ? t('taskDetails.bug') : task?.type === 'FEATURE' ? t('taskDetails.feature') : task?.type === 'IMPROVEMENT' ? t('taskDetails.improvement') : task?.type === 'OTHER' ? t('taskDetails.other') : t('taskDetails.task')}
                            </span>
                        ) : (
                            <select
                                value={editedTask.type}
                                onChange={(e) => setEditedTask({ ...editedTask, type: e.target.value })}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-2 outline-none"
                            >
                                <option value="TASK">{t('taskDetails.task')}</option>
                                <option value="BUG">{t('taskDetails.bug')}</option>
                                <option value="FEATURE">{t('taskDetails.feature')}</option>
                                <option value="IMPROVEMENT">{t('taskDetails.improvement')}</option>
                                <option value="OTHER">{t('taskDetails.other')}</option>
                            </select>
                        )}
                    </div>

                    {/* Assignee */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <UserIcon className="w-4 h-4" /> {t('taskDetails.assignee')}
                        </label>
                        {task?.assigneeId ? (
                            <div className="flex items-center gap-2">
                                <img 
                                    src={task.assigneeId?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(assigneeName || task.assigneeId?.name || 'User')}&background=64748B&color=fff&size=40`} 
                                    alt={assigneeName || task.assigneeId?.name || 'User'}
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((assigneeName || 'U').charAt(0))}&background=64748B&color=fff&size=40`;
                                    }}
                                />
                                <div>
                                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                                        {assigneeName || task.assigneeId?.name || 'Loading...'}
                                    </p>
                                    {task.assigneeId?.email && (
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{task.assigneeId.email}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                <UserIcon className="w-8 h-8" />
                                <span>{t('taskDetails.unassigned')}</span>
                            </div>
                        )}
                    </div>

                    {/* Due Date */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" /> {t('taskDetails.dueDate')}
                        </label>
                        {!isEditing ? (
                            <span className="text-zinc-700 dark:text-zinc-300">
                                {task?.due_date ? format(new Date(task.due_date), 'dd/MM/yyyy') : t('taskDetails.notSet')}
                            </span>
                        ) : (
                            <input
                                type="date"
                                value={editedTask.due_date}
                                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-2 outline-none"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <XCircleIcon className="w-5 h-5 text-red-500" />
                            Từ chối công việc
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Lý do từ chối <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Nhập lý do từ chối công việc..."
                                className="w-full h-32 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 outline-none focus:border-blue-500 resize-none"
                            />
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                Lý do từ chối sẽ được gửi cho người được giao việc
                            </p>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                            >
                                <ThumbsDownIcon className="w-4 h-4" />
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
