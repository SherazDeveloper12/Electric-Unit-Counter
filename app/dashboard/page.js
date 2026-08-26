"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { MeterCard } from "@/components/MeterCard";
import { EmptyState } from "@/components/EmptyState";
import { AddMeterModal } from "@/components/AddMeterModal";
import { fetchMeters } from "@/lib/api";
import { setMeters } from "@/store/slices/metersSlice";

function DashboardContent() {
  const user = useSelector((state) => state.auth.user);
  const meters = useSelector((state) => state.meters.list);
  const dispatch = useDispatch();
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeters()
      .then((data) => dispatch(setMeters(data)))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted mb-1">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-tight">{user?.name}</h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center text-sm font-medium">
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-medium text-muted">
            {meters.length} meter{meters.length !== 1 ? "s" : ""}
          </h2>
          {meters.length > 0 && (
            <button
              onClick={() => setAddOpen(true)}
              className="px-4 py-2 rounded-control bg-ink text-white text-sm font-medium hover:opacity-90 active:scale-[0.99] transition"
            >
              + Add meter
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-muted text-sm">Loading your meters...</p>
        ) : meters.length === 0 ? (
          <EmptyState onAdd={() => setAddOpen(true)} />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {meters.map((meter) => (
                <MeterCard key={meter._id} meter={meter} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AddMeterModal open={addOpen} onClose={() => setAddOpen(false)} />
    </main>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}