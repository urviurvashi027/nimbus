import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";

interface MeditationHeaderProps {
  onBack: () => void;
}

const MeditationHeader: React.FC<MeditationHeaderProps> = ({ onBack }) => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      {/* Back icon */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={newTheme.textSecondary} />
      </TouchableOpacity>

      {/* Title + subtitle block */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>Meditation</Text>
        <Text style={styles.subtitle}>
          Immerse yourself in guided sessions that help you slow down, breathe,
          and reset.
        </Text>
      </View>
    </View>
  );
};

const styling = (
  theme: ThemeKey,
  newTheme: any,
  spacing: any,
  typography: any
) =>
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

export default MeditationHeader;
