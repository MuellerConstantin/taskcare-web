"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { injectStore } from "@/api";
import themeSlice from "./slices/theme";
import authSlice from "./slices/auth";

const persistConfig = {
  key: "taskcare",
  version: 1,
  storage,
  whitelist: ["theme", "auth"],
};

export const rootReducer = combineReducers({
  theme: themeSlice.reducer,
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return [store, persistor];
};

export function StoreProvider({ children }) {
  const storeRef = useRef(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    injectStore(storeRef.current[0]);
  }

  return (
    <Provider store={storeRef.current[0]}>
      <PersistGate loading={null} persistor={storeRef.current[1]}>
        {children}
      </PersistGate>
    </Provider>
  );
}
