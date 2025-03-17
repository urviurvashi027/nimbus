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

type EditData = {
  time?: Date | undefined | null;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
};

interface ReminderAtModalProps {
  visible: boolean;
  isAllDayEnabled: boolean;
  onClose: () => void;
  onSave: (duration: ReminderAt) => void;
  isEditMode?: EditData | null;
}

const HabitReminderModal: React.FC<ReminderAtModalProps> = ({
  visible,
  onClose,
  isAllDayEnabled,
  onSave,
  isEditMode,
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
    if (isAllDayEnabled) {
      setLabel("You have selected All day in habit duration specify time");
      setIsSpecified(true);
      setShowStartTimePicker(true);
      if (isEditMode) {
        if (isEditMode?.time) setReminderAt(isEditMode?.time);
      }
    } else {
      setLabel("select the preset to send reminder");
      setIsSpecified(false);
      setShowStartTimePicker(false);
      if (isEditMode) {
        let key = isEditMode.ten_min_before
          ? "ten_min_before"
          : "thirty_min_before";
        setSelection(key);
      }
    }
  }, [isAllDayEnabled, isEditMode]);

  // useEffect(() => {
  //   if (isEditMode) {
  //     console.log("Reminder Modal is edit on");
  //   } else {
  //     console.log("Reminder Modal is edit off");
  //   }
  // }, [isEditMode]);

  const handleSave = () => {
    const obj = getFormattedValue();
    onSave(obj);
    setError("");
    onClose();
  };

  const handleTimeChange = (selectedDate: any) => {
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
        selection === "ten_min_before" ? "ten_min_before" : "thirty_min_before";
      result[key] = true;
    }
    return result;
  };

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
            <Text style={styles.title}>Reminder At</Text>
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
                  onPress={() => setSelection("ten_min_before")}
                >
                  <Ionicons
                    name={
                      selection === "ten_min_before"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={themeColors.basic.tertiaryColor}
                  />
                  <Text style={styles.radioText}>10 minutes before</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelection("thirty_min_before")}
                >
                  <Ionicons
                    name={
                      selection === "thirty_min_before"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={themeColors.basic.tertiaryColor}
                  />
                  <Text style={styles.radioText}>30 minutes before</Text>
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
