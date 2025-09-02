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
