import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function SegmentedTabs({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (k: any) => void;
  options: { key: string; label: string }[];
}) {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.item, active && styles.active]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      backgroundColor: newTheme.surface,
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    item: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },
    active: { backgroundColor: newTheme.card },
    text: { color: newTheme.textSecondary, fontWeight: "700", fontSize: 12 },
    textActive: { color: newTheme.buttonPrimary },
  });
