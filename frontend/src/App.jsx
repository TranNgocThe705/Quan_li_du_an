import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { getMe } from "./features/authSlice";

const App = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.auth);

    // Fetch user data once if token exists but user is not loaded
    useEffect(() => {
        if (token && !user) {
            dispatch(getMe());
        }
    }, [dispatch, token, user]);

    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                    token ? <Navigate to="/" replace /> : <Login />
                } />
                <Route path="/register" element={
                    token ? <Navigate to="/" replace /> : <Register />
                } />
                <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
                
                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
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
                </Route>

                {/* Admin routes */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboard />
                        </ProtectedAdminRoute>
                    } 
                />

                {/* Catch all - redirect to login if not authenticated, otherwise home */}
                <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
            </Routes>
        </>
    );
};

export default App;
