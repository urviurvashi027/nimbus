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
import styling from "../style/HabitTagModalStyle";

type ThemeKey = "basic" | "light" | "dark";

interface TagsType {
  id: number;
  name: string;
}

interface TaskTagsModalProps {
  habitTagList: HabitTag[];
  visible: boolean;
  onClose: () => void;
  selectedTagData: any;
  onSelect: (tag: selectedTag) => void;
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
    console.log(selectedTagData?.existing_tag, "selectedTagData from modal");
    if (selectedTagData.length) setSelectedTag(selectedTagData?.existing_tag);
  }, [selectedTagData]);

  useEffect(() => {
    console.log(selectedTag, "selectedTag usefeect modal");
  }, [selectedTag]);

  useEffect(() => {
    if (selectedTag.length) {
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

export default HabitTagsModal;
