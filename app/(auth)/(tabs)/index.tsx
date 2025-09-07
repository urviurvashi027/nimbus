import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { View, Text, ScreenView } from "@/components/Themed";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ThemeContext from "@/context/ThemeContext";
import HabitList from "@/components/HabitList/HabitList";
import { getHabitList, markHabitDone } from "@/services/habitService";
import { HabitItem } from "@/types/habitTypes";
import { ThemeKey } from "@/components/Themed";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import NewUserScreen from "../FirstTimeUser/NewUserScreen";
import DateScroller from "@/components/homeScreen/DateScroller";
// import HabitListPanel from "@/components/homeScreen/HabitListPanel";
import DailyCheckInPanel from "@/components/homeScreen/DailyCheckInPanel";
import HabitItemCard from "@/components/homeScreen/component/HabitItem";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
// import DailyCheckInCard from "@/components/homeScreen/DailyCheckInCard";

export default function TabOneScreen() {
  const [habitList, setHabitList] = useState<HabitItem[]>([]);
  const [date, setDate] = useState<string>("");
  const [dateLabel, setDateLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [completedHabit, setCompletedHabit] = useState<number>();

  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  // create button click
  const onCreateClick = () => {
    router.push("/habit/create");
  };

  // function to be called whenever date changes
  const onDateChange = async (val: any) => {
    const formatted = format(new Date(val), "yyyy-MM-dd");
    const label = getDateLabel(val);
    setDate(formatted);
    setDateLabel(label);

    await getHabitListData(formatted);
  };

  const getHabitListData = async (date?: string) => {
    const habitIcons = ["🍰", "🌱", "🏃‍♂️", "🧘", "📚", "💧"];
    const habitColors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#6A4C93"];
    try {
      setLoading(true);
      const result = await getHabitList(date);
      if (result?.success) {
        setCompletedHabit(result.data.filter((h: any) => h.completed).length);
        const formattedData = result.data.map((item: any, index: number) => {
          const color = habitColors[index % habitColors.length]; // cycle through colors
          const icon = habitIcons[index % habitIcons.length];
          return {
            ...item,
            done: item.completed,
            color: color,
            icon: icon,
          };
        });
        setHabitList(formattedData || []);
      } else {
        setHabitList([]);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
      setHabitList([]);
    } finally {
      setLoading(false);
    }
  };

  const { userProfile, getUserDetails } = useAuth();

  useEffect(() => {
    const init = async () => {
      if (!userProfile) {
        console.log("coming here index");
        // const fetched = await getUserDetails?.();
        // setUserInfo();
      } else {
        setUserInfo(userProfile);
      }
    };
    init();
  }, [userProfile]);

  const refreshData = () => {
    getHabitListData(date);
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMM dd"); // Fallback format
  };

  const handleHabitDoneClick = async (id: any, count: any) => {
    const request = {
      completed: true,
      actual_count: {
        count: count.metric_count,
        unit: count.metric_unit,
      },
    };
    try {
      const result = await markHabitDone(request, id);
      if (result?.success) {
        // refreshData();
        Toast.show({
          type: "success",
          text1: "Habit marked done successfuly",
          position: "bottom",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        position: "bottom",
      });
    } finally {
      refreshData();
    }
  };

  // ✅ Improved professional loading state
  if (loading && !userInfo) {
    return (
      <ScreenView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={newTheme.accent} />
        <Text
          style={{
            textAlign: "center",
            marginTop: 12,
            color: newTheme.textSecondary,
          }}
        >
          Loading your dashboard...
        </Text>
      </ScreenView>
    );
  }

  return (
    <ScreenView style={{ paddingTop: Platform.OS === "ios" ? 80 : 20 }}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {/* 🚀 One FlatList for everything */}
        <FlatList
          data={userInfo?.firstTimeUser ? [] : habitList} // if first-time user → no habit data
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HabitItemCard
              // {...item}
              id={item.id.toString()}
              name={item.name}
              icon={item.icon}
              color={item.color}
              frequency={item.frequency}
              time={item.time}
              actual_count={{
                count: item.metric_count,
                unit: item.metric_unit,
              }}
              description={item.description}
              done={item.completed}
              onToggle={(id: string, actual_count: any) => {
                console.log(id, "onToggle");
                handleHabitDoneClick(id, actual_count);
                // setHabitList((prev) =>
                //   prev.map((h) => (h.id === id ? { ...h, done: newStatus } : h))
                // );
              }}
            />
          )}
          ListHeaderComponent={
            <>
              {/* ✅ User info */}
              {userInfo && (
                <View
                  style={{
                    paddingVertical: 20,
                    backgroundColor: newTheme.background,
                  }}
                >
                  <Text style={styles.dateLabel}>
                    {userInfo.first_name} {userInfo.last_name}
                  </Text>
                </View>
              )}

              {/* ✅ Date scroller */}
              <DateScroller onDateChange={onDateChange} />

              {/* ✅ First time user journey */}
              {userInfo?.firstTimeUser ? (
                <View style={styles.taskListContainer}>
                  <NewUserScreen />
                </View>
              ) : (
                <>
                  {/* ✅ Daily check-in */}
                  <View style={{ marginTop: 20 }}>
                    <DailyCheckInPanel />
                  </View>

                  {/* ✅ Habits header (only if we have habits) */}
                  {habitList.length > 0 && (
                    <View style={styles.header}>
                      <Text style={styles.title}>{dateLabel}</Text>
                      <View style={styles.pill}>
                        <Text style={styles.pillText}>
                          {completedHabit}/{habitList.length}
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </>
          }
          ListEmptyComponent={
            !userInfo?.firstTimeUser ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: newTheme.textSecondary,
                }}
              >
                No habits found for {dateLabel}. Start creating one!
              </Text>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </GestureHandlerRootView>

      {/* Floating add button */}
      <TouchableOpacity style={styles.floatingButton} onPress={onCreateClick}>
        <Ionicons name="add" size={24} color={styles.iconColor.color} />
      </TouchableOpacity>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    gestureContainer: {
      // backgroundColor: themeColors[theme].background,
      backgroundColor: newTheme.background,
      flex: 1, // Ensures full screen coverage
    },
    datePanel: {},
    taskListContainer: {
      backgroundColor: newTheme.background,
      // backgroundColor: themeColors[theme].background,
      flex: 12, // Takes up the remaining space
      marginTop: 40, // 10px space between FlatList and TaskList
    },
    iconColor: {
      color: newTheme.textPrimary,
    },
    floatingButton: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: newTheme.surface,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: newTheme.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    itemSeparator: {
      flex: 1,
      height: 1,
      paddingBottom: 12,
      backgroundColor: newTheme.background,
    },
    dateLabel: {
      backgroundColor: newTheme.background,
      fontSize: 22,
      fontWeight: "600",
      color: newTheme.textPrimary,
      // textAlign: "center",
      // marginBottom: 5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      backgroundColor: newTheme.background,
    },
    title: { fontSize: 20, fontWeight: "600", color: newTheme.textPrimary },
    pill: {
      backgroundColor: newTheme.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6, // square-pill feel
    },
    pillText: { color: newTheme.textSecondary, fontWeight: "500" },
  });
