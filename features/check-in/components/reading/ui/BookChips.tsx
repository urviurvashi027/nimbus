import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

const SAMPLE_BOOKS = [
  { id: "1", title: "Atomic Habits" },
  { id: "2", title: "Deep Work" },
  { id: "3", title: "Make Time" },
  { id: "4", title: "Range" },
];

export function BookChips({
  value,
  onChange,
}: {
  value?: string;
  onChange: (id?: string) => void;
}) {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 4 }}
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        {SAMPLE_BOOKS.map((b) => {
          const active = value === b.id;
          return (
            <Pressable
              key={b.id}
              onPress={() => onChange(active ? undefined : b.id)}
              style={[styles.chip, active && styles.active]}
            >
              <Text style={[styles.text, active && styles.textActive]}>
                {b.title}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => onChange(undefined)}
          style={[styles.chip, { borderStyle: "dashed" }]}
        >
          <Text style={styles.text}>+ Add book</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: newTheme.border,
      backgroundColor: newTheme.card,
    },
    active: { backgroundColor: newTheme.buttonPrimary },
    text: { color: newTheme.textSecondary, fontWeight: "700", fontSize: 12 },
    textActive: { color: newTheme.buttonPrimaryText },
  });
