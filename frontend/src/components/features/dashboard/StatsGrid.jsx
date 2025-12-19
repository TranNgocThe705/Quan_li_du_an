    import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function StatsGrid() {
    const { t } = useTranslation();
    const projects = useSelector((state) => state?.project?.projects || []);
    const myTasks = useSelector((state) => state?.task?.myTasks || []);

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        myTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueIssues: 0,
    });

    useEffect(() => {
        if (projects && myTasks) {
            const now = new Date();
            
            // Calculate project stats
            const totalProjects = projects.length;
            const activeProjects = projects.filter(
                (p) => p.status === "ACTIVE" || p.status === "IN_PROGRESS"
            ).length;
            const completedProjects = projects.filter(
                (p) => p.status === "COMPLETED"
            ).length;

            // Calculate task stats
            const totalMyTasks = myTasks.length;
            const completedTasks = myTasks.filter(
                (t) => t.status === "DONE"
            ).length;
            const inProgressTasks = myTasks.filter(
                (t) => t.status === "IN_PROGRESS"
            ).length;
            const overdueTasks = myTasks.filter((t) => {
                if (!t.due_date || t.status === "DONE") return false;
                return new Date(t.due_date) < now;
            }).length;

            setStats({
                totalProjects,
                activeProjects,
                completedProjects,
                myTasks: totalMyTasks,
                completedTasks,
                inProgressTasks,
                overdueIssues: overdueTasks,
            });
        }
    }, [projects, myTasks]);

    const statCards = [
        {
            icon: FolderOpen,
            title: t('dashboard.totalProjects'),
            value: stats.totalProjects,
            subtitle: `${stats.activeProjects} ${t('dashboard.activeProjects').toLowerCase()}`,
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            icon: CheckCircle,
            title: t('dashboard.completedProjects'),
            value: stats.completedProjects,
            subtitle: t('statsGrid.outOf', { total: stats.totalProjects }),
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-500",
        },
        {
            icon: Users,
            title: t('dashboard.myTasks'),
            value: stats.myTasks,
            subtitle: `${stats.completedTasks} ${t('dashboard.completedTasks').toLowerCase()}, ${stats.inProgressTasks} ${t('dashboard.inProgressTasks').toLowerCase()}`,
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
        {
            icon: AlertTriangle,
            title: t('dashboard.overdue'),
            value: stats.overdueIssues,
            subtitle: t('statsGrid.needsAttention'),
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
            {statCards.map((card, i) => {
                const IconComponent = card.icon;
                return (
                    <div key={i} className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 rounded-md" >
                        <div className="p-6 py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                                        {card.value}
                                    </p>
                                    {card.subtitle && (
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                            {card.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl ${card.bgColor} bg-opacity-20`}>
                                    <IconComponent size={20} className={card.textColor} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
