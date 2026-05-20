import React, { useContext, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ThemeContext from "@/contexts/ThemeContext";
import type { ColorSet, Spacing, Typography } from "@/theme/types";

type InsightCardProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  onPress: () => void;
};

export const InsightCard = ({
  label,
  value,
  icon,
  accent,
  onPress,
}: InsightCardProps) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);

  const styles = useMemo(
    () => styling(newTheme, spacing, typography),
    [newTheme, spacing, typography]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.012)", "rgba(255,255,255,0.022)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.iconWrap}>
        <View style={[styles.iconBubble, { backgroundColor: accent }]}>
          <Ionicons name={icon} size={16} color={newTheme.background} />
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={newTheme.accent}
        style={styles.chevron}
      />
    </Pressable>
  );
};

const styling = (theme: ColorSet, spacing: Spacing, typography: Typography) =>
  StyleSheet.create({
    card: {
      minHeight: 74,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.cardRaised ?? theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderMuted ?? theme.border,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
    },
    cardPressed: {
      opacity: 0.94,
      transform: [{ scale: 0.99 }],
    },
    iconWrap: {
      marginRight: spacing.md,
    },
    iconBubble: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderMuted ?? theme.border,
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },
    textBlock: {
      flex: 1,
      justifyContent: "center",
    },
    label: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      fontWeight: "700",
      letterSpacing: 1.3,
      opacity: 0.75,
    },
    value: {
      marginTop: 2,
      color: theme.textPrimary,
      fontSize: 18,
      lineHeight: 22,
      fontWeight: "700",
      fontFamily: typography.h3.fontFamily,
      letterSpacing: -0.2,
    },
    chevron: {
      marginLeft: spacing.sm,
      opacity: 0.95,
    },
  });
