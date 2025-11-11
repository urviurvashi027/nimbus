export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function toHHmm(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromHHmm(hhmm: string) {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

export function overnightDiff(start: Date, end: Date) {
  const s = start.getHours() * 60 + start.getMinutes();
  const e = end.getHours() * 60 + end.getMinutes();
  const diff = (e - s + 24 * 60) % (24 * 60);
  return diff === 0 ? 24 * 60 : diff;
}

export function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${pad(m)}m`;
}

export const toISODate = (d: Date) => d.toISOString().slice(0, 10);
export const toHHmmReading = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;
export const durationFromRange = (start: Date, end: Date) => {
  const s = start.getHours() * 60 + start.getMinutes();
  const e = end.getHours() * 60 + end.getMinutes();
  const diff = (e - s + 24 * 60) % (24 * 60);
  return diff === 0 ? 24 * 60 : diff;
};
