import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { MetricFormat } from "./Modal/HabitMetricModal";
import HabitMetricModal from "./Modal/HabitMetricModal";
import { format } from "date-fns";

type ThemeKey = "basic" | "light" | "dark";

const HabitMetricInput: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  const [habitMetric, setHabitMetric] = useState<MetricFormat | null>(null);

  const [showHabitMetricModal, setShowHabitMetricModal] = useState(false);

  // function to handle metric
  const handleHabitMetricSave = (value: MetricFormat) => {
    setHabitMetric(value);
    setShowHabitMetricModal(false);
  };

  const styles = styling(theme);

  return (
    <>
      {/* Habit Metric Button */}
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowHabitMetricModal(true)}
      >
        <Text style={styles.label}>Habit Metric</Text>
        <Text style={styles.selectorText}>
          {habitMetric
            ? `Metric: ${habitMetric.count}  ${habitMetric.unit}`
            : "Select Habit Metric"}
        </Text>
      </TouchableOpacity>

      <HabitMetricModal
        visible={showHabitMetricModal}
        onClose={() => setShowHabitMetricModal(false)}
        onSave={handleHabitMetricSave}
      />
    </>
  );
};

export default HabitMetricInput;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    header: {
      color: themeColors[theme]?.text,
    },
    container: {
      marginTop: 20,
    },
    btn: {
      marginTop: 60,
      backgroundColor: themeColors[theme]?.primaryColor,
      padding: 20,
      alignItems: "center",
      borderRadius: 10,
    },
    btnText: {
      color: themeColors[theme]?.text,
      fontWeight: 800,
      fontSize: 18,
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: themeColors.basic.GRAY,
    },
    inputLabel: {
      marginBottom: 10,
    },
    // container: {
    //   backgroundColor: themeColors.basic.WHITE,
    //   padding: 45,
    //   paddingTop: 105,
    //   height: "100%",
    // },
    label: {
      fontSize: 16,
      // color: "#333",
      marginBottom: 10,
      marginTop: 10,
    },
    selectorButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    selectorText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
    },
  });
