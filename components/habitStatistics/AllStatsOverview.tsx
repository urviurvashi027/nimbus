// component/AllStatsOverview.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import StatCard from "../common/StatsCard";
import RingsChart, { Ring } from "./component/RingChart";
import TrendCard, { TrendPoint } from "./component/TrendChart";

export default function AllStatsOverview() {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const rings: Ring[] = [
    { value: 68, maxValue: 100, color: "#9DFF56", label: "Habits" },
    { value: 35, maxValue: 100, color: "#A78BFA", label: "Check-ins" },
    { value: 12, maxValue: 100, color: "#FF4B3E", label: "Mood tracker" },
  ];

  const completionData: TrendPoint[] = [
    { label: "Jul", value: 92 },
    { label: "Aug", value: 96 },
    { label: "Sep", value: 84 },
    { label: "Oct", value: 90 },
    { label: "Nov", value: 72 },
    { label: "Dec", value: 88 },
  ];

  const isLocked = true;

  if (isLocked) {
    return (
      <View style={styles.cardComingSoon}>
        <Text style={styles.title}>Overview</Text>
        <Text style={styles.subtitle}>In progress</Text>
        <Text style={styles.helper}>
          Soon you’ll see your rhythm at a glance — cycle trends, mood shifts,
          and energy peaks, all in one place.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* 1st row */}
      <View style={styles.ringChartContainer}>
        {/* Rings + legend card */}
        <RingsChart
          rings={rings}
          size={180}
          strokeWidth={10}
          gap={12}
          legendPlacement="left"
          showLegend
          style={styles.card}
        />
      </View>
      <View style={styles.row}>
        <StatCard
          label="Completion rate"
          value="89%"
          align="left"
          style={styles.card}
        />
        <StatCard
          label="Total perfect days"
          value="307"
          align="left"
          style={styles.card}
        />
      </View>

      {/* 2nd row */}
      <View style={styles.row}>
        <StatCard
          label="Habits completed"
          value="3,268"
          align="left"
          style={styles.card}
        />
        <StatCard
          label="Longest streak"
          value="226 days"
          align="left"
          style={styles.card}
        />
      </View>

      <View style={styles.trendCardContainer}>
        {/* <TrendCard
          title="Habit Completion Rate"
          periodLabel="Last 6 Months"
          data={completionData}
          onPressPeriod={() => {
            // open bottom sheet / picker later
          }}
          style={{ marginBottom: 20 }}
        /> */}
      </View>

      {/* Weekly summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Weekly snapshot</Text>
        <Text style={styles.summaryText}>
          You’ve been consistent with most habits. Productivity and mood look
          stable — keep logging daily to unlock deeper insights.
        </Text>
      </View>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 12, // equal spacing between cards
      marginBottom: 12,
      //   marginTop: 20,
    },
    card: {
      flex: 1, // each card takes half the row
    },
    summaryCard: {
      marginTop: 8,
      backgroundColor: newTheme.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: newTheme.divider,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 13,
      color: newTheme.textSecondary,
    },
    ringChartContainer: {
      marginBottom: 20,
      //   marginTop: 5,
    },
    trendCardContainer: { marginTop: 8 },
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
