import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '../features/workspaceSlice'
import themeReducer from '../features/themeSlice'
import authReducer from '../features/authSlice'
import projectReducer from '../features/projectSlice'
import taskReducer from '../features/taskSlice'
import permissionReducer from '../features/permissionSlice'
import notificationReducer from '../features/notificationSlice'
import adminReducer from '../features/adminSlice'
import progressReducer from '../features/progressSlice'

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        theme: themeReducer,
        auth: authReducer,
        project: projectReducer,
        task: taskReducer,
        permissions: permissionReducer,
        notification: notificationReducer,
        admin: adminReducer,
        progress: progressReducer,
    },
})