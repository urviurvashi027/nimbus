import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  habitName: string;
  frequency: string;
  icon?: string; // emoji for now
  data: { day: string; done: boolean }[];
  onToggle?: (day: string) => void;
}

export default function WeeklyHabitRow({
  habitName,
  frequency,
  icon = "✅",
  data,
  onToggle,
}: Props) {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {/* Left: icon + name */}
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={styles.icon}>{icon}</Text>
          {/* <View style={{ flexShrink: 1 }}>
            <Text style={styles.habitName}>{habitName}</Text>
          </View> */}
        </View>

        {/* Right: frequency */}
        <Text style={styles.frequency}>{frequency}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Days row */}
      <View style={styles.daysRow}>
        {data.map((item) => (
          <Pressable
            key={item.day}
            style={[
              styles.dayCircle,
              item.done && { backgroundColor: newTheme.accent }, // pink if done
            ]}
            onPress={() => onToggle?.(item.day)}
          >
            {item.done ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        ))}
      </View>

      {/* Day labels */}
      <View style={styles.labelsRow}>
        {data.map((item) => (
          <Text key={item.day} style={styles.dayLabel}>
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.surface,
      borderRadius: 12,
      padding: 12,
      marginVertical: 12,
      //   marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    icon: {
      fontSize: 20,
      marginRight: 8,
    },
    habitName: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
      flexShrink: 1,
      flexWrap: "wrap",
    },
    frequency: {
      fontSize: 14,
      color: newTheme.textPrimary,
      flexShrink: 1,
      textAlign: "right",
    },
    divider: {
      height: 1,
      backgroundColor: newTheme.divider,
      marginVertical: 8,
    },
    daysRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    labelsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: newTheme.disabled,
      justifyContent: "center",
      alignItems: "center",
    },
    check: {
      fontSize: 16,
      color: newTheme.surface,
    },
    dayLabel: {
      fontSize: 12,
      color: newTheme.textSecondary,
      textAlign: "center",
      flex: 1,
    },
  });
