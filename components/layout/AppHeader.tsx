import React, { useContext, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/contexts/ThemeContext";

type RightAction = {
  icon?: keyof typeof Ionicons.glyphMap; // e.g. "ellipsis-horizontal"
  onPress: () => void;
  accessibilityLabel?: string;
};

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: RightAction;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  titleStyle,
  subtitleStyle,
}) => {
  const { newTheme, nimbusColors, spacing, typography } = useContext(ThemeContext);

  const styles = useMemo(
    () => styling(newTheme, nimbusColors, spacing, typography),
    [newTheme, nimbusColors, spacing, typography]
  );

  return (
    <View style={styles.container}>
      {/* Top row: back + right action */}
      <View style={styles.topRow}>
        <View style={styles.leftSlot}>
          {onBack && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back"
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={nimbusColors.text.secondary || newTheme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightSlot}>
          {!!rightAction && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={rightAction.onPress}
              accessibilityRole="button"
              accessibilityLabel={
                rightAction.accessibilityLabel ?? "More options"
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={rightAction.icon ?? "ellipsis-horizontal"}
                size={22}
                color={nimbusColors.text.secondary || newTheme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title block */}
      <View style={styles.textBlock}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {!!subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styling = (theme: any, c: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    leftSlot: {
      minWidth: 44,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    rightSlot: {
      minWidth: 44,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    // Nimbus-ish premium icon touch target
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.interaction.pressed || "rgba(255,255,255,0.04)",
      borderWidth: 1,
      borderColor: c.border.subtle || "rgba(255,255,255,0.06)",
    },

    textBlock: {},
    title: {
      ...typography.h2,
      color: c.text.primary || theme.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: c.text.secondary || theme.textSecondary,
      marginTop: spacing.xs,
    },
  });

export default AppHeader;
