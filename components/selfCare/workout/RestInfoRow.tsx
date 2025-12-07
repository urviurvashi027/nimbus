// src/components/selfCare/workout/RestInfoRow.tsx

import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export type TimerMode = "workout" | "rest";

interface Props {
  restSeconds: number;
  mode: TimerMode;
  remainingSeconds: number;
  onPress: (e: GestureResponderEvent) => void;
}

const RestInfoRow: React.FC<Props> = ({
  restSeconds,
  mode,
  remainingSeconds,
  onPress,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const isResting = mode === "rest";
  const labelSeconds = isResting ? remainingSeconds : restSeconds;
  const label = `${labelSeconds} sec`;
  const subtitle = isResting ? "Tap to return to exercise" : "Rest Time";

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="information" size={18} color="#4C8DFF" />
      </View>
      <View>
        <Text style={styles.timeLabel}>{label}</Text>
        <Text style={styles.caption}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.lg,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#0B1220",
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.sm,
    },
    timeLabel: {
      ...typography.bodySmall,
      color: "#FFFFFF",
      fontWeight: "700",
    },
    caption: {
      ...typography.caption,
      color: newTheme.textSecondary,
    },
  });

export default RestInfoRow;
