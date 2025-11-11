import { View, Text, StyleSheet, Platform, Button } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import StatsDetails from "@/components/HabitStats/HabitStats";

const StatsScreen = () => {
  const router = useRouter();
  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);
  const { id } = useLocalSearchParams(); // Get habit ID from route params

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = styling(newTheme);
  const navigation = useNavigation();

  //   const habitEditClicked = (id: any) => {
  //     router.push({ pathname: "/habit/edit", params: { data: habit } });
  //   };

  //   const onEditClick = () => {
  //     router.push("/habit/edit");
  //   };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const startDate = "2025-08-13";
  const endDate = "2025-09-13";

  //   // Example of filled dates (in "month-day" format)
  //   const filledDates = [
  //     "8-13",
  //     "8-14",
  //     "8-20",
  //     "8-25",
  //     "8-28",
  //     "9-2",
  //     "9-5",
  //     "9-10",
  //     "9-13",
  //   ];

  //   const getHabitDetails = async (id: string) => {
  //     setLoading(true);
  //     try {
  //       const result = await getHabitDetailsById(id);
  //       if (result?.success) {
  //         setHabit(result.data);
  //       }
  //     } catch (error: any) {
  //       console.log(error, "API Error Response");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (id) {
  //       const habitId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
  //       getHabitDetails(habitId);
  //     }
  //   }, [id]);

  //   const getStreakData = () => {
  //     return {
  //       score: "65",
  //       total: 68,
  //       bestStreak: habit?.longest_streak || 13,
  //       streak: habit?.current_streak || 2,
  //     };
  //   };

  //   const getHabitDetailsData = () => {
  //     return {
  //       habit_type: "Build",
  //       metric_unit: "liters",
  //       metric_count: 3.0,
  //       start_time: "06:50:00",
  //       end_time: "07:50:00",
  //       all_day: true,
  //       reminder_time: "08:50:00",
  //       frequency: "Every day",
  //     };
  //   };

  //   const handleStatsPress = () => {
  //     // router.push("/()")
  //   };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <SafeAreaView>
          <ScrollView>
            <StatsDetails />
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ScreenView>
  );
};

export default StatsScreen;
const styling = (newTheme: any) =>
  StyleSheet.create({
    gestureContainer: {
      // flex: 1,
      backgroundColor: newTheme.background,
    },
    container: {
      // paddingVertical: 5,
    },
    header: {
      color: newTheme.textPrimary,
    },
  });
