"use client";

import React, { useRef, useEffect } from "react";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeSlice from "@/store/slices/theme";

export const rootReducer = combineReducers({
  theme: themeSlice.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

function ThemeSwitcher({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return children;
}

export function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeSwitcher>{children}</ThemeSwitcher>
    </Provider>
  );
}
