"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

export default function Landing() {
  const token = useSelector((state) => state.auth.token);

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center">
      <div className="max-w-5xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-sm text-accent font-medium mb-4">Electricity tracking, simplified</p>
          <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
            Know your units before the bill does.
          </h1>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            Connect your MEPCO meter with just a reference number. Bijli pulls your official
            bill automatically and lets you log readings between bills, so you always know
            where you stand.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={token ? "/dashboard" : "/signup"}
              className="px-6 py-3 rounded-control bg-ink text-white font-medium hover:opacity-90 active:scale-[0.99] transition"
            >
              {token ? "Go to dashboard" : "Get started"}
            </Link>
            <Link href="/about" className="text-muted hover:text-ink transition font-medium">
              Learn more →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20"
        >
          {[
            { title: "Auto-fetched bills", body: "Your official reading comes straight from MEPCO — no typing bill numbers by hand." },
            { title: "Live status", body: "Every meter shows a clear status, from Good to Dead, based on units used this cycle." },
            { title: "Full history", body: "Every reading you log is timestamped and kept, month after month." },
          ].map((item) => (
            <div key={item.title} className="bg-surface border border-border rounded-card p-6">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}