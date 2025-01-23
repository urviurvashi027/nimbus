import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DurationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (duration: Duration) => void;
}

export type Duration =
  | { type: "All Day" }
  | {
      type: "Point Time";
      time: Date;
    }
  | {
      type: "Time Period";
      start: Date;
      end: Date;
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
  const [showPointTimePicker, setShowPointTimePicker] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (allDayEnabled) {
      onSave({ type: "All Day" });
    } else {
      if (selection === "Point Time") {
        onSave({
          type: "Point Time",
          time: pointTime,
        });
      } else {
        if (endTime <= startTime) {
          setError("End time must be after start time.");
          return;
        }
        onSave({
          type: "Time Period",
          start: startTime,
          end: endTime,
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

  const handlePointTimeChange = (event: any, selectedDate?: Date) => {
    setShowPointTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      setPointTime(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      setEndTime(selectedDate);
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
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Toggle for Specified Time */}
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>All Day</Text>
            <Switch
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
                    color="#007AFF"
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
                    color="#007AFF"
                  />
                  <Text style={styles.radioText}>Time Period</Text>
                </TouchableOpacity>
              </View>

              {/* Time Picker for Point Time */}
              {selection === "Point Time" && (
                <>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowPointTimePicker(true)}
                  >
                    <Text style={styles.timePickerText}>
                      {format(pointTime, "hh:mm a")}
                    </Text>
                    <Ionicons name="time-outline" size={24} color="#333" />
                  </TouchableOpacity>

                  {showPointTimePicker && (
                    <DateTimePicker
                      value={pointTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={handlePointTimeChange}
                    />
                  )}
                </>
              )}

              {/* Time Pickers for Time Period */}
              {selection === "Time Period" && (
                <>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowStartTimePicker(true)}
                  >
                    <Text style={styles.timePickerText}>
                      From: {format(startTime, "hh:mm a")}
                    </Text>
                    <Ionicons name="time-outline" size={24} color="#333" />
                  </TouchableOpacity>

                  {showStartTimePicker && (
                    <DateTimePicker
                      value={startTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={handleStartTimeChange}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowEndTimePicker(true)}
                  >
                    <Text style={styles.timePickerText}>
                      To: {format(endTime, "hh:mm a")}
                    </Text>
                    <Ionicons name="time-outline" size={24} color="#333" />
                  </TouchableOpacity>

                  {showEndTimePicker && (
                    <DateTimePicker
                      value={endTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={handleEndTimeChange}
                    />
                  )}
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
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
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
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
    color: "#333",
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
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
  },
});

export default TaskModalDuration;
