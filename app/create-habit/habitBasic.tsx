import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import HabitContext from "@/context/HabitContext";
import { Button, FormInput, ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { Text } from "@/components/Themed";
import HabitTypeInput from "@/components/createHabit/HabitTypeInput";
import HabitTagsInput from "@/components/createHabit/HabitTagsInput";
import { ThemeKey } from "@/components/Themed";
import { HabitType } from "@/types/habitTypes";

export default function HabitBasic() {
  const [colorSchema, setColorSchema] = useState<
    "red" | "blue" | "green" | "yellow" | "black"
  >("red");

  const [habitName, sethabitName] = useState("");
  const [habitTypeId, sethabitTypeId] = useState<number>(0);
  const [tags, setTags] = useState<any>([]);
  // for modal
  const [showTaskTagsModal, setShowTaskTagsModal] = useState(false);

  const { habitData, setHabitData } = useContext(HabitContext);
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const navigation = useNavigation();

  const handleColorSelect = (
    color: "red" | "blue" | "green" | "yellow" | "black"
  ) => {
    setColorSchema(color);
  };

  // function to handle Type Task Modal
  const handleHabitTypeSelect = (habitTypeId: number) => {
    sethabitTypeId(habitTypeId);
  };

  const handleHabitTagSelection = (selectedTags: any) => {
    console.log(
      selectedTags,
      "selectedTags selectedTags handleHabitTagSelection-------------"
    );
  };

  // const handleAddTag = (tag: string) => {
  //   setTags([...tags, tag]);
  // };

  // const handleNewTag = (tagName: string, id: number | undefined) => {
  //   setTags([...tags, { name: tagName, id }]);
  // };

  // // useEffect(() => {
  // //   console.log(tags, "from useEffect ");
  // // }, [tags]);

  // // Handle removing tags
  // const handleRemoveTag = (index: number) => {
  //   const updatedTags = [...tags];
  //   updatedTags.splice(index, 1);
  //   setTags(updatedTags);
  // };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Habit Basic Details",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
        height: 40,
      },
    });
  }, [navigation]);

  const getSelectedTag = () => {
    const tagNames = tags.map((tag: any) => tag.name);
    return tagNames;
  };

  const onContinueClick = () => {
    if (!habitName && habitTypeId) {
      alert("Please fill in the required field");
    } else {
      setHabitData({
        ...habitData,
        color: colorSchema,
        name: habitName,
        habit_type_id: habitTypeId,
        tags: getSelectedTag(),
      });
      router.push("/create-habit/habitMetric");
    }
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <View>
        <View style={styles.colorOptionsContainer}>
          {["red", "blue", "green", "yellow", "black"].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                colorSchema === color && styles.selectedColor,
              ]}
              onPress={() =>
                handleColorSelect(
                  color as "red" | "blue" | "green" | "yellow" | "black"
                )
              }
            />
          ))}
        </View>

        {/* Task Name */}
        <Text style={styles.label}>Task Name</Text>
        <FormInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="Enter task name"
          value={habitName}
          onChangeText={sethabitName}
        />

        <HabitTypeInput onSelect={handleHabitTypeSelect} />
        <HabitTagsInput onSelect={handleHabitTagSelection} />
      </View>
      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Continue"
        onPress={onContinueClick}
      />
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    header: {
      color: themeColors[theme]?.text,
    },
    container: {
      marginTop: 60,
    },
    btn: {
      marginTop: 60,
      backgroundColor: themeColors[theme]?.primaryColor,
      padding: 20,
      alignItems: "center",
      borderRadius: 10,
    },
    btnText: {
      color: themeColors[theme]?.text,
      fontWeight: 800,
      fontSize: 18,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      color: "#333",
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
      marginTop: 10,
    },
    colorCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    selectedColor: {
      borderColor: "blue",
    },
    colorOptionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      paddingTop: 30,
    },
    selectorButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    selectorText: {
      fontSize: 14,
      color: themeColors.basic.mediumGrey,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#e0f7fa",
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 5,
      marginBottom: 5,
    },
    tagText: {
      marginRight: 5,
      fontSize: 14,
      color: "#333",
    },
  });
