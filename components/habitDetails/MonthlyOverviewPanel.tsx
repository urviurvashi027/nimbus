import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  //   year: number;
  //   month: number; // 0 = January
  completedDays: number[]; // e.g. [21, 22, 23, 24, 25]
}

export default function MonthlyOverviewPanel({
  //   year,
  //   month,
  completedDays,
}: Props) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // day of week
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weeks: (number | null)[][] = [];
  let day = 1 - firstDay;

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
    weeks.push(week);
  }

  const monthNames = [
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

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {monthNames[currentMonth]}, {currentYear}
        </Text>
        <Ionicons name="chevron-down" size={18} color={newTheme.background} />
      </View>

      {/* Weekday labels */}
      <View style={styles.weekRow}>
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            const isCompleted = completedDays.includes(day || -1);
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
                  <Text style={styles.dayText}></Text>
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
    },
    header: {
      flexDirection: "row",
      backgroundColor: newTheme.accent,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingVertical: 6,
      justifyContent: "center",
      alignItems: "center",
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
      color: newTheme.textPrimary,
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
    dropMarker: {
      backgroundColor: newTheme.accent,
      width: 28,
      height: 34,
      borderBottomLeftRadius: 14,
      borderBottomRightRadius: 14,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      transform: [{ rotate: "45deg" }], // 👈 teardrop shape
    },
    dropText: {
      fontSize: 12,
      color: newTheme.background,
      fontWeight: "600",
      transform: [{ rotate: "-45deg" }], // rotate back the number
    },
  });
