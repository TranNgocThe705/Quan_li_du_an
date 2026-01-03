import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadTheme } from '../features/themeSlice'
import { fetchWorkspaces } from '../features/workspaceSlice'
import { initializeSocket } from '../services/socket'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const dispatch = useDispatch()

    // Initial load of theme and workspaces
    useEffect(() => {
        dispatch(loadTheme())
        dispatch(fetchWorkspaces())
        
        // Initialize Socket.IO for real-time features
        const token = localStorage.getItem('token')
        if (token) {
            initializeSocket(token)
        }
    }, [dispatch])

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
