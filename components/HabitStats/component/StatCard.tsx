// components/StatCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  emoji: string;
  label: string;
  value: string;
}

export default function StatCard({ emoji, label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  label: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
});
