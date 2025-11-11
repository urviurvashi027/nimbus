// components/DailyCheckIn/MoodEmotionsChart.tsx
import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import ThemeContext from "@/context/ThemeContext";

type MoodPoint = {
  label: string; // x-axis tick (e.g., "1","2","Mon")
  happiness: number;
  neutral: number;
  stressful: number;
};

type Props = {
  data: MoodPoint[];
  totalPoints: number;
  title?: string;
};

export default function MoodEmotionsChart({
  data,
  totalPoints,
  title = "Mood & Emotions",
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  // Nimbus palette (override per theme if you like)
  const COLORS = {
    happy: "#9DFF56",
    neutral: newTheme.textSecondary, // muted grey that fits theme
    stress: "#FF4B3E",
  };

  // Flatten to gifted-charts data format (grouped by repeating label)
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.flatMap((d) => [
      { value: d.happiness, label: d.label, frontColor: COLORS.happy },
      { value: d.neutral, label: d.label, frontColor: COLORS.neutral },
      { value: d.stressful, label: d.label, frontColor: COLORS.stress },
    ]);
  }, [data, COLORS.happy, COLORS.neutral, COLORS.stress]);

  // Compute axis scaling: find max stack height for a label
  const maxForSections = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    return Math.max(
      ...data.map((d) => Math.max(d.happiness, d.neutral, d.stressful))
    );
  }, [data]);

  const noOfSections = useMemo(() => {
    // choose 4–6 sections based on the magnitude
    if (maxForSections <= 100) return 4;
    if (maxForSections <= 300) return 5;
    return 6;
  }, [maxForSections]);

  const pointsLabel = useMemo(
    () =>
      Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        totalPoints || 0
      ),
    [totalPoints]
  );

  if (!chartData.length) {
    return (
      <View style={s.card}>
        <Text style={s.sectionTitle}>{title}</Text>
        <Text style={s.emptyText}>
          No mood data yet. Check in to see trends.
        </Text>
      </View>
    );
  }

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.headerRow}>
        <Text style={s.sectionTitle}>{title}</Text>
        <Text style={s.points}>
          {pointsLabel}
          <Text style={s.pointsSuffix}> points</Text>
        </Text>
      </View>

      {/* Legend */}
      <View style={s.legendRow} accessibilityRole="text">
        <Legend color={COLORS.happy} label="Happiness" />
        <Legend color={COLORS.neutral} label="Neutral" />
        <Legend color={COLORS.stress} label="Stressful" />
      </View>

      {/* Chart */}
      <BarChart
        data={chartData}
        barWidth={14}
        spacing={12}
        barBorderRadius={6}
        height={220}
        noOfSections={noOfSections}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        xAxisLabelTextStyle={s.xAxisLabel}
        yAxisTextStyle={s.yAxisLabel}
        isAnimated
        animationDuration={650}
      />
    </View>
  );
}

/* ---------- Small Legend pill ---------- */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 14 }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 6,
        }}
      />
      <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
        {label}
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = (t: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.surface,
      borderRadius: 16,
      padding: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: t.divider,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: t.textPrimary,
    },
    points: {
      fontSize: 18,
      fontWeight: "800",
      color: t.textPrimary,
    },
    pointsSuffix: {
      fontSize: 12,
      color: t.textSecondary,
      fontWeight: "600",
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    xAxisLabel: {
      fontSize: 11,
      color: t.textSecondary,
    },
    yAxisLabel: {
      fontSize: 11,
      color: t.textSecondary,
    },
    emptyText: {
      marginTop: 6,
      color: t.textSecondary,
      fontSize: 13,
    },
  });
