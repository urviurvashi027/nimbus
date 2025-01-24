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

export type FormattedReminderAt = {
  timeDisplay: string;
  time: Date;
  isTenMinsBeforeEnabled: boolean;
};

type ThemeKey = "basic" | "light" | "dark";

interface ReminderAtModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (duration: FormattedReminderAt) => void;
}

const ReminderAtModal: React.FC<ReminderAtModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [isSpecified, setIsSpecified] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  //   const [reminderAt, setReminderAt] = useState('');
  const [reminderAt, setReminderAt] = useState(new Date());
  const [selection, setSelection] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const date = new Date(reminderAt);

    // Format the time using toLocaleTimeString
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short", // Optional to include the time zone abbreviation
    });
    const parsedValue = {
      timeDisplay: timeString,
      time: reminderAt,
      isTenMinsBeforeEnabled: selection === "10 minutes before" ? true : false,
    };
    //  console.log(timeString, "foramtted time");
    onSave(parsedValue);
    // Reset state after saving
    setReminderAt(new Date()); // TODO Need to recheck how to reset the value
    setIsSpecified(false);
    setError("");
    onClose();
  };

  const handlePointTimeChange = (event: any, selectedDate?: Date) => {
    // console.log('selectedDate', selectedDate);
    setShowStartTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      setReminderAt(selectedDate);
    }
  };

  const onSpecifyValueChange = (value: boolean) => {
    setIsSpecified(value);
    setShowStartTimePicker(value);
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
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
            <Text style={styles.remiderAtText}>
              Reminder At: {format(reminderAt, "hh:mm a")}
            </Text>
          </View>

          {/* Toggle for Specified Time */}
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Specify Time</Text>
            <Switch
              value={isSpecified}
              onValueChange={onSpecifyValueChange}
              thumbColor={themeColors.basic.primaryColor}
              trackColor={{
                true: `${themeColors.basic.tertiaryColor}`,
              }}
            />
          </View>
          {showStartTimePicker && (
            <View style={styles.optionsContainer}>
              <DateTimePicker
                value={reminderAt}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handlePointTimeChange}
              />
            </View>
          )}

          {/* Options when Specified Time is enabled */}
          {isSpecified && (
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
    remiderAt: {
      marginBottom: 20,
    },
    remiderAtText: { fontSize: 18, color: themeColors[theme].text },
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
      alignItems: "flex-start",
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
      marginLeft: 2,
      marginRight: 4,
      fontSize: 14,
    },
    // timePickerButton: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   paddingVertical: 12,
    //   borderWidth: 1,
    //   borderColor: '#ccc',
    //   borderRadius: 5,
    //   paddingHorizontal: 10,
    //   marginBottom: 10,
    // },
    // timePickerText: {
    //   fontSize: 16,
    //   color: '#333',
    // },
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

export default ReminderAtModal;
