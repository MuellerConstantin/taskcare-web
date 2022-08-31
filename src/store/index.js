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
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/auth";
import themeSlice from "./slices/theme";
import boardSlice from "./slices/board";
import tasksSlice from "./slices/tasks";
import membersSlice from "./slices/members";

const persistConfig = {
  key: "taskcare",
  version: 1,
  storage,
  whitelist: ["theme", "auth"],
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  theme: themeSlice.reducer,
  board: boardSlice.reducer,
  tasks: tasksSlice.reducer,
  members: membersSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
