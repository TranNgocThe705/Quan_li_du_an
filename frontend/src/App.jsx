import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Team from "./pages/team/Team";
import Profile from "./pages/settings/Profile";
import Settings from "./pages/settings/Settings";
import ProjectDetails from "./pages/projects/ProjectDetails";
import TaskDetails from "./pages/tasks/TaskDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GoogleAuthCallback from "./pages/auth/GoogleAuthCallback";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminWorkspacesPage from "./pages/admin/AdminWorkspacesPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";import AdminReportsPage from './pages/admin/AdminReportsPage';import AdminLayout from "./components/admin/AdminLayout";
import PendingApprovalsPage from "./pages/PendingApprovalsPage";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import ProtectedAdminRoute from "./components/guards/ProtectedAdminRoute";
import AIChatWidget from "./components/features/ai/AIChatWidget";
import { getMe } from "./features/authSlice";

const App = () => {
    const dispatch = useDispatch();
    const { token, isAuthenticated, loading } = useSelector(state => state.auth);
    const [initializing, setInitializing] = useState(!!token);

    // Validate token on app load
    useEffect(() => {
        const validateAuth = async () => {
            if (token) {
                // If token exists, validate it by fetching user
                try {
                    await dispatch(getMe()).unwrap();
                } catch (error) {
                    // Token is invalid, it will be cleared by the reducer
                    console.log('Token validation failed:', error);
                } finally {
                    setInitializing(false);
                }
            } else {
                setInitializing(false);
            }
        };

        validateAuth();
    }, [dispatch, token]);

    // Show loading spinner while validating token
    if (initializing || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-zinc-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
                
                {/* Protected routes - Only for regular users (not system admins) */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute allowAdmins={false}>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="team" element={<Team />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projectsDetail" element={<ProjectDetails />} />
                    <Route path="taskDetails" element={<TaskDetails />} />
                    <Route path="pending-approvals" element={<PendingApprovalsPage />} />
                </Route>

                {/* Admin routes */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedAdminRoute>
                            <AdminLayout />
                        </ProtectedAdminRoute>
                    }
                >
                    <Route index element={<AdminDashboardOverview />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="workspaces" element={<AdminWorkspacesPage />} />
                    <Route path="projects" element={<AdminProjectsPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="tasks" element={<AdminDashboard />} />
                    <Route path="activity" element={<AdminDashboard />} />
                    <Route path="settings" element={<AdminDashboard />} />
                </Route>

                {/* Catch all - redirect to login if not authenticated, otherwise home */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
            </Routes>

            {/* AI Chat Widget - Hiển thị khi đã đăng nhập */}
            {isAuthenticated && <AIChatWidget />}
        </>
    );
};

export default App;
