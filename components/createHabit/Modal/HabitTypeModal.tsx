import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "../../../context/ThemeContext";
import { themeColors } from "../../../constant/Colors";
import { HabitType } from "../../../types/habitTypes";
import { ThemeKey } from "../../Themed";
import styling from "../style/HabitTypeModalStyle";

interface HabitTypeModalProps {
  visible: boolean;
  habitTypeList: HabitType[];
  onClose: () => void;
  onSelect: (type: HabitType) => void;
}

const HabitTypeModal: React.FC<HabitTypeModalProps> = ({
  habitTypeList,
  visible,
  onClose,
  onSelect,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header with Title and Close Button */}
            <View style={styles.header}>
              <Text style={styles.title}>Select Task Types</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={themeColors[theme].text}
                />
              </TouchableOpacity>
            </View>

            {/* List of Task Types */}
            <View style={styles.listContainer}>
              {habitTypeList.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.typeButton}
                  onPress={() => {
                    onSelect(type);
                    onClose();
                  }}
                >
                  <Text style={styles.typeText}>{type.name}</Text>
                  {/* <Ionicons name="chevron-forward" size={20} color="#888" /> */}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HabitTypeModal;
