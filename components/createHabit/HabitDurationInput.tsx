import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "@/components/Themed";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";
import HabitDurationModal from "./Modal/HabitDurationModal";
import { Duration } from "./Modal/HabitDurationModal";

import { ThemeKey } from "@/components/Themed";

const HabitDurationInput: React.FC = () => {
  const [duration, setDuration] = useState<Duration>({ all_day: true });

  const [showDurationModal, setShowDurationModal] = useState(false);

  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  // function to handle task duration
  const handleTaskDuration = (selectedDuration: any) => {
    // console.log(selectedDuration, "durationk");
    setDuration(selectedDuration);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowDurationModal(true)}
      >
        <Text style={styles.label}>Habit Duration</Text>
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
      </TouchableOpacity>

      <HabitDurationModal
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onSave={handleTaskDuration}
        // onSave={(selectedDuration: any) => setDuration(selectedDuration)}
      />
    </>
  );
};

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

export default HabitDurationInput;
