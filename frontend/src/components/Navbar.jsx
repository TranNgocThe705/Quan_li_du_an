import { SearchIcon, PanelLeft, LogOut, MoonIcon, SunIcon, User, Settings, ChevronDown, Languages, FolderIcon, CheckSquare, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { toggleTheme } from '../features/themeSlice'
import { logout } from '../features/authSlice'
import NotificationBell from './NotificationBell'

const Navbar = ({ setIsSidebarOpen }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme } = useSelector(state => state.theme);
    const { user } = useSelector(state => state.auth);
    const { projects } = useSelector(state => state.project);
    const { tasks } = useSelector(state => state.task);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

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

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = [];

        // Search projects
        if (projects && projects.length > 0) {
            const matchedProjects = projects
                .filter(project => 
                    project.name.toLowerCase().includes(query) ||
                    project.description?.toLowerCase().includes(query)
                )
                .slice(0, 3)
                .map(project => ({
                    type: 'project',
                    id: project._id,
                    name: project.name,
                    description: project.description,
                    icon: FolderIcon
                }));
            results.push(...matchedProjects);
        }

        // Search tasks
        if (tasks && tasks.length > 0) {
            const matchedTasks = tasks
                .filter(task => 
                    task.title.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query)
                )
                .slice(0, 3)
                .map(task => ({
                    type: 'task',
                    id: task._id,
                    name: task.title,
                    description: task.description,
                    icon: CheckSquare,
                    projectId: task.projectId
                }));
            results.push(...matchedTasks);
        }

        setSearchResults(results);
        setShowSearchResults(results.length > 0);
    }, [searchQuery, projects, tasks]);

    // Close dropdown and search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchResultClick = (result) => {
        if (result.type === 'project') {
            navigate(`/projectsDetail?id=${result.id}&tab=overview`);
        } else if (result.type === 'task') {
            navigate(`/taskDetails?id=${result.id}`);
        }
        setSearchQuery('');
        setShowSearchResults(false);
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input with Autocomplete */}
                    <div className="relative flex-1 max-w-sm" ref={searchRef}>
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5 z-10" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                            placeholder={t('nav.search')}
                            className="pl-8 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        
                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                {searchResults.map((result, index) => {
                                    const Icon = result.icon;
                                    return (
                                        <button
                                            key={`${result.type}-${result.id}-${index}`}
                                            onClick={() => handleSearchResultClick(result)}
                                            className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors border-b border-gray-100 dark:border-zinc-700 last:border-0"
                                        >
                                            <Icon className="size-4 text-gray-400 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {result.name}
                                                    </span>
                                                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 rounded capitalize">
                                                        {result.type}
                                                    </span>
                                                </div>
                                                {result.description && (
                                                    <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-1">
                                                        {result.description}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                                {searchResults.length === 0 && (
                                    <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-zinc-400">
                                        Không tìm thấy kết quả nào
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* Notification Bell */}
                    <NotificationBell />

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
                                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10B981&color=fff&size=40`} 
                                alt="User Avatar" 
                                className="size-8 rounded-full border-2 border-gray-200 dark:border-zinc-700"
                                onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=U&background=10B981&color=fff&size=40'} 
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
