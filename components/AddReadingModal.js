"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { addReading } from "@/lib/api";
import { upsertMeter } from "@/store/slices/metersSlice";

export function AddReadingModal({ open, onClose, meter, lastValue }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleClose() {
    if (loading) return;
    setValue("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (value.trim() === "" || !/^\d+$/.test(value.trim())) {
      toast.error("Reading must be a number");
      return;
    }

    const reading = Number(value);
    setLoading(true);
    try {
      const updated = await addReading(meter._id, reading);
      dispatch(upsertMeter(updated));
      toast.success(`${reading - lastValue} units added`);
      setValue("");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!meter) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 className="text-xl font-semibold tracking-tight mb-1">{meter.nickname}</h2>
      <p className="text-muted text-sm mb-6">
        Last recorded reading was <span className="font-medium text-ink">{lastValue}</span>. Enter what your meter shows now.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoFocus
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
          placeholder={`${lastValue}`}
          disabled={loading}
          className="w-full px-4 py-3 rounded-control border border-border bg-bg text-lg font-mono focus:border-accent outline-none transition-colors disabled:opacity-50"
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-control border border-border text-ink font-medium hover:bg-bg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-control bg-ink text-white font-medium hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}