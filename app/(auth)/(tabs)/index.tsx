import { StyleSheet, TouchableOpacity } from "react-native";

import { View, Text, ScreenView } from "@/components/Themed";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import ThemeContext from "@/context/ThemeContext";
import DatePanel from "@/components/homeScreen/DatePanel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HabitList from "@/components/HabitList/HabitList";
import { tasks } from "@/constant/data/taskList";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/Colors";

type ThemeKey = "basic" | "light" | "dark";

export default function TabOneScreen() {
  const onContinueClick = () => {
    router.push("/create-habit/habitBasic");
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // useEffect(() => {
  //   // console.log(theme, "dicover theme");
  // }, [theme]);

  // function to be called whenever date changes
  const onDateChange = (val: any) => {
    // console.log(val, "value of changed date from index");
  };

  return (
    <ScreenView>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {/* Date Panel View */}
        <DatePanel onDateChange={onDateChange} />

        <View style={styles.taskListContainer}>
          <HabitList data={tasks} style={styles.itemSeparator} />
        </View>
      </GestureHandlerRootView>
      <TouchableOpacity style={styles.floatingButton} onPress={onContinueClick}>
        <Ionicons name="add" size={24} color={styles.iconColor.color} />
      </TouchableOpacity>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1, // Ensures full screen coverage
    },
    // heading: {
    //   paddingTop: 10,
    // },
    // headingText: {
    //   fontWeight: 600,
    //   fontSize: 18,
    // },
    datePanel: {},
    taskListContainer: {
      flex: 12, // Takes up the remaining space
      marginTop: 40, // 10px space between FlatList and TaskList
    },
    iconColor: {
      color: themeColors[theme].text,
    },
    floatingButton: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: themeColors[theme].background,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: themeColors[theme].shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    itemSeparator: {
      flex: 1,
      height: 1,
      paddingBottom: 12,
      backgroundColor: themeColors[theme].background,
    },
  });
