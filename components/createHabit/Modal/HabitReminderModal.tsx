import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Text } from "../../Themed";
import ThemeContext from "@/context/ThemeContext";
import HabitContext from "@/context/HabitContext";
import { themeColors } from "@/constant/Colors";
import TimePicker from "../../TimePicker";
import styling from "../style/HabitReminderModal";

export interface ReminderAt {
  time?: string | undefined;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
}

// export type FormattedReminderAt = {
//   timeDisplay: string | undefined | null;
//   val: ReminderAt;
// };

type ThemeKey = "basic" | "light" | "dark";

interface ReminderAtModalProps {
  visible: boolean;
  isAllDayEnabled: boolean;
  onClose: () => void;
  onSave: (duration: ReminderAt) => void;
}

const HabitReminderModal: React.FC<ReminderAtModalProps> = ({
  visible,
  onClose,
  isAllDayEnabled,
  onSave,
}) => {
  const [isSpecified, setIsSpecified] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [label, setLabel] = useState("");
  //   const [reminderAt, setReminderAt] = useState('');
  const [reminderAt, setReminderAt] = useState<Date>(new Date());
  const [selection, setSelection] = useState("");
  const [error, setError] = useState("");

  const { habitData, setHabitData } = useContext(HabitContext);

  useEffect(() => {
    // console.log(isAllDayEnabled, "isAllDayEnabled");
    if (isAllDayEnabled) {
      setLabel("You have selected All day in habit duration specify time");
      setIsSpecified(true);
      setShowStartTimePicker(true);
    } else {
      setLabel("select the preset to send reminder");
      // setReminderAt(habitData.habit_duration?.start_time);
      setIsSpecified(false);
      setShowStartTimePicker(false);
    }
  }, [isAllDayEnabled]);

  const handleSave = () => {
    // const date = reminderAt ? new Date(reminderAt) : null;
    // let timeString = null;
    // // Format the time using toLocaleTimeString
    // if (date) {
    //   const timeString = date.toLocaleTimeString("en-US", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     timeZoneName: "short", // Optional to include the time zone abbreviation
    //   });
    // }

    const obj = getFormattedValue();

    // console.log(obj, "obj");

    // const parsedValue = {
    //   timeDisplay: timeString,
    //   val: obj,
    // };
    onSave(obj);
    // Reset state after saving
    // setReminderAt(); // TODO Need to recheck how to reset the value
    // setIsSpecified(false);
    setError("");
    onClose();
  };

  const handleTimeChange = (selectedDate: any) => {
    // console.log(selectedDate, "selectedDate");
    if (selectedDate) {
      setReminderAt(selectedDate);
    }
  };

  const getFormattedValue = () => {
    let result: {
      time?: string | undefined;
      ten_min_before?: boolean;
      thirty_min_before?: boolean;
      [key: string]: string | boolean | undefined; // Index signature
    } = {};
    if (isSpecified) {
      result.time = reminderAt ? format(reminderAt, "hh:mm:ss") : "";
    } else {
      // Determine the key based on the selection
      let key =
        selection === "10 minutes before"
          ? "ten_min_before"
          : "thirty_min_before";
      result[key] = true;
    }
    return result;
  };

  // const onSpecifyValueChange = (value: boolean) => {
  //   setIsSpecified(value);
  //   setShowStartTimePicker(value);
  // };

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Habit Reminder At</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.remiderAt}>
            <Text>{label}</Text>
            <Text style={styles.remiderAtText}>
              {/* Reminder At: {reminderAt ? reminderAt : null} */}
            </Text>
          </View>

          {showStartTimePicker && (
            <TimePicker
              selectedValue={reminderAt}
              onConfirmTime={handleTimeChange}
              label="Reminder At"
            />
          )}

          {/* Options when Specified Time is enabled */}
          {!isSpecified && (
            <View style={styles.optionsContainer}>
              {/* Radio Buttons for Point Time and Time Period */}
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelection("at the event time")}
                >
                  <Ionicons
                    name={
                      selection === "at the event time"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={themeColors.basic.tertiaryColor}
                  />
                  <Text style={styles.radioText}>At the event time</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelection("10 minutes before")}
                >
                  <Ionicons
                    name={
                      selection === "10 minutes before"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={themeColors.basic.tertiaryColor}
                  />
                  <Text style={styles.radioText}>10 minutes before</Text>
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HabitReminderModal;
