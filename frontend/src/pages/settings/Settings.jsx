import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Bell, Lock, Save, X } from 'lucide-react';
import { setTheme } from '../../features/themeSlice';
import toast from 'react-hot-toast';
import { userAPI } from '../../api/index.js';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        taskUpdates: true,
        projectUpdates: true,
        mentions: true
    });

    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        toast.success(lng === 'vi' ? 'Đã chuyển sang tiếng Việt' : 'Switched to English');
    };

    const handleThemeChange = (newTheme) => {
        if (theme !== newTheme) {
            dispatch(setTheme(newTheme));
            localStorage.setItem('theme', newTheme);
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            toast.success(newTheme === 'dark' ? 'Đã chuyển sang chế độ tối' : 'Đã chuyển sang chế độ sáng');
        }
    };

    const handleSaveNotifications = () => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        toast.success(t('settings.saveSuccess'));
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            await userAPI.updateProfile({ 
                password: passwordData.newPassword 
            });
            
            toast.success('Đổi mật khẩu thành công!');
            setShowPasswordDialog(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                    {t('settings.title')}
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">
                    {t('settings.subtitle')}
                </p>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    {theme === 'light' ? <Sun size={20} className="text-gray-700 dark:text-zinc-300" /> : <Moon size={20} className="text-gray-700 dark:text-zinc-300" />}
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('settings.appearance')}
                    </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                    {t('settings.appearanceDesc')}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleThemeChange('light')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                            theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600'
                        }`}
                    >
                        <Sun size={20} className="mx-auto mb-2 text-gray-900 dark:text-white" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.lightMode')}</span>
                    </button>
                    <button
                        onClick={() => handleThemeChange('dark')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                            theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600'
                        }`}
                    >
                        <Moon size={20} className="mx-auto mb-2 text-gray-900 dark:text-white" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.darkMode')}</span>
                    </button>
                </div>
            </div>

            {/* Language Settings */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Languages size={20} className="text-gray-700 dark:text-zinc-300" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('settings.language')}
                    </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                    {t('settings.languageDesc')}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                            i18n.language === 'en'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400'
                        }`}
                    >
                        <span className="text-2xl mb-2">🇬🇧</span>
                        <p className="text-sm font-medium">English</p>
                    </button>
                    <button
                        onClick={() => changeLanguage('vi')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                            i18n.language === 'vi'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400'
                        }`}
                    >
                        <span className="text-2xl mb-2">🇻🇳</span>
                        <p className="text-sm font-medium">Tiếng Việt</p>
                    </button>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell size={20} className="text-gray-700 dark:text-zinc-300" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('settings.notifications')}
                    </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                    {t('settings.notificationsDesc')}
                </p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-800">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {t('settings.emailNotifications')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                {t('settings.emailNotificationsDesc')}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-800">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {t('settings.taskUpdates')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                {t('settings.taskUpdatesDesc')}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.taskUpdates}
                                onChange={(e) => setNotifications({ ...notifications, taskUpdates: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-800">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {t('settings.projectUpdates')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                {t('settings.projectUpdatesDesc')}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.projectUpdates}
                                onChange={(e) => setNotifications({ ...notifications, projectUpdates: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {t('settings.mentions')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                {t('settings.mentionsDesc')}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.mentions}
                                onChange={(e) => setNotifications({ ...notifications, mentions: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleSaveNotifications}
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                >
                    <Save size={16} />
                    {t('settings.saveChanges')}
                </button>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lock size={20} className="text-gray-700 dark:text-zinc-300" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('settings.security')}
                    </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                    {t('settings.securityDesc')}
                </p>
                <button 
                    onClick={() => setShowPasswordDialog(true)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition"
                >
                    {t('settings.changePassword')}
                </button>
            </div>

            {/* Change Password Dialog */}
            {showPasswordDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Đổi Mật Khẩu
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPasswordDialog(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-zinc-800">
                            <button
                                onClick={() => {
                                    setShowPasswordDialog(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                            >
                                Đổi Mật Khẩu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
