import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface Props {
  data: {
    label: string;
    happiness: number;
    neutral: number;
    stressful: number;
  }[];
  totalPoints: number;
}

export default function MoodEmotionsChart({ data, totalPoints }: Props) {
  // transform data into gifted-charts format
  const chartData = [
    {
      value: 120,
      label: "1",
      frontColor: "#9DFF56", // Happiness
    },
    {
      value: 80,
      label: "1",
      frontColor: "#888", // Neutral
    },
    {
      value: 60,
      label: "1",
      frontColor: "#FF4B3E", // Stressful
    },
    {
      value: 150,
      label: "2",
      frontColor: "#9DFF56",
    },
    {
      value: 100,
      label: "2",
      frontColor: "#888",
    },
    {
      value: 90,
      label: "2",
      frontColor: "#FF4B3E",
    },
    // ...continue for each day
  ];

  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.sectionTitle}>Mood & Emotions</Text>

      {/* Legends */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#9DFF56" }]} />
          <Text style={styles.legendLabel}>Happiness</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#888" }]} />
          <Text style={styles.legendLabel}>Neutral</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#FF4B3E" }]} />
          <Text style={styles.legendLabel}>Stressful</Text>
        </View>
      </View>

      {/* Points */}
      <Text style={styles.points}>
        {totalPoints}
        <Text style={styles.pointsSuffix}>pointss</Text>
      </Text>

      {/* Chart */}
      <BarChart
        data={chartData}
        barWidth={16}
        spacing={14}
        hideRules={false}
        xAxisThickness={0}
        yAxisThickness={0}
        // yAxisSide="right" // ✅ move Y-axis to right
        noOfSections={6} // adjust sections (600 max here)
        height={220}
        barBorderRadius={6}
        xAxisLabelTextStyle={styles.xAxisLabel}
        yAxisTextStyle={styles.yAxisLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 13,
    color: "#fff",
  },
  points: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    // marginBottom: 12,
  },
  pointsSuffix: {
    fontSize: 14,
    color: "#aaa",
  },
  xAxisLabel: {
    fontSize: 12,
    color: "#aaa",
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#aaa",
  },
});
