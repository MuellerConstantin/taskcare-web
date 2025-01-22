import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: false,
  },
  reducers: {
    toggleMode: (state, action) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export default themeSlice;
