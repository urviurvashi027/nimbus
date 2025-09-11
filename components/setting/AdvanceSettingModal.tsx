// components/AdvancedSettingsModal.tsx
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
import { getAllPreferences, PreferenceKey } from "@/services/PreferenceStorage";

type SettingType = {
  key: PreferenceKey;
  label: string;
  options: string[];
};

const SETTINGS: SettingType[] = [
  { key: "liquid", label: "Liquid unit", options: ["ml", "oz"] },
  { key: "weight", label: "Weight unit", options: ["kg", "lbs"] },
  { key: "weather", label: "Weather unit", options: ["°C", "°F"] },
  {
    key: "gender",
    label: "Gender",
    options: ["Not set", "Male", "Female", "Other"],
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

  const [prefs, setPrefs] = useState<Record<PreferenceKey, string>>({
    liquid: "",
    weight: "",
    weather: "",
    gender: "",
  });

  const [selected, setSelected] = useState<SettingType | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      (async () => {
        const vals = await getAllPreferences();
        setPrefs(vals);
      })();
    }
  }, [visible]);

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
            data={SETTINGS}
            keyExtractor={(i) => i.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setSelected(item);
                  setDetailVisible(true);
                }}
              >
                <Text style={styles.label}>{item.label}</Text>
                <View style={styles.right}>
                  <Text style={styles.value}>{prefs[item.key]}</Text>
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

        {selected && (
          <SettingDetail
            visible={detailVisible}
            categoryKey={selected.key}
            label={selected.label}
            options={selected.options}
            onClose={() => {
              setDetailVisible(false);
              setSelected(null);
              (async () => setPrefs(await getAllPreferences()))();
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
