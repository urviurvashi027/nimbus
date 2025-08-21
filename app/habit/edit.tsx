import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { format, addHours } from "date-fns";

import { Button, FormInput, ScreenView } from "@/components/Themed";
import HabitMetricInput from "@/components/createHabit/HabitMetricInput";
import HabitDurationInput from "@/components/createHabit/HabitDurationInput";
import HabitDateInput from "@/components/createHabit/HabitDateInput";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";
import { MetricFormat } from "@/components/createHabit/Modal/HabitMetricModal";
import { FrequencyObj } from "@/components/createHabit/Modal/HabitFrequencyModal";
import { Duration } from "@/components/createHabit/Modal/HabitDurationModal";
import { HabitDateType } from "@/components/createHabit/Modal/HabitDateModal";
import { ReminderAt } from "@/components/createHabit/Modal/HabitReminderModal";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";

const HabitEdit = () => {
  const [metric, setMetric] = useState<MetricFormat | {}>({});
  const [frequency, setFrequency] = useState<FrequencyObj | null>(null);
  const [duration, setDuration] = useState<Duration>({ all_day: undefined });
  const [date, setDate] = useState<HabitDateType>();
  const [reminderAt, setReminderAt] = useState<ReminderAt | null>(null);

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  // function to handle metric selection
  const handleMetricSelect = (value: any) => {
    setMetric(value);
  };

  // function to handle frequency selection
  const handleFrequencySelect = (value: any) => {
    setFrequency(value);
  };

  // function to hanlde duration selection
  const handleDurationSelect = (value: any) => {
    // const res = { all_day: false };
    // setDuration(res);
    setDuration(value);
  };

  // function to hanlde date selection
  const handleHabitStartDate = (value: any) => {
    setDate(value);
  };

  // function to handle reminder selection
  const handleReminderSelect = (value: any) => {
    setReminderAt(value);
  };

  const isAllDayEnabled = () => {
    return duration.all_day ? true : false;
  };

  const onSubmitClick = () => {
    // getCreateHabitData();
  };

  // test cases
  const getMetricData = () => {
    return {
      count: "2000",
      unitId: 2,
      unit: "Steps",
    };
  };

  const getDurationData = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Adds 1 day

    return {
      all_day: true,
      start_time: new Date(),
      end_time: undefined,
    };
  };

  const getReminerData = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return {
      time: null,
      ten_min_before: false,
      thirty_min_before: true,

      // second case
      // time: now,
      // ten_min_before: false,
      // thirty_min_before: false,
    };
  };

  const getDateData = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Adds 1 day
    return {
      // start_date: new Date(),
      // end_date: endDate,
      // frequency_type: "Daily",
      // interval: 3,

      // case 2
      // start_date: new Date(),

      // case 3
      start_date: new Date(),
      frequency_type: "Weekly",
      interval: 2,
      days_of_week: ["Su", "Mo", "Tu"],

      // case 4
      // start_date: new Date(),
      // frequency_type: "Monthly",
      // interval: 2,
      // days_of_month: [1, 12, 14, 15, 22],
    };
  };

  return (
    <>
      <View>
        <HabitMetricInput
          onSelect={handleMetricSelect}
          isEditMode={getMetricData()}
        />
        <HabitDurationInput
          onSelect={handleDurationSelect}
          isEditMode={getDurationData()}
        />
        <HabitDateInput
          onSelect={handleHabitStartDate}
          isEditMode={getDateData()}
        />
        <HabitReminderInput
          isAllDayEnabled={isAllDayEnabled()}
          isEditMode={getReminerData()}
          onSelect={handleReminderSelect}
        />
      </View>
      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Submit"
        onPress={onSubmitClick}
      />
    </>
  );
};

export default HabitEdit;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1,
      backgroundColor: themeColors[theme].background,
    },
    header: {
      color: themeColors[theme]?.text,
    },
    container: {
      marginTop: 60,
    },
    btn: {
      marginTop: 30,
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
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      color: "#333",
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
      marginTop: 10,
    },
    colorCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    selectedColor: {
      borderColor: "blue",
    },
    colorOptionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      paddingTop: 30,
    },
    customContainer: {
      width: "80%", // Adjust as needed
      alignSelf: "center",
      marginVertical: 10,
    },
    customLabel: {
      textAlign: "center", // Center the label
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5, // Space between label and input
    },
    customInput: {
      borderBottomWidth: 1, // Only bottom border
      borderBottomColor: "#555", // Border color
      fontSize: 16,
      textAlign: "center", // Center the input text
      paddingVertical: 5, // Adjust vertical spacing
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.2)", // Semi-transparent background
    },
  });
