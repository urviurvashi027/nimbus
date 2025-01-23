import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import StartTaskModal, {
  parsedValue,
} from "@/components/createHabit/HabitStartDateModal";
import ReminderAtModal, {
  FormattedReminderAt,
} from "@/components/createHabit/TaskReminderAt";
import { Ionicons } from "@expo/vector-icons";

type ThemeKey = "basic" | "light" | "dark";

export default function HabitMetric() {
  const [reminderAt, setReminderAt] = useState<FormattedReminderAt | null>(
    null
  );
  const [habitDate, setHabitDate] = useState<parsedValue>();

  const [showReminderAtModal, setShowReminderAtModal] = useState(false);
  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const { habitData, setHabitData } = useContext(HabitContext);
  const navigation = useNavigation();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // headerStyle: {
      //   backgroundColor: "#f4511e",
      // },
      headerTransparent: true,
      headerTitle: "Habit Schedules Details",
    });
  }, [navigation]);

  // useEffect(() => {
  //   console.log(habitData, "habitData from Schedules");
  // }, [habitData]);

  const styles = styling(theme);

  // function to handle Habit Reminder
  const handleHabitReminder = (reminderAt: any) => {
    // console.log(reminderAt, "handleHabitReminder");
    setReminderAt(reminderAt);
  };

  // function which will be called on
  const handleStartTaskSave = (habitDate: parsedValue) => {
    // Handle the start and end date logic here
    // console.log("from add routine habitDate", habitDate);
    // console.log('End Date:', endDate);
    setHabitDate(habitDate);
    setShowStartTaskModal(false);
  };

  const onContinueClick = () => {
    // console.log("continue clicked habit Schedules");
    console.log("from habit schedules", habitData, {
      habitDate: habitDate,
      RemindHabitAt: reminderAt,
    });
    setHabitData({
      ...habitData,
      habitDate: habitDate,
      RemindHabitAt: reminderAt,
    });
    router.push("/(auth)/(tabs)");
  };

  return (
    <ScreenView style={{ paddingTop: 75 }}>
      <View>
        <Text style={styles.label}>Habit Start Date</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowStartTaskModal(true)}
        >
          <Text style={styles.selectorText}>
            {habitDate
              ? `${JSON.stringify(
                  habitDate.display.startDate
                )} - ${JSON.stringify(habitDate.display.endDate)}`
              : "Select Start Task Date"}
          </Text>
        </TouchableOpacity>

        {/* Reminder At */}
        <Text style={styles.label}>Reminder At</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowReminderAtModal(true)}
        >
          <Text style={styles.selectorText}>
            {reminderAt
              ? `Reminder At: ${reminderAt.timeDisplay}`
              : "Select Reminder Time"}
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

      {/* Reminder At Modal */}
      <ReminderAtModal
        visible={showReminderAtModal}
        onClose={() => setShowReminderAtModal(false)}
        onSave={handleHabitReminder}
        // onSave={(reminderAt) => setReminderAt(reminderAt)}
      />

      {/* Start Task Modal */}
      <StartTaskModal
        visible={showStartTaskModal}
        onClose={() => setShowStartTaskModal(false)}
        onSave={handleStartTaskSave}
      />
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      marginTop: 60,
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
      color: "#333",
      marginBottom: 5,
      marginTop: 10,
    },
    selectorButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    selectorText: {
      fontSize: 16,
      color: "#333",
    },
  });
