import {
  BackendEntry,
  ReminderSettings,
  ReminderType,
} from "@/components/setting/NotificationTypeModal";
import { parse, format, isValid } from "date-fns";

/** Accept "HH:mm:ss" or "HH:mm" and return "7:30 AM" / "7:30 PM". Return fallback if invalid. */
const TIME_HHMMSS_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;
export const formatBackendTime = (
  time?: string | null,
  fallback = ""
): string => {
  if (!time || typeof time !== "string") return fallback;
  const t = time.trim();
  if (!TIME_HHMMSS_RE.test(t)) return fallback;
  const normalized = t.split(":").length === 2 ? `${t}:00` : t;
  const d = parse(normalized, "HH:mm:ss", new Date());
  if (!isValid(d)) return fallback;
  return format(d, "h:mm a");
};

/** Convert backend 'days_of_week' to a repeat label */
export const repeatLabelFromDays = (entry?: BackendEntry) => {
  if (!entry) return "Off";
  const days = entry.days_of_week ?? [];
  if (days.length === 7) return "Every day";
  const wk = ["mon", "tue", "wed", "thu", "fri"];
  const wkends = ["sat", "sun"];
  const isWeekdays = wk.every((d) => days.includes(d)) && days.length === 5;
  const isWeekends = wkends.every((d) => days.includes(d)) && days.length === 2;
  if (isWeekdays) return "Weekdays";
  if (isWeekends) return "Weekends";
  return days.length ? "Custom" : "Daily";
};

// ⚡ Generic merge function
export function mergeReminders(
  frontendList: ReminderType[],
  backendList: ReminderSettings[]
) {
  return frontendList.map((item) => {
    const backendItem = backendList.find(
      (b) => b.notification_type === item.key
    );

    if (!backendItem) {
      // No backend match — return with defaults
      return {
        ...item,
        enabled: false,
        time: null,
        repeat: null,
        weekdays: [],
        days_of_week: [],
      };
    }

    // Merge dynamically only fields that exist for that backend type
    return {
      ...item,
      enabled: backendItem.enabled,
      time: backendItem.time ?? null,
      repeat: backendItem.repeat ?? null,
      weekdays: backendItem.weekdays ?? [],
      days_of_week: backendItem.days_of_week ?? [],
    };
  });
}

export const inferRepeatFromWeekdays = (
  wd: number[] = []
): "daily" | "weekdays" | "weekends" | "custom" => {
  const set = new Set(wd);
  const isAll =
    wd.length === 7 && [0, 1, 2, 3, 4, 5, 6].every((d) => set.has(d));
  if (isAll) return "daily";

  const isWeekdays =
    wd.length === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d));
  if (isWeekdays) return "weekdays";

  const isWeekends = wd.length === 2 && [0, 6].every((d) => set.has(d));
  if (isWeekends) return "weekends";

  return "custom";
};

type DayShort = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
const DAY_MAP: DayShort[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Accept "HH:mm:ss" or "HH:mm" */
// const TIME_HHMMSS_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;
export const formatToAmPm = (time24?: string | null, fallback = ""): string => {
  if (!time24 || typeof time24 !== "string") return fallback;
  const t = time24.trim();
  if (!TIME_HHMMSS_RE.test(t)) return fallback;
  const normalized = t.split(":").length === 2 ? `${t}:00` : t;
  const dateObj = parse(normalized, "HH:mm:ss", new Date());
  if (!isValid(dateObj)) return fallback;
  return format(dateObj, "h:mm a");
};

/** Converts "HH:mm:ss" -> ISO (today local) */
export const timeStringToISO = (hhmmss?: string | null): string => {
  if (!hhmmss) return new Date().toISOString();
  const [hh = "0", mm = "0", ss = "0"] = hhmmss.split(":");
  const now = new Date();
  now.setHours(Number(hh), Number(mm), Number(ss), 0);
  return now.toISOString();
};

/** convert ["mon","thu"] -> [1,4] */
export const daysShortToNums = (days?: DayShort[] | undefined): number[] => {
  if (!Array.isArray(days)) return [];
  return days.map((d) => DAY_MAP.indexOf(d)).filter((n) => n >= 0);
};

/** convert weekday nums -> ["mon","thu"] */
export const numsToDaysShort = (nums?: number[] | undefined): DayShort[] => {
  if (!Array.isArray(nums)) return [];
  return nums.map((n) => DAY_MAP[n]).filter(Boolean) as DayShort[];
};
