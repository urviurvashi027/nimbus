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
  ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import type { ReminderSettings } from "@/services/remiderStorageService";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import {
  daysShortToNums,
  formatToAmPm,
  inferRepeatFromWeekdays,
  numsToDaysShort,
  timeStringToISO,
} from "@/utils/notoficationHelper";
import { arraysEqual, deriveHHmmss } from "@/utils/helper";

type Props = {
  detail: any;
  categoryKey: string;
  title?: string;
  description?: string;
  visible?: boolean;
  onSaved?: () => void;
  onClose?: () => void;
};

export default function ReminderDetail({
  detail,
  categoryKey,
  title = "Reminder",
  description = "",
  visible = true,
  onSaved,
  onClose,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [notif, setNotif] = useState<any>();
  const [original, setOriginal] = useState<any | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [notification, setNotification] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { loadUserFromStorage, updateProfile } = useAuth();

  useEffect(() => {
    console.log(detail, "details");
    const weekdaysNums = daysShortToNums(detail.days_of_week ?? []);
    const computedRepeat =
      detail.repeat || inferRepeatFromWeekdays(weekdaysNums);
    setLoading(true);
    const displayTime = detail.time
      ? formatToAmPm(detail.time, formatTime(detail.timeISO))
      : formatTime(detail.timeISO);
    const normalized = {
      notification_type: categoryKey,
      enabled: !!detail.enabled,
      time: detail.time ?? null,
      timeISO: timeStringToISO(detail.time),
      days_of_week: detail.days_of_week ?? [],
      weekdays: daysShortToNums(detail.days_of_week ?? []),
      // repeat: detail.repeat || null,
      displayTime: displayTime,
      repeat: computedRepeat,
      // snoozeIfMissed: false,
    };
    setNotif(normalized);
    setOriginal(normalized);
    console.log(normalized, "normalized");
  }, [visible]);

  useEffect(() => {
    if (notif?.notification_type) {
      console.log("notification useeffect", notif);
      setLoading(false);
    }
  }, [notif]);

  // Dirty check
  const dirty = useMemo(() => {
    if (!original || !notif) return false;
    if (original.enabled !== notif.enabled) return true;

    const origTime = deriveHHmmss(original);
    const nextTime = deriveHHmmss(notif);
    if (origTime !== nextTime) return true;

    if (!arraysEqual(original.weekdays ?? [], notif.weekdays ?? []))
      return true;
    return false;
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

  const onChangeTime = (e: any, picked?: Date) => {
    if (Platform.OS === "android") {
      if (e?.type !== "set") return;
      setShowPicker(false);
    }
    if (!picked) return;

    const nd = normalizeToTodayTime(picked);
    const hh = String(nd.getHours()).padStart(2, "0");
    const mm = String(nd.getMinutes()).padStart(2, "0");
    setNotif((s: any) => ({
      ...s,
      timeISO: nd.toISOString(),
      time: `${hh}:${mm}:00`,
    }));
  };

  // Build backend payload and save
  const doSave = async () => {
    setSaving(true);
    try {
      // compute field-level diff
      const patch: Record<string, any> = {};

      if (original?.enabled !== notif?.enabled) {
        patch.enabled = !!notif.enabled;
      }

      // compare canonical times (HH:mm:ss)
      const origTime = deriveHHmmss(original);
      const nextTime = deriveHHmmss(notif);
      if (origTime !== nextTime) {
        patch.time = nextTime;
      }

      // compare weekdays -> send days_of_week only if changed
      const origWeekdays = original?.weekdays ?? [];
      const nextWeekdays = notif?.weekdays ?? [];
      if (!arraysEqual(origWeekdays, nextWeekdays)) {
        patch.days_of_week = numsToDaysShort(nextWeekdays); // e.g. ["mon","thu"]
      }

      // nothing changed? bail early
      if (Object.keys(patch).length === 0) {
        Toast.show({
          type: "info",
          text1: "No changes to save",
          position: "bottom",
        });
        setSaving(false);
        return;
      }

      // final payload: only the changed fields + identifier
      const backendPayload = {
        notifications: [
          {
            notification_type: categoryKey,
            ...patch,
          },
        ],
      };

      const saved = await updateProfile?.(backendPayload);
      const { success, data } = saved;

      if (success) {
        onSaved?.();
        Toast.show({
          type: "success",
          text1: "Reminder updated",
          position: "bottom",
        });

        // update originals so dirty check resets
        const nextOriginal = {
          ...original,
          ...notif,
          enabled: patch.enabled ?? original.enabled,
          time: patch.time ?? original.time,
          weekdays: nextWeekdays, // keep nums in local state
          days_of_week: patch.days_of_week ?? original.days_of_week,
        };
        setOriginal(nextOriginal);
      }
    } catch (e) {
      console.warn("save error", e);
      Toast.show({
        type: "error",
        text1: "Could not save reminder",
        position: "bottom",
      });
    } finally {
      setSaving(false);
      onClose?.();
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

  const displayTime = useMemo(() => {
    const iso = notif?.timeISO ?? new Date().toISOString();
    return format(new Date(iso), "h:mm a");
  }, [notif?.timeISO]);

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

        {!notif ? (
          <ActivityIndicator size="large" color={newTheme.accent} />
        ) : (
          <View style={styles.body}>
            <Text style={styles.desc}>
              {description || "Get a gentle nudge to log this."}
            </Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Reminder</Text>
              <Switch
                value={!!notif.enabled}
                onValueChange={toggleEnabled}
                trackColor={{
                  true: newTheme.accentPressed,
                  false: newTheme.divider,
                }}
                thumbColor={
                  notif.enabled ? newTheme.background : newTheme.surface
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
                {notif?.enabled ? "Active" : "Inactive"}
              </Text>
            </TouchableOpacity>

            <View style={{ marginTop: 25 }}>
              <Text style={styles.rowLabel}>Repeat</Text>
              <View style={styles.repeatRow}>
                <TouchableOpacity
                  onPress={() => setRepeat("daily")}
                  style={[
                    styles.repeatButton,
                    notif.repeat === "daily" && {
                      borderColor: newTheme.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.repeatText,
                      notif.repeat === "daily" && { color: newTheme.accent },
                    ]}
                  >
                    Every day
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRepeat("weekdays")}
                  style={[
                    styles.repeatButton,
                    notif.repeat === "weekdays" && {
                      borderColor: newTheme.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.repeatText,
                      notif.repeat === "weekdays" && { color: newTheme.accent },
                    ]}
                  >
                    Weekdays
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRepeat("weekends")}
                  style={[
                    styles.repeatButton,
                    notif.repeat === "weekends" && {
                      borderColor: newTheme.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.repeatText,
                      notif.repeat === "weekends" && { color: newTheme.accent },
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
                    const active = (notif.weekdays ?? []).includes(idx);
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
                {notif.enabled
                  ? `${formatTime(notif.timeISO)} · ${notif.repeat}`
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
        )}

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
              {notif ? (
                <DateTimePicker
                  mode="time"
                  value={new Date(notif.timeISO ?? new Date().toISOString())}
                  display={Platform.OS === "ios" ? "spinner" : "clock"}
                  onChange={onChangeTime}
                />
              ) : (
                <ActivityIndicator size="small" color={newTheme.accent} />
              )}
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
