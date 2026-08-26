"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { createMeter } from "@/lib/api";
import { upsertMeter } from "@/store/slices/metersSlice";

const initialForm = { referenceNumber: "", nickname: "", expectedBill: "" };

export function AddMeterModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleClose() {
    if (loading) return;
    setForm(initialForm);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const referenceNumber = form.referenceNumber.trim();
    const nickname = form.nickname.trim();

    if (!/^\d{14}$/.test(referenceNumber)) {
      toast.error("Reference number must be 14 digits");
      return;
    }
    if (!nickname) {
      toast.error("Give this meter a name, e.g. 'Bilal Home'");
      return;
    }

    setLoading(true);
    try {
      const meter = await createMeter({
        referenceNumber,
        nickname,
        expectedBill: form.expectedBill ? Number(form.expectedBill) : null,
      });
      dispatch(upsertMeter(meter));
      toast.success(`${nickname} connected`);
      setForm(initialForm);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 className="text-xl font-semibold tracking-tight mb-1">Connect a meter</h2>
      <p className="text-muted text-sm mb-6">
        The reference number is printed on the top-left corner of your bill.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted mb-1.5 block">Meter name</label>
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
            placeholder="Bilal Home"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-control border border-border bg-bg focus:border-accent outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-sm text-muted mb-1.5 block">Reference number</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.referenceNumber}
            onChange={(e) => setForm((f) => ({ ...f, referenceNumber: e.target.value.replace(/\D/g, "").slice(0, 14) }))}
            placeholder="20152623079900"
            disabled={loading}
            maxLength={14}
            className="w-full px-4 py-2.5 rounded-control border border-border bg-bg focus:border-accent outline-none transition-colors font-mono tracking-tight disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-sm text-muted mb-1.5 block">Expected bill (optional)</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.expectedBill}
            onChange={(e) => setForm((f) => ({ ...f, expectedBill: e.target.value.replace(/\D/g, "") }))}
            placeholder="e.g. 5000"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-control border border-border bg-bg focus:border-accent outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3 pt-2">
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
            {loading ? "Fetching bill..." : "Connect"}
          </button>
        </div>
      </form>
    </Modal>
  );
}