const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const AUTH_KEY = "bijli-auth-v1";

export function getStoredAuth() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistAuth(auth) {
  if (typeof window === "undefined") return;
  if (!auth) {
    window.localStorage.removeItem(AUTH_KEY);
  } else {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }
}

async function request(path, options = {}) {
  const auth = getStoredAuth();
  const headers = { "Content-Type": "application/json" };
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

// --- Auth ---
export const signup = (name, email, password) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });

export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

// --- Meters ---
export const fetchMeters = () => request("/meters");

export const createMeter = ({ referenceNumber, customerId, nickname, expectedBill }) =>
  request("/meters", {
    method: "POST",
    body: JSON.stringify({ referenceNumber, customerId, nickname, expectedBill }),
  });

export const syncMeterBill = (id) => request(`/meters/${id}/sync-bill`, { method: "POST" });

export const addReading = (id, reading) =>
  request(`/meters/${id}/readings`, { method: "POST", body: JSON.stringify({ reading }) });

export const updateMeter = (id, updates) =>
  request(`/meters/${id}`, { method: "PATCH", body: JSON.stringify(updates) });

export const deleteMeter = (id) => request(`/meters/${id}`, { method: "DELETE" });