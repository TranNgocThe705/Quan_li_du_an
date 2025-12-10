import { Shield, Info, Lock, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import RoleBadge from "./RoleBadge";

/**
 * PermissionInfo Component - Shows current user's permissions in workspace/project
 * @param {Object} permissions - User permissions object from usePermissions hook
 * @param {string} type - Context type (workspace or project)
 */
const PermissionInfo = ({ permissions, type = "workspace" }) => {
    const { t } = useTranslation();

    if (!permissions) return null;

    const { role, isOwner, hasAccess, permissionsList = [] } = permissions;

    if (!hasAccess) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Lock className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                            {t('permission.noAccess')}
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            {t('permission.noAccessDesc')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <Shield className="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                            {t('permission.yourRole')}:
                        </h3>
                        <RoleBadge role={role} isOwner={isOwner} type={type} size="sm" />
                    </div>
                    
                    {permissionsList.length > 0 && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1">
                                <Info className="size-3.5" />
                                {t('permission.viewPermissions')}
                            </summary>
                            <div className="mt-2 space-y-1 pl-1">
                                {permissionsList.map((perm, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                                        <CheckCircle className="size-3.5" />
                                        <span>{t(`permission.perms.${perm}`) || perm.replace(/_/g, ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </details>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * PermissionGuard Component - Wraps content and shows/hides based on permissions
 * @param {Array<string>} requiredPermissions - Array of required permission names
 * @param {Object} permissions - User permissions object
 * @param {ReactNode} children - Content to render if user has permission
 * @param {ReactNode} fallback - Content to render if user lacks permission
 * @param {boolean} showMessage - Whether to show "no permission" message
 */
export const PermissionGuard = ({ 
    requiredPermissions = [], 
    permissions = {}, 
    children, 
    fallback = null,
    showMessage = false 
}) => {
    const { t } = useTranslation();
    const { permissionsList = [] } = permissions;

    const hasPermission = requiredPermissions.every(perm => 
        permissionsList.includes(perm)
    );

    if (!hasPermission) {
        if (showMessage) {
            return (
                <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <XCircle className="size-4" />
                        <span>{t('permission.insufficientPermissions')}</span>
                    </div>
                </div>
            );
        }
        return fallback;
    }

    return <>{children}</>;
};

export default PermissionInfo;
