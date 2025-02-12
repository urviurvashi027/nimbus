import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Text } from "../Themed";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import DatePicker from "../DatePicker";

export type parsedValue = {
  startDate: string;
  eneDate?: string;
  display: {
    startDate: string;
    endDate?: string;
  };
};

type ThemeKey = "basic" | "light" | "dark";

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
  // const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);

  const handleStartDateChange = (selectedDate: Date) => {
    // setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    // setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSave = () => {
    const endDateVal = endDate ? format(endDate, "yyyy-MM-dd") : null;
    let parsedValue = {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: isEndDateEnabled ? endDateVal : undefined,
      display: {
        startDate: format(startDate, "dd MMMM yyyy"),
        endDate: endDate ? format(endDate, "dd MMMM yyyy") : undefined,
      },
    };
    onSave(parsedValue);
    onClose();
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
          <View style={styles.header}>
            <Text style={styles.title}>Select Start Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              Start Date: {format(startDate, "dd MMMM yyyy")}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={themeColors[theme].text}
            />
          </TouchableOpacity> */}

          {/* {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              minimumDate={new Date()} // Disable previous dates
            />
          )} */}

          <DatePicker
            onConfirmDate={handleStartDateChange}
            label="Start Date"
            minimumDate={new Date()}
          ></DatePicker>

          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Set End Date</Text>
            <Switch
              value={isEndDateEnabled}
              thumbColor={themeColors.basic.primaryColor}
              trackColor={{
                true: `${themeColors.basic.tertiaryColor}`,
              }}
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
              {/* <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  End Date:{" "}
                  {endDate
                    ? format(endDate, "dd MMMM yyyy")
                    : "Select End Date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={themeColors[theme].text}
                />
              </TouchableOpacity> */}

              {/* {showEndDatePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={startDate} // End date must be after start date
                />
              )} */}

              <DatePicker
                onConfirmDate={handleEndDateChange}
                label="End Date"
                minimumDate={startDate}
              ></DatePicker>
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
    },
    datePickerButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    datePickerText: {
      fontSize: 16,
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
      // color: "#333",
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
  });

export default StartTaskModal;
