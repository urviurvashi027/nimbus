import { View, Text, StyleSheet, Platform, Button } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { themeColors } from "@/constant/theme/Colors";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { getHabitDetailsById } from "@/services/habitService";
import ThemeContext from "@/context/ThemeContext";
import WeeklyHabitRowPanel from "@/components/habitDetails/WeeklyRowPanel";
import SummaryPanel from "@/components/habitDetails/SummaryPanel";
import HabitDetailsPanel from "@/components/habitDetails/HabitDetailsPanel";
import HeaderPanel from "@/components/habitDetails/HeaderPanel";
import MonthlyOverviewPanel from "@/components/habitDetails/MonthlyOverviewPanel";

const HabitDetails = () => {
  const router = useRouter();
  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);
  const { id } = useLocalSearchParams(); // Get habit ID from route params

  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = styling(newTheme);
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
      headerTitle: "Habit Details",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      // headerRight: () => <Button title="Edit" onPress={onEditClick} />,
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
      if (result?.success) {
        const data = result.data;
        const formattedData = {
          ...data,
          longest_streak: data.longest_streak || 5,
          name: data.name,
          current_streak: data.current_streak || 3,
          success_rate: 45,
          completed_habits: 134,
          type: data.habit_type,
          frequency: data.frequency,
          metric_count: data.metric_count,
          metric_unit: data.metric_unit,
          icon: "🧘",
          summary_data: [
            {
              label: "Current streak",
              value: `${data.current_streak || 3} days`,
            },
            {
              label: "Success rate",
              value: `43 days`,
            },
            {
              label: "Best streak day",
              value: `${data.longest_streak || 10} days`,
            },
            {
              label: "Completed habits",
              value: `134 days`,
            },
          ],
          weekly_row: [
            { day: "Mon", done: true },
            { day: "Tue", done: true },
            { day: "Wed", done: true },
            { day: "Thu", done: true },
            { day: "Fri", done: false },
            { day: "Sat", done: false },
            { day: "Sun", done: false },
          ],
        };
        setHabit(formattedData);
      }
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

  useEffect(() => {
    console.log(habit, "habit details");
  }, [habit]);

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

  const handleStatsPress = () => {
    router.push("/(auth)/Stats/details");
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <SafeAreaView>
          <ScrollView>
            <View style={{ flex: 1 }}>
              {/* TODO: REMOVE THIS CHUNK */}
              <Text
                style={{
                  color: newTheme.textPrimary,
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: 500,
                  marginVertical: 10,
                }}
              >
                {habit?.name}
              </Text>
              <Pressable onPress={handleStatsPress}>
                <View>
                  <Text style={{ color: "red" }}>Click here stattsss</Text>
                </View>
              </Pressable>

              <HabitDetailsPanel
                name={habit?.name || "Water Intake"}
                frequency={habit?.frequency || "Everyday"}
                type={habit?.type || "Build"}
                metric_count={habit?.metric_count || 3}
                metric_unit={habit?.metric_unit || "liters"}
              />

              {/* Habit Summary Panel */}
              {habit && habit.summary_data.length > 0 && (
                <>
                  <HeaderPanel
                    title="Summary"
                    accentColor={newTheme.surface} // your app’s accent
                    onSelect={(value) => console.log("Selected:", value)}
                  />
                  <SummaryPanel data={habit.summary_data} />
                </>
              )}

              {/* Habit Weekly Row Panel */}
              {habit && habit.weekly_row && (
                <View style={{ padding: 5 }}>
                  <HeaderPanel
                    title="Weekly Overview"
                    type="weekly"
                    accentColor={newTheme.surface} // your app’s accent
                    onSelect={(value) => console.log("Selected:", value)}
                  />
                  <WeeklyHabitRowPanel
                    key={habit.name}
                    habitName={habit.name}
                    frequency={habit.frequency}
                    icon={habit.icon}
                    data={habit.weekly_row}
                  />
                </View>
              )}

              {habit && habit.weekly_row && (
                <>
                  <HeaderPanel
                    title="Monthly Overview"
                    type="monthly"
                    accentColor={newTheme.surface} // your app’s accent
                    onSelect={(value) => console.log("Selected:", value)}
                  />
                  <MonthlyOverviewPanel
                    completedDays={[21, 22, 23, 24, 20, 25]}
                  />
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ScreenView>
  );
};

export default HabitDetails;

const styling = (newTheme: any) =>
  StyleSheet.create({
    gestureContainer: {
      // flex: 1,
      // backgroundColor: themeColors[theme].background,
    },
    container: {
      // paddingVertical: 5,
    },
    header: {
      color: newTheme.textPrimary,
    },
  });
