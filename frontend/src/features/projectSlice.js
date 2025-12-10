import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectAPI } from "../services/api";
import toast from "react-hot-toast";

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchProjects = createAsyncThunk(
    'project/fetchProjects',
    async (workspaceId, { rejectWithValue }) => {
        try {
            const response = await projectAPI.getProjects(workspaceId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'project/fetchProjectById',
    async (id, { rejectWithValue }) => {
        try {
            // Validate and extract ID
            const validId = typeof id === 'string' ? id : id?._id || id?.toString();
            
            if (!validId || validId === '[object Object]') {
                console.error('❌ fetchProjectById: Invalid ID', id);
                const message = 'ID dự án không hợp lệ';
                toast.error(message);
                return rejectWithValue(message);
            }
            
            console.log('✅ fetchProjectById with ID:', validId);
            const response = await projectAPI.getProjectById(validId);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải chi tiết dự án';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const createProject = createAsyncThunk(
    'project/createProject',
    async (data, { rejectWithValue }) => {
        try {
            const response = await projectAPI.createProject(data);
            toast.success('Tạo dự án thành công!');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tạo dự án';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'project/updateProject',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await projectAPI.updateProject(id, data);
            toast.success('Project updated successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'project/deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            await projectAPI.deleteProject(id);
            toast.success('Project deleted successfully');
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
        }
    }
);

export const addProjectMember = createAsyncThunk(
    'project/addMember',
    async ({ projectId, data }, { rejectWithValue }) => {
        try {
            const response = await projectAPI.addMember(projectId, data);
            toast.success('Member added successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add member');
        }
    }
);

export const removeProjectMember = createAsyncThunk(
    'project/removeMember',
    async ({ projectId, memberId }, { rejectWithValue }) => {
        try {
            await projectAPI.removeMember(projectId, memberId);
            toast.success('Member removed successfully');
            return { projectId, memberId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
        }
    }
);

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },
        clearProjects: (state) => {
            state.projects = [];
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch project by ID
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                console.log('✅ fetchProjectById fulfilled:', action.payload);
                state.loading = false;
                state.currentProject = action.payload;
                
                // Update in projects array if exists
                const index = state.projects.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                } else {
                    state.projects.push(action.payload);
                }
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                console.error('❌ fetchProjectById rejected:', action.payload);
                state.loading = false;
                state.error = action.payload;
            })
            // Create project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
                state.currentProject = action.payload;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update project
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.map(p => 
                    p._id === action.payload._id ? action.payload : p
                );
                
                if (state.currentProject?._id === action.payload._id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete project
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter(p => p._id !== action.payload);
                
                if (state.currentProject?._id === action.payload) {
                    state.currentProject = null;
                }
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add member
            .addCase(addProjectMember.fulfilled, (state, action) => {
                if (state.currentProject?._id === action.payload._id) {
                    state.currentProject = action.payload;
                }
                
                state.projects = state.projects.map(p => 
                    p._id === action.payload._id ? action.payload : p
                );
            })
            // Remove member
            .addCase(removeProjectMember.fulfilled, (state, action) => {
                const { projectId, memberId } = action.payload;
                
                if (state.currentProject?._id === projectId) {
                    state.currentProject.members = state.currentProject.members.filter(
                        m => m._id !== memberId
                    );
                }
                
                state.projects = state.projects.map(p => {
                    if (p._id === projectId) {
                        return {
                            ...p,
                            members: p.members.filter(m => m._id !== memberId)
                        };
                    }
                    return p;
                });
            });
    }
});

export const { setCurrentProject, clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
