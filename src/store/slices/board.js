/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBoard } from "../../api/boards";
import { fetchMember } from "../../api/members";

const fetchBoardAction = createAsyncThunk(
  "board/fetchBoard",
  async (boardId, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      const boardRes = await fetchBoard(boardId);
      const currentMemberRes = await fetchMember(
        boardId,
        state.auth.principal.username
      );

      return {
        board: boardRes.data,
        currentMember: currentMemberRes.data,
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

const initialState = {
  loading: false,
  error: null,
  board: null,
  currentMember: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  extraReducers: (builder) => {
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
      state.board = payload.board;
      state.currentMember = payload.currentMember;
    });
  },
});

export default boardSlice;
export { fetchBoardAction as fetchBoard };
