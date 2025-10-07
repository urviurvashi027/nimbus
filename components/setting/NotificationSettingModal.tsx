// components/ReminderDetail.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { parse, format, isValid } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import { useReminder } from "@/context/ReminderContext";
import type { ReminderSettings } from "@/services/remiderStorageService";

type DayShort = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
const DAY_MAP: DayShort[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Accept "HH:mm:ss" or "HH:mm" */
const TIME_HHMMSS_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;
export const formatToAmPm = (time24?: string | null, fallback = ""): string => {
  if (!time24 || typeof time24 !== "string") return fallback;
  const t = time24.trim();
  if (!TIME_HHMMSS_RE.test(t)) return fallback;
  const normalized = t.split(":").length === 2 ? `${t}:00` : t;
  const dateObj = parse(normalized, "HH:mm:ss", new Date());
  if (!isValid(dateObj)) return fallback;
  return format(dateObj, "h:mm a");
};

/** Converts "HH:mm:ss" -> ISO (today local) */
const timeStringToISO = (hhmmss?: string | null): string => {
  if (!hhmmss) return new Date().toISOString();
  const [hh = "0", mm = "0", ss = "0"] = hhmmss.split(":");
  const now = new Date();
  now.setHours(Number(hh), Number(mm), Number(ss), 0);
  return now.toISOString();
};

/** convert ["mon","thu"] -> [1,4] */
const daysShortToNums = (days?: DayShort[] | undefined): number[] => {
  if (!Array.isArray(days)) return [];
  return days.map((d) => DAY_MAP.indexOf(d)).filter((n) => n >= 0);
};

/** convert weekday nums -> ["mon","thu"] */
const numsToDaysShort = (nums?: number[] | undefined): DayShort[] => {
  if (!Array.isArray(nums)) return [];
  return nums.map((n) => DAY_MAP[n]).filter(Boolean) as DayShort[];
};

type BackendMap = Record<
  string,
  { enabled?: boolean; time?: string; days_of_week?: DayShort[] }
>;

type Props = {
  categoryKey: string;
  title?: string;
  description?: string;
  visible?: boolean;
  onClose?: () => void;
};

export default function ReminderDetail({
  categoryKey,
  title = "Reminder",
  description = "",
  visible = true,
  onClose,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);
  const { get, save } = useReminder();

  // default UI notification shape consumed by component
  const defaultNotif = useMemo(() => {
    const dd = new Date();
    dd.setHours(7, 0, 0, 0);
    return {
      notification_type: categoryKey,
      enabled: false,
      time: "07:00:00",
      timeISO: dd.toISOString(),
      days_of_week: ["mon", "tue", "wed", "thu", "fri"] as DayShort[],
      weekdays: [1, 2, 3, 4, 5],
      repeat: "daily" as ReminderSettings["repeat"],
      // snoozeIfMissed: false,
    };
  }, [categoryKey]);

  const [backendMap, setBackendMap] = useState<BackendMap | null>(null);
  const [notif, setNotif] = useState<any>(defaultNotif);
  const [original, setOriginal] = useState<any | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load only current backend shape (keyed object)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const map = (await get(categoryKey)) as BackendMap | null;
        if (!mounted) return;
        setBackendMap(map ?? null);

        const backendEntry = map?.[categoryKey];

        console.log(map, "backendEntryo");
        if (!backendEntry) {
          // fallback to defaults
          setNotif(defaultNotif);
          setOriginal(defaultNotif);
          return;
        }

        const normalized = {
          notification_type: categoryKey,
          enabled: !!backendEntry.enabled,
          time: backendEntry.time ?? defaultNotif.time,
          timeISO: timeStringToISO(backendEntry.time ?? defaultNotif.time),
          days_of_week: backendEntry.days_of_week ?? defaultNotif.days_of_week,
          weekdays: daysShortToNums(
            backendEntry.days_of_week ?? defaultNotif.days_of_week
          ),
          repeat: defaultNotif.repeat,
          // snoozeIfMissed: false,
        };

        setNotif(normalized);
        setOriginal(normalized);
      } catch (e) {
        console.warn("ReminderDetail load error:", e);
        setNotif(defaultNotif);
        setOriginal(defaultNotif);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [categoryKey, get, defaultNotif]);

  // Dirty check
  const dirty = useMemo(() => {
    if (!original || !notif) return false;
    if (original.enabled !== notif.enabled) return true;
    if (original.time !== notif.time) return true;
    const a = (original.weekdays ?? []).join(",");
    const b = (notif.weekdays ?? []).join(",");
    return a !== b;
  }, [original, notif]);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const normalizeToTodayTime = (picked: Date) => {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      picked.getHours(),
      picked.getMinutes(),
      0,
      0
    );
  };

  // Handlers
  const toggleEnabled = (val: boolean) =>
    setNotif((s: any) => ({ ...s, enabled: val }));
  const setRepeat = (r: ReminderSettings["repeat"]) => {
    if (r === "weekdays")
      setNotif((s: any) => ({ ...s, repeat: r, weekdays: [1, 2, 3, 4, 5] }));
    else if (r === "weekends")
      setNotif((s: any) => ({ ...s, repeat: r, weekdays: [0, 6] }));
    else
      setNotif((s: any) => ({
        ...s,
        repeat: r,
        weekdays: [0, 1, 2, 3, 4, 5, 6],
      }));
  };
  const toggleWeekday = (d: number) => {
    setNotif((s: any) => {
      const set = new Set(s.weekdays ?? []);
      if (set.has(d)) set.delete(d);
      else set.add(d);
      return { ...s, repeat: "custom", weekdays: Array.from(set).sort() };
    });
  };

  const onChangeTime = (_: any, picked?: Date) => {
    setShowPicker(false);
    if (!picked) return;
    const nd = normalizeToTodayTime(picked);
    const hh = String(nd.getHours()).padStart(2, "0");
    const mm = String(nd.getMinutes()).padStart(2, "0");
    const ss = "00";
    setNotif((s: any) => ({
      ...s,
      timeISO: nd.toISOString(),
      time: `${hh}:${mm}:${ss}`,
    }));
  };

  // Build backend payload and save
  const doSave = async () => {
    setSaving(true);
    try {
      const timeHHmmss =
        notif.time ??
        (() => {
          const d = new Date(notif.timeISO);
          return `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
          ).padStart(2, "0")}:00`;
        })();

      const backendPayload = {
        notifications: [
          {
            notification_type: categoryKey,
            enabled: !!notif.enabled,
            time: timeHHmmss,
            days_of_week: numsToDaysShort(notif.weekdays), // e.g. ["mon","thu"]
          },
        ],
      };

      console.log(backendPayload, "backendPayload");

      // assume save(categoryKey, backendPayload) is expected
      const saved = await save(categoryKey, backendPayload);

      console.log(saved, "saved");

      // if save returns updated map or object, reflect it. otherwise keep local notif as original.
      // if (saved && typeof saved === "object") {
      // const updatedBackendEntry = (saved as any)[categoryKey] ?? saved;
      // const normalized = {
      //   notification_type: categoryKey,
      //   enabled: !!updatedBackendEntry.enabled,
      //   time: updatedBackendEntry.time ?? timeHHmmss,
      //   timeISO: timeStringToISO(updatedBackendEntry.time ?? timeHHmmss),
      //   days_of_week:
      //     updatedBackendEntry.days_of_week ?? numsToDaysShort(notif.weekdays),
      //   weekdays: daysShortToNums(
      //     updatedBackendEntry.days_of_week ?? numsToDaysShort(notif.weekdays)
      //   ),
      //   repeat: notif.repeat,
      //   snoozeIfMissed: notif.snoozeIfMissed ?? false,
      // };
      // setNotif(normalized);
      // setOriginal(normalized);
      // } else {
      //   setOriginal(notif);
      // }

      // Alert.alert("Saved", "Reminder saved");
      onClose?.();
    } catch (e) {
      console.warn("save error", e);
      Alert.alert("Error", "Could not save reminder");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (dirty) {
      Alert.alert("Discard changes?", "You have unsaved changes. Discard?", [
        { text: "Keep editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => onClose?.() },
      ]);
    } else onClose?.();
  };

  if (!visible) return null;
  const current = notif ?? defaultNotif;
  const displayTime = current.time
    ? formatToAmPm(current.time, formatTime(current.timeISO))
    : formatTime(current.timeISO);

  console.log(current, displayTime, "current");

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.screen]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={cancel} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{title}</Text>
            {dirty ? <Text style={styles.unsavedPill}>UNSAVED</Text> : null}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.desc}>
            {description || "Get a gentle nudge to log this."}
          </Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reminder</Text>
            <Switch
              value={!!current.enabled}
              onValueChange={toggleEnabled}
              trackColor={{
                true: newTheme.accentPressed,
                false: newTheme.divider,
              }}
              thumbColor={
                current.enabled ? newTheme.background : newTheme.surface
              }
            />
          </View>

          <TouchableOpacity
            style={styles.timeCard}
            onPress={() => setShowPicker(true)}
          >
            <View>
              <Text style={styles.timeLabel}>Select time</Text>
              <Text style={styles.timeValue}>{displayTime}</Text>
            </View>
            <Text style={[styles.smallMuted, { marginTop: 4 }]}>
              {current.enabled ? "Active" : "Inactive"}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 25 }}>
            <Text style={styles.rowLabel}>Repeat</Text>
            <View style={styles.repeatRow}>
              <TouchableOpacity
                onPress={() => setRepeat("daily")}
                style={[
                  styles.repeatButton,
                  current.repeat === "daily" && {
                    borderColor: newTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    current.repeat === "daily" && { color: newTheme.accent },
                  ]}
                >
                  Every day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRepeat("weekdays")}
                style={[
                  styles.repeatButton,
                  current.repeat === "weekdays" && {
                    borderColor: newTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    current.repeat === "weekdays" && { color: newTheme.accent },
                  ]}
                >
                  Weekdays
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRepeat("weekends")}
                style={[
                  styles.repeatButton,
                  current.repeat === "weekends" && {
                    borderColor: newTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    current.repeat === "weekends" && { color: newTheme.accent },
                  ]}
                >
                  Weekends
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.smallMuted}>Or choose days</Text>
              <View style={styles.weekdaysRow}>
                {["S", "M", "T", "W", "T", "F", "S"].map((l, idx) => {
                  const active = (current.weekdays ?? []).includes(idx);
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => toggleWeekday(idx)}
                      style={[
                        styles.weekdayButton,
                        active
                          ? { backgroundColor: newTheme.accent }
                          : { backgroundColor: newTheme.surface },
                      ]}
                    >
                      <Text
                        style={[
                          styles.weekdayText,
                          active
                            ? { color: newTheme.background }
                            : { color: newTheme.textPrimary },
                        ]}
                      >
                        {l}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={[styles.previewCard]}>
            <Text style={styles.smallMuted}>Preview</Text>
            <Text style={styles.previewText}>
              {current.enabled
                ? `${formatTime(current.timeISO)} · ${current.repeat}`
                : "Reminders are off"}
            </Text>
          </View>

          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.btnAlt} onPress={cancel}>
              <Text style={styles.btnAltText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnPrimary]}
              onPress={doSave}
              disabled={saving}
            >
              <Text style={styles.btnPrimaryText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable
            style={styles.pickerOverlay}
            onPress={() => setShowPicker(false)}
          >
            <View style={styles.pickerContainer}>
              <DateTimePicker
                mode="time"
                value={new Date(current.timeISO)}
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={onChangeTime}
              />
              <View style={styles.pickerButtons}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.pickerBtn}
                >
                  <Text style={styles.pickerBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </Modal>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: newTheme.background, paddingTop: 90 },
    headerRow: {
      height: 72,
      paddingHorizontal: 16,
      alignItems: "center",
      flexDirection: "row",
    },
    back: { padding: 8, marginRight: 8 },
    backText: { fontSize: 22, color: newTheme.textPrimary },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
    unsavedPill: {
      marginTop: 4,
      color: newTheme.background,
      backgroundColor: newTheme.error,
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontWeight: "700",
    },
    body: { padding: 16 },
    desc: { color: newTheme.textSecondary, marginBottom: 12 },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 15,
    },
    rowLabel: { color: newTheme.textPrimary, fontSize: 16 },
    timeCard: {
      marginTop: 12,
      padding: 14,
      borderRadius: 12,
      backgroundColor: newTheme.surface,
      borderWidth: 1,
      borderColor: newTheme.divider,
    },
    timeLabel: { color: newTheme.textSecondary },
    timeValue: {
      marginVertical: 10,
      fontSize: 20,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
    repeatRow: { flexDirection: "row", marginVertical: 15 },
    repeatButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "transparent",
      marginRight: 8,
    },
    repeatText: { color: newTheme.textSecondary, fontWeight: "600" },
    weekdaysRow: { flexDirection: "row", marginTop: 8 },
    weekdayButton: {
      width: 38,
      height: 38,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    weekdayText: { fontWeight: "700" },
    smallMuted: { color: newTheme.textSecondary, fontSize: 13 },
    previewCard: {
      marginTop: 25,
      padding: 12,
      backgroundColor: newTheme.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: newTheme.divider,
    },
    previewText: {
      marginTop: 8,
      color: newTheme.textPrimary,
      fontWeight: "700",
    },
    ctaRow: { marginTop: 25, flexDirection: "row", gap: 12 },
    btnPrimary: {
      backgroundColor: newTheme.accent,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
    },
    btnPrimaryText: { color: newTheme.background, fontWeight: "700" },
    btnAlt: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: newTheme.divider,
      flex: 1,
    },
    btnAltText: { color: newTheme.textPrimary, fontWeight: "700" },
    pickerOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "flex-end",
    },
    pickerContainer: {
      backgroundColor: newTheme.surface,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingBottom: Platform.OS === "ios" ? 32 : 12,
      paddingTop: 8,
    },
    pickerButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    pickerBtn: { paddingVertical: 10, paddingHorizontal: 18 },
    pickerBtnText: { color: newTheme.accent, fontWeight: "700", fontSize: 16 },
  });
