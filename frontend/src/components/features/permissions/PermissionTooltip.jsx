import { Info, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * PermissionTooltip Component - Shows why a button/action is disabled
 * @param {boolean} hasPermission - Whether user has permission
 * @param {string} reason - Reason key for translation
 * @param {ReactNode} children - Button or action element
 * @param {string} position - Tooltip position (top, bottom, left, right)
 */
const PermissionTooltip = ({ 
    hasPermission = true, 
    reason = "no_permission", 
    children, 
    position = "top" 
}) => {
    const { t } = useTranslation();

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2"
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900",
        bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900",
        left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-zinc-900",
        right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-zinc-900"
    };

    if (hasPermission) {
        return <>{children}</>;
    }

    return (
        <div className="group relative inline-flex">
            {children}
            <div className={`absolute ${positionClasses[position]} hidden group-hover:block z-50 pointer-events-none`}>
                <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                    <div className="flex items-center gap-2">
                        <Lock className="size-3.5 text-amber-400" />
                        <span>{t(`permission.reasons.${reason}`)}</span>
                    </div>
                    <div className={`absolute ${arrowClasses[position]}`}></div>
                </div>
            </div>
        </div>
    );
};

/**
 * DisabledButton Component - Button with permission tooltip
 */
export const DisabledButton = ({ 
    hasPermission = true, 
    reason = "no_permission",
    onClick,
    children,
    className = "",
    ...props 
}) => {
    return (
        <PermissionTooltip hasPermission={hasPermission} reason={reason}>
            <button
                onClick={hasPermission ? onClick : undefined}
                disabled={!hasPermission}
                className={`${className} ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}`}
                {...props}
            >
                {children}
            </button>
        </PermissionTooltip>
    );
};

/**
 * PermissionBadge Component - Small info badge showing permission requirement
 */
export const PermissionBadge = ({ requiredRole = "ADMIN" }) => {
    const { t } = useTranslation();

    const roleColors = {
        OWNER: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700",
        ADMIN: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700",
        LEAD: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700",
        MEMBER: "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700"
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${roleColors[requiredRole] || roleColors.MEMBER}`}>
            <Info className="size-3" />
            {t('permission.requiresRole')}: {t(`role.${requiredRole.toLowerCase()}`)}
        </span>
    );
};

export default PermissionTooltip;
