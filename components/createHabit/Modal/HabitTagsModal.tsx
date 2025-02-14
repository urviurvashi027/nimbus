import React, { useContext, useEffect, useState } from "react";
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
import { FormInput } from "../../Themed";
import { findIdBName, addObjectAtEnd } from "@/utils/helper";
import { HabitTag } from "@/types/habitTypes";
import { selectedTag } from "../HabitTagsInput";

type ThemeKey = "basic" | "light" | "dark";

interface TagsType {
  id: number;
  name: string;
}

interface TaskTagsModalProps {
  habitTagList: HabitTag[];
  visible: boolean;
  onClose: () => void;
  onSelect: (tag: selectedTag) => void;
  //   existingTags: TagsType[];
  //   onAddNewTag: (tag: string, id: number) => void;
}

const HabitTagsModal: React.FC<TaskTagsModalProps> = ({
  habitTagList,
  visible,
  onClose,
  onSelect,
  //   existingTags,
  //   onAddNewTag,
}) => {
  const [habitTagData, setHabitTagData] = useState<TagsType[]>([]);

  const [isAdding, setIsAdding] = useState(false);

  const [selectedTag, setSelectedTag] = useState<TagsType[]>([]);

  const [newTag, setNewTag] = useState<any>();
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
    if (selectedTag.includes(newTag.trim())) {
      setError("Tag already exists.");
      return;
    }
    console.log(newTag, "newTag -=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    // setNewTag("");
    setIsAdding(false);
    setError("");
    onClose();
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  useEffect(() => {
    const modifiedArray = addObjectAtEnd(habitTagList);
    setHabitTagData(modifiedArray);
  }, [habitTagList]);

  const handleSaveClick = (tag: any) => {
    setSelectedTag([...selectedTag, tag]);
  };

  useEffect(() => {
    if (selectedTag.length) {
      console.log(newTag, "newTag");
      const result = {
        existing_tag: selectedTag,
        new_tag: newTag,
      };

      onSelect(result);
    }
  }, [selectedTag, newTag]);

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
            {habitTagData.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tagButton}
                onPress={() => {
                  if (tag.name === "Add New") {
                    setIsAdding(true);
                  } else {
                    handleSaveClick(tag);
                    onClose();
                  }
                }}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
                {tag.name === "Add New" && (
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                )}
              </TouchableOpacity>
            ))}

            {/* Display existing tags dynamically */}
            {/* {existingTags
              .filter((tag) => !data.includes(tag))
              .map((tag, index) => (
                <TouchableOpacity
                  key={`existing-${index}`}
                  style={styles.tagButton}
                  onPress={() => {
                    handleSaveClick(tag);
                    onClose();
                  }}
                >
                  <Text style={styles.tagText}>{tag.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              ))} */}
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

export default HabitTagsModal;
