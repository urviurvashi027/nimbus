import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Rect } from "react-native-svg";
import ThemeContext from "@/context/ThemeContext";

// --- Type Definitions ---

// This defines the shape of the data for a single day's progress bar
export interface DailyProgress {
  day: string; // e.g., "tue", "wed"
  progress: number; // A number between 0 and 100
}

// This defines all the props our reusable component will accept
interface WeeklySummaryProps {
  dailyProgress: DailyProgress[];
  averageProgress: number;
  onAddHabitsPress: () => void; // A function to call when "Add habits" is pressed
}

// --- Constants ---
const BAR_WIDTH = 18;
const BAR_HEIGHT = 80;
const BAR_RADIUS = 10;

// --- Main Component ---
const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  dailyProgress,
  averageProgress,
  onAddHabitsPress,
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.container}>
      <Text style={styles.addButtonText}>Your progress:</Text>

      <View style={styles.mainContent}>
        <View style={styles.progressSection}>
          <Text style={styles.subTitle}>Your progress df:</Text>
          <View style={styles.barsContainer}>
            {dailyProgress.map((item) => (
              <View key={item.day} style={styles.dayColumn}>
                <Svg height={BAR_HEIGHT} width={BAR_WIDTH}>
                  {/* Background of the bar */}
                  <Rect
                    x="0"
                    y="0"
                    width={BAR_WIDTH}
                    height={BAR_HEIGHT}
                    rx={BAR_RADIUS}
                    ry={BAR_RADIUS}
                    fill="#2A2D24"
                  />
                  {/* Fill (progress) of the bar */}
                  <Rect
                    x="0"
                    y={BAR_HEIGHT - (item.progress / 100) * BAR_HEIGHT}
                    width={BAR_WIDTH}
                    height={(item.progress / 100) * BAR_HEIGHT}
                    rx={BAR_RADIUS}
                    ry={BAR_RADIUS}
                    fill="#90B47A"
                  />
                </Svg>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 2b. "On average" Section */}
        <View style={styles.averageSection}>
          <Text style={styles.subTitle}>On average</Text>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>Per week</Text>
          </View>
          <Text style={styles.averageText}>{averageProgress}%</Text>
        </View>
      </View>
    </View>
  );
};

// --- Styles ---
const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: newTheme.surface,
      borderRadius: 16,
      padding: 20,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    addButtonText: {
      color: newTheme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 3,
    },
    mainContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    progressSection: {
      flex: 1,
    },
    subTitle: {
      color: newTheme.textSecondary,
      fontSize: 13,
      marginBottom: 4,
    },
    barsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginRight: 16, // Space between bars and average
    },
    dayColumn: {
      alignItems: "center",
      flex: 1,
    },
    dayLabel: {
      color: newTheme.textSecondary,
      fontSize: 12,
      marginTop: 6,
      textTransform: "capitalize",
    },
    averageSection: {
      alignItems: "flex-start",
    },
    toggleButton: {
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 8,
    },
    toggleText: {
      color: newTheme.textSecondary,
      fontSize: 12,
      fontWeight: "500",
    },
    averageText: {
      color: newTheme.textPrimary,
      fontSize: 40,
      fontWeight: "bold",
    },
  });

export default WeeklySummary;
