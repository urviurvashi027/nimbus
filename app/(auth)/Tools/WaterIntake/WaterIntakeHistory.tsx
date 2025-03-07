import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const HistoryModal = ({ visible, onClose }: any) => {
  const [selectedWeek, setSelectedWeek] = useState("2025/03/02~03/08");

  const hydrationData = {
    goal: [68, 68, 68, 68, 68, 68, 68], // Static goal line
    intake: [0, 0, 0, 0, 0, 0, 0], // Replace with real data
  };

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
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>History</Text>
        </View>

        {/* Average Daily Drinking */}
        <Text style={styles.avgText}>Avg Daily Drinking</Text>
        <Text style={styles.intakeText}>0oz</Text>

        {/* Line Chart */}
        <LineChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              { data: hydrationData.goal, color: () => "gold" },
              { data: hydrationData.intake, color: () => "lightblue" },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: { r: "3", strokeWidth: "1", stroke: "#000" },
          }}
          style={styles.chart}
          bezier
        />

        {/* Week Navigation */}
        <View style={styles.weekContainer}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={28} color="black" />
            {/* <Icon name="chevron-left" size={16} color="black" /> */}
          </TouchableOpacity>
          <Text style={styles.weekText}>{selectedWeek}</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={28} color="black" />
            {/* <Icon name="chevron-right" size={16} color="black" /> */}
          </TouchableOpacity>
        </View>

        {/* Key Indicators */}
        <Text style={styles.sectionTitle}>Key indicators</Text>
        <View style={styles.indicatorBox}>
          <View style={styles.indicatorRow}>
            <Text style={styles.indicatorLabel}>Compliance days</Text>
            <Text style={styles.indicatorValue}>0 days</Text>
          </View>
          <View style={styles.indicatorRow}>
            <Text style={styles.indicatorLabel}>Number of glasses</Text>
            <Text style={styles.indicatorValue}>0 times</Text>
          </View>
          <View style={styles.indicatorRow}>
            <Text style={styles.indicatorLabel}>Weekly intake</Text>
            <Text style={styles.indicatorValue}>0 oz</Text>
          </View>
        </View>

        {/* Hydration Tracker */}
        <Text style={styles.sectionTitle}>Hydration Tracker</Text>
        <FlatList
          data={hydrationTracker}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={styles.trackerRow}>
              <Text style={styles.trackerDate}>• {item.date}</Text>
              <Text style={styles.trackerTotal}>Total: {item.total}</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avgText: {
    fontSize: 16,
    marginTop: 20,
  },
  intakeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 10,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  weekText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  indicatorBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  indicatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  indicatorLabel: {
    fontSize: 16,
    color: "#555",
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trackerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  trackerDate: {
    fontSize: 16,
    color: "#000",
  },
  trackerTotal: {
    fontSize: 16,
    color: "#555",
  },
});

export default HistoryModal;
