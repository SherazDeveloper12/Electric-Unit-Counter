export const STATUS_THRESHOLDS = [
  { max: 50, label: "Good", color: "#2FA84F", bg: "#E7F7EC" },
  { max: 100, label: "Fine", color: "#1F7A37", bg: "#DFF0E3" },
  { max: 150, label: "Average", color: "#A67C00", bg: "#FFF6D6" },
  { max: 180, label: "Notice", color: "#C1710C", bg: "#FFEBD6" },
  { max: 200, label: "Dangerous", color: "#D93B3B", bg: "#FCE3E3" },
];

export function getMeterStatus(units) {
  for (const tier of STATUS_THRESHOLDS) {
    if (units <= tier.max) return tier;
  }
  return { label: "Dead", color: "#FFFFFF", bg: "#8B1E1E" };
}