import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export type Mood = "happy" | "neutral" | "sleepy";

const MOODS: { key: Mood; label: string }[] = [
  { key: "happy", label: "🙂" },
  { key: "neutral", label: "😐" },
  { key: "sleepy", label: "😴" },
];

export function MoodChips({
  value,
  onChange,
}: {
  value?: Mood;
  onChange: (m?: Mood) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {MOODS.map((m) => {
        const active = value === m.key;
        return (
          <Pressable
            key={m.key}
            onPress={() => onChange(active ? undefined : m.key)}
            style={[styles.chip, active && styles.active]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2A2F3A",
    backgroundColor: "#141720",
  },
  active: { backgroundColor: "#2B2F3A" },
  text: { color: "#9AA3AF", fontWeight: "700", fontSize: 12 },
  textActive: { color: "#F6F7F9" },
});
