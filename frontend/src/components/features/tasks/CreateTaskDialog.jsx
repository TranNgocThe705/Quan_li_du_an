import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { createTask, fetchTasks } from "../../../features/taskSlice";
import toast from "react-hot-toast";
import { suggestAssignee, predictDeadline } from "../../../services/aiService";

export default function CreateTaskDialog({ showCreateTask, setShowCreateTask, projectId }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const currentProject = useSelector((state) => state.project.currentProject);
    const currentWorkspace = useSelector((state) => state.workspace.currentWorkspace);
    const teamMembers = currentProject?.members || [];

    // Debug projectId
    useEffect(() => {
        console.log('📝 CreateTaskDialog projectId:', projectId, typeof projectId);
        if (!projectId) {
            console.error('❌ projectId is missing!');
        }
    }, [projectId]);

    // Kiểm tra role của user hiện tại
    const userWorkspaceMember = currentWorkspace?.members?.find(m => m.userId?._id === user?._id);
    const userProjectMember = currentProject?.members?.find(m => m.userId?._id === user?._id);
    
    // User có thể assign cho người khác nếu:
    // - Là LEAD trong project (role LEAD trong ProjectMember)
    // - Hoặc là ADMIN trong workspace (role ADMIN trong WorkspaceMember)
    // - Hoặc là team_lead của project
    // - Hoặc là System Admin
    const isProjectLead = userProjectMember?.role === 'LEAD';
    const isWorkspaceAdmin = userWorkspaceMember?.role === 'ADMIN';
    const isTeamLeadOfProject = currentProject?.team_lead?._id === user?._id;
    const canAssignToOthers = isProjectLead || isWorkspaceAdmin || isTeamLeadOfProject || user?.isSystemAdmin;
    
    console.log('🔐 Permission check:', {
        userId: user?._id,
        userEmail: user?.email,
        isProjectLead,
        isWorkspaceAdmin,
        isTeamLeadOfProject,
        canAssignToOthers,
        projectMemberRole: userProjectMember?.role,
        workspaceMemberRole: userWorkspaceMember?.role,
        teamMembers: teamMembers?.length
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        assigneeId: canAssignToOthers ? "" : user?._id, // Nếu không có quyền thì tự assign
        due_date: "",
    });

    // Xử lý AI suggest assignee
    const handleAISuggest = async () => {
        if (!formData.title) {
            toast.error('Vui lòng nhập tiêu đề task trước');
            return;
        }

        // Validate projectId là string hợp lệ
        if (!projectId || typeof projectId !== 'string') {
            toast.error('Project ID không hợp lệ');
            console.error('Invalid projectId:', projectId);
            return;
        }

        setIsLoadingAI(true);
        try {
            const result = await suggestAssignee(projectId, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.due_date
            });

            if (result.success && result.data?.recommendations?.length > 0) {
                const topRecommendation = result.data.recommendations[0];
                setAiSuggestions(result.data);
                setFormData({ ...formData, assigneeId: topRecommendation.userId });
                toast.success(`AI đề xuất: ${topRecommendation.name} (${topRecommendation.score}% phù hợp)\n${topRecommendation.reason}`);
            } else {
                toast.error('AI không thể đưa ra gợi ý');
            }
        } catch (error) {
            toast.error('Lỗi khi gọi AI: ' + (error.message || 'Unknown error'));
        } finally {
            setIsLoadingAI(false);
        }
    };

    // Xử lý AI predict deadline
    const handlePredictDeadline = async () => {
        if (!formData.title) {
            toast.error('Vui lòng nhập tiêu đề task trước');
            return;
        }

        // Validate projectId là string hợp lệ
        if (!projectId || typeof projectId !== 'string') {
            toast.error('Project ID không hợp lệ');
            console.error('Invalid projectId:', projectId);
            return;
        }

        setIsLoadingAI(true);
        try {
            const result = await predictDeadline(projectId, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority
            });

            if (result.success && result.data?.estimatedDays) {
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + result.data.estimatedDays);
                setFormData({ ...formData, due_date: deadline.toISOString().split('T')[0] });
                toast.success(`AI dự đoán: ${result.data.estimatedDays} ngày\n${result.data.reasoning}`);
            } else {
                toast.error('AI không thể dự đoán deadline');
            }
        } catch (error) {
            toast.error('Lỗi khi gọi AI: ' + (error.message || 'Unknown error'));
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Xác định người nhận cuối cùng
            // Nếu không có quyền assign hoặc không chọn ai, assign cho chính mình
            let finalAssigneeId = formData.assigneeId;
            
            // Nếu không có assignee hoặc là empty string, assign cho creator
            if (!finalAssigneeId || finalAssigneeId === '') {
                finalAssigneeId = user?._id;
                console.log('⚠️ No assignee selected, auto-assigning to creator:', user?.name);
            }

            const taskData = {
                ...formData,
                projectId: projectId,
                assigneeId: finalAssigneeId, // Luôn có assigneeId
            };

            console.log('📤 Sending task data:', taskData);
            console.log('👤 Final assignee ID:', finalAssigneeId);

            const createdTask = await dispatch(createTask(taskData)).unwrap();
            
            console.log('✅ Task created:', createdTask);
            console.log('👤 Created task assignee:', createdTask?.assigneeId);
            console.log('🔄 Fetching tasks for projectId:', projectId, typeof projectId);

            toast.success('Tạo task thành công!');
            
            // Refresh tasks list - ensure projectId is string
            await dispatch(fetchTasks({ projectId: projectId?.toString() || projectId })).unwrap();
            
            // Reset form and close dialog
            setFormData({
                title: "",
                description: "",
                type: "TASK",
                status: "TODO",
                priority: "MEDIUM",
                assigneeId: canAssignToOthers ? "" : user?._id,
                due_date: "",
            });
            setAiSuggestions(null);
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
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    Người Nhận
                                    {!canAssignToOthers && (
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">(Chỉ assign cho bản thân)</span>
                                    )}
                                </label>
                                {canAssignToOthers && (
                                    <button
                                        type="button"
                                        onClick={handleAISuggest}
                                        disabled={isLoadingAI || !formData.title}
                                        className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="AI sẽ gợi ý người phù hợp nhất"
                                    >
                                        <Sparkles className="size-3" />
                                        {isLoadingAI ? 'AI đang suy nghĩ...' : 'AI Gợi Ý'}
                                    </button>
                                )}
                            </div>
                            <select 
                                value={formData.assigneeId} 
                                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })} 
                                className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"
                                disabled={!canAssignToOthers}
                            >
                                {canAssignToOthers ? (
                                    <>
                                        <option value="">(Bạn) {user?.name || user?.email} - Mặc định</option>
                                        {teamMembers
                                            .filter(member => member?.userId?._id !== user?._id)
                                            .map((member) => (
                                                <option key={member?.userId?._id} value={member?.userId?._id}>
                                                    {member?.userId?.name || member?.userId?.email}
                                                </option>
                                            ))}
                                    </>
                                ) : (
                                    <option value={user?._id}>
                                        {user?.name || user?.email} (Bạn)
                                    </option>
                                )}
                            </select>
                            {canAssignToOthers && !formData.assigneeId && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    💡 Task sẽ được tự động giao cho bạn
                                </p>
                            )}
                            {aiSuggestions && (
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                    ✨ {aiSuggestions.analysis}
                                </p>
                            )}
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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Hạn Chót</label>
                            <button
                                type="button"
                                onClick={handlePredictDeadline}
                                disabled={isLoadingAI || !formData.title}
                                className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="AI sẽ dự đoán thời gian hoàn thành"
                            >
                                <Sparkles className="size-3" />
                                {isLoadingAI ? 'AI đang dự đoán...' : 'AI Dự Đoán'}
                            </button>
                        </div>
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
