import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
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

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

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
    // setSelectedTag((prev: any) => ({ ...prev, updatedTags }));
  };

  // useEffect(() => {
  //   console.log(selectedTag, "selectedTag from useEffect");
  // }, [selectedTag]);

  //   useEffect(() => {
  //     if (tagsList.length) {
  //       setSelectedTaskType(habitTypeList[0]);
  //     }
  //   }, [habitTypeList]);

  // const handleNewTag = (newTag: string) => {
  //   const tag = { name: newTag, id: 0 };
  //   setSelectedTag((prev: any) => ({ ...prev, existing_tag: tag }));
  // };

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
      //   if (!selectedTag.includes(tag)) {
      //     setSelectedTags([...selectedTags, tag]);
      //   }
      // setSelectedTag([...selectedTag, selectedHabitTag]);
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
          style={styles.selectorButton}
          onPress={() => setShowHabitTagsModal(true)}
        >
          <Ionicons
            style={styles.iconLeft}
            name="pricetags-outline"
            size={20}
            color={themeColors[theme].text}
          />
          <View style={styles.inputField}>
            <Text style={styles.label}>Tags</Text>
            <Text style={styles.selectorText}>
              {selectedTag?.length > 0
                ? `${selectedTag?.length} Tag(s) Selected`
                : "Select Tags"}
            </Text>
          </View>
          <Ionicons
            style={styles.iconRight}
            name="chevron-forward"
            size={20}
            color={themeColors[theme].text}
          />
        </TouchableOpacity>
      </View>

      {/* Display Selected Tags */}
      <View style={styles.tagsContainer}>
        {selectedTag?.map((tag: any, index: number) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(index)}>
              <Ionicons name="close-circle" size={16} color="#ff0000" />
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

// Bug List
// bug unselect everything and then select on of the value, it will show all selected
// add new tag not coming with cross
