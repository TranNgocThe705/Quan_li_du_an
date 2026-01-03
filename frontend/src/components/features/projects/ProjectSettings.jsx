import { format } from "date-fns";
import { Plus, Save, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AddProjectMember from "./AddProjectMember";

export default function ProjectSettings({ project }) {
    const { t } = useTranslation();
    const { user } = useSelector(state => state.auth);

    // Check if current user is the team lead (project creator)
    const isTeamLead = user?._id === project?.team_lead?._id || user?._id === project?.team_lead;
    const canEdit = isTeamLead;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        progress: 0,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                status: project.status || "PLANNING",
                priority: project.priority || "MEDIUM",
                start_date: project.start_date || "",
                end_date: project.end_date || "",
                progress: project.progress || 0,
            });
        }
    }, [project]);

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

    const cardClasses = "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Access denied message */}
            {!canEdit && (
                <div className="lg:col-span-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                            {t('projectSettings.viewOnlyMode') || 'Chế độ chỉ xem'}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                            {t('projectSettings.onlyTeamLeadCanEdit') || 'Chỉ người tạo dự án mới có thể chỉnh sửa cài đặt và thêm thành viên'}
                        </p>
                    </div>
                </div>
            )}

            {/* Project Details */}
            <div className={cardClasses}>
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">{t('projectSettings.projectDetails')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className={labelClasses}>{t('projectSettings.projectName')}</label>
                        <input 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            className={inputClasses} 
                            disabled={!canEdit}
                            required 
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className={labelClasses}>{t('projectSettings.description')}</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                            className={inputClasses + " h-24"}
                            disabled={!canEdit}
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>{t('projectSettings.status')}</label>
                            <select 
                                value={formData.status} 
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                                className={inputClasses}
                                disabled={!canEdit}
                            >
                                <option value="PLANNING">{t('projectSettings.planning')}</option>
                                <option value="ACTIVE">{t('projectSettings.active')}</option>
                                <option value="ON_HOLD">{t('projectSettings.onHold')}</option>
                                <option value="COMPLETED">{t('projectSettings.completed')}</option>
                                <option value="CANCELLED">{t('projectSettings.cancelled')}</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>{t('projectSettings.priority')}</label>
                            <select 
                                value={formData.priority} 
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })} 
                                className={inputClasses}
                                disabled={!canEdit}
                            >
                                <option value="LOW">{t('projectSettings.low')}</option>
                                <option value="MEDIUM">{t('projectSettings.medium')}</option>
                                <option value="HIGH">{t('projectSettings.high')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>{t('projectSettings.startDate')}</label>
                            <input 
                                type="date" 
                                value={formData.start_date ? format(new Date(formData.start_date), "yyyy-MM-dd") : ""} 
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                                className={inputClasses}
                                disabled={!canEdit}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClasses}>{t('projectSettings.endDate')}</label>
                            <input 
                                type="date" 
                                value={formData.end_date ? format(new Date(formData.end_date), "yyyy-MM-dd") : ""} 
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                                className={inputClasses}
                                disabled={!canEdit}
                            />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <label className={labelClasses}>{t('projectSettings.progress')}: {formData.progress}%</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5" 
                            value={formData.progress} 
                            onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} 
                            className="w-full accent-blue-500 dark:accent-blue-400"
                            disabled={!canEdit}
                        />
                    </div>

                    {/* Save Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !canEdit} 
                        className="ml-auto flex items-center text-sm justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" 
                    >
                        <Save className="size-4" /> {isSubmitting ? t('projectSettings.saving') : t('projectSettings.saveChanges')}
                    </button>
                </form>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
                            {t('projectSettings.teamMembers')} <span className="text-sm text-zinc-600 dark:text-zinc-400">({project?.members?.length || 0})</span>
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => setIsDialogOpen(true)} 
                            disabled={!canEdit}
                            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                        >
                            <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
                        </button>
                        <AddProjectMember isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>

                    {/* Member List */}
                    {project?.members && project.members.length > 0 ? (
                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                            {project.members.map((member, index) => (
                                <div key={index} className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-300" >
                                    <span> {member?.userId?.email || member?.user?.email || t('projectSettings.unknown')} </span>
                                    {project.team_lead === member?.userId?._id && <span className="px-2 py-0.5 rounded-xs ring ring-zinc-200 dark:ring-zinc-600">{t('projectSettings.teamLead')}</span>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-sm text-gray-500 dark:text-zinc-500">
                            {t('projectSettings.noMembers') || 'Chưa có thành viên nào'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
