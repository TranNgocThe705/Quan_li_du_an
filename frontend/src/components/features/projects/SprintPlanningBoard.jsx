import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { GripVertical, Calendar, User, Flag, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { updateTask } from "../../../features/taskSlice";

const SprintPlanningBoard = ({ tasks }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [draggedTask, setDraggedTask] = useState(null);

    // Group tasks by status
    const tasksByStatus = useMemo(() => {
        return {
            TODO: tasks.filter(task => task.status === 'TODO'),
            IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
            DONE: tasks.filter(task => task.status === 'DONE')
        };
    }, [tasks]);

    const columns = [
        { id: 'TODO', title: t('sprintBoard.todo') || 'Cần làm', headerColor: 'bg-gray-100 dark:bg-zinc-800', badgeColor: 'bg-gray-500' },
        { id: 'IN_PROGRESS', title: t('sprintBoard.inProgress') || 'Đang làm', headerColor: 'bg-blue-100 dark:bg-blue-900/30', badgeColor: 'bg-blue-500' },
        { id: 'DONE', title: t('sprintBoard.done') || 'Hoàn thành', headerColor: 'bg-emerald-100 dark:bg-emerald-900/30', badgeColor: 'bg-emerald-500' }
    ];

    const priorityColors = {
        HIGH: 'text-red-600 dark:text-red-400',
        MEDIUM: 'text-amber-600 dark:text-amber-400',
        LOW: 'text-blue-600 dark:text-blue-400'
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        
        if (!draggedTask || draggedTask.status === newStatus) {
            setDraggedTask(null);
            return;
        }

        try {
            await dispatch(updateTask({
                id: draggedTask._id,
                data: { status: newStatus }
            })).unwrap();
            
            toast.success(t('sprintBoard.taskMoved') || 'Đã cập nhật trạng thái task');
        } catch (error) {
            toast.error(error || t('sprintBoard.moveError') || 'Không thể di chuyển task');
        }
        
        setDraggedTask(null);
    };

    const TaskCard = ({ task }) => {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

        return (
            <div
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                className={`bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 mb-3 cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-gray-300 dark:hover:border-zinc-600 transition-all ${
                    draggedTask?._id === task._id ? 'opacity-50 scale-95' : ''
                }`}
            >
                <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-gray-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 line-clamp-2">
                        {task.title}
                    </h4>
                    <Flag className={`w-3.5 h-3.5 ${priorityColors[task.priority]} flex-shrink-0`} />
                </div>

                {task.description && (
                    <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mb-2 ml-6">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center justify-between ml-6 text-xs">
                    <div className="flex items-center gap-3">
                        {task.assigneeId && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-zinc-400">
                                <User className="w-3 h-3" />
                                <span className="truncate max-w-[80px]">
                                    {task.assigneeId.name}
                                </span>
                            </div>
                        )}
                        {task.dueDate && (
                            <div className={`flex items-center gap-1 ${
                                isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-zinc-400'
                            }`}>
                                {isOverdue && <AlertCircle className="w-3 h-3" />}
                                <Calendar className="w-3 h-3" />
                                <span>{format(new Date(task.dueDate), 'dd/MM')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('sprintBoard.title') || 'Sprint Planning Board'}
                </h2>
                <div className="text-sm text-gray-500 dark:text-zinc-400">
                    {t('sprintBoard.totalTasks', { count: tasks.length })} {tasks.length} tasks
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.map(column => (
                    <div
                        key={column.id}
                        className={`border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 ${
                            draggedTask && draggedTask.status !== column.id 
                                ? 'ring-2 ring-blue-500 ring-opacity-50' 
                                : ''
                        } transition-all duration-200`}
                    >
                        {/* Header */}
                        <div className={`${column.headerColor} px-4 py-3 border-b border-gray-200 dark:border-zinc-700`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${column.badgeColor}`}></span>
                                    {column.title}
                                </h3>
                                <span className="text-xs font-medium text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-2 py-1 rounded-full">
                                    {tasksByStatus[column.id].length}
                                </span>
                            </div>
                        </div>

                        {/* Scrollable content area */}
                        <div 
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                            className="p-4 overflow-y-auto"
                            style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '500px' }}
                        >
                            {tasksByStatus[column.id].length === 0 ? (
                                <div className="text-center py-12 text-gray-400 dark:text-zinc-500 text-sm">
                                    {t('sprintBoard.noTasks') || 'Không có task nào'}
                                </div>
                            ) : (
                                tasksByStatus[column.id].map(task => (
                                    <TaskCard key={task._id} task={task} />
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {draggedTask && (
                <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
                    {t('sprintBoard.dragging') || 'Kéo task để thay đổi trạng thái...'}
                </div>
            )}
        </div>
    );
};

export default SprintPlanningBoard;
