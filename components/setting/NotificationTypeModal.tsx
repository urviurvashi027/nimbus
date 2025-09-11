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
import ReminderDetail from "./NotificationSettingModal";
import { useReminder } from "@/context/ReminderContext";

type ReminderType = { key: string; label: string; desc?: string };

const REMINDER_TYPES: ReminderType[] = [
  {
    key: "morning",
    label: "Morning check-in",
    desc: "Start your day with a quick reflection.",
  },
  {
    key: "nightly",
    label: "Nightly review",
    desc: "Wind down and review today.",
  },
  { key: "mood", label: "Log your mood", desc: "Capture how you feel." },
  {
    key: "streak",
    label: "Streak saver",
    desc: "Save your streak if you’re about to lose it.",
  },
];

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
    if (visible) {
      // refresh to ensure we read latest values
      refreshAll();
    }
  }, [visible]);

  const statusLabel = (key: string) => {
    const r = reminders[key];
    if (!r || !r.enabled) return "Off";
    const t = new Date(r.timeISO).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const repeat = r.repeat || "daily";
    const repeatLabel =
      repeat === "daily"
        ? "Every day"
        : repeat === "weekdays"
        ? "Weekdays"
        : repeat === "weekends"
        ? "Weekends"
        : "Custom";
    return `${t} · ${repeatLabel}`;
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
              renderItem={({ item }) => (
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
              )}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          )}
        </View>

        {/* nested detail */}
        {selected && (
          <ReminderDetail
            categoryKey={selected.key}
            title={selected.label}
            description={selected.desc}
            visible={detailVisible}
            onClose={() => {
              setDetailVisible(false);
              setSelected(null);
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
