import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Switch,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

export type parsedValue = {
  startDate: Date;
  eneDate?: Date;
  display: {
    startDate: string;
    endDate?: string;
  };
};

interface StartTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habitDate: parsedValue) => void;
}

const StartTaskModal: React.FC<StartTaskModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSave = () => {
    // console.log(startDate, endDate, "Habit Start Modal");
    let parsedValue = {
      startDate: startDate,
      endDate: isEndDateEnabled ? endDate : undefined,
      display: {
        startDate: format(startDate, "dd MMMM yyyy"),
        endDate: endDate ? format(endDate, "dd MMMM yyyy") : undefined,
      },
    };
    onSave(parsedValue);
    onClose();
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
          <View style={styles.header}>
            <Text style={styles.title}>Select Start Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              Start Date: {format(startDate, "dd MMMM yyyy")}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="#333" />
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              minimumDate={new Date()} // Disable previous dates
            />
          )}

          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Set End Date</Text>
            <Switch
              value={isEndDateEnabled}
              onValueChange={(value) => {
                setIsEndDateEnabled(value);
                if (!value) {
                  setEndDate(undefined); // Reset end date if switch is turned off
                }
              }}
            />
          </View>

          {isEndDateEnabled && (
            <>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  End Date:{" "}
                  {endDate
                    ? format(endDate, "dd MMMM yyyy")
                    : "Select End Date"}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="#333" />
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={startDate} // End date must be after start date
                />
              )}
            </>
          )}

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
  datePickerButton: {
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
  datePickerText: {
    fontSize: 16,
    color: "#333",
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
});

export default StartTaskModal;
