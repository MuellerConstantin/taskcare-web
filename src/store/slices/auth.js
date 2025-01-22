import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    principal: null
  },
  reducers: {
    setAuthentication: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuthentication: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setPrincipal: (state, action) => {
      state.principal = action.payload.principal;
    },
    clearPrincipal: (state) => {
      state.principal = null;
    },
  },
});

export default authSlice;
