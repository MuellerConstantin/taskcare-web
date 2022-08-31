/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMembers } from "../../api/members";

const fetchMembersAction = createAsyncThunk(
  "board/fetchMembers",
  async (boardId, { rejectWithValue }) => {
    try {
      const membersRes = await fetchMembers(boardId);
      return membersRes.data;
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
  members: [],
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMembersAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchMembersAction.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(fetchMembersAction.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.members = payload;
    });
  },
});

export default membersSlice;
export { fetchMembersAction as fetchMembers };
