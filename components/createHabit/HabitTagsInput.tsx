import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/theme/Colors";
import { getHabitTag } from "@/services/habitService";
import { HabitTag } from "@/types/habitTypes";
import { ThemeKey } from "../Themed";
import HabitTagsModal from "./Modal/HabitTagsModal";
import styling from "./style/HabitInputStyle";
// import styling from "./style/HabitTagsInputStyle";

export type selectedTag = {
  old?: HabitTag[];
  new?: string;
};

// type selectedTag = {
//   tags: number[];
// };

interface HabitTagsInputProps {
  onSelect: (selectedTag: selectedTag) => void;
}

const HabitTagsInput: React.FC<HabitTagsInputProps> = ({ onSelect }) => {
  const [tagsList, setTagsList] = useState<HabitTag[]>([]);

  const [selectedTag, setSelectedTag] = useState<HabitTag[]>([]);

  const [showHabitTagsModal, setShowHabitTagsModal] = useState(false);

  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme);

  // const onLoginClick = async () => {
  //   try {
  //     const result = await getHabitTag();
  //     if (result?.success) {
  //          setTagsList(result.data);
  //     }
  //   } catch (error: any) {
  //     console.log(error, "API Error Response");
  //   }
  // };

  const getHabitTagList = async () => {
    try {
      const result = await getHabitTag();
      if (result?.success) {
        setTagsList(result.data);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getHabitTagList();
  }, []);

  // Handle removing tags
  const handleRemoveTag = (index: number) => {
    const res = selectedTag;
    const updatedTags = [...res];
    updatedTags.splice(index, 1);
    // TODO
    setSelectedTag(updatedTags);
  };

  const handleOnSelect = (selectedHabitTag: any, newTag?: string) => {
    if (newTag) {
    } else {
      setSelectedTag((prevTags) => {
        // Check if the tag already exists based on the `id`
        const isDuplicate = prevTags.some(
          (tag) => tag.id === selectedHabitTag.id
        );

        if (isDuplicate) {
          return prevTags; // If already exists, return the same array (no update)
        }

        return [...prevTags, selectedHabitTag]; // Otherwise, add new tag
      });
    }
  };

  const constructTagObject = (tagsArray: { id: number; name?: string }[]) => {
    return {
      old: tagsArray.filter((tag) => tag.id !== 0), // Exclude id = 0
      new: tagsArray.find((tag) => tag.id === 0)?.name || "", // Store name of id = 0
    };
  };

  useEffect(() => {
    if (selectedTag.length) {
      const result = constructTagObject(selectedTag);
      onSelect(result);
    }
  }, [selectedTag]);

  const onCloseModalClick = () => {
    setShowHabitTagsModal(false);
  };

  return (
    <>
      <View>
        <TouchableOpacity
          style={styles.rowItem}
          onPress={() => setShowHabitTagsModal(true)}
        >
          <View style={styles.rowLeft}>
            <Ionicons
              style={styles.iconLeft}
              name="pricetags-outline"
              size={20}
              color={newTheme.textSecondary}
            />
            <Text style={styles.rowLabel}>Types</Text>
          </View>

          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>
              {selectedTag?.length > 0
                ? `${selectedTag?.length} Tag(s) Selected`
                : "Select Tags"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={newTheme.textSecondary}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Display Selected Tags */}
      <View style={styles.tagsContainer}>
        {selectedTag?.map((tag: any, index: number) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(index)}>
              <Ionicons name="close-circle" size={16} color={newTheme.accent} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <HabitTagsModal
        habitTagList={tagsList}
        visible={showHabitTagsModal}
        selectedTagData={selectedTag}
        onClose={onCloseModalClick}
        onSelect={handleOnSelect}
      />
    </>
  );
};

export default HabitTagsInput;
