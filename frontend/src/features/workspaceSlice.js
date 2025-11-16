import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceAPI } from "../services/api";
import toast from "react-hot-toast";

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchWorkspaces = createAsyncThunk(
    'workspace/fetchWorkspaces',
    async (_, { rejectWithValue }) => {
        try {
            const response = await workspaceAPI.getWorkspaces();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspaces');
        }
    }
);

export const fetchWorkspaceById = createAsyncThunk(
    'workspace/fetchWorkspaceById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await workspaceAPI.getWorkspaceById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspace');
        }
    }
);

export const createWorkspace = createAsyncThunk(
    'workspace/createWorkspace',
    async (data, { rejectWithValue }) => {
        try {
            const response = await workspaceAPI.createWorkspace(data);
            toast.success('Workspace created successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create workspace');
        }
    }
);

export const updateWorkspace = createAsyncThunk(
    'workspace/updateWorkspace',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await workspaceAPI.updateWorkspace(id, data);
            toast.success('Workspace updated successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update workspace');
        }
    }
);

export const deleteWorkspace = createAsyncThunk(
    'workspace/deleteWorkspace',
    async (id, { rejectWithValue }) => {
        try {
            await workspaceAPI.deleteWorkspace(id);
            toast.success('Workspace deleted successfully');
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete workspace');
        }
    }
);

export const addWorkspaceMember = createAsyncThunk(
    'workspace/addMember',
    async ({ workspaceId, data }, { rejectWithValue }) => {
        try {
            const response = await workspaceAPI.addMember(workspaceId, data);
            toast.success('Member added successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add member');
        }
    }
);

export const removeWorkspaceMember = createAsyncThunk(
    'workspace/removeMember',
    async ({ workspaceId, memberId }, { rejectWithValue }) => {
        try {
            await workspaceAPI.removeMember(workspaceId, memberId);
            toast.success('Member removed successfully');
            return { workspaceId, memberId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
        }
    }
);

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            // action.payload should be workspace ID
            const workspaceId = action.payload;
            const workspace = state.workspaces.find((w) => w._id === workspaceId);
            
            if (workspace) {
                state.currentWorkspace = workspace;
                localStorage.setItem("currentWorkspaceId", workspaceId);
            }
        },
        clearCurrentWorkspace: (state) => {
            state.currentWorkspace = null;
            localStorage.removeItem("currentWorkspaceId");
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all workspaces
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
                
                // Set current workspace only if it doesn't exist or ID doesn't match
                const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
                const currentId = state.currentWorkspace?._id;
                
                if (action.payload.length > 0) {
                    // Only update if current workspace is not set yet
                    if (!currentId) {
                        const targetId = savedWorkspaceId || action.payload[0]._id;
                        const workspace = action.payload.find(w => w._id === targetId) || action.payload[0];
                        state.currentWorkspace = workspace;
                        localStorage.setItem('currentWorkspaceId', workspace._id);
                    } else {
                        // Update current workspace data if it's in the new list (to keep data fresh)
                        const updated = action.payload.find(w => w._id === currentId);
                        if (updated) {
                            state.currentWorkspace = updated;
                        }
                    }
                }
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch workspace by ID
            .addCase(fetchWorkspaceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentWorkspace = action.payload;
                
                // Update in workspaces array
                const index = state.workspaces.findIndex(w => w._id === action.payload._id);
                if (index !== -1) {
                    state.workspaces[index] = action.payload;
                }
            })
            .addCase(fetchWorkspaceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create workspace
            .addCase(createWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces.push(action.payload);
                state.currentWorkspace = action.payload;
                localStorage.setItem('currentWorkspaceId', action.payload._id);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update workspace
            .addCase(updateWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = state.workspaces.map(w => 
                    w._id === action.payload._id ? action.payload : w
                );
                
                if (state.currentWorkspace?._id === action.payload._id) {
                    state.currentWorkspace = action.payload;
                }
            })
            .addCase(updateWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete workspace
            .addCase(deleteWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = state.workspaces.filter(w => w._id !== action.payload);
                
                // If deleted workspace is current, switch to another
                if (state.currentWorkspace?._id === action.payload) {
                    state.currentWorkspace = state.workspaces[0] || null;
                    if (state.currentWorkspace) {
                        localStorage.setItem('currentWorkspaceId', state.currentWorkspace._id);
                    } else {
                        localStorage.removeItem('currentWorkspaceId');
                    }
                }
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add member
            .addCase(addWorkspaceMember.fulfilled, (state, action) => {
                // Refresh current workspace with new member data
                if (state.currentWorkspace?._id === action.payload._id) {
                    state.currentWorkspace = action.payload;
                }
                
                // Update in workspaces array
                state.workspaces = state.workspaces.map(w => 
                    w._id === action.payload._id ? action.payload : w
                );
            })
            // Remove member
            .addCase(removeWorkspaceMember.fulfilled, (state, action) => {
                const { workspaceId, memberId } = action.payload;
                
                // Remove from current workspace
                if (state.currentWorkspace?._id === workspaceId) {
                    state.currentWorkspace.members = state.currentWorkspace.members.filter(
                        m => m._id !== memberId
                    );
                }
                
                // Remove from workspaces array
                state.workspaces = state.workspaces.map(w => {
                    if (w._id === workspaceId) {
                        return {
                            ...w,
                            members: w.members.filter(m => m._id !== memberId)
                        };
                    }
                    return w;
                });
            });
    }
});

export const { setCurrentWorkspace, clearCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;