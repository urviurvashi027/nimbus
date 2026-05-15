export const DEFAULT_GOAL_MINUTES = 15;

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatMinutes = (minutes: number) => {
  const safe = Math.max(0, minutes);
  const rounded = Math.round(safe * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}m`;
};

export const parseAnchorAt = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const parseGoalMinutes = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw ?? DEFAULT_GOAL_MINUTES);

  return clamp(
    Number.isFinite(parsed) ? parsed : DEFAULT_GOAL_MINUTES,
    5,
    60
  );
};
