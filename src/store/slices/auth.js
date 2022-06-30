import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  accessExpiresAt: null,
  refreshExpiresAt: null,
  principal: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthentication: (state, action) => {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        accessExpiresAt: new Date(
          new Date().getTime() + action.payload.accessExpiresIn
        ),
        refreshExpiresAt: new Date(
          new Date().getTime() + action.payload.refreshExpiresIn
        ),
      };
    },
    setPrincipal: (state, action) => {
      return {
        ...state,
        principal: action.payload,
      };
    },
    clearAuthentication: (state) => {
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        accessExpiresAt: null,
        refreshExpiresAt: null,
        principal: null,
      };
    },
  },
});

export default authSlice;
