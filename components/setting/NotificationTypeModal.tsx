// components/NotificationTypeModal.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import ReminderDetail from "./NotificationSettingModal"; // your detail component
import { useReminder } from "@/context/ReminderContext";
import { parse, format, isValid } from "date-fns";

type ReminderType = { id: string; key: string; label: string; desc?: string };

const REMINDER_TYPES: ReminderType[] = [
  {
    key: "morning_review",
    id: "morning",
    label: "Morning check-in",
    desc: "Start your day with a quick reflection.",
  },
  {
    key: "night_review",
    id: "nightly",
    label: "Nightly review",
    desc: "Wind down and review today.",
  },
  {
    key: "mood_logger",
    id: "mood",
    label: "Log your mood",
    desc: "Capture how you feel.",
  },
  {
    key: "streak_saver",
    id: "streak",
    label: "Streak saver",
    desc: "Save your streak if you’re about to lose it.",
  },
];

type BackendEntry = {
  enabled?: boolean;
  time?: string; // "HH:mm:ss"
  days_of_week?: string[]; // ["mon","thu"]
  // might include other backend keys in future
};

/* Helpers */

/** Accept "HH:mm:ss" or "HH:mm" and return "7:30 AM" / "7:30 PM". Return fallback if invalid. */
const TIME_HHMMSS_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;
const formatBackendTime = (time?: string | null, fallback = ""): string => {
  if (!time || typeof time !== "string") return fallback;
  const t = time.trim();
  if (!TIME_HHMMSS_RE.test(t)) return fallback;
  const normalized = t.split(":").length === 2 ? `${t}:00` : t;
  const d = parse(normalized, "HH:mm:ss", new Date());
  if (!isValid(d)) return fallback;
  return format(d, "h:mm a");
};

/** Convert backend 'days_of_week' to a repeat label */
const repeatLabelFromDays = (entry?: BackendEntry) => {
  if (!entry) return "Off";
  const days = entry.days_of_week ?? [];
  if (days.length === 7) return "Every day";
  const wk = ["mon", "tue", "wed", "thu", "fri"];
  const wkends = ["sat", "sun"];
  const isWeekdays = wk.every((d) => days.includes(d)) && days.length === 5;
  const isWeekends = wkends.every((d) => days.includes(d)) && days.length === 2;
  if (isWeekdays) return "Weekdays";
  if (isWeekends) return "Weekends";
  return days.length ? "Custom" : "Daily";
};

export default function NotificationTypeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const { loading, reminders, refreshAll } = useReminder();

  const [selected, setSelected] = useState<ReminderType | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    if (visible) refreshAll();
  }, [visible, refreshAll]);

  const statusLabel = (key: string) => {
    // reminders is expected to be keyed object: { morning_review: {enabled, time, days_of_week}, ... }
    const entry = (reminders as Record<string, BackendEntry> | undefined)?.[
      key
    ];
    // Not configured
    if (!entry) return "Off";

    if (!entry.enabled) return "Off";

    // Prefer time from backend time (HH:mm:ss). If backend doesn't supply, fallback label
    const timeText = formatBackendTime(entry.time, "");
    const repeatText = repeatLabelFromDays(entry);
    return timeText ? `${timeText} · ${repeatText}` : repeatText;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={newTheme.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.subtitle}>Choose a reminder to edit</Text>

          {loading ? (
            <ActivityIndicator size="large" color={newTheme.accent} />
          ) : (
            <FlatList
              data={REMINDER_TYPES}
              keyExtractor={(i) => i.key}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setSelected(item);
                      setDetailVisible(true);
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>{item.label}</Text>
                      {item.desc ? (
                        <Text style={styles.desc}>{item.desc}</Text>
                      ) : null}
                    </View>

                    <View style={styles.rowRight}>
                      <Text style={styles.statusText}>
                        {statusLabel(item.key)}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={newTheme.textSecondary}
                        style={{ marginLeft: 8 }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          )}
        </View>

        {selected && (
          <ReminderDetail
            categoryKey={selected.key}
            title={selected.label}
            description={selected.desc}
            visible={detailVisible}
            onClose={() => {
              setDetailVisible(false);
              setSelected(null);
              // refresh so list updates after edit
              refreshAll();
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: theme.background, paddingTop: 90 },
    header: {
      height: 74,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    backBtn: { padding: 6, marginRight: 8 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: theme.textPrimary },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: theme.background,
    },
    subtitle: { color: theme.textSecondary, marginBottom: 12, fontSize: 14 },
    item: {
      paddingVertical: 16,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 10,
    },
    label: { color: theme.textPrimary, fontSize: 16, fontWeight: "600" },
    desc: { color: theme.textSecondary, fontSize: 13, marginTop: 4 },
    rowRight: { flexDirection: "row", alignItems: "center" },
    statusText: { color: theme.textSecondary, fontSize: 14 },
    sep: { height: 1, backgroundColor: theme.divider, marginVertical: 6 },
  });
