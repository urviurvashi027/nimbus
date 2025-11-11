import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import NotificationSettingRow from "@/components/DailyCheckIn/common/NotificationSettingRow";
import ReadingOverviewCard from "@/components/DailyCheckIn/reading/ReadingOverviewCard";
import LogReadingModal from "@/components/DailyCheckIn/reading/LogReadingSheet";
import WeeklySummary from "@/components/DailyCheckIn/reading/WeeklySummary";

import { readingData } from "@/constant/data/dailyCheckin";
import { DailyCheckInDetailResponse } from "@/types/dailyCheckin";
import { getHabitDetailsByDate } from "@/services/dailyCheckinService";
import { toMinutes } from "@/utils/dailyCheckin";
import { Skeleton } from "@/components/DailyCheckIn/reading/SkeletonCard";
import { ErrorCard } from "@/components/DailyCheckIn/reading/ErrorCard";

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

const options = [
  { key: "3hr", label: "Three Hour before bedtime" },
  { key: "1hr", label: "One Hour before bedtime" },
  { key: "custom", label: "Custom" },
];

const ReadingCheckIn = () => {
  const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>();
  const templateId = useMemo(() => Number(id), [id]);

  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const averageData = 65;

  const [enabled, setEnabled] = useState(true);
  const [valueKey, setValueKey] = useState<string | null>("1hr");
  const [showLog, setShowLog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [detail, setDetail] = useState<DailyCheckInDetailResponse | null>(null);

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
      setErr(e?.message ?? "Failed to load reading data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = () => {
    console.log("Add habits button was pressed!");
    // You could navigate to a new screen or open a modal here
  };

  // ---------- derive UI data
  const { titleName, goalMin, completedMin, progressPct, weeklySeries, avg } =
    useMemo(() => {
      const d = detail?.data as any | undefined;

      const title = d?.name || "Reading";
      const goal = toMinutes(
        d?.target_unit ?? d?.metric_count ?? 30,
        d?.metric_unit ?? "min"
      );
      const done = toMinutes(d?.completed_unit ?? 0, d?.metric_unit ?? "min");
      const pct =
        goal > 0 ? Math.max(0, Math.min(100, (done / goal) * 100)) : 0;

      // Weekly card expects { day, percent }[]
      const weekly = Array.isArray(d?.last_7_days_completion)
        ? d.last_7_days_completion.map((it: any) => ({
            day: it.day,
            percent: Number(it.percent) || 0,
          }))
        : [];

      const average = weekly.length
        ? Math.round(
            weekly.reduce((s: number, x: any) => s + (x.percent || 0), 0) /
              weekly.length
          )
        : 0;

      return {
        titleName: title,
        goalMin: goal,
        completedMin: done,
        progressPct: pct,
        weeklySeries: weekly,
        avg: average,
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

        <ScrollView
          bounces
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reading CheckIn</Text>
            <Text style={styles.subtitle}>
              Immense Yourself in true nature.
            </Text>
          </View>

          {/* Loading */}
          {loading && (
            <>
              <Skeleton h={110} />
              <Skeleton h={90} />
              <Skeleton h={210} />
            </>
          )}

          {/* Error */}
          {!loading && err && (
            <ErrorCard msg={err} onRetry={fetchDetails} colors={newTheme} />
          )}

          {/* Content */}
          {!loading && !err && (
            <>
              <View style={styles.section}>
                <ReadingOverviewCard
                  title="Reading Progress"
                  percent={progressPct}
                  subtitle={`You've read ${completedMin} of ${goalMin} minutes today`}
                  onLogPress={() => setShowLog(true)}
                />
              </View>

              <View style={{ height: 12 }} />

              <View style={{ paddingHorizontal: 0 }}>
                <NotificationSettingRow
                  label="Notification"
                  subtitle="Remind me to read"
                  helpText=""
                  enabled={enabled}
                  onToggle={setEnabled}
                  options={options}
                  valueKey={valueKey}
                  onOptionSelect={(item) => setValueKey(item.key)}
                />
              </View>

              <View style={{ height: 12 }} />

              <View>
                <WeeklySummary
                  dailyProgress={weeklySeries} // [{day, percent}]
                  averageProgress={avg}
                  onAddHabitsPress={() => console.log("Add reading habit")}
                />
              </View>

              <LogReadingModal
                visible={showLog}
                onClose={() => setShowLog(false)}
                onSaveQuick={(payload) => console.log("Quick saved", payload)}
                onSaveTimer={(payload) => console.log("Timer saved", payload)}
              />
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

export default ReadingCheckIn;
