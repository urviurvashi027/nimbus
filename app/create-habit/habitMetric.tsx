import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "@/components/Themed";
import { router, useNavigation } from "expo-router";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import HabitMetricModal, {
  MetricFormat,
} from "@/components/createHabit/TaskHabitMetric";
import FrequencyModal, {
  FormattedFrequency,
} from "@/components/createHabit/TaskFrequencyModal";
import TaskModalDuration, {
  Duration,
} from "@/components/createHabit/TaskModalDuration";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

type ThemeKey = "basic" | "light" | "dark";

export default function HabitMetric() {
  const { habitData, setHabitData } = useContext(HabitContext);
  const navigation = useNavigation();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const [habitMetric, setHabitMetric] = useState<MetricFormat | null>(null);
  const [frequency, setFrequency] = useState<FormattedFrequency | null>(null);
  const [duration, setDuration] = useState<Duration>({ type: "All Day" });

  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showHabitMetricModal, setShowHabitMetricModal] = useState(false);
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

  useEffect(() => {
    console.log(habitData, "habitData from metric");
  }, [habitData]);

  // function to handle task duration
  const handleTaskDuration = (selectedDuration: any) => {
    // console.log(selectedDuration, "selectedDuration");
    setDuration(selectedDuration);
  };

  // function to handle metric
  const handleHabitMetricSave = (value: MetricFormat) => {
    // console.log(value, "handleHabitMetricSave");
    setHabitMetric(value);
    setShowHabitMetricModal(false);
  };

  // function to handle frequency save
  const handleFrequencySave = (selectedFrequency: any) => {
    // console.log(selectedFrequency, "from: selectedFrequency ");
    setFrequency(selectedFrequency);
    setShowFrequencyModal(false);
  };

  const onContinueClick = () => {
    // console.log("continue clicked habit Metric");
    console.log("from habit basic", habitData, {
      habitMetric: habitMetric,
      frequency: frequency?.parsedFreq,
      habitDuration: duration,
    });
    console.log(frequency?.parsedFreq.details.specificDate, "specific data");
    setHabitData({
      ...habitData,
      habitMetric: habitMetric,
      frequency: frequency?.parsedFreq,
      habitDuration: duration,
    });
    router.push("/create-habit/habitSchedules");
  };

  const styles = styling(theme);
  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <View style={styles.container}>
        {/* Habit Metric */}
        <Text style={styles.label}>Habit Metric</Text>
        {/* Habit Metric Button */}
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowHabitMetricModal(true)}
        >
          <Text style={styles.selectorText}>
            {habitMetric
              ? `Metric: ${habitMetric.target}  ${habitMetric.unitLabel}`
              : "Select Habit Metric"}
          </Text>
        </TouchableOpacity>

        {/* Habit Frequency */}
        <Text style={styles.label}>Habit Frequency</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowFrequencyModal(true)}
        >
          <Text style={styles.selectorText}>
            {frequency
              ? `Frequency: ${JSON.stringify(frequency.userDisplay)}`
              : "Select Frequency"}
          </Text>
        </TouchableOpacity>

        {/* Habit Duration */}
        <Text style={styles.label}>Habit Duration</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowDurationModal(true)}
        >
          <Text style={styles.selectorText}>
            {duration.type === "All Day"
              ? "All Day"
              : duration.type === "Point Time"
              ? `Point Time: ${format(duration.time, "hh:mm a")}`
              : `From ${format(duration.start, "hh:mm a")} To ${format(
                  duration.end,
                  "hh:mm a"
                )}`}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Continue"
        onPress={onContinueClick}
      />

      {/* Duration Modal */}
      <TaskModalDuration
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onSave={handleTaskDuration}
        // onSave={(selectedDuration: any) => setDuration(selectedDuration)}
      />

      {/* Habit Metric Modal */}
      <HabitMetricModal
        visible={showHabitMetricModal}
        onClose={() => setShowHabitMetricModal(false)}
        onSave={handleHabitMetricSave}
      />

      {/* Frequency Type Modal */}
      <FrequencyModal
        visible={showFrequencyModal}
        onClose={() => setShowFrequencyModal(false)}
        onSave={handleFrequencySave}
      />
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
