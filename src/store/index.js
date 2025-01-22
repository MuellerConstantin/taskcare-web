"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/theme";
import authSlice from "./slices/auth";

export const makeStore = () => {
  return configureStore({
    reducer: {
      theme: themeSlice.reducer,
      auth: authSlice.reducer,
    },
  })
}

export function StoreProvider({ children }) {
  const storeRef = useRef(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
