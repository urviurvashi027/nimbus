import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { getHabitTag } from "@/services/habitService";
import { HabitTag } from "@/types/habitTypes";
import { ThemeKey } from "../Themed";
import HabitTagsModal from "./Modal/HabitTagsModal";
import styling from "./style/HabitTagsInputStyle";

export type selectedTag = {
  existing_tag: HabitTag[];
  new_tag: string;
};

// type selectedTag = {
//   tags: number[];
// };

interface HabitTagsInputProps {
  onSelect: (selectedTag: selectedTag) => void;
}

const HabitTagsInput: React.FC<HabitTagsInputProps> = ({ onSelect }) => {
  const [tagsList, setTagsList] = useState<HabitTag[]>([]);

  const [selectedTag, setSelectedTag] = useState<any>({
    existing_tag: [],
    new_tag: "",
  });

  const [showHabitTagsModal, setShowHabitTagsModal] = useState(false);

  const [parsedValue, setParsedValue] = useState<selectedTag>({
    existing_tag: [],
    new_tag: "",
  });

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

  //   const handleAddTag = (tag: string) => {
  //     setSelectedTag([...selectedTag, tag]);
  //   };

  //   const handleNewTag = (tagName: string, id: number | undefined) => {
  //     setSelectedTag([...selectedTag, { name: tagName, id }]);
  //   };

  // useEffect(() => {
  //   console.log(tags, "from useEffect ");
  // }, [tags]);

  // Handle removing tags
  const handleRemoveTag = (index: number) => {
    const res = selectedTag.existing_tag;
    const updatedTags = [...res];
    updatedTags.splice(index, 1);

    // TODO
    setSelectedTag((prev: any) => ({ ...prev, existing_tag: updatedTags }));
  };

  useEffect(() => {
    console.log(selectedTag, "selectedTag from useEffect");
  }, [selectedTag]);

  //   useEffect(() => {
  //     if (tagsList.length) {
  //       setSelectedTaskType(habitTypeList[0]);
  //     }
  //   }, [habitTypeList]);

  // const handleNewTag = (newTag: string) => {
  //   const tag = { name: newTag, id: 0 };
  //   setSelectedTag((prev: any) => ({ ...prev, existing_tag: tag }));
  // };

  const handleOnSelect = (selectedHabitTag: selectedTag) => {
    console.log(selectedHabitTag, "selectedHabitTag");
    setSelectedTag(selectedHabitTag);
    // handleNewTag(selectedHabitTag.new_tag);
    // onSelect(id);
  };

  useEffect(() => {
    const res = selectedTag?.existing_tag?.map((item: any) => item.id);
  }, [selectedTag]);

  return (
    <>
      <View>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowHabitTagsModal(true)}
        >
          <Ionicons
            style={styles.iconLeft}
            name="chevron-forward"
            size={20}
            color={themeColors[theme].text}
          />
          <Text style={styles.label}>Tags</Text>
          <Text style={styles.selectorText}>
            {selectedTag?.existing_tag.length > 0
              ? `${selectedTag?.existing_tag?.length} Tag(s) Selected`
              : "Select Tags"}
          </Text>
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
        {selectedTag?.existing_tag.map((tag: any, index: number) => (
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
        onClose={() => setShowHabitTagsModal(false)}
        onSelect={handleOnSelect}
      />
    </>
  );
};

export default HabitTagsInput;

// Bug List
// bug unselect everything and then select on of the value, it will show all selected
// add new tag not coming with cross
// css fix for input box
