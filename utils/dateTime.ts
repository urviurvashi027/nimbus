import {
  format,
  parseISO,
  isToday,
  isYesterday,
  isTomorrow,
  addDays,
  subDays,
  startOfDay,
  isValid,
} from "date-fns";

/**
 * Nimbus Date & Time Standards
 * ----------------------------
 * Backend Date: "yyyy-MM-dd"
 * Backend Time: "HH:mm:ss"
 * UI Date:      "EEE, MMM d" (Mon, Oct 12)
 * UI Time:      "h:mm a"     (8:30 PM)
 * UI Full:      "PPP"        (Jan 2nd, 2026)
 */

export const DATE_FORMATS = {
  API_DATE: "yyyy-MM-dd",
  API_TIME: "HH:mm:ss",
  DISPLAY_DATE: "EEE, MMM d",
  DISPLAY_TIME: "h:mm a",
  DISPLAY_DAY: "EEEE",
  MONTH_YEAR: "MMMM yyyy",
  SHORT_MONTH: "MMM",
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. BACKEND TRANSFORMATIONS (To API)
// ─────────────────────────────────────────────────────────────────────────────

/** Convert Date object to "yyyy-MM-dd" */
export const toApiDate = (date: Date): string => {
  if (!isValid(date)) return format(new Date(), DATE_FORMATS.API_DATE);
  return format(date, DATE_FORMATS.API_DATE);
};

/** Convert Date object to "HH:mm:ss" */
export const toApiTime = (date: Date): string => {
  if (!isValid(date)) return "00:00:00";
  return format(date, DATE_FORMATS.API_TIME);
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. FRONTEND TRANSFORMATIONS (From API)
// ─────────────────────────────────────────────────────────────────────────────

/** Parse "yyyy-MM-dd" or ISO string into a valid Date object */
export const fromApiDate = (dateStr: string | null | undefined): Date => {
  if (!dateStr) return new Date();
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? parsed : new Date();
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. UI DISPLAY HELPERS (For User)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns "Today", "Yesterday", "Tomorrow" or "Mon, Jan 2" */
export const toFriendlyDate = (date: Date | string): string => {
  const d = typeof date === "string" ? fromApiDate(date) : date;
  if (!isValid(d)) return "";

  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  if (isTomorrow(d)) return "Tomorrow";

  return format(d, DATE_FORMATS.DISPLAY_DATE);
};

/** Returns "8:30 PM" */
export const toFriendlyTime = (date: Date | string): string => {
  const d = typeof date === "string" ? parseISO(`1970-01-01T${date}`) : date;
  if (!isValid(d)) return "";
  return format(d, DATE_FORMATS.DISPLAY_TIME);
};

/** Returns a clean range like "1 Jan — 7 Jan" */
export const toFriendlyRange = (start: Date, end: Date): string => {
  return `${format(start, "d MMM")} — ${format(end, "d MMM")}`;
};

/** Returns "Sun", "Mon", etc. */
export const formatDay = (date: Date) => format(date, "EEE");

// ─────────────────────────────────────────────────────────────────────────────
// 4. BUSINESS LOGIC HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Generate a range of dates around a center point */
export const generateDateRange = (center: Date, rangeCount = 14) => {
  const dates: Date[] = [];
  const start = subDays(startOfDay(center), rangeCount);
  for (let i = 0; i <= rangeCount * 2; i++) {
    dates.push(addDays(start, i));
  }
  return dates;
};

/** Check if two dates are the same day (local time) */
export const isSameDayLocal = (d1: Date, d2: Date): boolean => {
  return format(d1, "yyyyMMdd") === format(d2, "yyyyMMdd");
};
