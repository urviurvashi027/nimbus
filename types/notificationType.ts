// UI Types
export type NotificationType = {
  id: string;
  key: string;
  label: string;
  desc?: string;
};

export type DayShort = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

// export type ReminderSettings = {
//   repeat?: "once" | "daily" | "weekdays" | "weekends" | "custom";
//   weekdays?: number[];
//   notification_type: string; // e.g. "morning_review"
//   enabled: boolean;
//   time: string; // "07:30:00"
//   days_of_week?: DayShort[];
// };

export type ReminderSettings = {
  // timeISO: string; // e.g. "2025-09-10T07:30:00.000Z"
  repeat: "once" | "daily" | "weekdays" | "weekends" | "custom";
  weekdays?: number[]; // 0..6 (Sun..Sat)

  notification_type: string; // e.g. "morning_review"
  enabled: boolean;
  time: string; // "07:30:00" (HH:mm:ss)
  days_of_week?: DayShort[]; // ["mon","thu"]
};
