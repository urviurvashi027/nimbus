import React, { FC, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export type DifficultyLevel = "easy" | "medium" | "hard";

interface WorkoutCardProps {
  title: string;
  imageUri: string | ImageSourcePropType;
  durationSeconds: number;
  reps: number;
  difficulty: DifficultyLevel;
  onPressStart?: () => void;
}

const DIFFICULTY_COLORS: Record<DifficultyLevel, { bg: string; text: string }> =
  {
    easy: { bg: "#6DFF8C", text: "#063A18" },
    medium: { bg: "#FFE178", text: "#3A2D09" },
    hard: { bg: "#FF7A50", text: "#3A1203" },
  };

const WorkoutCard: FC<WorkoutCardProps> = ({
  title,
  imageUri,
  durationSeconds,
  reps,
  difficulty,
  onPressStart,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);
  const diff = DIFFICULTY_COLORS[difficulty];

  const durationLabel =
    durationSeconds < 60
      ? `${durationSeconds} sec`
      : `${Math.round(durationSeconds / 60)} min`;

  return (
    <View style={styles.card}>
      {/* Thumbnail */}
      <Image
        source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
        style={styles.thumbnail}
      />

      {/* Right Block */}
      <View style={styles.rightBlock}>
        {/* Title + Difficulty */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {/* 
          <View style={[styles.diffPill, { backgroundColor: diff.bg }]}>
            <Text style={[styles.diffPillText, { color: diff.text }]}>
              {difficulty[0].toUpperCase() + difficulty.slice(1)}
            </Text>
          </View> */}
        </View>

        {/* Metrics Row */}
        {/* <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Ionicons name="time-outline" size={15} color={diff.bg} />
            <Text style={styles.metricText}>{durationLabel}</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="repeat-outline" size={15} color={diff.bg} />
            <Text style={styles.metricText}>{reps} reps</Text>
          </View>
        </View> */}

        {/* Start Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPressStart}
          style={styles.startBtn}
        >
          <Text style={styles.startText}>Start</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: theme.surfaceMuted,
      borderRadius: 22,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    thumbnail: {
      width: 110,
      height: 90,
      borderRadius: 16,
      marginRight: spacing.md,
    },
    rightBlock: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    title: {
      ...typography.body,
      fontSize: 17,
      fontWeight: "600",
      color: theme.textPrimary,
      flex: 1,
      marginRight: 10,
      lineHeight: 22,
    },
    diffPill: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 3,
      alignSelf: "flex-start",
    },
    diffPillText: {
      fontSize: 12,
      fontWeight: "600",
    },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
    },
    metricItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    metricText: {
      marginLeft: 5,
      fontSize: 14,
      color: theme.textSecondary,
    },
    startBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.surface,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 12,
      marginTop: spacing.sm,
    },
    startText: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.textPrimary,
    },
  });

export default WorkoutCard;
