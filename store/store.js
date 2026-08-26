"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import metersReducer from "./slices/metersSlice";
import { authPersistenceMiddleware, loadPersistedAuth } from "./authPersistence";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      meters: metersReducer,
    },
    preloadedState: {
      auth: loadPersistedAuth(),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authPersistenceMiddleware),
  });
}

export const store = makeStore();