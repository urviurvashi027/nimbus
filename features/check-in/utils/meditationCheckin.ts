export type WeeklyPoint = {
  day: string;
  percent: number;
};

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const REMINDER_OPTIONS = [15, 30, 60] as const;
export const DEFAULT_GOAL_MINUTES = 20;
export const DEFAULT_COMPLETED_MINUTES = 12;
export const DEFAULT_START_TIME_MINUTES = 20 * 60;

export const MOCK_WEEKLY_MEDITATION: WeeklyPoint[] = [
  { day: "Mon", percent: 34 },
  { day: "Tue", percent: 48 },
  { day: "Wed", percent: 59 },
  { day: "Thu", percent: 52 },
  { day: "Fri", percent: 67 },
  { day: "Sat", percent: 74 },
  { day: "Sun", percent: 63 },
];

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export const formatMinutes = (minutes: number) =>
  `${Math.max(0, Math.round(minutes))}m`;

export const formatClockTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const setHoursMinutes = (hours: number, minutes: number) => {
  const next = new Date();
  next.setHours(hours, minutes, 0, 0);
  return next;
};

export const parseTimeToDate = (
  value?: string | null,
  fallbackMinutes = DEFAULT_START_TIME_MINUTES
) => {
  if (!value) {
    return setHoursMinutes(
      Math.floor(fallbackMinutes / 60),
      fallbackMinutes % 60
    );
  }

  const input = String(value).trim();
  const hhmm = input.match(/(\d{1,2}):(\d{2})/);
  if (hhmm) {
    return setHoursMinutes(Number(hhmm[1]), Number(hhmm[2]));
  }

  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return setHoursMinutes(
    Math.floor(fallbackMinutes / 60),
    fallbackMinutes % 60
  );
};

export const parseReminderIndex = (value?: string | null) => {
  const reminderValue = Number(String(value ?? "").match(/\d+/)?.[0] ?? NaN);
  const index = REMINDER_OPTIONS.indexOf(
    reminderValue as (typeof REMINDER_OPTIONS)[number]
  );
  return index >= 0 ? index : 1;
};

export const buildWeeklyMeditationSeries = (raw: unknown): WeeklyPoint[] => {
  const source = Array.isArray(raw) ? raw : [];

  return WEEK_DAYS.map((day, index) => {
    const entry = source[index];

    if (typeof entry === "number") {
      return {
        day,
        percent: clamp(entry, 0, 100),
      };
    }

    if (entry && typeof entry === "object") {
      const candidate = entry as Record<string, unknown>;
      return {
        day: String(candidate.day ?? day),
        percent: clamp(
          Number(candidate.percent ?? candidate.value ?? candidate.progress ?? 0),
          0,
          100
        ),
      };
    }

    return { day, percent: 0 };
  });
};

export const hasMeaningfulWeeklyData = (data: WeeklyPoint[]) =>
  data.some((point) => point.percent > 0);

export const getAverage = (data: WeeklyPoint[]) => {
  if (!data.length) return 0;
  const total = data.reduce((sum, point) => sum + point.percent, 0);
  return Math.round((total / data.length) * 10) / 10;
};

export const getProgressLabel = (progress: number) => {
  if (progress >= 1) return "SESSION COMPLETE";
  if (progress >= 0.75) return "APPROACHING STILLNESS";
  if (progress >= 0.5) return "SETTLING IN";
  if (progress > 0) return "ARRIVING";
  return "READY TO BEGIN";
};
