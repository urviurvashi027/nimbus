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
  existing_tag: HabitTag[];
  new_tag?: string;
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

  const getHabitTagList = async () => {
    const result = await getHabitTag();
    if (result && result.success) {
      setTagsList(result.data);
    }
    if (result && result.error) {
      alert(result.error);
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
    console.log("Tags Input:: handleRemoveTag, updatedTags, ");
    // TODO
    console.log(updatedTags);
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
    console.log("Tags Input:: handleOnSelect from tag input", selectedHabitTag);
    if (newTag) {
      console.log(
        " Tags Input:: handleOnSelect added newly",
        selectedHabitTag,
        newTag
      );
    } else {
      console.log(
        " Tags Input:: handleOnSelect else part",
        selectedHabitTag,
        newTag
      );
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

  const constructTagObject = (tagsArray: { id: number; name: string }[]) => {
    return {
      existing_tag: tagsArray.filter((tag) => tag.id !== 0), // Exclude id = 0
      new_tag: tagsArray.find((tag) => tag.id === 0)?.name || "", // Store name of id = 0
    };
  };

  useEffect(() => {
    if (selectedTag.length) {
      console.log("Tags Input:: useEffect", selectedTag);
      const result = constructTagObject(selectedTag);
      console.log(result);
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
