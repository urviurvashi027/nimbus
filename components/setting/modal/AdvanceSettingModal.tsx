import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import SettingDetail from "./PreferenceDetailModal";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";
// import { useReminder } from "@/context/ReminderContext";

type PreferenceKey =
  | "liquid_unit"
  | "weight_unit"
  | "weather_unit"
  | "start_of_day"
  | "start_of_week"
  | "height_unit"
  | "length_unit"
  | "sleep_time";

type SettingType = {
  key: PreferenceKey;
  label: string;
  options: string[];
  selectedUnit?: string | null;
};
type BackendSettings = Record<string, string | null | undefined>;

type UserPrefs = {
  // other fields...
  settings?: BackendSettings | null;
};

const SETTINGS: SettingType[] = [
  { key: "liquid_unit", label: "Liquid unit", options: ["ml", "oz"] },
  { key: "weight_unit", label: "Weight unit", options: ["kg", "lbs"] },
  {
    key: "weather_unit",
    label: "Weather unit",
    options: ["Celsius", "Fahrenheit"],
  },
  {
    key: "start_of_day",
    label: "Start of the day",
    options: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  },
  {
    key: "start_of_week",
    label: "Start of the week",
    options: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  {
    key: "length_unit",
    label: "Length Unit",
    options: ["feet", "km", "miles"],
  },
  {
    key: "sleep_time",
    label: "Sleep time",
    options: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  },
];

export default function AdvancedSettingsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);
  const [userPrefs, setUserPrefs] = useState<UserPrefs>();
  const [selectedPanel, setSelectedPanel] = useState<SettingType | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [merged, setMerged] = useState<SettingType[]>(SETTINGS);
  const [loading, setLoading] = useState(false);

  // const { userProfile } = useAuth();
  const { loadUserFromStorage, updateProfile } = useAuth();
  // const { getUserProfile, save } = useReminder();

  const toast = useNimbusToast();

  useEffect(() => {
    // console.log("coming here useefect", loadUserFromStorage);
    setLoading(true);
    (async () => {
      const cached = await loadUserFromStorage?.(); // ← safe call
      const updated = SETTINGS.map((item) => ({
        ...item,
        selectedUnit: cached.settings[item.key] ?? null,
      }));

      setMerged(updated);
      setLoading(false);
      // console.log("Loaded from storage: Advanced", updated);
    })();
  }, [loadUserFromStorage]); // include in deps

  const onSaveSetting = async (val: any) => {
    try {
      const saved = await updateProfile?.(val);
      const { success, message, data } = saved;
      if (success && "email" in data) {
        setUserPrefs(data);

        const rawProfile = data?.settings;
        if (!rawProfile) return;
        const backendSettings = rawProfile;

        const updated = SETTINGS.map((item) => ({
          ...item,
          selectedUnit: backendSettings[item.key] ?? null,
        }));

        setMerged(updated);
        toast.show({
          variant: "success",
          title: "Advanced Setting Updated",
          message: "Advanced Setting Updated",
        });
      }
    } catch (e) {
      console.warn("save error", e);
      toast.show({
        variant: "error",
        title: "Something went wrong",
        message: "Could not save setting. Please try again.",
      });
    } finally {
      // onClose?.();
    }
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
          <Text style={styles.headerTitle}>Advanced Settings</Text>
        </View>

        <View style={styles.container}>
          <FlatList
            data={merged}
            keyExtractor={(i) => i.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setSelectedPanel(item);
                  setDetailVisible(true);
                }}
              >
                <Text style={styles.label}>{item.label}</Text>
                <View style={styles.right}>
                  <Text style={[styles.value, { textTransform: "capitalize" }]}>
                    {item.selectedUnit ? item.selectedUnit : "Not selected"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={newTheme.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </View>

        {selectedPanel && (
          <SettingDetail
            visible={detailVisible}
            categoryKey={selectedPanel.key}
            label={selectedPanel.label}
            options={selectedPanel.options}
            selectedUnit={selectedPanel.selectedUnit || undefined}
            onSave={onSaveSetting}
            onClose={() => {
              setDetailVisible(false);
              setSelectedPanel(null);
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
      paddingHorizontal: 8,
      backgroundColor: theme.background,
    },
    item: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 10,
    },
    label: { color: theme.textPrimary, fontSize: 16, fontWeight: "600" },
    right: { flexDirection: "row", alignItems: "center", gap: 8 },
    value: { color: theme.textSecondary, fontSize: 14 },
    sep: { height: 1, backgroundColor: theme.divider, marginHorizontal: 12 },
  });
