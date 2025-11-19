import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Text } from "@/components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import ThemeContext from "@/context/ThemeContext";
import { ReminderAt } from "@/types/habitTypes";
// import HabitReminderModal from "./Modal/HabitReminderModal";
import styling from "./style/HabitInputStyle";
import ReminderModal from "./Modal/ReminderModal";

type EditData = {
  time?: Date | undefined | null;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
};

interface HabitReminderInputProps {
  isAllDayEnabled: boolean;
  onSelect: (value: any) => void;
  isEditMode?: EditData;
}

const HabitReminderInput: React.FC<HabitReminderInputProps> = ({
  onSelect,
  isAllDayEnabled,
  isEditMode,
}) => {
  const [reminderAt, setReminderAt] = useState<ReminderAt>({
    // time: format(new Date(), "hh:mm:ss"),
  });
  const [userDisplay, setUserDisplay] = useState<string>("");
  const [showReminderAtModal, setShowReminderAtModal] = useState(false);
  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  // function to handle Habit Reminder
  const handleHabitReminder = (reminderAt: any) => {
    console.log(reminderAt, "reminderAt");
    setReminderAt(reminderAt);
    if (reminderAt.time) {
      console.log(reminderAt, "reminderAt.time");
      // const time12 = format(new Date(reminderAt.time), "hh:mm a");
      // setUserDisplay(time12);
      setUserDisplay(reminderAt.time);
      onSelect(reminderAt);
    }
  };

  useEffect(() => {
    let time = "";
    if (reminderAt.time) {
      time = reminderAt.time;
      onSelect(reminderAt);
    }
    if (isEditMode?.time) {
      const result = { time: format(isEditMode.time, "hh:mm:ss") };
      setReminderAt(result);
      time = result.time;
      // setUserDisplay(result.time);
      onSelect(result);
    }
    if (isAllDayEnabled) {
      setUserDisplay("Select the preset");
      // setUserDisplay(time);
    } else {
      setUserDisplay("Select the preset");
    }
  }, [isAllDayEnabled]);

  // useEffect(() => {
  //   if (isEditMode?.time) {
  //     const result = { time: format(isEditMode.time, "hh:mm:ss") };
  //     setReminderAt(result);
  //     // setHabitMetric(isEditMode);
  //   } else {
  //     console.log("it is not on");
  //   }
  // }, [isEditMode]);

  return (
    <>
      <TouchableOpacity
        // style={styles.selectorButton}
        style={styles.rowItem}
        onPress={() => {
          setShowReminderAtModal(true);
        }}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="stopwatch-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Remind me at</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue}>
            {reminderAt ? `${userDisplay}` : "Select Reminder Time"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
        {/* 
        <Ionicons
          style={styles.iconLeft}
          name="stopwatch-outline"
          size={20}
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
        /> */}
      </TouchableOpacity>
      <ReminderModal
        visible={showReminderAtModal}
        onClose={() => setShowReminderAtModal(false)}
        // visible={reminderModalVisible}
        isAllDayEnabled={isAllDayEnabled} // 👈 pass true/false depending on HabitDuration modal
        // onClose={() => setReminderModalVisible(false)}
        onSave={handleHabitReminder}
        // onSave={(data) => {
        //   console.log("Reminder saved:", data);
        //   setReminderData(data); // store it in state
        //   setReminderModalVisible(false);
        // }}
        isEditMode={isEditMode} // 👈 pass saved state when editing
      />
      {/* <HabitReminderModal
        visible={showReminderAtModal}
        onClose={() => setShowReminderAtModal(false)}
        isAllDayEnabled={isAllDayEnabled}
        onSave={handleHabitReminder}
        isEditMode={isEditMode}
      /> */}
    </>
  );
};

export default HabitReminderInput;
