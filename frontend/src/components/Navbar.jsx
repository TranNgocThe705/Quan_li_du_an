import { SearchIcon, PanelLeft, LogOut, MoonIcon, SunIcon, User, Settings, ChevronDown, Languages } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { toggleTheme } from '../features/themeSlice'
import { logout } from '../features/authSlice'

const Navbar = ({ setIsSidebarOpen }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme } = useSelector(state => state.theme);
    const { user } = useSelector(state => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        toast.success(lng === 'vi' ? 'Đã chuyển sang tiếng Việt' : 'Switched to English');
    };

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast.success('Đăng xuất thành công');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            type="text"
                            placeholder={t('nav.search')}
                            className="pl-8 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* Language Toggle */}
                    <div className="relative group">
                        <button className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95">
                            <Languages className="size-4 text-gray-800 dark:text-gray-200" />
                        </button>
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <button
                                onClick={() => changeLanguage('vi')}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${i18n.language === 'vi' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-zinc-300'}`}
                            >
                                🇻🇳 Tiếng Việt
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${i18n.language === 'en' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-zinc-300'}`}
                            >
                                🇬🇧 English
                            </button>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <button onClick={() => dispatch(toggleTheme())} className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95">
                        {
                            theme === "light"
                                ? (<MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />)
                                : (<SunIcon className="size-4 text-yellow-400" />)
                        }
                    </button>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            <img 
                                src={user?.image || 'https://i.pravatar.cc/150?img=1'} 
                                alt="User Avatar" 
                                className="size-8 rounded-full border-2 border-gray-200 dark:border-zinc-700" 
                            />
                            <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                                {user?.name || 'User'}
                            </span>
                            <ChevronDown className={`size-4 text-gray-500 dark:text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg py-1 z-50">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate('/profile');
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <User size={16} />
                                        <span>{t('nav.profile')}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate('/settings');
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <Settings size={16} />
                                        <span>{t('nav.settings')}</span>
                                    </button>

                                    <div className="border-t border-gray-200 dark:border-zinc-700 my-1"></div>

                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>{t('nav.logout')}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
