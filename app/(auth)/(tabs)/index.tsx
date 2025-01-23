import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { View, Text, ScreenView } from "@/components/Themed";
import { router, useNavigation } from "expo-router";
import React, { useContext, useEffect } from "react";
import ThemeContext from "@/context/ThemeContext";
import DatePanel from "@/components/homeScreen/DatePanel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HabitList from "@/components/HabitList/HabitList";
import { tasks } from "@/constant/data/taskList";
import { Ionicons } from "@expo/vector-icons";

type ThemeKey = "basic" | "light" | "dark";

export default function TabOneScreen() {
  const onContinueClick = () => {
    console.log("pushed");
    router.push("/create-habit/habitBasic");
  };

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  useEffect(() => {
    console.log(theme, "dicover theme");
  }, [theme]);

  // function to be called whenever date changes
  const onDateChange = (val: any) => {
    console.log(val, "value of changed date from index");
  };

  return (
    <ScreenView>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {/* Date Panel View */}
        <DatePanel onDateChange={onDateChange} />

        <View style={styles.taskListContainer}>
          <HabitList data={tasks} />
        </View>
      </GestureHandlerRootView>
      <TouchableOpacity style={styles.floatingButton} onPress={onContinueClick}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1, // Ensures full screen coverage
    },
    heading: {
      paddingTop: 10,
    },
    headingText: {
      fontWeight: 600,
      fontSize: 18,
    },
    datePanel: {},
    taskListContainer: {
      flex: 12, // Takes up the remaining space
      marginTop: 10, // 10px space between FlatList and TaskList
    },
    floatingButton: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
  });
