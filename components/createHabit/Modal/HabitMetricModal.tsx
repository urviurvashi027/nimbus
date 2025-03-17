import React, {
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormInput, Text } from "../../Themed";
import DropDownPicker from "react-native-dropdown-picker";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import styling from "../style/HabitMetricModalStyle";
import { addObjectAtEnd } from "@/utils/helper";
import { HabitUnit } from "@/types/habitTypes";
// import { Button } from 'react-native-paper'; // Import Button for segmented control

export type MetricFormat = {
  count: string;
  // unitId?: number; // TODO need to check
  unit: number;

  label?: string;
  // frequency: "Daily" | "Weekly" | "Monthly";
};

type EditData = {
  count: string;
  unit: number;
  //   unitId: number; // TODO need to check
  //   unit: string;
};

interface HabitMetricModalProps {
  visible: boolean;
  habitUnitList: HabitUnit[];
  onClose: () => void;
  isEditMode?: EditData | null;
  onSave: (value: MetricFormat) => void;
}

// const units = [
//   { label: "Count", value: 1 },
//   { label: "Steps", value: 2 },
//   { label: "m", value: 3 },
//   { label: "km", value: 4 },
//   { label: "Miles", value: 5 },
//   { label: "Ltr", value: 6 },
//   { label: "Ml", value: 7 },
//   { label: "Pound", value: 8 },
//   { label: "Kg", value: 9 },
//   { label: "Gm", value: 10 },
//   { label: "Mg", value: 11 },
//   { label: "Hr", value: 12 },
//   { label: "Min", value: 13 },
//   { label: "Sec", value: 14 },
//   { label: "Oz", value: 15 },
//   { label: "Cal", value: 16 },
//   { label: "Drink", value: 17 },
//   // { label: "Add New Unit", value: 18 },
// ];

const frequencies = ["Daily", "Weekly", "Monthly"];

const HabitMetricModal: React.FC<HabitMetricModalProps> = ({
  habitUnitList,
  visible,
  onClose,
  onSave,
  isEditMode,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<HabitUnit[]>([]);
  const [units, setUnit] = useState<HabitUnit[]>([{ id: 0, name: "steps" }]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState("");

  const handleSave = () => {
    let selectedItemLabel = findLabel(value);
    const val = {
      count: target,
      unit: value !== null ? value : 0,
      label: selectedItemLabel ? selectedItemLabel.name : "",
    };
    onSave(val);
    onClose();
  };

  useEffect(() => {
    setUnit(habitUnitList);
    console.log(habitUnitList, units);
  }, [habitUnitList]);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const findLabel = (value: number | null) =>
    units.find((item) => item.id === value);

  useEffect(() => {
    if (isEditMode) {
      setTarget(isEditMode.count);
      setValue(isEditMode?.unit);
    } else {
    }
  }, [isEditMode]);

  // useEffect(() => {
  //   const modifiedArray = addObjectAtEnd(habitTagList);
  //   setHabitTagData(modifiedArray);
  // }, [habitTagList]);

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
              placeholderTextColor={themeColors.basic.mediumGrey}
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
            items={units.map((unit) => ({ label: unit.name, value: unit.id }))} // Ensure proper mapping
            // items={units}
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

export default HabitMetricModal;
