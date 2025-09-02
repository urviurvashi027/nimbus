import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import FilterPill from "./component/FilterPill";
import StatCard from "./component/StatCard";
import { ScreenView } from "../Themed";
import MentalHealthCharts from "./component/MentalHealthChart";
import ThemeContext from "@/context/ThemeContext";

const dateFilters = ["D", "W", "M", "3M", "6M", "Y"];
const tagFilters = ["Hormone Level", "Mental Health", "Productivity"];

const productivityData = [
  { value: 80, label: "S", frontColor: "black" },
  { value: 95, label: "M", frontColor: "black" },
  { value: 100, label: "T", frontColor: "black" },
  { value: 90, label: "W", frontColor: "black" },
  { value: 60, label: "T", frontColor: "black" },
  { value: 85, label: "F", frontColor: "black" },
  { value: 20, label: "S", frontColor: "black" },
];

export default function StatsScreen() {
  const [selectedDate, setSelectedDate] = useState("W");
  const [selectedTag, setSelectedTag] = useState("Productivity");

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  return (
    <View style={styles.container}>
      {/* Title */}
      {/* <Text style={styles.title}>Stats</Text> */}

      {/* Date Segmented Control */}
      <View style={styles.dateRow}>
        {dateFilters.map((filter) => (
          <FilterPill
            key={filter}
            label={filter}
            selected={selectedDate === filter}
            onPress={() => setSelectedDate(filter)}
            type="date"
          />
        ))}
      </View>

      {/* Tag Filters (scrollable pills) */}
      <View style={styles.tagFilterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tagFilters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <FilterPill
              label={item}
              selected={selectedTag === item}
              onPress={() => setSelectedTag(item)}
              type="tag"
            />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {/* Dynamic Charts */}
      {selectedTag === "Productivity" && (
        <View style={styles.chartContainer}>
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
            yAxisTextStyle={{ color: "transparent" }} // hide numbers
          />
        </View>
      )}

      {selectedTag === "Mental Health" && <MentalHealthCharts />}

      {selectedTag === "Hormone Level" && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Hormone Level</Text>
          <Text style={styles.chartValue}>Coming soon 🚀</Text>
        </View>
      )}

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <StatCard emoji="👍" label="Habits Done" value="16" />
        <StatCard emoji="⛔" label="Habits Skipped" value="1" />
      </View>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: newTheme.surface,
      // backgroundColor: "red",
      // paddingHorizontal: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#fff",
      marginVertical: 16,
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      backgroundColor: "#222",
      borderRadius: 24,
      // padding: 4,
    },
    tagFilterContainer: {
      marginBottom: 20,
    },
    chartContainer: {
      backgroundColor: "#9DFF56",
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111",
    },
    chartValue: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111",
      marginBottom: 8,
    },
    dayLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#111",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
  });
