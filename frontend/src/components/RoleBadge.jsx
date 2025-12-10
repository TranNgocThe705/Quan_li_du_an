import { Shield, Crown, User } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * RoleBadge Component - Displays user role with icon and tooltip
 * @param {string} role - User role (ADMIN, MEMBER, LEAD, VIEWER)
 * @param {boolean} isOwner - Whether user is workspace owner
 * @param {string} type - Context type (workspace or project)
 * @param {string} size - Badge size (sm, md, lg)
 */
const RoleBadge = ({ role, isOwner = false, type = "workspace", size = "md" }) => {
    const { t } = useTranslation();

    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5"
    };

    const iconSizes = {
        sm: "size-3",
        md: "size-3.5",
        lg: "size-4"
    };

    // Owner badge (highest priority)
    if (isOwner) {
        return (
            <div className="group relative inline-flex">
                <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm`}>
                    <Crown className={iconSizes[size]} />
                    {t('role.owner')}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                        <div className="font-semibold mb-1">{t('role.ownerTooltip.title')}</div>
                        <div className="text-zinc-300 space-y-0.5">
                            <div>✓ {t('role.ownerTooltip.perm1')}</div>
                            <div>✓ {t('role.ownerTooltip.perm2')}</div>
                            <div>✓ {t('role.ownerTooltip.perm3')}</div>
                            <div>✓ {t('role.ownerTooltip.perm4')}</div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-zinc-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Admin badge
    if (role === 'ADMIN') {
        return (
            <div className="group relative inline-flex">
                <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full font-medium bg-purple-500 dark:bg-purple-600 text-white shadow-sm`}>
                    <Shield className={iconSizes[size]} />
                    {t('role.admin')}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                        <div className="font-semibold mb-1">{t('role.adminTooltip.title')}</div>
                        <div className="text-zinc-300 space-y-0.5">
                            <div>✓ {t('role.adminTooltip.perm1')}</div>
                            <div>✓ {t('role.adminTooltip.perm2')}</div>
                            <div>✓ {t('role.adminTooltip.perm3')}</div>
                            <div>✗ {t('role.adminTooltip.perm4')}</div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-zinc-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Team Lead badge (for projects)
    if (role === 'LEAD' && type === 'project') {
        return (
            <div className="group relative inline-flex">
                <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full font-medium bg-blue-500 dark:bg-blue-600 text-white shadow-sm`}>
                    <Shield className={iconSizes[size]} />
                    {t('role.lead')}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                        <div className="font-semibold mb-1">{t('role.leadTooltip.title')}</div>
                        <div className="text-zinc-300 space-y-0.5">
                            <div>✓ {t('role.leadTooltip.perm1')}</div>
                            <div>✓ {t('role.leadTooltip.perm2')}</div>
                            <div>✓ {t('role.leadTooltip.perm3')}</div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-zinc-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Member badge
    if (role === 'MEMBER') {
        return (
            <div className="group relative inline-flex">
                <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-sm`}>
                    <User className={iconSizes[size]} />
                    {t('role.member')}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                        <div className="font-semibold mb-1">{t('role.memberTooltip.title')}</div>
                        <div className="text-zinc-300 space-y-0.5">
                            <div>✓ {t('role.memberTooltip.perm1')}</div>
                            <div>✓ {t('role.memberTooltip.perm2')}</div>
                            <div>✗ {t('role.memberTooltip.perm3')}</div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-zinc-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Viewer badge (for projects)
    if (role === 'VIEWER' && type === 'project') {
        return (
            <div className="group relative inline-flex">
                <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full font-medium bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-sm`}>
                    <User className={iconSizes[size]} />
                    {t('role.viewer')}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                        <div className="font-semibold mb-1">{t('role.viewerTooltip.title')}</div>
                        <div className="text-zinc-300 space-y-0.5">
                            <div>✓ {t('role.viewerTooltip.perm1')}</div>
                            <div>✗ {t('role.viewerTooltip.perm2')}</div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-zinc-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default RoleBadge;
