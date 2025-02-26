import { View, Text, StyleSheet, Platform, Button } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { themeColors } from "@/constant/Colors";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { getHabitDetailsById } from "@/services/habitService";
import StreakCard from "@/components/habitDetails/StreakCard";
import WeeklyView from "@/components/habitDetails/WeeklyPanel";
import MonthlyOverview from "@/components/habitDetails/MonthlyOverview";
import WeeklyHabitChart from "@/components/habitDetails/MonthlyChartView";
import ThemeContext from "@/context/ThemeContext";
import HabitDetailsCard from "@/components/habitDetails/HabitDetails";

const HabitDetails = () => {
  const router = useRouter();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const { id } = useLocalSearchParams(); // Get habit ID from route params

  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = styling(theme);
  const navigation = useNavigation();

  const habitEditClicked = (id: any) => {
    router.push({ pathname: "/habit/edit", params: { data: habit } });
  };

  const onEditClick = () => {
    router.push("/habit/edit");
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Habit Basic Details",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      headerRight: () => <Button title="Edit" onPress={onEditClick} />,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
        height: 40,
      },
    });
  }, [navigation]);

  const startDate = "2025-08-13";
  const endDate = "2025-09-13";

  // Example of filled dates (in "month-day" format)
  const filledDates = [
    "8-13",
    "8-14",
    "8-20",
    "8-25",
    "8-28",
    "9-2",
    "9-5",
    "9-10",
    "9-13",
  ];

  const getHabitDetails = async (id: string) => {
    setLoading(true);
    try {
      const result = await getHabitDetailsById(id);
      // API need to chanege the str. only data is coming, but need success, message and data like other api response
      // const response = JSON.parse(result);
      const response = result;
      setHabit(response);
      // if (result?.success) {
      //   setHabit(result.data);
      // }
    } catch (error: any) {
      console.log(error, "API Error Response");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const habitId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
      getHabitDetails(habitId);
    }
  }, [id]);

  // useEffect(() => {
  //   console.log(`habit data ${habit}`);
  //   console.log(getStreakData());
  // }, [habit]);

  const getStreakData = () => {
    return {
      score: "65",
      total: 68,
      bestStreak: habit?.longest_streak || 13,
      streak: habit?.current_streak || 2,
    };
  };

  const getHabitDetailsData = () => {
    return {
      habit_type: "Build",
      metric_unit: "liters",
      metric_count: 3.0,
      start_time: "06:50:00",
      end_time: "07:50:00",
      all_day: true,
      reminder_time: "08:50:00",
      frequency: "Every day",
    };
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.gestureContainer}>
        <ScrollView>
          <ScreenView
            style={{
              paddingTop: Platform.OS === "ios" ? 40 : 20,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <StreakCard data={getStreakData()} />
              <HabitDetailsCard data={getHabitDetailsData()} />
              <WeeklyView />
              <MonthlyOverview
                filledDates={filledDates}
                startDate={startDate}
                endDate={endDate}
              />
              {/* <WeeklyHabitChart /> */}
            </View>
          </ScreenView>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default HabitDetails;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      // flex: 1,
      backgroundColor: themeColors[theme].background,
    },
    container: {
      // paddingVertical: 5,
    },
    header: {
      color: themeColors[theme]?.text,
    },
  });
