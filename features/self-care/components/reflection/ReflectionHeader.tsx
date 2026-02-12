// src/components/selfCare/reflection/ReflectionHeader.tsx

import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  onBack: () => void;
}

const ReflectionHeader: React.FC<Props> = ({ onBack }) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={newTheme.textSecondary} />
      </TouchableOpacity>

      <View style={styles.textBlock}>
        <Text style={styles.title}>Reflection</Text>
        <Text style={styles.subtitle}>
          Gently explore your thoughts, one prompt at a time.
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

export default ReflectionHeader;
