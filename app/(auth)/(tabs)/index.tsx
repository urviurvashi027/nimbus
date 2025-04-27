import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, ScreenView } from "@/components/Themed";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import DatePanel from "@/components/homeScreen/DatePanel";
import HabitList from "@/components/HabitList/HabitList";
import { themeColors } from "@/constant/Colors";
import { getHabitList } from "@/services/habitService";
import { HabitItem } from "@/types/habitTypes";
import { ThemeKey } from "@/components/Themed";
import NewUserScreen from "../FirstTimeUser/NewUserScreen";

export default function TabOneScreen() {
  const [habitList, setHabitList] = useState<HabitItem[]>([]);
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // create button click
  const onCreateClick = () => {
    router.push("/habit/create");
  };

  // function to be called whenever date changes
  const onDateChange = (val: any) => {};

  const getHabitListData = async () => {
    try {
      const result = await getHabitList();
      if (result?.success) {
        setHabitList(result.data);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getHabitListData();
  }, []);

  const refreshData = () => {
    getHabitListData();
  };

  return (
    <ScreenView style={{ paddingTop: Platform.OS === "ios" ? 50 : 20 }}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {/* Date Panel View */}
        <DatePanel onDateChange={onDateChange} />

        {habitList.length > 0 ? (
          <View style={styles.taskListContainer}>
            <HabitList
              data={habitList}
              style={styles.itemSeparator}
              refreshData={refreshData}
            />
          </View>
        ) : (
          <View style={styles.taskListContainer}>
            <NewUserScreen></NewUserScreen>
            {/* <Text>Create your first habit by click on add button.</Text> */}
          </View>
        )}
      </GestureHandlerRootView>
      <TouchableOpacity style={styles.floatingButton} onPress={onCreateClick}>
        <Ionicons name="add" size={24} color={styles.iconColor.color} />
      </TouchableOpacity>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      backgroundColor: themeColors[theme].background,
      flex: 1, // Ensures full screen coverage
    },
    datePanel: {},
    taskListContainer: {
      backgroundColor: themeColors[theme].background,
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

// FFEDFA;
// B4EBE6;
// F8ED8C;
// C1CFA1;
// B7B1F2;
