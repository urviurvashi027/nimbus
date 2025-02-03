import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { FormInput } from "../Themed";

interface TaskTagsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (tag: string) => void;
  existingTags: string[];
  onAddNewTag: (tag: string) => void;
}

type ThemeKey = "basic" | "light" | "dark";

const PREDEFINED_TAGS = [
  "Morning",
  "Routine",
  "Workout",
  "Clean Room",
  "Healthy Lifestyle",
  "Sleep Better",
  "Relationship",
  "Add New",
];

const TaskTagsModal: React.FC<TaskTagsModalProps> = ({
  visible,
  onClose,
  onSelect,
  existingTags,
  onAddNewTag,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  const handleAddNew = () => {
    if (newTag.trim().length === 0) {
      setError("Tag cannot be empty.");
      return;
    }
    if (newTag.trim().length > 20) {
      setError("Tag cannot exceed 20 characters.");
      return;
    }
    if (existingTags.includes(newTag.trim())) {
      setError("Tag already exists.");
      return;
    }
    onAddNewTag(newTag.trim());
    setNewTag("");
    setIsAdding(false);
    setError("");
    onClose();
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setIsAdding(false);
        setNewTag("");
        setError("");
        onClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header with Title and Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Task Tag</Text>
            <TouchableOpacity
              onPress={() => {
                setIsAdding(false);
                setNewTag("");
                setError("");
                onClose();
              }}
            >
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          {/* List of Task Tags */}
          <View style={styles.listContainer}>
            {PREDEFINED_TAGS.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tagButton}
                onPress={() => {
                  if (tag === "Add New") {
                    setIsAdding(true);
                  } else {
                    onSelect(tag);
                    onClose();
                  }
                }}
              >
                <Text style={styles.tagText}>{tag}</Text>
                {tag === "Add New" && (
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                )}
              </TouchableOpacity>
            ))}

            {/* Display existing tags dynamically */}
            {existingTags
              .filter((tag) => !PREDEFINED_TAGS.includes(tag))
              .map((tag, index) => (
                <TouchableOpacity
                  key={`existing-${index}`}
                  style={styles.tagButton}
                  onPress={() => {
                    onSelect(tag);
                    onClose();
                  }}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              ))}
          </View>

          {/* Add New Tag Section */}
          {isAdding && (
            <View style={styles.addNewContainer}>
              <FormInput
                style={styles.input}
                placeholder="Enter new tag"
                value={newTag}
                onChangeText={(text) => {
                  setNewTag(text);
                  if (text.length <= 20) {
                    setError("");
                  }
                }}
                maxLength={20}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "85%",
      backgroundColor: themeColors[theme].background,
      borderRadius: 10,
      padding: 20,
      maxHeight: "85%",
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
      color: themeColors[theme].text,
    },
    listContainer: {
      // Optional: Add any additional styling if needed
    },
    tagButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    tagText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
    addNewContainer: {
      marginTop: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    addButton: {
      marginTop: 10,
      backgroundColor: themeColors.basic.secondaryColor,
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: "center",
    },
    addButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: themeColors.basic.danger,
      marginTop: 5,
      fontSize: 14,
    },
  });

export default TaskTagsModal;
