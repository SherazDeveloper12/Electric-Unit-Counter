"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { toast } from "sonner";
import { logout } from "@/store/slices/authSlice";
import { clearMeters } from "@/store/slices/metersSlice";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    dispatch(logout());
    dispatch(clearMeters());
    toast("Logged out");
    router.push("/");
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4">
      <motion.nav
        animate={{
          maxWidth: scrolled ? 640 : 880,
          paddingLeft: scrolled ? 16 : 24,
          paddingRight: scrolled ? 16 : 24,
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-full border border-border bg-surface/80 backdrop-blur-xl shadow-card flex items-center justify-between"
      >
        <Link href="/" className="font-semibold tracking-tight text-[15px] flex items-center gap-1.5">
          <span>⚡</span> Bijli
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/about" className={`transition ${pathname === "/about" ? "text-ink" : "text-muted hover:text-ink"}`}>
            About
          </Link>

          {token ? (
            <>
              <Link href="/dashboard" className={`transition ${pathname === "/dashboard" ? "text-ink" : "text-muted hover:text-ink"}`}>
                Dashboard
              </Link>
              <span className="text-muted hidden sm:inline">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full border border-border hover:bg-bg transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-ink transition">
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-full bg-ink text-white hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </motion.nav>
    </div>
  );
}