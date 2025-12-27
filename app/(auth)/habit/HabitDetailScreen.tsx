import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenView } from "@/components/Themed";
import { getHabitDetailsById } from "@/services/habitService";
import ThemeContext from "@/context/ThemeContext";
import WeeklyHabitRowPanel from "@/components/habitDetails/WeeklyRowPanel";
import SummaryPanel from "@/components/habitDetails/SummaryPanel";
import HabitDetailsPanel from "@/components/habitDetails/HabitDetailsPanel";
import HeaderPanel from "@/components/habitDetails/HeaderPanel";
import MonthlyOverviewPanel from "@/components/habitDetails/MonthlyOverviewPanel";
import AppHeader from "@/components/common/AppHeader";
import { format, startOfDay } from "date-fns";
import { formatReminderTime } from "@/utils/dates";
import HabitDetailsSkeleton from "@/components/habitDetails/HabitDetailsSkeleton";

const HabitDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);

  const { id, date } = useLocalSearchParams<{
    id: string | string[];
    date?: string | string[];
  }>();
  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = styling(newTheme, spacing);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getHabitDetails = async (habitId: string, selectedDate: string) => {
    setLoading(true);
    try {
      const result = await getHabitDetailsById(habitId, selectedDate);
      if (result?.success) {
        const data = result.data;
        const formattedData = {
          ...data,
          name: data.name,
          success_rate: 45,
          completed_habits: 134,
          type: data.habit_type,
          metric_unit: "ltrs",
          icon: "🧘",
          summary_data: [
            {
              label: "Current streak",
              value: `${data.current_streak || 3}`,
            },
            {
              label: "Success rate",
              value: `${data.success_rate || 45}%`,
            },
            {
              label: "Best streak day",
              value: `${data.longest_streak || 10}`,
            },
            {
              label: "Completed habits",
              value: `${data.total_completed_habits || 134}`,
            },
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
      const habitId = Array.isArray(id) ? id[0] : id;
      const selectedDate = Array.isArray(date) ? date?.[0] : date; // "2025-12-10"
      const safeDate =
        selectedDate ?? format(startOfDay(new Date()), "yyyy-MM-dd");
      getHabitDetails(habitId, safeDate);
    }
  }, [id, date]);

  if (loading) {
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
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <HabitDetailsSkeleton spacing={spacing} />
            </ScrollView>
          </SafeAreaView>
        </GestureHandlerRootView>
      </ScreenView>
    );
  }

  return (
    <ScreenView
      style={{
        // flex: 1,
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xl"] + spacing["xl"] * 0.4
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Nimbus shared header */}
            <AppHeader
              title={habit?.name || "Habit details"}
              subtitle={
                habit
                  ? `${habit.frequency || "Every day"} • ${
                      habit.metric_count ?? ""
                    } ${habit.metric_unit ?? ""}`.trim()
                  : "Review your streaks and progress."
              }
              onBack={() => router.back()}
            />

            {/* Top details card */}
            <HabitDetailsPanel
              reminderTime={formatReminderTime(habit?.reminder_time)}
              frequency={habit?.frequency || "Everyday"}
              type={habit?.type || "Build"}
              metric_count={habit?.metric_count || 3}
              metric_unit={habit?.metric_unit || "liters"}
            />

            {/* Summary */}
            {habit && habit.summary_data.length > 0 && (
              <>
                <HeaderPanel
                  title="Summary"
                  accentColor={newTheme.surface}
                  onSelect={(value) => console.log("Selected:", value)}
                />
                <SummaryPanel data={habit.summary_data} />
              </>
            )}

            {/* Weekly */}
            {habit && habit.name && (
              <View style={styles.sectionWrapper}>
                <HeaderPanel
                  title="Weekly Overview"
                  accentColor={newTheme.surface}
                  onSelect={(value) => console.log("Selected:", value)}
                />
                <WeeklyHabitRowPanel
                  key={habit.name}
                  habitName={habit.name}
                  frequency={habit.frequency}
                  icon={habit.icon}
                  data={habit.last_7_days_completion}
                />
              </View>
            )}

            {/* Monthly */}
            {habit && habit.name && (
              <>
                <HeaderPanel
                  title="Monthly Overview"
                  accentColor={newTheme.surface}
                  onSelect={(value) => console.log("Selected:", value)}
                />
                <MonthlyOverviewPanel
                  completedDays={habit.completed_days_in_month || []}
                />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ScreenView>
  );
};

export default HabitDetails;

const styling = (newTheme: any, spacing: any) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing.lg, // space for bottom / home indicator
    },
    sectionWrapper: {
      paddingTop: spacing.sm,
    },
    header: {
      color: newTheme.textPrimary,
    },
  });
