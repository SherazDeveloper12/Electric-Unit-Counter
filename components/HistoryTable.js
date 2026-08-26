"use client";

import { getMeterStatus } from "@/lib/status";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryTable({ meter }) {
  const rows = [...meter.currentCycle.entries].reverse();

  return (
    <div className="pt-4">
      {rows.length === 0 ? (
        <p className="text-xs text-subtle py-2">No manual readings logged yet this cycle.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-subtle text-left">
              <th className="font-medium pb-2">Date</th>
              <th className="font-medium pb-2">Reading</th>
              <th className="font-medium pb-2">Units used</th>
              <th className="font-medium pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, idx) => {
              const runningTotal = entry.reading - meter.currentCycle.baseline;
              const status = getMeterStatus(runningTotal);
              return (
                <tr key={entry._id || idx} className="border-t border-border">
                  <td className="py-2 text-muted">{formatDate(entry.date)}</td>
                  <td className="py-2 font-mono">{entry.reading}</td>
                  <td className="py-2 font-medium text-good">+{entry.unitsConsumed}</td>
                  <td className="py-2">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {meter.history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-subtle mb-2">Past months</p>
          <div className="space-y-1.5">
            {meter.history.map((month) => (
              <div key={month.billMonth + month.archivedAt} className="flex justify-between text-sm">
                <span className="text-muted">{month.billMonth}</span>
                <span className="font-medium">{month.totalUnits} units</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}