import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, Edit2Icon, Trash2Icon, CalendarIcon, UserIcon, TagIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchTaskById, updateTask, deleteTask, fetchComments, createComment, deleteComment } from "../features/taskSlice";
import { getUserById } from "../features/authSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

const statusColors = {
    TODO: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200",
    IN_PROGRESS: "bg-blue-200 text-blue-900 dark:bg-blue-600 dark:text-blue-100",
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
    
    const { currentTask: task, loading, comments } = useSelector(state => state.task);

    const { user } = useSelector(state => state.auth);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [newComment, setNewComment] = useState("");
    const [assigneeName, setAssigneeName] = useState(null);
    


    useEffect(() => {
        if (taskId) {
            dispatch(fetchTaskById(taskId));
            dispatch(fetchComments(taskId));
        }
    }, [dispatch, taskId]);

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

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await dispatch(createComment({
                taskId,
                content: newComment
            })).unwrap();
            setNewComment("");
        } catch (error) {
            toast.error(error || t('taskDetails.commentError'));
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

    if (loading) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-40"></div>
                <p className="mt-4">{t('taskDetails.loading')}</p>
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
                            className="text-2xl font-semibold bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                            >
                                <Edit2Icon className="w-4 h-4" /> {t('taskDetails.edit')}
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                            >
                                <Trash2Icon className="w-4 h-4" /> {t('taskDetails.delete')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleUpdate} 
                                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                            >
                                {t('taskDetails.save')}
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="px-4 py-2 bg-zinc-500 text-white rounded hover:bg-zinc-600"
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
                <div className="md:col-span-2 space-y-6">
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

                    {/* Comments */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">{t('taskDetails.comments')} ({comments?.length || 0})</h2>
                        
                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="mb-6">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-3 outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                placeholder={t('taskDetails.writeComment')}
                            />
                            <button 
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('taskDetails.postComment')}
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments && comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment._id} className="border-l-4 border-blue-500 bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                        <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                    src={comment.userId?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.name || 'User')}&background=random&size=40`} 
                                                    alt={comment.userId?.name}
                                                    className="w-10 h-10 rounded-full"
                                                    />
                                                <div>
                                                    <p className="font-semibold text-sm">{comment.userId?.name}</p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                            {comment.userId?._id === user?._id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">{t('taskDetails.noComments')}</p>
                            )}
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
                                {task?.status === 'TODO' ? t('taskDetails.todo') : task?.status === 'IN_PROGRESS' ? t('taskDetails.inProgress') : t('taskDetails.done')}
                            </span>
                        ) : (
                            <select
                                value={editedTask.status}
                                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-2 outline-none"
                            >
                                <option value="TODO">{t('taskDetails.todo')}</option>
                                <option value="IN_PROGRESS">{t('taskDetails.inProgress')}</option>
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
        </div>
    );
}
