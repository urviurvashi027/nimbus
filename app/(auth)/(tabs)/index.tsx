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
  View,
  Text,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  format,
  isAfter,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
} from "date-fns";

import { ScreenView } from "@/components/ui/Themed";
import ThemeContext from "@/contexts/ThemeContext";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContext";
import {
  getHabitList,
  markHabitDone,
} from "@/features/habit/services/habitService";
import { HabitItem } from "@/features/habit/types/habitTypes";

import DateScroller from "@/features/home/components/DateScroller";
import HabitItemCard from "@/features/home/components/component/HabitItem";
import TopBadge from "@/features/home/components/TopBadge";
import ProgressPill from "@/features/home/components/component/ProgressPill";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import SyncProgressCard from "@/features/home/components/component/SyncProgressCard";
import DailySutraCard from "@/features/home/components/component/DailySutraCard";
import BioMetricBlueprintPanel from "@/features/home/components/BioMetricBlueprintPanel";

// ---------- Nimbus visual helpers ----------
const HABIT_ICONS = ["🍰", "🌱", "🏃‍♂️", "🧘", "📚", "💧"];
const HABIT_COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#6A4C93"];

// ---------- Screen ----------
export default function TabOneScreen() {
  const { newTheme: theme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, spacing, typography);

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
        <ActivityIndicator size="large" color={theme.accent} />
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
      <View style={styles.gestureContainer}>
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
                  </View>

                  <TopBadge
                    iconName="star"
                    variant="circle"
                    onPress={() => router.push(ROUTES.AUTH.COACH)}
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

              <SyncProgressCard
                percentage={84}
                currentPhase="Flow State"
                nextPhase="Master Healer"
              />

              <DailySutraCard />

              <>
                {/* Bio-Metric Blueprint */}
                <BioMetricBlueprintPanel date={isoDate} />

                {/* Habits section header */}
                {habitList.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text
                        style={styles.sectionTitle}
                      >{`${sectionTitle}'S PROTOCOLS`}</Text>
                      {/* {sectionSubtitle && (
                        <Text style={styles.sectionSubtitle}>{sectionSubtitle}</Text>
                      )} */}
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
              currentStreak={item.current_streak}
              lastCompleted={item.last_completed}
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
      </View>
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
      paddingBottom: 130, // Increased to accommodate floating tab bar
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
      ...typography.caption,
    },

    // Greeting
    greetingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
      marginTop: spacing.md,
    },
    greetingTitle: {
      ...typography.h2,
      color: theme.textPrimary,
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
      ...typography.smallCaption,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.6,
      color: theme.accent,
      textTransform: "uppercase",
      opacity: 0.9,
    },
    sectionSubtitle: {
      ...typography.caption,
      fontSize: 10,
      fontWeight: "600",
      letterSpacing: 0.8,
      color: theme.textSecondary,
      textTransform: "uppercase",
      opacity: 0.5,
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
      ...typography.h3,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    emptyText: {
      textAlign: "center",
      color: theme.textSecondary,
      ...typography.caption,
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
