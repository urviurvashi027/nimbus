export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export const formatHours = (minutes: number) => {
  const hours = Math.max(0, minutes) / 60;
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded.toFixed(1)}h`;
};

export const formatGoalHours = (minutes: number) => {
  const hours = Math.max(0, minutes) / 60;
  const rounded = Math.round(hours * 10) / 10;
  return Number.isInteger(rounded)
    ? `${rounded.toFixed(0)}h`
    : `${rounded.toFixed(1)}h`;
};
