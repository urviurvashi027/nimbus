import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

type ThemeKey = "basic" | "light" | "dark";

interface ThingsToDoProps {
  visible: boolean;
  onClose: () => void;
}

const ThingsToDoModal: React.FC<ThingsToDoProps> = ({ visible, onClose }) => {
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
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
          {/* Header with Title and Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>Things TO Do</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <Text>100 thing to do</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ThingsToDoModal;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: themeColors[theme].background,
      borderRadius: 10,
      padding: 20,
      maxHeight: "80%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      color: themeColors[theme].text,
      fontWeight: "bold",
    },
    listContainer: {
      // Optional: Add any additional styling if needed
    },
    typeButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    typeText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
  });
