import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useMemo, useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

export const Tab = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    tab: {
      backgroundColor: newTheme.surface,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: newTheme.border,
    },
    tabActive: { backgroundColor: newTheme.accent },
    tabText: { color: newTheme.textSecondary, fontSize: 12, fontWeight: "700" },
    tabTextActive: { color: newTheme.buttonPrimaryText },
  });
