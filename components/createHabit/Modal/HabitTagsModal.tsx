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

import ThemeContext from "@/context/ThemeContext";
import { findIdBName, addObjectAtEnd } from "@/utils/helper";
import { HabitTag } from "@/types/habitTypes";
import { selectedTag } from "../HabitTagsInput";
import InputField from "@/components/common/ThemedComponent/StyledInput";
// import styling from "../style/HabitTagModalStyle";

type ThemeKey = "basic" | "light" | "dark";

interface TagsType {
  id: number;
  name?: string;
}

interface TaskTagsModalProps {
  habitTagList: HabitTag[];
  visible: boolean;
  onClose: () => void;
  selectedTagData: any;
  onSelect: (tag?: any, newTag?: string) => void;
  //   existingTags: TagsType[];
  //   onAddNewTag: (tag: string, id: number) => void;
}

const HabitTagsModal: React.FC<TaskTagsModalProps> = ({
  habitTagList,
  visible,
  onClose,
  onSelect,
  selectedTagData,
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
    setSelectedTag([...selectedTag, { id: 0, name: newTag }]);
    onSelect({ id: 0, name: newTag });
    // setNewTag("");
    setIsAdding(false);
    setError("");
    onClose();
  };

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  useEffect(() => {
    const modifiedArray = addObjectAtEnd(habitTagList);
    setHabitTagData(modifiedArray);
  }, [habitTagList]);

  const handleSaveClick = (tag: { id: number; name?: string }) => {
    setSelectedTag((prev) => {
      // Check if the tag already exists based on `id`
      const tagExists = prev.some((t) => t.id === tag.id);

      if (tagExists) {
        return prev; // Do nothing if tag already exists
      }

      // Otherwise, add the new tag
      return [...prev, tag];
    });
    onSelect(tag);
  };

  useEffect(() => {
    if (selectedTagData.length) setSelectedTag(selectedTagData);
  }, [selectedTagData]);

  // useEffect(() => {
  //   if (selectedTag.length && newTag) {
  //     onSelect(selectedTag, newTag);
  //   }
  // }, [newTag]);

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
              <Ionicons name="close" size={24} color={newTheme.textPrimary} />
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
          </View>

          {/* Add New Tag Section */}
          {isAdding && (
            <View style={styles.addNewContainer}>
              <InputField
                label="New Tag"
                value={newTag}
                // maxLength={20}
                onChangeText={(text) => {
                  setNewTag(text);
                  if (text.length <= 20) {
                    setError("");
                  }
                }}
                placeholder="Add New Tag"
              />

              {/* <FormInput
                style={styles.input}
                placeholder="Enter news tag"
                value={newTag}
                onChangeText={(text) => {
                  setNewTag(text);
                  if (text.length <= 20) {
                    setError("");
                  }
                }}
                maxLength={20}
              /> */}
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

export default HabitTagsModal;

const styling = (newTheme: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "85%",
      backgroundColor: newTheme.surface,
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
      color: newTheme.textPrimary,
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
      borderBottomColor: newTheme.divider,
    },
    tagText: {
      fontSize: 16,
      color: newTheme.textPrimary,
    },
    addNewContainer: {
      marginTop: 20,
    },
    input: {
      borderWidth: 1,
      backgroundColor: newTheme.surface,
      borderColor: newTheme.divider,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    addButton: {
      marginTop: 10,
      backgroundColor: newTheme.accent,
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: "center",
    },
    addButtonText: {
      color: newTheme.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: newTheme.error,
      marginTop: 5,
      fontSize: 14,
    },
  });
