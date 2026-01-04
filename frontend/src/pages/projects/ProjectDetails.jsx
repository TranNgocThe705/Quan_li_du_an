import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, SettingsIcon, BarChart3Icon, CalendarIcon, FileStackIcon, ZapIcon, Sparkles, Kanban, LockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ProjectAnalytics from "../../components/features/projects/ProjectAnalytics";
import ProjectSettings from "../../components/features/projects/ProjectSettings";
import CreateTaskDialog from "../../components/features/tasks/CreateTaskDialog";
import ProjectCalendar from "../../components/features/projects/ProjectCalendar";
import ProjectTasks from "../../components/features/projects/ProjectTasks";
import SprintPlanningBoard from "../../components/features/projects/SprintPlanningBoard";
import AIProjectInsights from "../../components/features/ai/AIProjectInsights";
import { fetchProjectById } from "../../features/projectSlice";
import { fetchTasks } from "../../features/taskSlice";

export default function ProjectDetail() {

    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const id = searchParams.get('id');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { currentProject: project, loading } = useSelector(state => state.project);
    const { tasks } = useSelector(state => state.task);
    const { user } = useSelector(state => state.auth);

    const [showCreateTask, setShowCreateTask] = useState(false);
    const [activeTab, setActiveTab] = useState(tab || "tasks");

    // Check if current user is project team lead (creator/owner)
    const isProjectCreator = project && user && (project.team_lead?._id === user._id || project.team_lead === user._id);

    useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    useEffect(() => {
        if (id) {
            console.log('🔍 ProjectDetails ID from URL:', id, typeof id);
            
            // Validate ID is string
            if (typeof id !== 'string' || id === '[object Object]') {
                console.error('❌ Invalid project ID:', id);
                toast.error('Project ID không hợp lệ');
                navigate('/projects');
                return;
            }
            
            dispatch(fetchProjectById(id));
            dispatch(fetchTasks({ projectId: id }));
        }
    }, [dispatch, id, navigate]);

    const statusColors = {
        PLANNING: "bg-zinc-200 text-zinc-900 dark:bg-zinc-600 dark:text-zinc-200",
        ACTIVE: "bg-emerald-200 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-900",
        ON_HOLD: "bg-amber-200 text-amber-900 dark:bg-amber-500 dark:text-amber-900",
        COMPLETED: "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-blue-900",
        CANCELLED: "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-900",
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-40"></div>
                <p className="mt-4">{t('projectDetail.loading')}</p>
            </div>
        );
    }

    // Not found
    if (!project && !loading) {
        return (
            <div className="p-6 text-center text-zinc-900 dark:text-zinc-200">
                <p className="text-3xl md:text-5xl mt-40 mb-10">{t('projectDetail.notFound')}</p>
                <button onClick={() => navigate('/projects')} className="mt-4 px-4 py-2 rounded bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600" >
                    {t('projectDetail.backToProjects')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-6xl mx-auto text-zinc-900 dark:text-white">
            {/* Header */}
            <div className="flex max-md:flex-col gap-4 flex-wrap items-start justify-between max-w-6xl">
                <div className="flex items-center gap-4">
                    <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400" onClick={() => navigate('/projects')}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-medium">{project.name}</h1>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${statusColors[project.status]}`} >
                            {project.status.replace("_", " ")}
                        </span>
                    </div>
                </div>
                <button onClick={() => setShowCreateTask(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white" >
                    <PlusIcon className="size-4" />
                    {t('projectDetail.createNewTask')}
                </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-6">
                {[
                    { label: t('projectDetail.totalTasks'), value: tasks.length, color: "text-zinc-900 dark:text-white" },
                    { label: t('projectDetail.completed'), value: tasks.filter((t) => t.status === "DONE").length, color: "text-emerald-700 dark:text-emerald-400" },
                    { label: t('projectDetail.inProgress'), value: tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length, color: "text-amber-700 dark:text-amber-400" },
                    { label: t('projectDetail.members'), value: project.members?.length || 0, color: "text-blue-700 dark:text-blue-400" },
                ].map((card, idx) => (
                    <div key={idx} className=" dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex justify-between sm:min-w-60 p-4 py-2.5 rounded">
                        <div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">{card.label}</div>
                            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        </div>
                        <ZapIcon className={`size-4 ${card.color}`} />
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div>
                <div className="inline-flex flex-wrap max-sm:grid grid-cols-3 gap-2 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                    {[
                        { key: "tasks", label: t('projectDetail.tasks'), icon: FileStackIcon },
                        { key: "sprint-board", label: t('projectDetail.sprintBoard') || "Sprint Board", icon: Kanban },
                        { key: "calendar", label: t('projectDetail.calendar'), icon: CalendarIcon },
                        { key: "analytics", label: t('projectDetail.analytics'), icon: BarChart3Icon },
                        ...(isProjectCreator ? [{ key: "ai-insights", label: "AI Insights", icon: Sparkles }] : []),
                        { key: "settings", label: t('projectDetail.settings'), icon: SettingsIcon },
                    ].map((tabItem) => (
                        <button 
                            key={tabItem.key} 
                            onClick={() => { setActiveTab(tabItem.key); setSearchParams({ id: id, tab: tabItem.key }) }} 
                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${activeTab === tabItem.key ? "bg-zinc-100 dark:bg-zinc-800/80" : "hover:bg-zinc-50 dark:hover:bg-zinc-700"}`} 
                        >
                            <tabItem.icon className="size-3.5" />
                            {tabItem.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {activeTab === "tasks" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectTasks tasks={tasks} />
                        </div>
                    )}
                    {activeTab === "sprint-board" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <SprintPlanningBoard tasks={tasks} />
                        </div>
                    )}
                    {activeTab === "analytics" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectAnalytics tasks={tasks} project={project} />
                        </div>
                    )}
                    {activeTab === "ai-insights" && (
                        isProjectCreator ? (
                            <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                                <AIProjectInsights projectId={id} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center max-w-md">
                                    <LockIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                                        Không có quyền truy cập
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        Chỉ người tạo dự án mới có thể sử dụng chức năng AI Insights. Vui lòng liên hệ với chủ dự án để được cấp quyền.
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                    {activeTab === "calendar" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectCalendar tasks={tasks} />
                        </div>
                    )}
                    {activeTab === "settings" && (
                        <div className=" dark:bg-zinc-900/40 rounded max-w-6xl">
                            <ProjectSettings project={project} />
                        </div>
                    )}
                </div>
            </div>

            {/* Create Task Modal */}
            {showCreateTask && <CreateTaskDialog showCreateTask={showCreateTask} setShowCreateTask={setShowCreateTask} projectId={id} />}
        </div>
    );
}
