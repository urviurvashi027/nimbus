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
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { useReminder } from "@/context/ReminderContext";
import type { ReminderSettings } from "@/services/remiderStorageService";

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

  const defaultTime = new Date();
  defaultTime.setHours(7, 0, 0, 0);

  const defaultSettings: ReminderSettings = useMemo(
    () => ({
      enabled: false,
      timeISO: defaultTime.toISOString(),
      repeat: "daily",
      weekdays: [1, 2, 3, 4, 5],
      snoozeIfMissed: false,
    }),
    []
  );

  const [settings, setSettings] = useState<ReminderSettings>(defaultSettings);
  const [original, setOriginal] = useState<ReminderSettings | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const loaded = (await get(categoryKey)) ?? defaultSettings;
      if (!mounted) return;
      setSettings(loaded);
      setOriginal(loaded);
    })();
    return () => {
      mounted = false;
    };
  }, [categoryKey, get]);

  const dirty = useMemo(() => {
    if (!original) return false;
    if (original.enabled !== settings.enabled) return true;
    if (original.timeISO !== settings.timeISO) return true;
    if (original.repeat !== settings.repeat) return true;
    if (
      (original.snoozeIfMissed ?? false) !== (settings.snoozeIfMissed ?? false)
    )
      return true;
    const a = (original.weekdays ?? []).join(",");
    const b = (settings.weekdays ?? []).join(",");
    if (a !== b) return true;
    return false;
  }, [original, settings]);

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

  const toggleEnabled = (val: boolean) =>
    setSettings((s) => ({ ...s, enabled: val }));
  const toggleSnooze = (val: boolean) =>
    setSettings((s) => ({ ...s, snoozeIfMissed: val }));

  const onChangeTime = (_: any, picked?: Date) => {
    setShowPicker(false);
    if (picked) {
      const newDate = normalizeToTodayTime(picked);
      setSettings((s) => ({ ...s, timeISO: newDate.toISOString() }));
    }
  };

  const setRepeat = (r: ReminderSettings["repeat"]) => {
    if (r === "weekdays")
      setSettings((s) => ({ ...s, repeat: r, weekdays: [1, 2, 3, 4, 5] }));
    else if (r === "weekends")
      setSettings((s) => ({ ...s, repeat: r, weekdays: [0, 6] }));
    else setSettings((s) => ({ ...s, repeat: r }));
  };

  const toggleWeekday = (d: number) => {
    setSettings((s) => {
      const set = new Set(s.weekdays ?? []);
      if (set.has(d)) set.delete(d);
      else set.add(d);
      return { ...s, repeat: "custom", weekdays: Array.from(set).sort() };
    });
  };

  const doSave = async () => {
    setSaving(true);
    try {
      const saved = await save(categoryKey, settings);
      setOriginal(saved);
      Alert.alert("Saved", "Reminder saved");
      onClose?.();
    } catch (e) {
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
    } else {
      onClose?.();
    }
  };

  if (!visible) return null;

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
              value={settings.enabled}
              onValueChange={toggleEnabled}
              trackColor={{
                true: newTheme.accentPressed,
                false: newTheme.divider,
              }}
              thumbColor={
                settings.enabled ? newTheme.background : newTheme.surface
              }
            />
          </View>

          <TouchableOpacity
            style={styles.timeCard}
            onPress={() => setShowPicker(true)}
          >
            <View>
              <Text style={styles.timeLabel}>Select time</Text>
              <Text style={styles.timeValue}>
                {formatTime(settings.timeISO)}
              </Text>
            </View>
            <Text style={[styles.smallMuted, { marginTop: 4 }]}>
              {settings.enabled ? "Active" : "Inactive"}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.rowLabel}>Repeat</Text>
            <View style={styles.repeatRow}>
              <TouchableOpacity
                onPress={() => setRepeat("daily")}
                style={[
                  styles.repeatButton,
                  settings.repeat === "daily" && {
                    borderColor: newTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    settings.repeat === "daily" && { color: newTheme.accent },
                  ]}
                >
                  Every day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRepeat("weekdays")}
                style={[
                  styles.repeatButton,
                  settings.repeat === "weekdays" && {
                    borderColor: newTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    settings.repeat === "weekdays" && {
                      color: newTheme.accent,
                    },
                  ]}
                >
                  Weekdays
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRepeat("weekends")}
                style={[
                  styles.repeatButton,
                  settings.repeat === "weekends" && {
                    borderColor: newTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.repeatText,
                    settings.repeat === "weekends" && {
                      color: newTheme.accent,
                    },
                  ]}
                >
                  Weekends
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.smallMuted}>Or choose days</Text>
              <View style={styles.weekdaysRow}>
                {["S", "M", "T", "W", "T", "F", "S"].map((l, idx) => {
                  const active = settings.weekdays?.includes(idx);
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

          <View style={[styles.row, { marginTop: 16 }]}>
            <Text style={styles.rowLabel}>Remind again if missed</Text>
            <Switch
              value={!!settings.snoozeIfMissed}
              onValueChange={toggleSnooze}
              trackColor={{
                true: newTheme.accentPressed,
                false: newTheme.divider,
              }}
              thumbColor={
                settings.snoozeIfMissed ? newTheme.background : newTheme.surface
              }
            />
          </View>

          <View style={[styles.previewCard]}>
            <Text style={styles.smallMuted}>Preview</Text>
            <Text style={styles.previewText}>
              {settings.enabled
                ? `${formatTime(settings.timeISO)} · ${settings.repeat}`
                : "Reminders are off"}
            </Text>
          </View>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.btnPrimary]}
              onPress={doSave}
              disabled={saving}
            >
              <Text style={styles.btnPrimaryText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAlt} onPress={cancel}>
              <Text style={styles.btnAltText}>Cancel</Text>
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
                value={new Date(settings.timeISO)}
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
      marginVertical: 8,
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
      marginTop: 6,
      fontSize: 20,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
    repeatRow: { flexDirection: "row", marginTop: 8 },
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
      marginTop: 16,
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
    ctaRow: { marginTop: 18, flexDirection: "row", gap: 12 },
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
