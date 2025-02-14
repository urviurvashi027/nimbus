import React, { useState, Dispatch, SetStateAction, useContext } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormInput, Text } from "../../Themed";
import DropDownPicker from "react-native-dropdown-picker";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
// import { Button } from 'react-native-paper'; // Import Button for segmented control

type ThemeKey = "basic" | "light" | "dark";

export type MetricFormat = {
  count: string;
  unitId: number; // TODO need to check
  unit: string;
  // frequency: "Daily" | "Weekly" | "Monthly";
};

interface HabitMetricModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: MetricFormat) => void;
}

const units = [
  { label: "Count", value: 1 },
  { label: "Steps", value: 2 },
  { label: "m", value: 3 },
  { label: "km", value: 4 },
  { label: "Miles", value: 5 },
  { label: "Ltr", value: 6 },
  { label: "Ml", value: 7 },
  { label: "Pound", value: 8 },
  { label: "Kg", value: 9 },
  { label: "Gm", value: 10 },
  { label: "Mg", value: 11 },
  { label: "Hr", value: 12 },
  { label: "Min", value: 13 },
  { label: "Sec", value: 14 },
  { label: "Oz", value: 15 },
  { label: "Cal", value: 16 },
  { label: "Drink", value: 17 },
  { label: "Add New Unit", value: 18 },
];

const frequencies = ["Daily", "Weekly", "Monthly"];

const HabitMetricModal: React.FC<HabitMetricModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<any[]>(units);
  // const [selectedFrequency, setSelectedFrequency] = useState<string>(
  //   frequencies[0]
  // );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState("");

  const handleSave = () => {
    let selectedItemLabel = findLabel(value);
    const val = {
      count: target,
      unitId: value !== null ? value : 0,
      unit: selectedItemLabel ? selectedItemLabel.label : "",
    };
    onSave(val);
    onClose();
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const findLabel = (value: number | null) =>
    units.find((item) => item.value === value);

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
            <Text style={styles.title}>Select Habit Metric</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          {/* Input for Target Value */}
          <Text style={styles.label}>Target Value</Text>
          <View style={styles.inputContainer}>
            <FormInput
              style={styles.input}
              placeholder="Enter target value"
              value={target}
              onChangeText={setTarget}
              keyboardType="numeric"
            />
          </View>

          {/* Dropdown for Unit Selection */}
          <Text style={styles.label}>Select Unit</Text>
          <DropDownPicker
            open={open}
            multiple={false}
            value={value}
            items={units}
            style={styles.dropDown}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setSelectedUnit}
            textStyle={styles.item}
            dropDownContainerStyle={{
              backgroundColor: themeColors[theme].background,
              borderColor: themeColors[theme].inpurBorderColor,
            }}
          />

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
    input: {
      borderWidth: 1,
      // borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      // color: "#333",
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 30,
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
    label: {
      fontSize: 16,
      // color: "#333",
      marginBottom: 5,
    },
    dropDown: {
      backgroundColor: themeColors[theme].background,
      borderColor: themeColors[theme].inpurBorderColor,
      color: themeColors[theme].text,
    },
    saveButton: {
      backgroundColor: themeColors[theme].primaryColor,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
    item: {
      color: themeColors[theme].text,
      borderColor: themeColors[theme].inpurBorderColor,
    },
  });

export default HabitMetricModal;
