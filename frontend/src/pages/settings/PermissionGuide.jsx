import { Shield, Crown, Users, Briefcase, Eye, Info, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import RoleBadge from "../../components/features/permissions/RoleBadge";

const PermissionGuide = () => {
    const { t } = useTranslation();

    const workspaceRoles = [
        {
            role: "OWNER",
            isOwner: true,
            icon: Crown,
            color: "from-amber-500 to-orange-500",
            permissions: [
                { key: "fullControl", allowed: true },
                { key: "deleteWorkspace", allowed: true },
                { key: "manageAllMembers", allowed: true },
                { key: "manageAllProjects", allowed: true },
                { key: "changeSettings", allowed: true }
            ]
        },
        {
            role: "ADMIN",
            icon: Shield,
            color: "from-purple-500 to-purple-600",
            permissions: [
                { key: "inviteMembers", allowed: true },
                { key: "removeMembers", allowed: true },
                { key: "manageProjects", allowed: true },
                { key: "updateWorkspace", allowed: true },
                { key: "deleteWorkspace", allowed: false }
            ]
        },
        {
            role: "MEMBER",
            icon: Users,
            color: "from-gray-400 to-gray-500",
            permissions: [
                { key: "viewWorkspace", allowed: true },
                { key: "joinProjects", allowed: true },
                { key: "createProjects", allowed: true },
                { key: "inviteMembers", allowed: false },
                { key: "manageWorkspace", allowed: false }
            ]
        }
    ];

    const projectRoles = [
        {
            role: "LEAD",
            icon: Shield,
            color: "from-blue-500 to-blue-600",
            permissions: [
                { key: "manageProject", allowed: true },
                { key: "addRemoveMembers", allowed: true },
                { key: "manageAllTasks", allowed: true },
                { key: "deleteProject", allowed: true },
                { key: "updateSettings", allowed: true }
            ]
        },
        {
            role: "MEMBER",
            icon: Users,
            color: "from-gray-400 to-gray-500",
            permissions: [
                { key: "viewProject", allowed: true },
                { key: "createTasks", allowed: true },
                { key: "updateOwnTasks", allowed: true },
                { key: "manageTasks", allowed: false },
                { key: "addMembers", allowed: false }
            ]
        },
        {
            role: "VIEWER",
            icon: Eye,
            color: "from-gray-300 to-gray-400",
            permissions: [
                { key: "viewProject", allowed: true },
                { key: "viewTasks", allowed: true },
                { key: "createTasks", allowed: false },
                { key: "editTasks", allowed: false },
                { key: "editProject", allowed: false }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <Shield className="size-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {t('permissionGuide.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        {t('permissionGuide.description')}
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <Info className="size-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                {t('permissionGuide.infoTitle')}
                            </h3>
                            <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
                                {t('permissionGuide.infoDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Workspace Roles */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="size-6 text-gray-700 dark:text-gray-300" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('permissionGuide.workspaceRoles')}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {workspaceRoles.map((roleData, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <RoleBadge 
                                        role={roleData.role} 
                                        isOwner={roleData.isOwner}
                                        type="workspace"
                                        size="md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {roleData.permissions.map((perm, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            {perm.allowed ? (
                                                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="size-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                                            )}
                                            <span className={perm.allowed ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>
                                                {t(`permissionGuide.workspace.${perm.key}`)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Roles */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="size-6 text-gray-700 dark:text-gray-300" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('permissionGuide.projectRoles')}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {projectRoles.map((roleData, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <RoleBadge 
                                        role={roleData.role} 
                                        type="project"
                                        size="md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {roleData.permissions.map((perm, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            {perm.allowed ? (
                                                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="size-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                                            )}
                                            <span className={perm.allowed ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>
                                                {t(`permissionGuide.project.${perm.key}`)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Points */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('permissionGuide.keyPoints.title')}
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {t('permissionGuide.keyPoints.point1')}
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {t('permissionGuide.keyPoints.point2')}
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {t('permissionGuide.keyPoints.point3')}
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {t('permissionGuide.keyPoints.point4')}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PermissionGuide;
