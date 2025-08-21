import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ACTIVITY_OPTIONS = ["Low Activity", "Medium Activity", "High Activity"];
const screenHeight = Dimensions.get("window").height;

const ActivityModal = ({
  visible,
  onClose,
  onSelect,
  selectedActivity,
}: any) => {
  const [selected, setSelected] = useState(selectedActivity || "");

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Activity</Text>

          {ACTIVITY_OPTIONS.map((option) => {
            const isSelected = selected === option;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  setSelected(option);
                  onSelect(option);
                }}
                style={[styles.optionRow, isSelected && styles.selectedRow]}
              >
                <Text style={styles.optionText}>{option}</Text>
                {isSelected && (
                  <View style={styles.radio}>
                    <View style={styles.radioDot} />
                  </View>
                )}
              </Pressable>
            );
          })}

          <Text style={styles.note}>
            Your personal information won’t be collected or shared.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityModal;

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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  back: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  optionRow: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 0.6,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedRow: {
    backgroundColor: "#E9F3FF",
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
  },
  radio: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    height: 10,
    width: 10,
    backgroundColor: "black",
    borderRadius: 5,
  },
  note: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
    fontSize: 13,
  },
});
