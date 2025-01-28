import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import HabitContext from "@/context/HabitContext";
import { Button, FormInput, ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/Themed";
import TaskTagsModal from "@/components/createHabit/TaskTagsModal";
import TaskTypeModal from "@/components/createHabit/TaskTypeModal";

type ThemeKey = "basic" | "light" | "dark";

export default function HabitBasic() {
  const [colorSchema, setColorSchema] = useState<
    "red" | "blue" | "green" | "yellow" | "black"
  >("red");
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState<string>("Build");
  const [tags, setTags] = useState<string[]>([]);

  const [showTaskTypeModal, setShowTaskTypeModal] = useState(false);
  const [showTaskTagsModal, setShowTaskTagsModal] = useState(false);

  const { habitData, setHabitData } = useContext(HabitContext);
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const handleColorSelect = (
    color: "red" | "blue" | "green" | "yellow" | "black"
  ) => {
    setColorSchema(color);
  };

  // function to handle Type Task Modal
  const handleTypeTaskModal = (type: any) => {
    // console.log(type, "from type task modal");
    setTaskType(type);
  };

  const handleAddTag = (tag: string) => {
    // console.log(tag, "from tag modal");
    setTags([...tags, tag]);
  };

  // Handle removing tags
  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  // useEffect(() => {
  //   console.log(habitData, "habitData");
  // }, [habitData]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // headerStyle: {
      //   backgroundColor: "#f4511e",
      // },
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

  const styles = styling(theme);

  // useEffect(() => {
  //   console.log(habitData, "habitData from basic");
  // }, [habitData]);

  const onContinueClick = () => {
    // console.log("continue clicked habit basics");
    setHabitData({
      ...habitData,
      habitColor: colorSchema,
      habitName: taskName,
      habitType: taskType,
      Tags: tags,
    });
    router.push("/create-habit/habitMetric");
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <View>
        {/* Color Selection */}
        {/* <Text style={styles.label}>Select Color</Text> */}
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
          value={taskName}
          onChangeText={setTaskName}
        />

        {/* Task Type */}
        <Text style={styles.label}>Task Type</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowTaskTypeModal(true)}
        >
          <Text style={styles.selectorText}>{taskType}</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        {/* Tags */}
        <Text style={styles.label}>Tags</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setShowTaskTagsModal(true)}
        >
          <Text style={styles.selectorText}>
            {tags.length > 0 ? `${tags.length} Tag(s) Selected` : "Select Tags"}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Display Selected Tags */}
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(index)}>
              <Ionicons name="close-circle" size={16} color="#ff0000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Continue"
        onPress={onContinueClick}
      />

      {/* Task Type Modal */}
      <TaskTypeModal
        visible={showTaskTypeModal}
        onClose={() => setShowTaskTypeModal(false)}
        onSelect={handleTypeTaskModal}
        // onSelect={(type) => setTaskType(type)}
      />

      {/* Task Tags Modal */}
      <TaskTagsModal
        visible={showTaskTagsModal}
        onClose={() => setShowTaskTagsModal(false)}
        onSelect={(tag: any) => handleAddTag(tag)}
        existingTags={tags}
        onAddNewTag={handleAddTag}
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
    // inputLabel: {
    //   marginBottom: 10,
    // },
    label: {
      fontSize: 16,
      // color: "#333",
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
