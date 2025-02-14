import { Text } from "react-native";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemeKey } from "@/components/Themed";
import { parsedValue } from "./Modal/HabitDateModal";
import HabitDateModal from "./Modal/HabitDateModal";

const HabitDateInput: React.FC = () => {
  const [habitDate, setHabitDate] = useState<parsedValue>();

  const [showReminderAtModal, setShowReminderAtModal] = useState(false);
  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const { habitData, setHabitData } = useContext(HabitContext);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // function which will be called on
  const handleStartTaskSave = (habitDate: parsedValue) => {
    // Handle the start and end date logic here
    // console.log(habitDate, "habitDate");
    setHabitDate(habitDate);
    setShowStartTaskModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowStartTaskModal(true)}
      >
        <Text style={styles.label}>Habit Start Date</Text>
        <Text style={styles.selectorText}>
          {habitDate
            ? `${JSON.stringify(
                habitDate.display.startDate
              )} - ${JSON.stringify(habitDate.display.endDate)}`
            : "Select Start Task Date"}
        </Text>
      </TouchableOpacity>

      <HabitDateModal
        visible={showStartTaskModal}
        onClose={() => setShowStartTaskModal(false)}
        onSave={handleStartTaskSave}
      />
    </>
  );
};

export default HabitDateInput;

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
