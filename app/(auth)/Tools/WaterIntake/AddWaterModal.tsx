import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const predefinedAmounts = [12, 16, 20, 24, 30];

interface AddWaterProps {
  visible: boolean;
  onClose: () => void;
  onAddWater: any;
}

const AddWaterModal: React.FC<AddWaterProps> = ({
  visible,
  onClose,
  onAddWater,
}) => {
  const [amount, setAmount] = useState("");

  const handleKeyPress = (key: any) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === "confirm") {
      if (amount) {
        onAddWater(parseInt(amount, 10));
        setAmount("");
        onClose();
      }
    } else {
      setAmount((prev) => (prev.length < 4 ? prev + key : prev));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Water</Text>
          <TouchableOpacity onPress={() => handleKeyPress("confirm")}>
            <Text style={styles.addText}>Add Water</Text>
          </TouchableOpacity>
        </View>

        {/* Input Display */}
        <Text style={styles.amountText}>{amount || "0"} oz</Text>

        {/* Predefined Water Amounts */}
        <View style={styles.amountRow}>
          {predefinedAmounts.map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.amountButton}
              onPress={() => setAmount(value.toString())}
            >
              <Ionicons name="calendar-outline" size={20} color="black" />
              <Text style={styles.amountButtonText}>{value}oz</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Numeric Keypad */}
        <View style={styles.keypad}>
          {[
            "7",
            "8",
            "9",
            "4",
            "5",
            "6",
            "1",
            "2",
            "3",
            "backspace",
            "0",
            "confirm",
          ].map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                key === "confirm"
                  ? styles.confirmKey
                  : key === "backspace"
                  ? styles.backKey
                  : null,
              ]}
              onPress={() => handleKeyPress(key)}
            >
              {key === "backspace" ? (
                <Ionicons name="calendar-outline" size={20} color="black" />
              ) : // <Icon name="arrow-left" size={20} color="black" />
              key === "confirm" ? (
                <Ionicons name="calendar-outline" size={20} color="white" />
              ) : (
                // <Icon name="check" size={20} color="white" />
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#E3F2FD", // Light blue background
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cancelText: {
    fontSize: 16,
    color: "black",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  amountButton: {
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 10,
  },
  amountButtonText: {
    fontSize: 14,
    marginTop: 5,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  key: {
    width: "33%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  backKey: {
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
  },
  confirmKey: {
    backgroundColor: "black",
    borderRadius: 10,
  },
});

export default AddWaterModal;
