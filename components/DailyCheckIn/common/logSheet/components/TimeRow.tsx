import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useMemo, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export const TimeRow = ({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  onChange?: (d: Date) => void;
  children: React.ReactNode;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.timeRow}>
      <View style={{ gap: 2 }}>
        <Text style={styles.timeLabel}>{label}</Text>
        <Text style={styles.timeValue}>{value}</Text>
      </View>
      <View style={{ marginLeft: "auto" }}>{children}</View>
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    timeRow: {
      borderRadius: 14,
      padding: 12,
      backgroundColor: newTheme.background,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: newTheme.border,
      flexDirection: "row",
      alignItems: "center",
    },
    timeLabel: { color: newTheme.textSecondary, fontSize: 12 },
    timeValue: { color: newTheme.textPrimary, fontSize: 16, fontWeight: "800" },
  });
