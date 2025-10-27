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
import { useAuth } from "@/context/AuthContext";
import {
  formatBackendTime,
  mergeReminders,
  repeatLabelFromDays,
} from "@/utils/notoficationHelper";

export type ReminderType = {
  id: string;
  key: string;
  label: string;
  desc?: string;
};

export type DayShort = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type ReminderSettings = {
  repeat?: "once" | "daily" | "weekdays" | "weekends" | "custom";
  weekdays?: number[];
  notification_type: string; // e.g. "morning_review"
  enabled: boolean;
  time: string; // "07:30:00"
  days_of_week?: DayShort[];
};

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

export type BackendEntry = {
  enabled?: boolean;
  time?: string; // "HH:mm:ss"
  days_of_week?: string[]; // ["mon","thu"]
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

  const [selected, setSelected] = useState<ReminderType | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [notification, setNotification] = useState<any>();
  const [loading, setLoading] = useState(false);

  const { loadUserFromStorage } = useAuth();

  const refreshAll = React.useCallback(async () => {
    setLoading(true);
    const cached = await loadUserFromStorage?.();
    const r = mergeReminders(REMINDER_TYPES, cached?.notifications ?? []);
    setNotification(r);
    setLoading(false);
  }, [loadUserFromStorage]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]); // initial load

  useEffect(() => {
    // console.log("coming here useefect", loadUserFromStorage);
    setLoading(true);
    (async () => {
      const cached = await loadUserFromStorage?.(); // ← safe call
      const r = mergeReminders(REMINDER_TYPES, cached?.notifications);
      console.log(r, "rrr");
      setNotification(r);
      setLoading(false);
      // console.log("Loaded from storage:", cached?.notifications);
    })();
  }, [loadUserFromStorage]); // include in deps

  const statusLabel = (item: any) => {
    // Not configured
    if (!item) return "Off";

    if (!item.enabled) return "Off";

    const timeText = formatBackendTime(item.time, "");
    const repeatText = repeatLabelFromDays(item);
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
              data={notification}
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
                        {/* {item.} */}
                        {statusLabel(item)}
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
            detail={selected}
            categoryKey={selected.key}
            title={selected.label}
            description={selected.desc}
            visible={detailVisible}
            onSaved={async () => {
              // only refetch after a successful save
              await refreshAll();
            }}
            onClose={() => {
              setDetailVisible(false);
              setSelected(null);
              // refresh so list updates after edit
              // refreshAll();
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
