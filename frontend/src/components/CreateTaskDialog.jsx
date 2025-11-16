import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { createTask, fetchTasks } from "../features/taskSlice";
import toast from "react-hot-toast";

export default function CreateTaskDialog({ showCreateTask, setShowCreateTask, projectId }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const currentProject = useSelector((state) => state.project.currentProject);
    const teamMembers = currentProject?.members || [];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: "",
        due_date: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await dispatch(createTask({
                ...formData,
                projectId: projectId,
                assigneeId: formData.assigneeId || user?._id, // Default to current user if no assignee
            })).unwrap();

            toast.success('Tạo task thành công!');
            
            // Refresh tasks list
            dispatch(fetchTasks({ projectId }));
            
            // Reset form and close dialog
            setFormData({
                title: "",
                description: "",
                type: "TASK",
                status: "TODO",
                priority: "MEDIUM",
                assigneeId: "",
                due_date: "",
            });
            setShowCreateTask(false);
        } catch (error) {
            toast.error(error || 'Không thể tạo task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return showCreateTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6 text-zinc-900 dark:text-white">
                <h2 className="text-xl font-bold mb-4">Tạo Task Mới</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label htmlFor="title" className="text-sm font-medium">Tiêu Đề</label>
                        <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Tiêu đề task" className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label htmlFor="description" className="text-sm font-medium">Mô Tả</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả task" className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Type & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Loại</label>
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                <option value="TASK">Nhiệm Vụ</option>
                                <option value="BUG">Lỗi</option>
                                <option value="FEATURE">Tính Năng</option>
                                <option value="IMPROVEMENT">Cải Tiến</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Độ Ưu Tiên</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"                             >
                                <option value="LOW">Thấp</option>
                                <option value="MEDIUM">Trung Bình</option>
                                <option value="HIGH">Cao</option>
                            </select>
                        </div>
                    </div>

                    {/* Assignee and Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Người Nhận</label>
                            <select value={formData.assigneeId} onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                <option value="">Chưa phân công</option>
                                {teamMembers.map((member) => (
                                    <option key={member?.userId?._id} value={member?.userId?._id}>
                                        {member?.userId?.name || member?.userId?.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Trạng Thái</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                <option value="TODO">Cần Làm</option>
                                <option value="IN_PROGRESS">Đang Làm</option>
                                <option value="DONE">Hoàn Thành</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Hạn Chót</label>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
                            <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" />
                        </div>
                        {formData.due_date && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {format(new Date(formData.due_date), "PPP")}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowCreateTask(false)} className="rounded border border-zinc-300 dark:border-zinc-700 px-5 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" >
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="rounded px-5 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white dark:text-zinc-200 transition disabled:opacity-50" >
                            {isSubmitting ? "Đang tạo..." : "Tạo Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
}
