// app/(auth)/index/TabOneScreen.tsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {
  format,
  isAfter,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
} from "date-fns";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getHabitList, markHabitDone } from "@/services/habitService";
import { HabitItem } from "@/types/habitTypes";

import DateScroller from "@/components/homeScreen/DateScroller";
import DailyCheckInPanel from "@/components/homeScreen/DailyCheckInPanel";
import HabitItemCard from "@/components/homeScreen/component/HabitItem";
import TopBadge from "@/components/homeScreen/TopBadge";
import NewUserScreen from "../FirstTimeUser/NewUserScreen";
import ProgressPill from "@/components/homeScreen/component/ProgressPill";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

// ---------- Nimbus visual helpers ----------
const HABIT_ICONS = ["🍰", "🌱", "🏃‍♂️", "🧘", "📚", "💧"];
const HABIT_COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#6A4C93"];

// ---------- Screen ----------
export default function TabOneScreen() {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [habitList, setHabitList] = useState<HabitItem[]>([]);
  const [completedHabit, setCompletedHabit] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  const { userProfile } = useAuth();

  const toast = useNimbusToast();

  const isoDate = useMemo(() => {
    return format(selectedDate, "yyyy-MM-dd");
  }, [selectedDate]);

  // Friendly label for the selected date
  const dateLabel = useMemo(() => {
    if (isToday(selectedDate)) return "Today";
    if (isTomorrow(selectedDate)) return "Tomorrow";
    if (isYesterday(selectedDate)) return "Yesterday";
    return format(selectedDate, "EEE, MMM dd");
  }, [selectedDate]);

  // Section header – one clear “Today” / “Tomorrow” etc.
  const sectionTitle = useMemo(() => dateLabel, [dateLabel]);
  const sectionSubtitle = useMemo(
    () => format(selectedDate, "EEE, MMM dd"),
    [selectedDate]
  );

  // decorate habits with Nimbus icon + color
  const decorateHabits = useCallback((data: any[]): HabitItem[] => {
    return data.map((item: any, idx: number) => ({
      ...item,
      done: item.completed,
      color: item.color ? item.color : HABIT_COLORS[idx % HABIT_COLORS.length],
      icon: item.icon ? item.icon : HABIT_ICONS[idx % HABIT_ICONS.length],
    }));
  }, []);

  // single loader used everywhere
  const loadHabits = useCallback(
    async (dateString: string) => {
      try {
        setLoading(true);
        const res = await getHabitList(dateString);

        if (res?.success && Array.isArray(res.data)) {
          const formatted = decorateHabits(res.data);
          // console.log("Formatted habits:", formatted);
          setHabitList(formatted);
          setCompletedHabit(res.data.filter((h: any) => h.completed).length);
        } else {
          setHabitList([]);
          setCompletedHabit(0);
        }
      } catch {
        setHabitList([]);
        setCompletedHabit(0);
      } finally {
        setLoading(false);
      }
    },
    [decorateHabits]
  );

  useFocusEffect(
    useCallback(() => {
      // runs every time this screen is focused again
      loadHabits(isoDate);
    }, [loadHabits, isoDate])
  );

  // keep userInfo in sync
  useEffect(() => {
    setUserInfo(userProfile || null);
  }, [userProfile]);

  // // fetch when date changes
  // useEffect(() => {
  //   loadHabits(isoDate);
  // }, [isoDate, loadHabits]);

  const onCreateClick = () => router.push("/(auth)/habit/CreateHabitScreen");

  const handleHabitDoneClick = async (id: string, count: any) => {
    const currentIsoDate = format(startOfDay(selectedDate), "yyyy-MM-dd");
    const day = startOfDay(selectedDate);
    const today = startOfDay(new Date());

    if (isAfter(day, today)) {
      toast.show({
        variant: "warning",
        title: "Not yet",
        message: "You can mark a habit once that day arrives.",
      });
      return;
    }

    try {
      const payload = { date: currentIsoDate };
      const result = await markHabitDone(payload, id);

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Habit",
          message: "Habit marked as done",
        });
        loadHabits(currentIsoDate);
      }
    } catch {
      toast.show({
        variant: "error",
        title: "Something went wrong",
        message: "Not able to update the habit",
      });
    }
  };

  // ---------- Loading state ----------
  if (loading && !userInfo) {
    return (
      <ScreenView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={newTheme.accent} />
        <Text style={styles.loadingText}>Preparing your routine…</Text>
      </ScreenView>
    );
  }

  const isFirstTimeUser = !!userInfo?.firstTimeUser;

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.4
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <FlatList
          data={isFirstTimeUser ? [] : habitList}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* Greeting + coach badge */}
              {userInfo && (
                <View style={styles.greetingRow}>
                  <View>
                    <Text style={styles.greetingTitle}>
                      {`Good ${getTimeOfDayGreeting()}, ${userInfo.username}.`}
                    </Text>
                    {/* No “today” duplication – simple Nimbus line */}
                    <Text style={styles.greetingSubtitle}>
                      Here’s your routine.
                    </Text>
                  </View>

                  <TopBadge
                    iconName="star"
                    variant="pill"
                    onPress={() =>
                      router.push("/(auth)/CoachScreen/CoachScreen")
                    }
                  />
                </View>
              )}

              {/* Date scroller */}
              <DateScroller
                value={selectedDate}
                onChange={(d) => setSelectedDate(startOfDay(d))}
                isLoading={loading}
                // centerSelected
              />

              <>
                {/* Daily check-in */}
                <View style={styles.checkInContainer}>
                  <DailyCheckInPanel date={isoDate} />
                </View>

                {/* Habits section header */}
                {habitList.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                    </View>
                    <ProgressPill
                      label={`${completedHabit}/${habitList.length}`}
                    />
                  </View>
                )}
              </>
            </>
          }
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
              onToggle={handleHabitDoneClick}
              // onHabitDelete={loadHabits(selectedDate)}
              selectedDate={isoDate}
            />
          )}
          ListEmptyComponent={
            !isFirstTimeUser ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyTitle}>No habits yet</Text>
                <Text style={styles.emptyText}>
                  Create a habit to start building your routine for this day.
                </Text>
              </View>
            ) : null
          }
        />
      </GestureHandlerRootView>

      {/* Floating add button */}
      <TouchableOpacity style={styles.floatingButton} onPress={onCreateClick}>
        <Ionicons name="add" size={26} color={styles.fabIcon.color} />
      </TouchableOpacity>
    </ScreenView>
  );
}

// simple time-of-day helper for greeting
function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    gestureContainer: {
      backgroundColor: theme.background,
      flex: 1,
    },
    listContent: {
      paddingBottom: spacing.xl * 2, // horizontal padding is on ScreenView
    },

    // Loading
    loadingScreen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 12,
      color: theme.textSecondary,
      ...typography.bodySmall,
    },

    // Greeting
    greetingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xl,
      marginTop: spacing.md,
    },
    greetingTitle: {
      ...typography.title,
      color: theme.textPrimary,
    },
    greetingSubtitle: {
      ...typography.bodySmall,
      color: theme.textSecondary,
      marginTop: 4,
    },

    // Daily check-in
    checkInContainer: {
      marginTop: spacing.lg,
      marginBottom: spacing.xs,
    },

    // Section header
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
      marginTop: spacing.xs,
    },
    sectionTitle: {
      ...typography.subtitle,
      color: theme.textPrimary,
    },
    sectionSubtitle: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    pill: {
      backgroundColor: theme.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 999,
    },
    pillText: {
      ...typography.caption,
      color: theme.textSecondary,
    },

    taskListContainer: {
      marginTop: spacing.lg,
    },

    // Empty state
    emptyStateContainer: {
      marginTop: spacing.xl,
      alignItems: "center",
    },
    emptyTitle: {
      ...typography.subtitle,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    emptyText: {
      textAlign: "center",
      color: theme.textSecondary,
      ...typography.bodySmall,
      paddingHorizontal: spacing.lg,
    },

    // FAB – slightly smaller & softer
    floatingButton: {
      position: "absolute",
      right: spacing.lg,
      bottom: spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 8,
    },
    fabIcon: {
      color: theme.surface,
    },
  });
