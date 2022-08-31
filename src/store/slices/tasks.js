/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks } from "../../api/tasks";

const fetchTasksAction = createAsyncThunk(
  "board/fetchTasks",
  async (boardId, { rejectWithValue }) => {
    try {
      const tasksRes = await fetchTasks(boardId);
      return tasksRes.data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return rejectWithValue({
        ...err?.response,
        message: err?.message,
        request: undefined,
        config: undefined,
      });
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTasksAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchTasksAction.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(fetchTasksAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tasks = payload;
    });
  },
});

export default tasksSlice;
export { fetchTasksAction as fetchTasks };
