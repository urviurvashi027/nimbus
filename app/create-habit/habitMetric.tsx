import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "@/components/Themed";
import { router, useNavigation } from "expo-router";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { MetricFormat } from "@/components/createHabit/Modal/HabitMetricModal";
import FrequencyModal, {
  FormattedFrequency,
} from "@/components/createHabit/TaskFrequencyModal";
import TaskModalDuration, {
  Duration,
} from "@/components/createHabit/TaskModalDuration";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";
import HabitMetricInput from "@/components/createHabit/HabitMetricInput";
import HabitFrequencyInput from "@/components/createHabit/HabitFrequencyInput";
import HabitDurationInput from "@/components/createHabit/HabitDurationInput";

type ThemeKey = "basic" | "light" | "dark";

export default function HabitMetric() {
  const { habitData, setHabitData } = useContext(HabitContext);
  const navigation = useNavigation();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const [habitMetric, setHabitMetric] = useState<MetricFormat | null>(null);
  const [frequency, setFrequency] = useState<FormattedFrequency | null>(null);
  const [duration, setDuration] = useState<Duration>({ all_day: true });

  const [showDurationModal, setShowDurationModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // headerStyle: {
      //   backgroundColor: "#f4511e",
      // },
      headerTransparent: true,
      headerTitle: "Habit Metric Details",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
        height: 40,
      },
    });
  }, [navigation]);

  // function to handle task duration
  const handleTaskDuration = (selectedDuration: any) => {
    // console.log(selectedDuration, "durationk");
    setDuration(selectedDuration);
  };

  // // function to handle metric
  // const handleHabitMetricSave = (value: MetricFormat) => {
  //   setHabitMetric(value);
  //   setShowHabitMetricModal(false);
  // };

  // // function to handle frequency save
  // const handleFrequencySave = (selectedFrequency: any) => {
  //   console.log(selectedFrequency, "selectedFrequency============= ");
  //   setFrequency(selectedFrequency);
  //   setShowFrequencyModal(false);
  // };

  const onContinueClick = () => {
    setHabitData({
      ...habitData,
      habit_metric: {
        count: habitMetric?.count,
        unit: habitMetric?.unit,
      },
      habit_frequency: frequency?.parsedFreq,
      habit_duration: duration,
    });
    router.push("/create-habit/habitSchedules");
  };

  useEffect(() => {
    console.log(
      habitData,
      "habitData from metric -------------------------------------"
    );
  }, [habitData]);

  const styles = styling(theme);
  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <View style={styles.container}>
        {/* Habit Metric */}

        <HabitMetricInput />
        <HabitFrequencyInput />
        <HabitDurationInput />

        {/* <Text style={styles.label}>Habit Metric</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowHabitMetricModal(true)}
        >
          <Text style={styles.selectorText}>
            {habitMetric
              ? `Metric: ${habitMetric.count}  ${habitMetric.unit}`
              : "Select Habit Metric"}
          </Text>
        </TouchableOpacity> */}

        {/* Habit Frequency */}
        {/* <Text style={styles.label}>Habit Frequency</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowFrequencyModal(true)}
        >
          <Text style={styles.selectorText}>
            {frequency
              ? `Frequency: ${JSON.stringify(frequency.userDisplay)}`
              : "Select Frequency"}
          </Text>
        </TouchableOpacity> */}

        {/* Habit Duration */}
        {/* <Text style={styles.label}>Habit Duration</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowDurationModal(true)}
        >
          <Text style={styles.selectorText}>
            {duration?.all_day === true
              ? "All Day"
              : duration.start_time && duration.end_time
              ? `From ${duration.start_time} To ${duration.end_time},
                  "hh:mm a"
                )}`
              : `Point Time: ${duration.start_time}`}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity> */}
      </View>

      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Continue"
        onPress={onContinueClick}
      />

      {/* Duration Modal
      <TaskModalDuration
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onSave={handleTaskDuration}
        // onSave={(selectedDuration: any) => setDuration(selectedDuration)}
      /> */}
    </ScreenView>
  );
}

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
