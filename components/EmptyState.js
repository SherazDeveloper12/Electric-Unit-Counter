"use client";

import { motion } from "motion/react";

export function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border border-dashed border-border rounded-card py-16 px-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-accent-soft mx-auto mb-4 flex items-center justify-center text-xl">
        ⚡
      </div>
      <h3 className="text-lg font-semibold mb-1">No meters connected yet</h3>
      <p className="text-muted text-sm mb-6 max-w-xs mx-auto">
        Connect your first electricity meter to start tracking readings.
      </p>
      <button
        onClick={onAdd}
        className="px-5 py-2.5 rounded-control bg-ink text-white text-sm font-medium hover:opacity-90 active:scale-[0.99] transition"
      >
        Connect a meter
      </button>
    </motion.div>
  );
}