import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import NotificationSettingRow from "@/components/DailyCheckIn/common/NotificationSettingRow";
import MeditationWeeklySummary from "@/components/DailyCheckIn/meditation/WeeklySummary";
import MeditationGaugeCard from "@/components/DailyCheckIn/meditation/MeditationGaugeCard";
import { meditationData } from "@/constant/data/dailyCheckin";
import { DailyCheckInDetailResponse } from "@/types/dailyCheckin";
import { getHabitDetailsByDate } from "@/services/dailyCheckinService";
import { toMinutes } from "@/utils/dailyCheckin";
import { Skeleton } from "@/components/DailyCheckIn/meditation/SkeletonCard";
import { ErrorCard } from "@/components/DailyCheckIn/meditation/ErrorCard";

const remindOptions = [
  { key: "3hr", label: "Three Hour before bedtime" },
  { key: "1hr", label: "One Hour before bedtime" },
  { key: "custom", label: "Custom" },
];

const MeditationCheckIn = () => {
  const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>();
  const templateId = useMemo(() => Number(id), [id]);

  const [enabled, setEnabled] = useState(true);
  const [valueKey, setValueKey] = useState<string | null>("1hr");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [detail, setDetail] = useState<DailyCheckInDetailResponse | null>(null);

  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchDetails = async () => {
    if (!templateId || !date) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await getHabitDetailsByDate(templateId, date);
      setDetail(res);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load meditation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, date]);

  // ----- derive UI state from API
  const { titleName, goalMin, completedMin, progressPct, weeklySeries } =
    useMemo(() => {
      const d = detail?.data as any | undefined;

      const title = d?.name || "Meditation";
      // goal/completed in minutes
      const goal = toMinutes(
        d?.target_unit ?? d?.metric_count ?? 30,
        d?.metric_unit ?? "min"
      );
      const done = toMinutes(d?.completed_unit ?? 0, d?.metric_unit ?? "min");

      const pct =
        goal > 0 ? Math.max(0, Math.min(100, (done / goal) * 100)) : 0;

      // weekly: backend provides percents; convert to minutes using goal minutes per day
      const perDayGoalMin =
        (d?.metric_unit &&
          ("" + d.metric_unit).toLowerCase().includes("hour")) ||
        d?.metric_unit === "19"
          ? Math.round((d?.target_unit ?? d?.metric_count ?? 0) * 60)
          : Math.round(d?.target_unit ?? d?.metric_count ?? 0);

      const weekly =
        Array.isArray(d?.last_7_days_completion) && perDayGoalMin
          ? d.last_7_days_completion.map((it: any) => ({
              day: it.day,
              // for WeeklySummary that expects percent, pass percent directly
              percent: Number(it.percent) || 0,
              // or if you want minutes: value: Math.round((it.percent / 100) * perDayGoalMin)
            }))
          : [];

      return {
        titleName: title,
        goalMin: goal,
        completedMin: done,
        progressPct: pct,
        weeklySeries: weekly,
      };
    }, [detail]);

  const onReminderSelect = (item: any) => setValueKey(item.key);

  return (
    <ScreenView style={{ paddingTop: Platform.OS === "ios" ? 40 : 20 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          bounces
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Meditation CheckIn</Text>
            <Text style={styles.subtitle}>
              Build a calm, consistent practice.
            </Text>
          </View>

          {/* Loading skeletons */}
          {loading && (
            <>
              <Skeleton h={220} />
              <Skeleton h={100} />
              <Skeleton h={220} />
            </>
          )}

          {/* Error */}
          {!loading && err && (
            <ErrorCard msg={err} onRetry={fetchDetails} colors={newTheme} />
          )}

          {/* Content */}
          {!loading && !err && (
            <>
              {/* --- Use your gauge card --- */}
              <View style={{ marginBottom: 16 }}>
                <MeditationGaugeCard
                  title="Meditation Minutes"
                  subtitle={`Great job! You've meditated for ${completedMin} minutes today.`}
                  progress={Math.round(progressPct)}
                />
              </View>

              {/* Or fallback UI if you prefer simple progress bar card */}
              {/*
              <View style={{ marginBottom: 16 }}>
                <ReadingOverviewCard
                  title="Meditation"
                  percent={progressPct}
                  subtitle={`Today's progress (${completedMin}/${goalMin} min)`}
                  onLogPress={() => console.log("log meditation")}
                />
              </View>
              */}

              {/* Reminders */}
              <View style={{ marginBottom: 12 }}>
                <NotificationSettingRow
                  label="Notification"
                  subtitle="Remind me to meditate"
                  enabled={enabled}
                  onToggle={setEnabled}
                  options={remindOptions}
                  valueKey={valueKey}
                  onOptionSelect={onReminderSelect}
                />
              </View>

              {/* Weekly summary (percent per day) */}
              <View>
                <MeditationWeeklySummary
                  title="Meditation Summary"
                  data={weeklySeries}
                  changePct={-2}
                  periodLabel="This Week"
                  onPressPeriod={() => console.log("open period menu")}
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenView>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    itemTitle: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: "bold",
    },
    header: {
      paddingTop: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      color: theme.textPrimary,
      fontWeight: "bold",
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 4,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 10,
      color: theme.textSecondary,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      color: theme.textSecondary,
      fontWeight: "bold",
      // marginLeft: 10,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 0,
    },
  });

export default MeditationCheckIn;
