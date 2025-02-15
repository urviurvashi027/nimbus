import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { ReminderAt } from "./Modal/HabitReminderModal";
import HabitReminderModal from "./Modal/HabitReminderModal";
import styling from "./style/HabitRemiderInputStyle";
import { format } from "date-fns";

interface HabitReminderInputProps {
  onSelect: (value: any) => void;
}

const HabitReminderInput: React.FC<HabitReminderInputProps> = ({
  onSelect,
}) => {
  const [reminderAt, setReminderAt] = useState<ReminderAt | null>(null);
  const [userDisplay, setUserDisplay] = useState<string>("");
  const [showReminderAtModal, setShowReminderAtModal] = useState(false);
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // function to handle Habit Reminder
  const handleHabitReminder = (reminderAt: any) => {
    setReminderAt(reminderAt);
    console.log(reminderAt, "reminderAt from reminder input");
    if (reminderAt.time) {
      setUserDisplay(reminderAt.time);
    }
    // onSelect(reminderAt);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowReminderAtModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
        <Text style={styles.label}>Reminder At</Text>
        <Text style={styles.selectorText}>
          {reminderAt ? `Reminder At: ${userDisplay}` : "Select Reminder Time"}
        </Text>
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
        onSave={handleHabitReminder}
      />
    </>
  );
};

export default HabitReminderInput;
