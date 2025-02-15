import React, { useContext, useState } from "react";
import { View, Modal, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import { Text } from "../../Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import DatePicker from "../../DatePicker";
import styling from "../style/HabitDateModalStyle";

export type HabitDateType = {
  start_date: Date;
  end_date?: Date;
};

interface HabitDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habitDate: HabitDateType) => void;
}

const HabitDateModal: React.FC<HabitDateModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);

  const handleStartDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSave = () => {
    let parsedValue = {
      start_date: startDate,
      end_date: isEndDateEnabled ? endDate : undefined,
    };
    onSave(parsedValue);
    onClose();
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
              <DatePicker
                onConfirmDate={handleEndDateChange}
                label="End Date"
                minimumDate={startDate}
              ></DatePicker>
            </>
          )}

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

export default HabitDateModal;
