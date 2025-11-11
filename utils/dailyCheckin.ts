/* ---------------- helpers ---------------- */

import { Unit } from "@/types/dailyCheckin";

export function pickIcon(name?: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("water")) return "💧";
  if (n.includes("sleep")) return "😴";
  if (n.includes("medit")) return "🧘";
  if (n.includes("read")) return "📚";
  return "⭐️";
}
export function pickColor(name?: string, theme?: any) {
  const n = (name || "").toLowerCase();
  if (n.includes("water")) return "#81A1C1";
  if (n.includes("sleep")) return "#EBCB8B";
  if (n.includes("medit")) return theme?.accent ?? "#A3BE8C";
  if (n.includes("read")) return "#B48EAD";
  return theme?.surface ?? "#2A2D24";
}
export function routeFor(name?: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("water")) return "/(auth)/dailyCheckIn/WaterCheckIn";
  if (n.includes("sleep")) return "/(auth)/dailyCheckIn/SleepCheckIn";
  if (n.includes("medit")) return "/(auth)/dailyCheckIn/MeditationCheckIn";
  if (n.includes("read")) return "/(auth)/dailyCheckIn/ReadingCheckIn";
  return "/(auth)/dailyCheckIn"; // fallback
}
export function resolveUnit(h: any): string {
  // Try to humanize units (backend may return "19" or similar)
  // You can extend this mapping if you have unit catalog.
  if (h.metric_unit && typeof h.metric_unit === "string") {
    const u = h.metric_unit.toLowerCase();
    if (u === "19") return "glass";
    if (u === "20") return "hr";
    if (u === "21") return "mintues";
  }
  // Fall back to sensible defaults per habit name
  const n = (h.name || "").toLowerCase();
  if (n.includes("water")) return "glass";
  if (n.includes("sleep")) return "hours";
  if (n.includes("medit")) return "min";
  if (n.includes("read")) return "min";
  return "unit";
}

export const stepFor = (it: any): number => {
  const n = it.name.toLowerCase();
  if (n.includes("water")) return 1; // glasses
  if (n.includes("sleep")) return 0.5; // hours
  if (n.includes("medit")) return 5; // minutes
  if (n.includes("read")) return 5; // minutes
  return 1;
};

export const roundForUnit = (v: number, unit?: Unit) => {
  if (unit === "hours") return Math.round(v * 10) / 10; // 1 decimal
  return Math.round(v); // integer for glasses/min
};

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// ---- Unit helpers
export const toMinutes = (val: number, unit?: string) => {
  if (!Number.isFinite(val)) return 0;
  const u = (unit || "").toLowerCase();
  if (
    u.includes("hour") ||
    u === "hr" ||
    u === "19" /* backend enum for hr? */
  ) {
    return Math.round(val * 60);
  }
  // assume already minutes
  return Math.round(val);
};

export const minutesToHhMm = (m: number) => {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};
