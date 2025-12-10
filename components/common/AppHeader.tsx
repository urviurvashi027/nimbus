import React, { useContext, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle, onBack }) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(
    () => styling(newTheme, spacing, typography),
    [newTheme, spacing, typography]
  );

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>
      )}

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    backButton: {
      marginBottom: spacing.md,
      alignSelf: "flex-start",
    },
    textBlock: {},
    title: {
      ...typography.h2,
      color: theme.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },
  });

export default AppHeader;
