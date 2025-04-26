import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;

const WeightInputModal = ({
  visible,
  onClose,
  onSelect,
  initialValue = "70.0",
  initialUnit = "Kg",
}: any) => {
  const [weight, setWeight] = useState(initialValue.toString());
  const [unit, setUnit] = useState(initialUnit);

  const handleSave = () => {
    const parsed = parseFloat(weight);
    if (!isNaN(parsed)) {
      onSelect(parsed, unit);
      onClose();
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Weight</Text>

          <View style={styles.unitSwitch}>
            {["Lbs", "Kg"].map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
              >
                <Text
                  style={[styles.unitText, unit === u && styles.unitTextActive]}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight"
              style={styles.input}
            />
            <Text style={styles.inputUnit}>{unit.toLowerCase()}</Text>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Your personal information won’t be collected or shared.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default WeightInputModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modal: {
    height: screenHeight * 0.55,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  back: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  unitSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  unitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  unitBtnActive: {
    backgroundColor: "#DDEEFF",
  },
  unitText: {
    fontSize: 16,
    color: "#888",
  },
  unitTextActive: {
    fontWeight: "600",
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  input: {
    fontSize: 40,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    textAlign: "right",
    width: 120,
    paddingRight: 10,
  },
  inputUnit: {
    fontSize: 20,
    marginLeft: 4,
    paddingBottom: 8,
    color: "#333",
  },
  saveBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 40,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontSize: 13,
  },
});
