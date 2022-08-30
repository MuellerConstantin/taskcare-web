/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBoard } from "../../api/boards";
import { fetchMembers, fetchMember } from "../../api/members";
import { fetchTasks } from "../../api/tasks";

const fetchBoardInfoAction = createAsyncThunk(
  "board/fetchBoardInfo",
  async (boardId, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      const boardRes = await fetchBoard(boardId);
      const currentMemberRes = await fetchMember(
        boardId,
        state.auth.principal.username
      );

      return {
        boardRes: boardRes.data,
        currentMemberRes: currentMemberRes.data,
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return rejectWithValue(
        err?.response
          ? { ...err.response, request: undefined, config: undefined }
          : { message: err.message }
      );
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
      // eslint-disable-next-line no-console
      console.error(err);
      return rejectWithValue(
        err?.response
          ? { ...err.response, request: undefined, config: undefined }
          : { message: err.message }
      );
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
      // eslint-disable-next-line no-console
      console.error(err);
      return rejectWithValue(
        err?.response
          ? { ...err.response, request: undefined, config: undefined }
          : { message: err.message }
      );
    }
  }
);

const initialMembersState = {
  membersLoading: false,
  membersError: null,
  members: [],
};

const initialTasksState = {
  tasksLoading: false,
  tasksError: null,
  tasks: [],
};

const initialInfoState = {
  infoLoading: false,
  infoError: null,
  board: null,
  currentMember: null,
};

const initialState = {
  ...initialInfoState,
  ...initialMembersState,
  ...initialTasksState,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBoardInfoAction.pending, (state) => {
      state.infoLoading = true;
      state.infoError = null;
    });

    builder.addCase(fetchBoardInfoAction.rejected, (state, { payload }) => {
      state.infoLoading = false;
      state.infoError = payload;
    });

    builder.addCase(fetchBoardInfoAction.fulfilled, (state, { payload }) => {
      state.infoLoading = false;
      state.board = payload.boardRes;
      state.currentMember = payload.currentMemberRes;
    });

    builder.addCase(fetchBoardMembersAction.pending, (state) => {
      state.membersLoading = true;
      state.membersError = null;
    });

    builder.addCase(fetchBoardMembersAction.rejected, (state, { payload }) => {
      state.membersLoading = false;
      state.membersError = payload;
    });

    builder.addCase(fetchBoardMembersAction.fulfilled, (state, { payload }) => {
      state.membersLoading = false;
      state.members = payload;
    });

    builder.addCase(fetchBoardTasksAction.pending, (state) => {
      state.tasksLoading = true;
      state.tasksError = null;
    });

    builder.addCase(fetchBoardTasksAction.rejected, (state, { payload }) => {
      state.tasksLoading = false;
      state.tasksError = payload;
    });

    builder.addCase(fetchBoardTasksAction.fulfilled, (state, { payload }) => {
      state.tasksLoading = false;
      state.tasks = payload;
    });
  },
});

export default authSlice;
export { fetchBoardInfoAction as fetchBoardInfo };
export { fetchBoardMembersAction as fetchBoardMembers };
export { fetchBoardTasksAction as fetchBoardTasks };
