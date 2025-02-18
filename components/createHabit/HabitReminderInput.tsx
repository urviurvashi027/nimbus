import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { ReminderAt } from "./Modal/HabitReminderModal";
import HabitReminderModal from "./Modal/HabitReminderModal";
// import styling from "./style/HabitRemiderInputStyle";
import styling from "./style/HabitInputStyle";
import { format } from "date-fns";

interface HabitReminderInputProps {
  isAllDayEnabled: boolean;
  onSelect: (value: any) => void;
}

const HabitReminderInput: React.FC<HabitReminderInputProps> = ({
  onSelect,
  isAllDayEnabled,
}) => {
  const [reminderAt, setReminderAt] = useState<ReminderAt>({
    time: format(new Date(), "hh:mm:ss"),
  });
  const [userDisplay, setUserDisplay] = useState<string>("");
  const [showReminderAtModal, setShowReminderAtModal] = useState(false);
  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  // function to handle Habit Reminder
  const handleHabitReminder = (reminderAt: any) => {
    setReminderAt(reminderAt);
    // if (reminderAt.time) {
    //   setUserDisplay(reminderAt.time);
    // }
  };

  useEffect(() => {
    if (reminderAt.time) {
      setUserDisplay(reminderAt.time);
      onSelect(reminderAt);
    }
  }, [reminderAt]);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowReminderAtModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="stopwatch-outline"
          size={20}
          color={themeColors[theme].text}
        />
        <View style={styles.inputField}>
          <Text style={styles.label}>Reminder At</Text>
          <Text
            style={styles.selectorText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {reminderAt ? `${userDisplay}` : "Select Reminder Time"}
          </Text>
        </View>
        <Ionicons
          style={styles.iconRight}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>
      <HabitReminderModal
        visible={showReminderAtModal}
        onClose={() => setShowReminderAtModal(false)}
        isAllDayEnabled={isAllDayEnabled}
        onSave={handleHabitReminder}
      />
    </>
  );
};

export default HabitReminderInput;
