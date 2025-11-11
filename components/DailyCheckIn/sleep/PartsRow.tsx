import React, { useContext } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export interface RowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}

export const Row = ({ icon, label, value, onPress }: RowProps) => {
  const { newTheme } = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        { backgroundColor: newTheme.surface, borderColor: newTheme.border },
      ]}
    >
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, { color: newTheme.textSecondary }]}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={[styles.rowValue, { color: newTheme.textPrimary }]}>
          {value}
        </Text>
        <Ionicons
          name="create-outline"
          size={18}
          color={newTheme.textSecondary}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowValue: { fontSize: 16, fontWeight: "700" },
});
