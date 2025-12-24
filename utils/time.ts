// utils/time.ts
import { format, parse } from "date-fns";

/**
 * Nimbus time conventions
 * -----------------------
 * Backend time: "HH:mm:ss" (24h)
 * UI time:      "h:mm a"  (12h, e.g., 4:22 PM)
 * Simple time:  "HH:mm"   (24h, no seconds)
 */

export const BACKEND_TIME_FORMAT = "HH:mm:ss";
export const HHMM_24 = "HH:mm";
export const UI_TIME_FORMAT = "h:mm a";

// ---------- Basics ----------
export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const toISODate = (d: Date) => d.toISOString().slice(0, 10);

export function isValidDate(d: any): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

// ---------- HH:mm helpers (24h, no seconds) ----------
export function toHHmm(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// (Keep one name – this replaces toHHmmReading)
export const toHHmmReading = toHHmm;

export function fromHHmm(hhmm: string) {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

// ---------- Backend time helpers (HH:mm:ss) ----------
export function toBackendTime(value?: Date | null): string | undefined {
  if (!value || !isValidDate(value)) return undefined;
  return format(value, BACKEND_TIME_FORMAT);
}

export function parseBackendTimeToDate(
  time?: string | null,
  baseDate: Date = new Date()
): Date | null {
  if (!time) return null;
  const d = parse(time, BACKEND_TIME_FORMAT, baseDate);
  return isValidDate(d) ? d : null;
}

// ---------- Duration math ----------
export function durationFromRange(start: Date, end: Date) {
  const s = start.getHours() * 60 + start.getMinutes();
  const e = end.getHours() * 60 + end.getMinutes();
  const diff = (e - s + 24 * 60) % (24 * 60);
  return diff === 0 ? 24 * 60 : diff;
}

// Keep compatibility name
export const overnightDiff = durationFromRange;

export function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${pad(m)}m`;
}

// ---------- Nimbus UI formatters ----------
export function formatTimeUI(value?: Date | null, fallback = ""): string {
  if (value && isValidDate(value)) return format(value, UI_TIME_FORMAT);
  return fallback;
}

export function formatTimeRangeUI(
  start?: Date | null,
  end?: Date | null,
  fallback = ""
): string {
  if (start && isValidDate(start) && end && isValidDate(end)) {
    return `${format(start, UI_TIME_FORMAT)} - ${format(end, UI_TIME_FORMAT)}`;
  }
  if (start && isValidDate(start)) return format(start, UI_TIME_FORMAT);
  return fallback;
}

// ---------- Duration display + backend payload ----------
export type DurationLike = {
  all_day?: boolean;
  start_time?: Date | null;
  end_time?: Date | null;
};

export function formatDurationDisplay(
  duration?: DurationLike | null,
  opts?: { allDayLabel?: string; fallback?: string }
): string {
  const allDayLabel = opts?.allDayLabel ?? "All Day";
  const fallback = opts?.fallback ?? "";

  if (!duration) return fallback;
  if (duration.all_day) return allDayLabel;

  return formatTimeRangeUI(duration.start_time, duration.end_time, fallback);
}

export function toBackendDurationPayload(duration: DurationLike): any {
  if (duration.all_day) return { all_day: true };

  const start = toBackendTime(duration.start_time ?? null);
  const end = toBackendTime(duration.end_time ?? null);

  if (!start) return {};
  return end ? { start_time: start, end_time: end } : { start_time: start };
}

// ---------- Reminder helpers ----------
export type ReminderLike = {
  time?: string; // backend format "HH:mm:ss"
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
};

/** Display reminder in Nimbus UI (consistent everywhere) */
export function formatReminderDisplay(
  reminder?: ReminderLike | null,
  opts?: { fallback?: string }
) {
  const fallback = opts?.fallback ?? "Select the preset";
  if (!reminder) return fallback;

  if (reminder.time) {
    const d = parseBackendTimeToDate(reminder.time);
    return d ? formatTimeUI(d, fallback) : fallback;
  }

  if (reminder.ten_min_before) return "10 min before";
  if (reminder.thirty_min_before) return "30 min before";

  return fallback;
}

/** Optional: normalize outgoing payload so you never send conflicting fields */
export function toBackendReminderPayload(reminder: ReminderLike) {
  if (reminder.time) return { time: reminder.time };
  if (reminder.ten_min_before) return { ten_min_before: true };
  if (reminder.thirty_min_before) return { thirty_min_before: true };
  return {};
}
