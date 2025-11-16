import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskAPI, commentAPI } from "../services/api";
import toast from "react-hot-toast";

const initialState = {
    tasks: [],
    myTasks: [],
    currentTask: null,
    comments: [],
    loading: false,
    error: null,
};

// Task Async Thunks
export const fetchTasks = createAsyncThunk(
    'task/fetchTasks',
    async ({ projectId, filters }, { rejectWithValue }) => {
        try {
            const response = await taskAPI.getTasks(projectId, filters);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const fetchMyTasks = createAsyncThunk(
    'task/fetchMyTasks',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await taskAPI.getMyTasks(filters);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch my tasks');
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'task/fetchTaskById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await taskAPI.getTaskById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
        }
    }
);

export const createTask = createAsyncThunk(
    'task/createTask',
    async (data, { rejectWithValue }) => {
        try {
            const response = await taskAPI.createTask(data);
            toast.success('Task created successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'task/updateTask',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await taskAPI.updateTask(id, data);
            toast.success('Task updated successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await taskAPI.deleteTask(id);
            toast.success('Task deleted successfully');
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

// Comment Async Thunks
export const fetchComments = createAsyncThunk(
    'task/fetchComments',
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await commentAPI.getComments(taskId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
        }
    }
);

export const createComment = createAsyncThunk(
    'task/createComment',
    async (data, { rejectWithValue }) => {
        try {
            const response = await commentAPI.createComment(data);
            toast.success('Comment added successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

export const updateComment = createAsyncThunk(
    'task/updateComment',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await commentAPI.updateComment(id, data);
            toast.success('Comment updated successfully');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'task/deleteComment',
    async (id, { rejectWithValue }) => {
        try {
            await commentAPI.deleteComment(id);
            toast.success('Comment deleted successfully');
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
        }
    }
);

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload;
        },
        clearTasks: (state) => {
            state.tasks = [];
            state.currentTask = null;
        },
        clearComments: (state) => {
            state.comments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch my tasks
            .addCase(fetchMyTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.myTasks = action.payload;
            })
            .addCase(fetchMyTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch task by ID
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTask = action.payload;
                
                // Update in tasks array if exists
                const index = state.tasks.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.map(t => 
                    t._id === action.payload._id ? action.payload : t
                );
                
                if (state.currentTask?._id === action.payload._id) {
                    state.currentTask = action.payload;
                }
                
                // Update in myTasks if exists
                state.myTasks = state.myTasks.map(t => 
                    t._id === action.payload._id ? action.payload : t
                );
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(t => t._id !== action.payload);
                state.myTasks = state.myTasks.filter(t => t._id !== action.payload);
                
                if (state.currentTask?._id === action.payload) {
                    state.currentTask = null;
                }
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch comments
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create comment
            .addCase(createComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            // Update comment
            .addCase(updateComment.fulfilled, (state, action) => {
                state.comments = state.comments.map(c => 
                    c._id === action.payload._id ? action.payload : c
                );
            })
            // Delete comment
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c._id !== action.payload);
            });
    }
});

export const { setCurrentTask, clearTasks, clearComments } = taskSlice.actions;
export default taskSlice.reducer;
