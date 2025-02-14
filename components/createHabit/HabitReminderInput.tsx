import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Themed";
import React, { useContext, useEffect, useState } from "react";
// import { router, useNavigation } from "expo-router";
// import HabitContext from "@/context/HabitContext";
// import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
// import StartTaskModal, {
//   parsedValue,
// } from "@/components/createHabit/HabitStartDateModal";
// import ReminderAtModal, {
//   FormattedReminderAt,
// } from "@/components/createHabit/TaskReminderAt";
import { FormattedReminderAt } from "./TaskReminderAt";
import { Ionicons } from "@expo/vector-icons";

import HabitReminderModal from "./Modal/HabitReminderModal";

type ThemeKey = "basic" | "light" | "dark";

export default function HabitReminderInput() {
  const [reminderAt, setReminderAt] = useState<FormattedReminderAt | null>(
    null
  );
  //   const [habitDate, setHabitDate] = useState<parsedValue>();

  const [showReminderAtModal, setShowReminderAtModal] = useState(false);
  //   const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  //   const { habitData, setHabitData } = useContext(HabitContext);
  //   const navigation = useNavigation();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // function to handle Habit Reminder
  const handleHabitReminder = (reminderAt: any) => {
    // console.log(reminderAt, "from reminderAt");
    setReminderAt(reminderAt);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowReminderAtModal(true)}
      >
        <View>
          <Text style={styles.label}>Reminder At</Text>
          <Text style={styles.selectorText}>
            {reminderAt
              ? `Reminder At: ${reminderAt.timeDisplay}`
              : "Select Reminder Time"}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </View>
      </TouchableOpacity>
      <HabitReminderModal
        visible={showReminderAtModal}
        onClose={() => setShowReminderAtModal(false)}
        onSave={handleHabitReminder}
      />
      //
    </>
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
      marginBottom: 5,
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
