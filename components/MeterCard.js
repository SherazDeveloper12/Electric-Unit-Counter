"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ActivityRing } from "./ActivityRing";
import { AddReadingModal } from "./AddReadingModal";
import { HistoryTable } from "./HistoryTable";
import { removeMeter as removeMeterAction, upsertMeter, getLastRecordedValue, getCycleTotalUnits } from "@/store/slices/metersSlice";
import { syncMeterBill, deleteMeter, updateMeter } from "@/lib/api";
import { getMeterStatus } from "@/lib/status";

export function MeterCard({ meter }) {
  const [readingOpen, setReadingOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingBill, setEditingBill] = useState(false);
  const [billInput, setBillInput] = useState(meter.expectedBill ?? "");
  const dispatch = useDispatch();

  const lastValue = getLastRecordedValue(meter);
  const cycleUnits = getCycleTotalUnits(meter);
  const status = getMeterStatus(cycleUnits);
  const lastMonthUnits = meter.lastUnitsFromBill || 0;
  const progress = lastMonthUnits > 0 ? cycleUnits / lastMonthUnits : cycleUnits > 0 ? 1 : 0;

  async function handleResync() {
    setSyncing(true);
    try {
      const updated = await syncMeterBill(meter._id);
      dispatch(upsertMeter(updated));
      toast.success("Bill updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleSaveBill() {
    try {
      const updated = await updateMeter(meter._id, { expectedBill: billInput === "" ? "" : Number(billInput) });
      dispatch(upsertMeter(updated));
      setEditingBill(false);
      toast.success("Expected bill saved");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove ${meter.nickname}? This can't be undone.`)) return;
    try {
      await deleteMeter(meter._id);
      dispatch(removeMeterAction(meter._id));
      toast("Meter removed");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-surface border border-border rounded-card shadow-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{meter.nickname}</h3>
          <p className="text-xs text-subtle font-mono mt-0.5">{meter.referenceNumber}</p>
        </div>
        <div className="relative">
          <ActivityRing progress={progress} color={status.color} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-sm font-semibold leading-none">{cycleUnits}</span>
            <span className="text-[9px] text-subtle mt-0.5">units</span>
          </div>
        </div>
      </div>

      <span
        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4"
        style={{ color: status.color, backgroundColor: status.bg }}
      >
        {status.label}
      </span>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-bg rounded-control px-3.5 py-3">
          <p className="text-xs text-subtle mb-0.5">Last meter reading</p>
          <p className="text-base font-semibold">{meter.lastOfficialReading}</p>
        </div>
        <div className="bg-bg rounded-control px-3.5 py-3">
          <p className="text-xs text-subtle mb-0.5">Current reading</p>
          <p className="text-base font-semibold">{lastValue}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-bg rounded-control px-3.5 py-3">
          <p className="text-xs text-subtle mb-0.5">Last bill</p>
          <p className="text-base font-semibold">
            {meter.lastGrandTotal ? `Rs ${meter.lastGrandTotal}` : "—"}
          </p>
        </div>
        <div className="bg-bg rounded-control px-3.5 py-3">
          <p className="text-xs text-subtle mb-0.5">Expected bill</p>
          {editingBill ? (
            <input
              autoFocus
              type="number"
              value={billInput}
              onChange={(e) => setBillInput(e.target.value)}
              onBlur={handleSaveBill}
              onKeyDown={(e) => e.key === "Enter" && handleSaveBill()}
              className="w-full bg-transparent text-base font-semibold outline-none border-b border-accent"
            />
          ) : (
            <p
              onClick={() => setEditingBill(true)}
              className="text-base font-semibold cursor-pointer hover:text-accent transition"
            >
              {meter.expectedBill ? `Rs ${meter.expectedBill}` : "Set amount"}
            </p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-medium text-muted mb-2">
          History ({meter.currentCycle.entries.length} readings)
        </p>
        <HistoryTable meter={meter} />
      </div>

      <div className="flex gap-2 mb-1">
        <button
          onClick={() => setReadingOpen(true)}
          className="flex-1 py-2.5 rounded-control bg-ink text-white text-sm font-medium hover:opacity-90 active:scale-[0.99] transition"
        >
          Add reading
        </button>
        <button
          onClick={handleResync}
          disabled={syncing}
          title="Sync latest bill"
          className="px-3.5 rounded-control border border-border text-sm hover:bg-bg transition disabled:opacity-50"
        >
          {syncing ? "…" : "↻"}
        </button>
      </div>

      <button
        onClick={handleDelete}
        className="w-full text-center text-xs text-subtle hover:text-warn transition mt-4"
      >
        Remove meter
      </button>

      <AddReadingModal open={readingOpen} onClose={() => setReadingOpen(false)} meter={meter} lastValue={lastValue} />
    </motion.div>
  );
}