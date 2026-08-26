import { getStoredAuth, persistAuth } from "@/lib/api";

export function loadPersistedAuth() {
  const stored = getStoredAuth();
  return stored || { token: null, user: null };
}

export const authPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === "auth/setCredentials") {
    persistAuth(store.getState().auth);
  }
  if (action.type === "auth/logout") {
    persistAuth(null);
  }
  return result;
};