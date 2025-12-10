import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  completedDays?: number[]; // e.g. [21, 22, 23, 24, 25]
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Monday-first labels to match your Weekly Overview
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthlyOverviewPanel({ completedDays = [] }: Props) {
  const now = new Date();
  const [currentMonth] = useState(now.getMonth());
  const [currentYear] = useState(now.getFullYear());

  const { newTheme } = useContext(ThemeContext);
  const styles = useMemo(() => styling(newTheme), [newTheme]);

  // Build matrix of weeks for current month, Monday-first
  const weeks = useMemo(() => {
    // JS: 0 = Sun ... 6 = Sat
    const jsFirstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Convert to Monday-first offset: 0 = Mon ... 6 = Sun
    const firstDayIndex = (jsFirstDay + 6) % 7;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const matrix: (number | null)[][] = [];

    let day = 1 - firstDayIndex;

    while (day <= daysInMonth) {
      const week: (number | null)[] = [];
      for (let i = 0; i < 7; i++) {
        if (day < 1 || day > daysInMonth) {
          week.push(null);
        } else {
          week.push(day);
        }
        day++;
      }
      matrix.push(week);
    }

    return matrix;
  }, [currentMonth, currentYear]);

  const safeCompleted = completedDays ?? [];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {MONTH_NAMES[currentMonth]}, {currentYear}
        </Text>
        <Ionicons name="chevron-down" size={18} color={newTheme.background} />
      </View>

      {/* Weekday labels */}
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            const isCompleted =
              day != null && safeCompleted.includes(day as number);

            return (
              <View key={di} style={styles.dayCell}>
                {day ? (
                  <View style={styles.dayWrapper}>
                    {isCompleted ? (
                      <View style={styles.dropMarker}>
                        <Text style={styles.dropText}>{day}</Text>
                      </View>
                    ) : (
                      <Text style={styles.dayText}>{day}</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.dayText} />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: newTheme.accent,
      borderRadius: 12,
      paddingBottom: 12,
      marginTop: 16,
      backgroundColor: newTheme.surface,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      backgroundColor: newTheme.accent,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingVertical: 6,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
    },
    headerText: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.background,
      marginRight: 4,
    },
    weekRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 4,
    },
    weekDay: {
      fontSize: 12,
      fontWeight: "600",
      color: newTheme.textSecondary,
      width: 28,
      textAlign: "center",
    },
    dayCell: {
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    dayWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },
    dayText: {
      fontSize: 14,
      color: newTheme.textPrimary,
    },
    // Teardrop / pill marker for completed days
    dropMarker: {
      backgroundColor: newTheme.accent,
      width: 28,
      height: 34,
      borderRadius: 17,
      justifyContent: "center",
      alignItems: "center",
      transform: [{ rotate: "45deg" }],
    },
    dropText: {
      fontSize: 12,
      color: newTheme.background,
      fontWeight: "600",
      transform: [{ rotate: "-45deg" }],
    },
  });
