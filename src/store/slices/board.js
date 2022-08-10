/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBoard } from "../../api/boards";
import { fetchMembers, fetchMember } from "../../api/members";
import { fetchTasks } from "../../api/tasks";

const fetchBoardInfoAction = createAsyncThunk(
  "board/fetchBoardInfo",
  async (boardId, { rejectWithValue }) => {
    try {
      const boardRes = await fetchBoard(boardId);
      return boardRes.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const fetchBoardMembersAction = createAsyncThunk(
  "board/fetchBoardMembers",
  async (boardId, { rejectWithValue }) => {
    try {
      const membersRes = await fetchMembers(boardId);
      return membersRes.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const fetchBoardCurrentMemberAction = createAsyncThunk(
  "board/fetchBoardCurrentMember",
  async (boardId, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      const currentMemberRes = await fetchMember(
        boardId,
        state.auth.principal.username
      );

      return currentMemberRes.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const fetchBoardTasksAction = createAsyncThunk(
  "board/fetchBoardTasks",
  async (boardId, { rejectWithValue }) => {
    try {
      const tasksRes = await fetchTasks(boardId);
      return tasksRes.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const fetchBoardAction = createAsyncThunk(
  "board/fetchBoard",
  async (boardId, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      const boardRes = await fetchBoard(boardId);
      const membersRes = await fetchMembers(boardId);
      const currentMemberRes = await fetchMember(
        boardId,
        state.auth.principal.username
      );
      const tasksRes = await fetchTasks(boardId);

      return {
        boardRes: boardRes.data,
        membersRes: membersRes.data,
        currentMemberRes: currentMemberRes.data,
        tasksRes: tasksRes.data,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  board: null,
  members: [],
  tasks: [],
  currentMember: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBoardInfoAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchBoardInfoAction.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(fetchBoardInfoAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.board = payload;
    });

    builder.addCase(fetchBoardMembersAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchBoardMembersAction.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(fetchBoardMembersAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.members = payload;
    });

    builder.addCase(fetchBoardCurrentMemberAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchBoardCurrentMemberAction.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      }
    );

    builder.addCase(
      fetchBoardCurrentMemberAction.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.currentMember = payload;
      }
    );

    builder.addCase(fetchBoardTasksAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchBoardTasksAction.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(fetchBoardTasksAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tasks = payload;
    });

    builder.addCase(fetchBoardAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchBoardAction.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(fetchBoardAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.board = payload.boardRes;
      state.members = payload.membersRes;
      state.currentMember = payload.currentMemberRes;
      state.tasks = payload.tasksRes;
    });
  },
});

export default authSlice;
export { fetchBoardInfoAction as fetchBoardInfo };
export { fetchBoardMembersAction as fetchBoardMembers };
export { fetchBoardCurrentMemberAction as fetchBoardCurrentMember };
export { fetchBoardTasksAction as fetchBoardTasks };
export { fetchBoardAction as fetchBoard };
