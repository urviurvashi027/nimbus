// app/(auth)/index/TabOneScreen.tsx
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { View, Text, ScreenView } from "@/components/Themed";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { format, isToday, isTomorrow, isYesterday, startOfDay } from "date-fns";

import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getHabitList, markHabitDone } from "@/services/habitService";
import { HabitItem } from "@/types/habitTypes";

import DateScroller from "@/components/homeScreen/DateScroller";
import DailyCheckInPanel from "@/components/homeScreen/DailyCheckInPanel";
import HabitItemCard from "@/components/homeScreen/component/HabitItem";
import TopBadge from "@/components/homeScreen/TopBadge";
import NewUserScreen from "../FirstTimeUser/NewUserScreen";

export default function TabOneScreen() {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  // Controlled date (single source of truth)
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const isoDate = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );
  const [userInfo, setUserInfo] = useState<any>(null);
  // API + UI state
  const [habitList, setHabitList] = useState<HabitItem[]>([]);
  const [completedHabit, setCompletedHabit] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const { userProfile } = useAuth();
  // const userInfo = userProfile || null;

  const dateLabel = useMemo(() => {
    if (isToday(selectedDate)) return "Today";
    if (isTomorrow(selectedDate)) return "Tomorrow";
    if (isYesterday(selectedDate)) return "Yesterday";
    return format(selectedDate, "EEE, MMM dd");
  }, [selectedDate]);

  // map helpers
  const habitIcons = ["🍰", "🌱", "🏃‍♂️", "🧘", "📚", "💧"];
  const habitColors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#6A4C93"];

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

  // Single fetch path tied to isoDate
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getHabitList(isoDate); // one call here
        if (!mounted) return;
        if (res?.success) {
          setCompletedHabit(res.data.filter((h: any) => h.completed).length);
          const formatted = res.data.map((item: any, idx: number) => ({
            ...item,
            done: item.completed,
            color: habitColors[idx % habitColors.length],
            icon: habitIcons[idx % habitIcons.length],
          }));
          setHabitList(formatted);
        } else {
          setHabitList([]);
          setCompletedHabit(0);
        }
      } catch (e) {
        if (mounted) {
          setHabitList([]);
          setCompletedHabit(0);
        }
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isoDate]); // <-- ONLY when date string changes

  const onCreateClick = () => router.push("/habit/create");

  const refreshData = () => {
    // force re-run by changing state to same date (or refetch inline)
    (async () => {
      setLoading(true);
      try {
        const res = await getHabitList(isoDate);
        if (res?.success) {
          setCompletedHabit(res.data.filter((h: any) => h.completed).length);
          const formatted = res.data.map((item: any, idx: number) => ({
            ...item,
            done: item.completed,
            color: habitColors[idx % habitColors.length],
            icon: habitIcons[idx % habitIcons.length],
          }));
          setHabitList(formatted);
        }
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleHabitDoneClick = async (id: any, count: any) => {
    try {
      const result = await markHabitDone(
        {
          completed: true,
          actual_count: { count: count.metric_count, unit: count.metric_unit },
        },
        id
      );
      if (result?.success) {
        Toast.show({
          type: "success",
          text1: "Habit marked done successfuly",
          position: "bottom",
        });
        refreshData();
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        position: "bottom",
      });
    }
  };

  // Initial “whole screen” loading
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
        <FlatList
          data={userInfo?.firstTimeUser ? [] : habitList} // if first-time user → no habit data
          // data={userInfo?.firstTimeUser ? [] : habitList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HabitItemCard
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
              onToggle={(id: string, actual_count: any) =>
                handleHabitDoneClick(id, actual_count)
              }
            />
          )}
          ListHeaderComponent={
            <>
              {userInfo && (
                <View
                  style={{
                    paddingVertical: 20,
                    backgroundColor: newTheme.background,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.dateLabel}>{userInfo.username}</Text>
                  <TopBadge
                    iconName="star"
                    variant="pill"
                    onPress={() =>
                      router.push("/(auth)/CoachScreen/CoachScreen")
                    }
                  />
                </View>
              )}

              <DateScroller
                value={selectedDate}
                onChange={(d) => setSelectedDate(startOfDay(d))}
                isLoading={loading}
                centerSelected
              />

              {userInfo?.firstTimeUser ? (
                <View style={styles.taskListContainer}>
                  <NewUserScreen />
                </View>
              ) : (
                <>
                  <View style={{ marginVertical: 30 }}>
                    {/* This component will do ONE more call using `date={isoDate}` */}
                    <DailyCheckInPanel date={isoDate} />
                  </View>

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

      <TouchableOpacity style={styles.floatingButton} onPress={onCreateClick}>
        <Ionicons name="add" size={24} color={styles.iconColor.color} />
      </TouchableOpacity>
    </ScreenView>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    gestureContainer: { backgroundColor: newTheme.background, flex: 1 },
    taskListContainer: {
      backgroundColor: newTheme.background,
      flex: 12,
      marginTop: 20,
    },
    iconColor: { color: newTheme.textPrimary },
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
    dateLabel: { fontSize: 22, fontWeight: "600", color: newTheme.textPrimary },
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
      borderRadius: 6,
    },
    pillText: { color: newTheme.textSecondary, fontWeight: "500" },
  });
