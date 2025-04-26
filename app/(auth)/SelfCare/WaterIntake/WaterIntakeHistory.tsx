import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";

const waterHistory = {
  avgDailyIntake: "2000ml",
  complainceDays: 23,
  weeklyIntake: 3000,
  numGlasses: 3,
  hydrationData: {
    goal: [3000, 3000, 3000, 3000, 3000, 3000, 3000], // Static goal line
    intake: [3000, 400, 600, 2000, 2500, 3000, 1800], // Replace with real data
  },
  history: [
    {
      date: "04/04/2025",
      value: "2000ml",
    },
    {
      date: "03/04/2025",
      value: "3000ml",
    },
    {
      date: "02/04/2025",
      value: "800ml",
    },
    {
      date: "01/04/2025",
      value: "2000ml",
    },
    {
      date: "28/03/2025",
      value: "1500ml",
    },
    {
      date: "27/03/2025",
      value: "400ml",
    },
    {
      date: "26/03/2025",
      value: "790ml",
    },
  ],
};

const screenWidth = Dimensions.get("window").width;

const HistoryModal = ({ visible, onClose }: any) => {
  const [selectedWeek, setSelectedWeek] = useState("2025/03/02~2025/03/08");

  const hydrationData = {
    goal: [3000, 3000, 3000, 3000, 3000, 3000, 3000], // Static goal line
    intake: [3000, 400, 600, 2000, 2500, 3000, 1800], // Replace with real data
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const hydrationTracker = [
    { date: "Mar 04", total: "0oz" },
    { date: "Mar 03", total: "0oz" },
    { date: "Mar 02", total: "0oz" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>History</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Average Daily Drinking */}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.dailyAvg}>
            <Text style={styles.avgText}>Avg Daily Drinking</Text>
            <Text style={styles.intakeText}>{waterHistory.avgDailyIntake}</Text>
          </View>

          {/* Line Chart */}
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: waterHistory.hydrationData.goal,
                  color: () => "gold",
                  strokeWidth: 2,
                },
                {
                  data: waterHistory.hydrationData.intake,
                  color: () => "lightblue",
                  strokeWidth: 2,
                },
              ],
              legend: ["Water intake", "Your goal"],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix="ml"
            yAxisInterval={1}
            fromZero
            segments={6}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            withShadow={false}
            withDots={true}
            withInnerLines={false}
            bezier
            style={{ paddingTop: 20, alignSelf: "center" }}
          />

          {/* Week Navigation */}
          <View style={styles.weekContainer}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.weekText}>{selectedWeek}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* Key Indicators */}

          <Text style={styles.sectionTitle}>Key indicators</Text>
          <View style={styles.indicatorBox}>
            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Compliance days</Text>
              <Text style={styles.indicatorValue}>
                {waterHistory.complainceDays} days
              </Text>
            </View>
            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Number of glasses</Text>
              <Text style={styles.indicatorValue}>
                {waterHistory.numGlasses} times
              </Text>
            </View>
            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Weekly intake</Text>
              <Text style={styles.indicatorValue}>
                {waterHistory.weeklyIntake} oz
              </Text>
            </View>
          </View>

          {/* Hydration Tracker */}
          <Text style={styles.sectionTitle}>Hydration Trackers</Text>
          {waterHistory.history.map((item) => (
            <View key={item.date} style={styles.trackerRow}>
              <Text style={styles.trackerDate}>• {item.date}</Text>
              <Text style={styles.trackerTotal}>Total: {item.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: themeColors.basic.deactiveColor,
      paddingHorizontal: 20,
      paddingTop: 80,
    },
    container: {},
    scrollContent: {
      paddingBottom: 60, // Extra bottom space to avoid cut-off on smaller screens
    },
    closeButton: {
      position: "absolute",
      top: 30,
      right: 1,
      zIndex: 10,
    },
    header: {
      paddingTop: 30,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    dailyAvg: {
      marginBottom: 10,
    },
    avgText: {
      fontSize: 13,
      marginTop: 20,
    },
    intakeText: {
      fontSize: 30,
      fontWeight: "bold",
    },
    chart: {},
    weekContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
      backgroundColor: themeColors.basic.commonWhite,
    },
    weekText: {
      fontSize: 16,
      fontWeight: "bold",
      marginHorizontal: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 30,
    },
    indicatorBox: {
      backgroundColor: themeColors.basic.commonWhite,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    indicatorRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      borderBottomColor: themeColors.basic.deactiveColor,
      borderBottomWidth: 1,
      padding: 10,
    },
    indicatorLabel: {
      fontSize: 16,
      color: themeColors.basic.darkGrey,
    },
    indicatorValue: {
      fontSize: 16,
      fontWeight: "bold",
    },
    trackerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: themeColors.basic.commonWhite,
      padding: 15,
      borderRadius: 10,
      marginBottom: 5,
    },
    trackerDate: {
      fontSize: 16,
      color: themeColors.basic.darkGrey,
    },
    trackerTotal: {
      fontSize: 16,
      color: themeColors.basic.commonBlack,
    },
  });

export default HistoryModal;
