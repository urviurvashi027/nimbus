import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  onBack: () => void;
}

const WorkoutHeader: React.FC<Props> = ({ onBack }) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={newTheme.textSecondary} />
      </TouchableOpacity>

      {/* Title + Subtitle */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>
          Build strength, improve flexibility, and feel your best.
        </Text>
      </View>
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    backButton: {
      marginBottom: spacing.md,
    },
    textBlock: {},
    title: {
      ...typography.h2,
      color: newTheme.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: newTheme.textSecondary,
      marginTop: spacing.xs,
    },
  });

export default WorkoutHeader;
