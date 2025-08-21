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
import { themeColors } from "@/constant/Colors";
import TimePicker from "@/components/TimePicker";
import styling from "../style/HabitDurationModalStyle";

interface DurationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (duration: Duration) => void;
  isEditMode?: Duration;
}

export type Duration = {
  all_day?: boolean;
  start_time?: Date;
  end_time?: Date;
};

const HabitDurationModal: React.FC<DurationModalProps> = ({
  visible,
  onClose,
  onSave,
  isEditMode,
}) => {
  const [allDayEnabled, setAllDayEnabled] = useState<boolean>(true);

  // const [isSpecified, setIsSpecified] = useState(false);
  const [selection, setSelection] = useState<"Point Time" | "Time Period">(
    "Point Time"
  );
  const [pointTime, setPointTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const handleSave = () => {
    if (allDayEnabled) {
      onSave({ all_day: true });
    } else {
      if (selection === "Point Time") {
        onSave({
          // start_time: format(pointTime, "hh:mm:ss"),
          start_time: pointTime,
        });
      } else {
        if (endTime <= pointTime) {
          setError("End time must be after start time.");
          return;
        }
        onSave({
          start_time: pointTime,
          end_time: endTime,
        });
      }
    }
    // Reset state after saving
    setSelection("Point Time");
    setError("");
    onClose();
  };

  const handleEndTimeChange = (selectedDate: Date) => {
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

  useEffect(() => {
    if (isEditMode?.all_day) {
      setAllDayEnabled(true);
    } else if (isEditMode?.end_time && isEditMode.start_time) {
      setPointTime(isEditMode.start_time);
      setEndTime(isEditMode.end_time);
      setAllDayEnabled(false);
      setSelection("Time Period");
    } else {
      if (isEditMode?.start_time) {
        setSelection("Point Time");
        setPointTime(isEditMode.start_time);
      }
    }
  }, [isEditMode]);

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
              {(selection === "Point Time" || selection === "Time Period") && (
                <TimePicker
                  selectedValue={pointTime}
                  onConfirmTime={onPointTimeSelected}
                  label="Point of Time"
                />
              )}

              {selection === "Time Period" && (
                <>
                  <TimePicker
                    selectedValue={endTime}
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
            <View>
              <Text style={styles.saveButtonText}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HabitDurationModal;
