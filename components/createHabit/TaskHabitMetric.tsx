import React, { useState, Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
// import { Button } from 'react-native-paper'; // Import Button for segmented control

export type MetricFormat = {
  target: string;
  unitValue: number; // TODO need to check
  unitLabel: string;
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
    // console.log(value, "value");
    let selectedItemLabel = findLabel(value);
    // console.log(findLabel(value));
    const val = {
      target,
      unitValue: value !== null ? value : 0,
      unitLabel: selectedItemLabel ? selectedItemLabel.label : "",
    };
    onSave(val);
    onClose();
  };

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
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Input for Target Value */}
          <Text style={styles.label}>Target Value</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter target value"
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
          />

          {/* Dropdown for Unit Selection */}
          <Text style={styles.label}>Select Unit</Text>
          <DropDownPicker
            open={open}
            multiple={false}
            value={value}
            items={units}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setSelectedUnit}
          />

          {/* Segmented Button for Frequency Selection */}
          {/* <Text style={styles.label}>Select Frequency</Text>
          <View style={styles.frequencyContainer}>
            {frequencies.map((frequency) => (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.frequencyButton,
                  selectedFrequency === frequency && styles.selectedFrequency,
                ]}
                onPress={() => setSelectedFrequency(frequency)}
              >
                <Text style={styles.frequencyText}>{frequency}</Text>
              </TouchableOpacity>
            ))}
          </View> */}

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
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
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  frequencyButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  selectedFrequency: {
    backgroundColor: "#007AFF",
  },
  frequencyText: {
    color: "#333",
  },
  segmentedButton: {
    flex: 1,
    marginHorizontal: 5,
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

export default HabitMetricModal;
