import { format, addDays, subDays } from "date-fns";

export const generateDates = (center: Date, range = 14) => {
  const dates: Date[] = [];
  for (let i = -range; i <= range; i++) {
    dates.push(addDays(center, i));
  }
  return dates;
};

export const formatDay = (date: Date) => format(date, "EEE"); // Sun, Mon
export const formatDate = (date: Date) => format(date, "dd"); // 25
export const formatApiDate = (date: Date) => format(date, "yyyy-MM-dd");

// small helper
export const formatReminderTime = (raw: any, fallback = "8:00 AM") => {
  if (!raw) return fallback;

  try {
    let d: Date | null = null;

    if (typeof raw === "number") {
      // if backend stores epoch seconds
      const ms = raw.toString().length === 10 ? raw * 1000 : raw;
      d = new Date(ms);
    } else if (typeof raw === "string") {
      // if it's already "8:00 AM" or similar, just return it
      if (/am|pm/i.test(raw)) {
        return raw;
      }

      // HH:mm   → "1970-01-01T08:00:00"
      if (/^\d{2}:\d{2}$/.test(raw)) {
        d = new Date(`1970-01-01T${raw}:00`);
      }
      // HH:mm:ss → "1970-01-01T08:00:00"
      else if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) {
        d = new Date(`1970-01-01T${raw}`);
      } else {
        // last attempt: let JS try to parse it as a full date string
        d = new Date(raw);
      }
    }

    if (!d || isNaN(d.getTime())) {
      return fallback;
    }

    return format(d, "hh:mm a");
  } catch {
    return fallback;
  }
};
