import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Bell, Lock, Save } from 'lucide-react';
import { toggleTheme } from '../features/themeSlice';
import toast from 'react-hot-toast';

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

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        toast.success(lng === 'vi' ? 'Đã chuyển sang tiếng Việt' : 'Switched to English');
    };

    const handleSaveNotifications = () => {
        // TODO: Implement save notifications API call
        toast.success(t('settings.saveSuccess'));
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
                        onClick={() => dispatch(toggleTheme())}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                            theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400'
                        }`}
                    >
                        <Sun size={20} className="mx-auto mb-2" />
                        <span className="text-sm font-medium">{t('settings.lightMode')}</span>
                    </button>
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                            theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400'
                        }`}
                    >
                        <Moon size={20} className="mx-auto mb-2" />
                        <span className="text-sm font-medium">{t('settings.darkMode')}</span>
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
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition">
                    {t('settings.changePassword')}
                </button>
            </div>
        </div>
    );
};

export default Settings;
