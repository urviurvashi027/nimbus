import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { themeColors } from "@/constant/Colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={secondaryBtnClick}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{header}</Text>
            <TouchableOpacity onPress={secondaryBtnClick}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View>
            <Text>{title}</Text>
            <Text>{content}</Text>
          </View>
          <View style={styles.rowDirection}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={secondaryBtnClick}
            >
              <Text
                style={{
                  color: themeColors.basic.PRIMARY,
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                {secondaryBtnText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={onDeleteClick}
            >
              <Text
                style={{
                  color: themeColors.basic.PRIMARY,
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                {primaryBtnText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteHabitModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
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
