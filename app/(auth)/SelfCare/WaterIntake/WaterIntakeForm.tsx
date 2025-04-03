import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WaterIntakeProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<WaterIntakeProps> = ({ visible, onClose }) => {
  const settingsOptions = [
    {
      id: "1",
      icon: "notifications",
      title: "Reminders",
      value: "Off",
    },
    {
      id: "2",
      icon: "water",
      title: "Water intake goal",
      value: "73oz",
    },
    { id: "3", icon: "scale", title: "Units", value: "Lbs, oz" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Setting</Text>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        <FlatList
          data={settingsOptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.optionRow}>
              <Ionicons
                name="scale"
                size={20}
                color="black"
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>{item.title}</Text>
              <Text style={styles.optionValue}>{item.value}</Text>
              <Ionicons name="calendar-outline" size={20} color="black" />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  saveButton: {
    padding: 10,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  optionRow: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionValue: {
    fontSize: 16,
    color: "#555",
  },
});

export default SettingsModal;
