// context/ReminderContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ReminderSettings,
  getReminder,
  saveReminder,
  removeReminder,
  seedMockReminders,
} from "@/services/remiderStorageService";

type ReminderMap = Record<string, ReminderSettings | null>;

type ReminderContextType = {
  loading: boolean;
  reminders: ReminderMap;
  get: (type: string) => Promise<ReminderSettings | null>;
  save: (type: string, payload: ReminderSettings) => Promise<ReminderSettings>;
  remove: (type: string) => Promise<void>;
  refreshAll: () => Promise<void>;
};

const ReminderContext = createContext<ReminderContextType | undefined>(
  undefined
);

export const useReminder = () => {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error("useReminder must be used within ReminderProvider");
  return ctx;
};

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reminders, setReminders] = useState<ReminderMap>({});
  const [loading, setLoading] = useState(true);

  const types = useMemo(() => ["morning", "nightly", "mood", "streak"], []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const next: ReminderMap = {};
    await Promise.all(
      types.map(async (t) => {
        next[t] = await getReminder(t);
      })
    );
    setReminders(next);
    setLoading(false);
  }, [types]);

  useEffect(() => {
    // seed mock data in dev if missing
    (async () => {
      await seedMockReminders();
      await refreshAll();
    })();
  }, [refreshAll]);

  const get = useCallback(async (type: string) => {
    const v = await getReminder(type);
    setReminders((s) => ({ ...s, [type]: v }));
    return v;
  }, []);

  const save = useCallback(async (type: string, payload: ReminderSettings) => {
    const saved = await saveReminder(type, payload);
    setReminders((s) => ({ ...s, [type]: saved }));
    return saved;
  }, []);

  const remove = useCallback(async (type: string) => {
    await removeReminder(type);
    setReminders((s) => ({ ...s, [type]: null }));
  }, []);

  return (
    <ReminderContext.Provider
      value={{ loading, reminders, get, save, remove, refreshAll }}
    >
      {children}
    </ReminderContext.Provider>
  );
};
