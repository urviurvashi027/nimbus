import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const predefinedAmounts = [150, 300, 500, 800, 1000];

export default function HydrationModal({ visible, onClose, onAddWater }: any) {
  const [amount, setAmount] = useState("");

  const handleNumberPress = (num: any) => {
    setAmount((prev) => prev + num);
  };

  const handleDelete = () => setAmount((prev) => prev.slice(0, -1));

  const handlePreset = (val: any) => setAmount(val.toString());

  const handleAdd = () => {
    const value = Number(amount);
    if (value <= 0 || value > 3000) {
      alert("Please enter a value between 0–3000ml");
      return;
    }
    console.log(value, "water intake value");
    onAddWater(value);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Stay Hydrated</Text>

          <Text style={styles.input}>
            {amount || 0}
            <Text style={{ fontSize: 18 }}>ml</Text>
          </Text>

          <View style={styles.presets}>
            {predefinedAmounts.map((val) => (
              <TouchableOpacity key={val} onPress={() => handlePreset(val)}>
                <View style={styles.presetBtn}>
                  <Text>{val === 1000 ? "1L" : `${val}ml`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypad}>
            {[
              ["7", "8", "9"],
              ["4", "5", "6"],
              ["1", "2", "3"],
              ["clear", "0", "ok"],
            ].map((row, i) => (
              <View key={i} style={styles.keypadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() =>
                      key === "clear"
                        ? handleDelete()
                        : key === "ok"
                        ? handleAdd()
                        : handleNumberPress(key)
                    }
                    style={[
                      styles.key,
                      key === "clear" && styles.clearKey,
                      key === "ok" && styles.okKey,
                    ]}
                  >
                    <Text style={styles.keyText}>
                      {key === "clear" ? "⌫" : key === "ok" ? "✓" : key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "white",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
  },
  close: {
    backgroundColor: "red",
    position: "absolute",
    right: 20,
    top: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "600",
    marginVertical: 10,
  },
  presets: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  presetBtn: {
    backgroundColor: "#E6F0FA",
    padding: 10,
    borderRadius: 10,
    minWidth: screenWidth / 6,
    alignItems: "center",
  },
  keypad: {
    marginTop: 10,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  key: {
    backgroundColor: "#F2F2F2",
    width: screenWidth / 4.2,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  clearKey: {
    backgroundColor: "#CCE0F5",
  },
  okKey: {
    backgroundColor: "#CCE0F5",
  },
  keyText: {
    fontSize: 20,
    color: "black",
  },
});
