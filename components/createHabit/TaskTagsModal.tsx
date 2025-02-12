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
import { FormInput } from "../Themed";
import { findIdBName, addObjectAtEnd } from "@/utlity/helper";

interface TagsType {
  id: number;
  name: string;
}

interface TaskTagsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (tag: TagsType) => void;
  existingTags: TagsType[];
  onAddNewTag: (tag: string, id: number) => void;
}

type ThemeKey = "basic" | "light" | "dark";

const PREDEFINED_TAGS = [
  {
    id: 1,
    name: "Morning",
  },
  {
    id: 2,
    name: "Routine",
  },
  {
    id: 3,
    name: "Workout",
  },
  {
    id: 4,
    name: "Clean Room",
  },
  {
    id: 5,
    name: "Healthy Lifestyle",
  },
  {
    id: 6,
    name: "Sleep Better",
  },
  {
    id: 7,
    name: "Relationship",
  },
];

// addObjectAtEnd(PREDEFINED_TAGS);
// const addNewLabel = () => {
//   // Get the last object in the array
//   const lastObject = PREDEFINED_TAGS[PREDEFINED_TAGS.length - 1];

//   // Extract the last id and increment it by 1
//   const newId = lastObject ? lastObject.id + 1 : 1; // Handle empty array case

//   // Create the new object to add
//   const newObject = {
//     id: newId,
//     name: "Add New",
//   };

//   // Add the new object to the end of the array
//   const modifiedArray = [...PREDEFINED_TAGS, newObject];

//   return modifiedArray;
// };

const TaskTagsModal: React.FC<TaskTagsModalProps> = ({
  visible,
  onClose,
  onSelect,
  existingTags,
  onAddNewTag,
}) => {
  const [data, setData] = useState<TagsType[]>([]);

  const [isAdding, setIsAdding] = useState(false);

  const [selectedTag, setSelectedTag] = useState<string[]>([]);

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
    if (existingTags.includes(newTag.trim())) {
      setError("Tag already exists.");
      return;
    }
    const id = findIdBName(data, "name", "id", "Add New");
    onAddNewTag(newTag.trim(), id);
    setNewTag("");
    setIsAdding(false);
    setError("");
    onClose();
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  useEffect(() => {
    const modifiedArray = addObjectAtEnd(PREDEFINED_TAGS);
    setData(modifiedArray);
  }, []);

  const handleSaveClick = (tag: any) => {
    // setSelectedTag([...selectedTag, tag]);
    onSelect(tag);
  };

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
            {data.map((tag, index) => (
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
            {existingTags
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
