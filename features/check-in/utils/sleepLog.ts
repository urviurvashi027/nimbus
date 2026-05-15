export function setHM(hours: number, minutes: number): Date;
export function setHM(base: Date, hours: number, minutes: number): Date;
export function setHM(
  arg1: Date | number,
  arg2: number,
  arg3?: number
): Date {
  const base = arg1 instanceof Date ? arg1 : new Date();
  const hours = arg1 instanceof Date ? arg2 : arg1;
  const minutes = arg1 instanceof Date ? (arg3 ?? 0) : arg2;

  const t = new Date(base);
  t.setHours(hours, minutes, 0, 0);
  return t;
}

export const mergeHM = (base: Date, src: Date) => {
  const t = new Date(base);
  t.setHours(src.getHours(), src.getMinutes(), 0, 0);
  return t;
};

export const addDays = (date: Date, days: number) => {
  const t = new Date(date);
  t.setDate(t.getDate() + days);
  return t;
};

export const addMinutes = (date: Date, minutes: number) => {
  const t = new Date(date);
  t.setMinutes(t.getMinutes() + minutes);
  return t;
};

export const diffMinutes = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / 60000));
};

export const formatHM = (date: Date) => {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const formatSleepClock = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const formatSleepDateChip = (date: Date) => {
  const day = date.toLocaleDateString([], { weekday: "short" });
  return {
    day: day.toUpperCase(),
    label: `${date.getDate()}`,
  };
};

export const getPastSleepDates = (count = 7) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) =>
    addDays(startOfToday, -(index + 1))
  );
};
