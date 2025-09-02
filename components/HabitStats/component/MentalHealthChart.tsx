import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart, BarChart } from "react-native-gifted-charts";
import RingsChart from "./RingChart";
import ThemeContext from "@/context/ThemeContext";
import MoodEmotionsChart from "./MoodEmotionsChart";

export default function MentalHealthCharts() {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const rings = [
    { value: 68, maxValue: 100, color: "#9DFF56", label: "Habits" },
    { value: 35, maxValue: 100, color: "#A78BFA", label: "Check-ins" },
    { value: 12, maxValue: 100, color: "#FF4B3E", label: "Mood tracker" },
  ];

  const sampleData = [
    { label: "1", happiness: 120, neutral: 80, stressful: 60 },
    { label: "2", happiness: 150, neutral: 100, stressful: 90 },
    { label: "3", happiness: 300, neutral: 50, stressful: 200 },
    { label: "4", happiness: 500, neutral: 100, stressful: 0 },
    { label: "5", happiness: 250, neutral: 150, stressful: 200 },
    { label: "6", happiness: 200, neutral: 180, stressful: 300 },
    { label: "7", happiness: 400, neutral: 220, stressful: 100 },
    { label: "8", happiness: 100, neutral: 200, stressful: 180 },
  ];

  // Multi-series bar chart data
  const barData = [
    {
      stacks: [
        { value: 200, color: "#9DFF56" }, // Happiness
        { value: 100, color: "#888" }, // Neutral
        { value: 50, color: "#FF4B3E" }, // Stressful
      ],
      label: "1",
    },
    {
      stacks: [
        { value: 300, color: "#9DFF56" },
        { value: 200, color: "#888" },
        { value: 100, color: "#FF4B3E" },
      ],
      label: "2",
    },
    {
      stacks: [
        { value: 500, color: "#9DFF56" },
        { value: 200, color: "#888" },
        { value: 250, color: "#FF4B3E" },
      ],
      label: "3",
    },
    {
      stacks: [
        { value: 250, color: "#9DFF56" },
        { value: 100, color: "#888" },
        { value: 300, color: "#FF4B3E" },
      ],
      label: "4",
    },
  ];

  return (
    <View>
      {/* Donut Chart Section */}
      <View style={styles.card}>
        {/* Activity Rings */}
        <View style={styles.card}>
          <View style={styles.row}>
            {/* Legends */}
            <View style={styles.legendBlock}>
              {rings.map((ring, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: ring.color }]} />
                  <View>
                    <Text style={styles.legendLabel}>{ring.label}</Text>
                    <Text style={[styles.legendValue, { color: ring.color }]}>
                      {ring.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <RingsChart
              rings={[
                { value: 68, maxValue: 100, color: "#9DFF56" }, // Habits
                { value: 35, maxValue: 100, color: "#A78BFA" }, // Check-ins
                { value: 12, maxValue: 100, color: "#FF4B3E" }, // Mood tracker
              ]}
              size={180}
              strokeWidth={10}
              gap={12}
            />
          </View>
        </View>
      </View>
      <MoodEmotionsChart data={sampleData} totalPoints={5795} />;
      {/* Multi-series Bar Chart Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mood & Emotions</Text>
        <Text style={styles.points}>5795 points</Text>
        <BarChart
          data={barData}
          barWidth={22}
          spacing={16}
          //   stackData
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          height={220}
          noOfSections={6}
        />
        {/* Legends */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.dot,
                { backgroundColor: "#9DFF56", marginLeft: 10 },
              ]}
            />
            <Text style={styles.legendLabel}>Happiness</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.dot, { backgroundColor: "#888", marginLeft: 10 }]}
            />
            <Text style={styles.legendLabel}>Neutral</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.dot,
                { backgroundColor: "#FF4B3E", marginLeft: 10 },
              ]}
            />
            <Text style={styles.legendLabel}>Stressful</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.surface,
      borderRadius: 16,
      padding: 10,
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    legend: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: newTheme.textPrimary,
      marginBottom: 4,
    },
    points: {
      fontSize: 16,
      color: newTheme.textSecondary,
      marginBottom: 12,
    },
    legendRow: {
      flexDirection: "row",
      // justifyContent: "space-around",
      marginTop: 12,
    },
    //   legendItem: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //   },
    //   dot: {
    //     width: 12,
    //     height: 12,
    //     borderRadius: 6,
    //     marginRight: 6,
    //   },
    //   legendLabel: {
    //     color: "#fff",
    //     fontSize: 14,
    //   },
    legendBlock: {
      // flex: 1,
      justifyContent: "center",
    },
    legendItem: {
      flexDirection: "row",
      //   alignItems: "center",
      marginBottom: 12,
    },
    dot: {
      width: 10,
      height: 10,
      marginTop: 4,
      borderRadius: 6,
      marginRight: 10,
      //   marginLeft: 10,
    },
    legendLabel: {
      color: newTheme.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    legendValue: {
      fontSize: 16,
      fontWeight: "700",
    },
  });
