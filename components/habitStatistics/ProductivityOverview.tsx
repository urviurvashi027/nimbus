// component/ProductivityOverview.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import ThemeContext from "@/context/ThemeContext";

const productivityData = [
  { value: 80, label: "S", frontColor: "black" },
  { value: 95, label: "M", frontColor: "black" },
  { value: 100, label: "T", frontColor: "black" },
  { value: 90, label: "W", frontColor: "black" },
  { value: 60, label: "T", frontColor: "black" },
  { value: 85, label: "F", frontColor: "black" },
  { value: 20, label: "S", frontColor: "black" },
];

export default function ProductivityOverview() {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const isLocked = true;

  if (isLocked) {
    return (
      <View style={styles.cardComingSoon}>
        <Text style={styles.title}>Productivity Overview</Text>
        <Text style={styles.subtitle}>Unlocking soon ✨</Text>
        <Text style={styles.helper}>
          A personalised productivity overview is on the way — insights into
          focus, routines, and energy patterns designed for sustainable
          progress.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.chartTitle}>Total Activities</Text>
      <Text style={styles.chartValue}>86%</Text>

      <BarChart
        data={productivityData}
        barWidth={28}
        spacing={20}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        barBorderRadius={14}
        xAxisLabelTextStyle={styles.dayLabel}
        isAnimated
        height={220}
        noOfSections={4}
        yAxisTextStyle={{ color: "transparent" }}
      />
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.accent,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.background,
    },
    chartValue: {
      fontSize: 28,
      fontWeight: "700",
      color: newTheme.background,
      marginBottom: 8,
    },
    dayLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: newTheme.background,
    },
    cardComingSoon: {
      backgroundColor: newTheme.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: newTheme.divider,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: newTheme.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "600",
      color: newTheme.accent,
      marginBottom: 8,
    },
    helper: {
      fontSize: 13,
      color: newTheme.textSecondary,
    },
  });
