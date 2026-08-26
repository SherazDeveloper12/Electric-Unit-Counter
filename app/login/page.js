"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion } from "motion/react";
import { login, persistAuth } from "@/lib/api";
import { setCredentials } from "@/store/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email.trim(), form.password);
      persistAuth(data);
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name}`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface border border-border rounded-card shadow-card p-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-6">Log in to see your meters.</p>

        <div className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-control border border-border bg-bg focus:border-accent outline-none transition-colors"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-control border border-border bg-bg focus:border-accent outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full py-3 rounded-control bg-ink text-white font-medium hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-muted text-center mt-5">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent font-medium">
            Sign up
          </Link>
        </p>
      </motion.form>
    </main>
  );
}