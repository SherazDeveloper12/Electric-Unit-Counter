"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store/store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-center"
        richColors={false}
        toastOptions={{
          style: {
            background: "var(--surface)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    </Provider>
  );
}
