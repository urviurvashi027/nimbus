import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Platform,
} from "react-native";
import { Text } from "../Themed";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import TimePicker from "@/components/TimePicker";

interface DurationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (duration: Duration) => void;
}
type ThemeKey = "basic" | "light" | "dark";

export type Duration = {
  all_day?: boolean;
  start_time?: string;
  end_time?: string;
};

const TaskModalDuration: React.FC<DurationModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [allDayEnabled, setAllDayEnabled] = useState<boolean>(true);

  // const [isSpecified, setIsSpecified] = useState(false);
  const [selection, setSelection] = useState<"Point Time" | "Time Period">(
    "Point Time"
  );
  const [pointTime, setPointTime] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [error, setError] = useState("");

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const handleSave = () => {
    // console.log(allDayEnabled, selection);
    if (allDayEnabled) {
      onSave({ all_day: true });
    } else {
      if (selection === "Point Time") {
        onSave({
          start_time: format(pointTime, "hh:mm:ss"),
        });
      } else {
        if (endTime <= startTime) {
          setError("End time must be after start time.");
          return;
        }
        onSave({
          start_time: format(startTime, "hh:mm:ss"),
          end_time: format(endTime, "hh:mm:ss"),
        });
      }
    }
    // Reset state after saving
    // setIsSpecified(false);
    setSelection("Point Time");
    setPointTime(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setError("");
    onClose();
  };

  const timeFormat = (value: Date) => {
    const date = new Date(value);

    // Format the time using toLocaleTimeString
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short", // Optional to include the time zone abbreviation
    });

    return timeString;
  };

  // const handlePointTimeChange = (event: any, selectedDate?: Date) => {
  //   setShowPointTimePicker(Platform.OS === "ios");
  //   if (selectedDate) {
  //     setPointTime(selectedDate);
  //   }
  // };

  const handleStartTimeChange = (selectedDate: Date) => {
    // setShowStartTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartTime(selectedDate);
      setError("");
    }
  };

  const handleEndTimeChange = (selectedDate: Date) => {
    // setShowEndTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      setEndTime(selectedDate);
      setError("");
    }
  };

  const onPointTimeSelected = (selectedDate: Date) => {
    if (selectedDate) {
      setPointTime(selectedDate);
      setError("");
    }
  };

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
            <Text style={styles.title}>Habit Duration</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          {/* Toggle for Specified Time */}
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>All Day</Text>
            <Switch
              thumbColor={themeColors.basic.primaryColor}
              trackColor={{
                true: `${themeColors.basic.tertiaryColor}`,
              }}
              value={allDayEnabled}
              onValueChange={(value) => setAllDayEnabled(value)}
            />
          </View>

          {/* Options when Specified Time is enabled */}
          {!allDayEnabled && (
            <View style={styles.optionsContainer}>
              {/* Radio Buttons for Point Time and Time Period */}
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelection("Point Time")}
                >
                  <Ionicons
                    name={
                      selection === "Point Time"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={themeColors.basic.tertiaryColor}
                  />
                  <Text style={styles.radioText}>Point Time</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelection("Time Period")}
                >
                  <Ionicons
                    name={
                      selection === "Time Period"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={themeColors.basic.tertiaryColor}
                  />
                  <Text style={styles.radioText}>Time Period</Text>
                </TouchableOpacity>
              </View>

              {/* Time Picker for Point Time */}
              {selection === "Point Time" && (
                <TimePicker
                  onConfirmTime={onPointTimeSelected}
                  label="Point of Time"
                />
              )}

              {selection === "Time Period" && (
                <>
                  <TimePicker
                    onConfirmTime={handleStartTimeChange}
                    label="Start Time"
                  />
                  <TimePicker
                    onConfirmTime={handleEndTimeChange}
                    label="End Time"
                  />
                </>
              )}

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

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: themeColors[theme].background,
      borderRadius: 10,
      padding: 20,
      maxHeight: "90%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    toggleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
    },
    optionsContainer: {
      marginBottom: 20,
    },
    radioContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    radioText: {
      marginLeft: 8,
      fontSize: 16,
      color: themeColors[theme].text,
    },
    timePickerButton: {
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
    timePickerText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
    saveButton: {
      backgroundColor: themeColors.basic.secondaryColor,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    saveButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: themeColors.basic.danger,
      marginTop: 5,
      fontSize: 14,
      textAlign: "center",
    },
  });

export default TaskModalDuration;
