// services/reminderStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReminderSettings = {
  enabled: boolean;
  timeISO: string; // e.g. "2025-09-10T07:30:00.000Z"
  repeat: "once" | "daily" | "weekdays" | "weekends" | "custom";
  weekdays?: number[]; // 0..6 (Sun..Sat)
  snoozeIfMissed?: boolean;
  lastUpdated?: string;
};

const PREFIX = "@nimbus_reminder_";
const DEFAULTS: ReminderSettings = {
  enabled: false,
  timeISO: new Date().toISOString(),
  repeat: "daily",
  weekdays: [1, 2, 3, 4, 5],
  snoozeIfMissed: false,
  lastUpdated: new Date().toISOString(),
};

export const storageKey = (type: string) => PREFIX + type;

export const getReminder = async (
  type: string
): Promise<ReminderSettings | null> => {
  try {
    const raw = await AsyncStorage.getItem(storageKey(type));
    if (!raw) return null;
    return JSON.parse(raw) as ReminderSettings;
  } catch (e) {
    console.warn("getReminder error", e);
    return null;
  }
};

export const saveReminder = async (type: string, payload: ReminderSettings) => {
  try {
    const now = new Date().toISOString();
    const toSave = { ...payload, lastUpdated: now };
    await AsyncStorage.setItem(storageKey(type), JSON.stringify(toSave));
    return toSave;
  } catch (e) {
    console.warn("saveReminder error", e);
    throw e;
  }
};

export const removeReminder = async (type: string) => {
  try {
    await AsyncStorage.removeItem(storageKey(type));
  } catch (e) {
    console.warn("removeReminder error", e);
  }
};

export const seedMockReminders = async () => {
  // Only seed if keys do not exist
  const keys = ["morning", "nightly", "mood", "streak"];
  const now = new Date().toISOString();

  const samples: Record<string, ReminderSettings> = {
    morning: {
      enabled: true,
      timeISO: new Date(new Date().setHours(7, 30, 0, 0)).toISOString(),
      repeat: "weekdays",
      weekdays: [1, 2, 3, 4, 5],
      snoozeIfMissed: true,
      lastUpdated: now,
    },
    nightly: {
      enabled: true,
      timeISO: new Date(new Date().setHours(21, 30, 0, 0)).toISOString(),
      repeat: "daily",
      snoozeIfMissed: false,
      lastUpdated: now,
    },
    mood: {
      enabled: false,
      timeISO: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      repeat: "once",
      snoozeIfMissed: false,
      lastUpdated: now,
    },
    streak: {
      enabled: true,
      timeISO: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
      repeat: "custom",
      weekdays: [0, 2, 4, 6],
      snoozeIfMissed: true,
      lastUpdated: now,
    },
  };

  for (const k of keys) {
    const existing = await getReminder(k);
    if (!existing) {
      await saveReminder(k, samples[k]);
    }
  }
};
