import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { User, Mail, Calendar, Shield, Save } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { userAPI } from '../../api/index.js';
import { updateUser } from '../../features/authSlice';

const Profile = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        image: user?.image || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userAPI.updateProfile(formData);
            
            // Cập nhật Redux store với user mới
            if (response.data?.data) {
                dispatch(updateUser(response.data.data));
            }
            
            toast.success(t('profile.updateSuccess'));
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || t('profile.updateError'));
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            image: user?.image || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                    {t('profile.title')}
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">
                    {t('profile.subtitle')}
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0D8ABC&color=fff&size=128`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-zinc-700 object-cover"
                            onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff&size=128'}
                        />
                        {isEditing && (
                            <button
                                type="button"
                                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
                            >
                                {t('profile.changePhoto')}
                            </button>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    <User size={16} />
                                    {t('profile.fullName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-zinc-900 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    <Mail size={16} />
                                    {t('profile.email')}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-zinc-900 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    <Shield size={16} />
                                    {t('profile.role')}
                                </label>
                                <input
                                    type="text"
                                    value={user?.role || 'User'}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Member Since */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                    <Calendar size={16} />
                                    {t('profile.memberSince')}
                                </label>
                                <input
                                    type="text"
                                    value={user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        {t('profile.editProfile')}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                                        >
                                            <Save size={16} />
                                            {t('profile.saveChanges')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition"
                                        >
                                            {t('profile.cancel')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    ℹ️ {t('profile.infoMessage')}
                </p>
            </div>
        </div>
    );
};

export default Profile;
