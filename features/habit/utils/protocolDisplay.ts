import type { HabitDateType } from "@/features/habit/types/habitTypes";

const WEEKDAY_LABELS: Record<string, string> = {
  su: "Sun",
  mo: "Mon",
  tu: "Tue",
  we: "Wed",
  th: "Thu",
  fr: "Fri",
  sa: "Sat",
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

const normalizeWeekdayLabel = (value: string) => {
  const key = value.trim().toLowerCase();
  return WEEKDAY_LABELS[key] ?? value;
};

const pluralize = (value: number, singular: string) =>
  value === 1 ? singular : `${singular}s`;

export const formatProtocolFrequencySummary = (
  protocolFrequency?: Pick<
    HabitDateType,
    "frequency_type" | "interval" | "days_of_week" | "days_of_month"
  > | null
) => {
  const frequency = protocolFrequency?.frequency_type?.toLowerCase();
  if (!frequency) return "";

  const interval = Math.max(1, Number(protocolFrequency?.interval ?? 1));
  const unit =
    frequency === "daily"
      ? pluralize(interval, "day")
      : frequency === "weekly"
      ? pluralize(interval, "week")
      : pluralize(interval, "month");

  const base = interval === 1 ? `Every ${unit}` : `Every ${interval} ${unit}`;

  if (frequency === "weekly") {
    const days = (protocolFrequency?.days_of_week ?? [])
      .map(normalizeWeekdayLabel)
      .filter(Boolean);
    return days.length ? `${base} on ${days.join(", ")}` : base;
  }

  if (frequency === "monthly") {
    const dates = (protocolFrequency?.days_of_month ?? []).filter(
      (day): day is number => typeof day === "number" && Number.isFinite(day)
    );
    return dates.length ? `${base} on ${dates.join(", ")}` : base;
  }

  return base;
};
