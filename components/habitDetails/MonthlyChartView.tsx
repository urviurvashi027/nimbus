import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const WeeklyHabitChart = () => {
  const barData = [
    { value: 25, label: "wk 1" },
    { value: 50, label: "wk 2", frontColor: "#177AD5" },
    { value: 74, label: "wk 3", frontColor: "#177AD5" },
    { value: 32, label: "wk 4" },
    { value: 60, label: "wk 5", frontColor: "#177AD5" },
  ];
  return (
    <View style={styles.chartContainer}>
      <BarChart
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={1}
        xAxisThickness={1}
      />
    </View>
  );
};

export default WeeklyHabitChart;

const styles = StyleSheet.create({
  chartContainer: {
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    width: "90%",
    borderRadius: 15,
    margin: 20,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 5,
  },
});
