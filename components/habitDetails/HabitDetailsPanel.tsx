import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  name: string;
  frequency: string;
  type: string;
  metric_count: number;
  metric_unit: string;
}

export default function HabitDetailsPanel({
  name,
  frequency,
  type,
  metric_count,
  metric_unit,
}: Props) {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.card}>
      <DetailRow label="Name" value={name} />
      <DetailRow label="Repeat on" value={frequency} />
      <DetailRow label="Type" value={type} />
      <DetailRow value={`${metric_count}/${metric_unit}`} label="Metric" />
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 18,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: newTheme.textSecondary,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
    },
  });
