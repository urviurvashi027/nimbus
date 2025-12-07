import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/theme/Colors";
import { ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";

interface DeleteHabitModalProps {
  visible: boolean;
  title: string;
  header: string;
  content: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  secondaryBtnClick: () => void;
  primaryBtnClick: () => void;
}

const DeleteHabitModal: React.FC<DeleteHabitModalProps> = ({
  visible,
  content,
  title,
  header,
  primaryBtnText,
  secondaryBtnText,
  secondaryBtnClick,
  primaryBtnClick,
}) => {
  const onDeleteClick = () => {
    primaryBtnClick();
  };

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={primaryBtnClick}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header with Title and Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Task Types</Text>
            <TouchableOpacity onPress={primaryBtnClick}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          {/* List of Task Types */}
          <View style={styles.listContainer}></View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteHabitModal;

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
      borderBottomColor: "#eee",
    },
    typeText: {
      fontSize: 16,
      color: "#333",
    },
    createButton: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors.basic.WHITE,
      marginTop: 20,
      borderWidth: 1,
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
    rowDirection: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
