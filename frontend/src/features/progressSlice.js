import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { progressAPI } from "../api/services/progress.service.js";

const initialState = {
    progress: [],
    myProgress: [],
    currentProgress: null,
    projectProgress: [],
    loading: false,
    error: null,
};

// Async Thunks
export const createOrUpdateProgress = createAsyncThunk(
    'progress/createOrUpdateProgress',
    async (data, { rejectWithValue }) => {
        try {
            const response = await progressAPI.createOrUpdateProgress(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getTaskProgress = createAsyncThunk(
    'progress/getTaskProgress',
    async ({ taskId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await progressAPI.getTaskProgress(taskId, startDate, endDate);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getMyProgress = createAsyncThunk(
    'progress/getMyProgress',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await progressAPI.getMyProgress(startDate, endDate);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getProjectProgress = createAsyncThunk(
    'progress/getProjectProgress',
    async ({ projectId, startDate, endDate, userId }, { rejectWithValue }) => {
        try {
            const response = await progressAPI.getProjectProgress(projectId, startDate, endDate, userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const reviewProgress = createAsyncThunk(
    'progress/reviewProgress',
    async ({ progressId, data }, { rejectWithValue }) => {
        try {
            const response = await progressAPI.reviewProgress(progressId, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteProgress = createAsyncThunk(
    'progress/deleteProgress',
    async (progressId, { rejectWithValue }) => {
        try {
            await progressAPI.deleteProgress(progressId);
            return progressId;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const progressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        clearProgress: (state) => {
            state.progress = [];
            state.currentProgress = null;
        },
        clearMyProgress: (state) => {
            state.myProgress = [];
        },
        clearProjectProgress: (state) => {
            state.projectProgress = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Create or Update Progress
            .addCase(createOrUpdateProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrUpdateProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProgress = action.payload;
                
                // Update in myProgress array if exists
                const index = state.myProgress.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.myProgress[index] = action.payload;
                } else {
                    state.myProgress.unshift(action.payload);
                }
            })
            .addCase(createOrUpdateProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Task Progress
            .addCase(getTaskProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTaskProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.progress = action.payload;
            })
            .addCase(getTaskProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get My Progress
            .addCase(getMyProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.myProgress = action.payload;
            })
            .addCase(getMyProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Project Progress
            .addCase(getProjectProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.projectProgress = action.payload;
            })
            .addCase(getProjectProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Review Progress
            .addCase(reviewProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reviewProgress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.progress.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.progress[index] = action.payload;
                }
                
                const projectIndex = state.projectProgress.findIndex(p => p._id === action.payload._id);
                if (projectIndex !== -1) {
                    state.projectProgress[projectIndex] = action.payload;
                }
            })
            .addCase(reviewProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Progress
            .addCase(deleteProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.myProgress = state.myProgress.filter(p => p._id !== action.payload);
                state.progress = state.progress.filter(p => p._id !== action.payload);
                state.projectProgress = state.projectProgress.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProgress, clearMyProgress, clearProjectProgress } = progressSlice.actions;
export default progressSlice.reducer;
