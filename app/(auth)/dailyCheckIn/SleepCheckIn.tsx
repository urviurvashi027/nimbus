import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  // Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";

import { ScreenView, ThemeKey } from "@/components/Themed";
import NotificationSettingRow from "@/components/DailyCheckIn/common/NotificationSettingRow";
import SleepPerformanceCard from "@/components/DailyCheckIn/sleep/SleepPerformance";
import SleepTimeCard from "@/components/DailyCheckIn/sleep/SleepTimeCard";
import SleepWeekChart from "@/components/DailyCheckIn/sleep/SleepWeeklyReview";

// TODO GET: Sleep Log Details API call
// import { sleepData } from "@/constant/data/dailyCheckin";
import { DailyCheckInDetailResponse } from "@/types/dailyCheckin";
import { getHabitDetailsByDate } from "@/services/dailyCheckinService";
import { toMinutes } from "@/utils/dailyCheckin";
import { SkeletonCard } from "@/components/DailyCheckIn/sleep/SkeletonCard";
import { ErrorCard } from "@/components/DailyCheckIn/sleep/ErrorCard";

const remindOptions = [
  { key: "3hr", label: "Three Hour before bedtime" },
  { key: "1hr", label: "One Hour before bedtime" },
  { key: "custom", label: "Custom" },
];

const SleepCheckIn = () => {
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
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // fetch details
  const fetchDetails = async () => {
    if (!templateId || !date) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await getHabitDetailsByDate(templateId, date);
      setDetail(res);
    } catch (e: any) {
      const msg =
        typeof e === "string" ? e : e?.message || "Failed to load sleep data";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, date]);

  // TODO POST: Sleep Log API call
  const onNotificationSelection = (item: any) => {
    console.log("Selected item:", item);
    setValueKey(item.key);
  };

  // derive UI data from API
  const {
    titleName,
    goalMinutes,
    asleepMinutes,
    bedtimeHHmm,
    wakeHHmm,
    weeklyHours,
  } = useMemo(() => {
    const d = detail?.data as any | undefined;

    const title = d?.name || "Sleep";

    // goal / completed in minutes
    const goalMin = toMinutes(
      d?.target_unit ?? d?.metric_count ?? 8,
      d?.metric_unit ?? "hours"
    );
    const completedMin = toMinutes(
      d?.completed_unit ?? 0,
      d?.metric_unit ?? "hours"
    );

    // bedtime / wake (fallbacks)
    const bed = d?.start_time ? d.start_time.slice(11, 16) : "23:00";
    const wake = d?.end_time ? d.end_time.slice(11, 16) : "07:00";

    // weekly chart: convert percent → hours using target
    const targetHours =
      (d?.metric_unit && ("" + d.metric_unit).toLowerCase().includes("hour")) ||
      d?.metric_unit === "19"
        ? d?.target_unit ?? d?.metric_count ?? 8
        : (d?.target_unit ?? d?.metric_count ?? 480) / 60;

    const weekly =
      Array.isArray(d?.last_7_days_completion) && targetHours
        ? d.last_7_days_completion.map((it: any) => ({
            day: it.day,
            hours:
              Math.round(((Number(it.percent) || 0) / 100) * targetHours * 10) /
              10,
          }))
        : [];

    return {
      titleName: title,
      goalMinutes: goalMin,
      asleepMinutes: completedMin,
      bedtimeHHmm: bed,
      wakeHHmm: wake,
      weeklyHours: weekly,
    };
  }, [detail]);

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
            <Text style={styles.title}>Sleep CheckIns</Text>
            <Text style={styles.subtitle}>
              Immense Yourself in true nature.
            </Text>
          </View>
          {/* Loading */}
          {loading && (
            <>
              <SkeletonCard height={180} />
              <SkeletonCard height={90} />
              <SkeletonCard height={140} />
              <SkeletonCard height={220} />
            </>
          )}
          {/* Error */}
          {!loading && err && (
            <ErrorCard
              message={err}
              onRetry={fetchDetails}
              accent={newTheme.accent}
              surface={newTheme.surface}
              text={newTheme.textPrimary}
            />
          )}

          {/* Content */}
          {!loading && !err && (
            <>
              {/* Performance */}
              <View style={styles.section}>
                <SleepPerformanceCard
                  asleepMinutes={asleepMinutes}
                  goalMinutes={goalMinutes}
                />
              </View>

              {/* Reminder */}
              <View style={{ height: 20 }} />
              <View style={{ paddingHorizontal: 0 }}>
                <NotificationSettingRow
                  label="Notification"
                  subtitle="Remind me before bedtime"
                  helpText=""
                  enabled={enabled}
                  onToggle={setEnabled}
                  options={remindOptions}
                  valueKey={valueKey}
                  onOptionSelect={onNotificationSelection}
                />
              </View>

              {/* Bed/Wake + Alarm */}
              <View style={{ height: 12 }} />
              <View>
                <SleepTimeCard
                  defaultBedtime={bedtimeHHmm}
                  defaultWake={wakeHHmm}
                  defaultAlarm="07:00"
                  onSaveBedWake={(bed: string, wake: string) => {
                    // TODO: POST save bed/wake for this habitId + date
                    console.log({ bed, wake });
                  }}
                  onSaveAlarm={(alarm: string) => {
                    // TODO: POST alarm preference
                    console.log({ alarm });
                  }}
                />
              </View>

              {/* Weekly chart */}
              <View style={{ height: 24 }} />
              <View>
                <SleepWeekChart
                  data={
                    weeklyHours.length
                      ? weeklyHours
                      : [
                          { day: "Mon", hours: 0 },
                          { day: "Tue", hours: 0 },
                          { day: "Wed", hours: 0 },
                          { day: "Thu", hours: 0 },
                          { day: "Fri", hours: 0 },
                          { day: "Sat", hours: 0 },
                          { day: "Sun", hours: 0 },
                        ]
                  }
                  idealRange={{ min: 7, max: 9 }}
                />
              </View>
            </>
          )}
          {/* "For You" Section */}
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
    section: {
      paddingHorizontal: 0,
    },
  });

export default SleepCheckIn;
