import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

interface SummaryItem {
  label: string;
  value: string | number;
}

interface Props {
  data: SummaryItem[];
}

export default function SummaryPanel({ data }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginVertical: 12,
    },
    card: {
      backgroundColor: newTheme.surface,
      borderRadius: 10,
      padding: 12,
      width: "48%", // 2 per row
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      color: newTheme.textSecondary,

      marginBottom: 6,
    },
    value: {
      fontSize: 18,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
  });
