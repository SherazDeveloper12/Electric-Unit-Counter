"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function RequireAuth({ children }) {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [token, router]);

  if (!checked) return null;
  return children;
}