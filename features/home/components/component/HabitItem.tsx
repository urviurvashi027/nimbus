import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/contexts/ThemeContext";
import { router } from "expo-router";

interface HabitItemProps {
  selectedDate: string;
  id: string;
  name: string;
  icon?: any; // emoji string is fine
  time?: string;
  done: boolean;
  description?: string;
  frequency: string;
  color?: string;
  actual_count: any;
  // onHabitDelete:() => {};
  onToggle: (id: string, actual_count: any) => void;
}

/**
 * Legacy HabitItemCard - kept as per user request "do not remove the old one"
 */
export const HabitItemCardLegacy: React.FC<HabitItemProps> = ({
  id,
  name,
  selectedDate,
  icon,
  time,
  done,
  frequency,
  description,
  actual_count,
  color,
  onToggle,
}) => {
  const { newTheme, spacing, typography } = React.useContext(ThemeContext);
  const styles = useMemo(
    () => legacyStyling(newTheme, spacing, typography),
    [newTheme, spacing, typography]
  );

  const handleToggle = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onToggle(id, actual_count);
  };

  const handleHabitClick = () => {
    router.push({
      pathname: "/(auth)/habit/habitDetail",
      params: { id, date: selectedDate },
    });
  };

  const subtitle = time ? `${frequency} • ${time}` : frequency;
  const iconBgStyle = color ? { backgroundColor: `${color}33` } : null;
  const accentBorderStyle = color ? { borderColor: color } : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleHabitClick}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, iconBgStyle]}>
        {icon ? (
          <Text style={styles.iconText}>{icon}</Text>
        ) : (
          <Ionicons
            name="leaf-outline"
            size={18}
            color={newTheme.textSecondary}
          />
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {!!description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.statusTouchable}
      >
        <View
          style={[
            styles.circle,
            accentBorderStyle,
            done ? styles.circleDone : styles.circleEmpty,
          ]}
        >
          {done && (
            <Ionicons name="checkmark" size={14} color={newTheme.surface} />
          )}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

/**
 * New HabitItemCard - Fine-tuned to match Nimbus standard and screenshot 1.png
 */
const HabitItemCard: React.FC<HabitItemProps> = ({
  id,
  name,
  selectedDate,
  icon,
  time,
  done,
  frequency,
  description,
  actual_count,
  color,
  onToggle,
}) => {
  const { newTheme, spacing, typography } = React.useContext(ThemeContext);
  const styles = useMemo(
    () => nimbusStyling(newTheme, spacing, typography),
    [newTheme, spacing, typography]
  );

  const handleToggle = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onToggle(id, actual_count);
  };

  const handleHabitClick = () => {
    router.push({
      pathname: "/(auth)/habit/habitDetail",
      params: { id, date: selectedDate },
    });
  };

  // Mock intensity for visual fidelity to screenshot
  const intensity = "Phase I";
  const actionLabel = done ? "COMPLETED" : "INITIALIZE";

  const accentColor = color || newTheme.accent;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleHabitClick}
      activeOpacity={0.9}
    >
      {/* Accent Strip */}
      <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

      <View style={styles.inner}>
        {/* Top Content Row */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}30`,
              },
            ]}
          >
            {icon && icon.length < 3 ? (
              <Text style={styles.iconText}>{icon}</Text>
            ) : (
              <Ionicons name={icon || "leaf"} size={22} color={accentColor} />
            )}
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>

        {/* Bottom Row: Goal Metric & Action Button */}
        <View style={styles.bottomRow}>
          <View style={styles.metricWrap}>
            <Text style={styles.metricLabel}>Goal: </Text>
            <Text style={styles.metricText}>
              {actual_count?.count || "5"} {actual_count?.unit || "MINS"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              done && { backgroundColor: accentColor },
            ]}
            onPress={handleToggle}
          >
            <Text
              style={[
                styles.actionButtonText,
                done && { color: newTheme.surface },
              ]}
            >
              {actionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const nimbusStyling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.cardRaised || "#262A22",
      borderRadius: 24,
      marginVertical: spacing.sm,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.06)",
      // Elevation for Android / Shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 5,
    },
    accentStrip: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
    },
    inner: {
      padding: spacing.md,
      paddingLeft: spacing.md + 4, // offset for accent strip
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.05)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    iconText: {
      fontSize: 20,
    },
    textWrap: {
      flex: 1,
    },
    title: {
      ...typography.h3,
      fontSize: 18,
      fontWeight: "900",
      color: theme.textPrimary,
      letterSpacing: 0.2,
    },
    subtitle: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 2,
      opacity: 0.8,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.05)",
      paddingTop: spacing.sm,
    },
    metricWrap: {
      flexDirection: "row",
      alignItems: "center",
    },
    metricLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "400",
      opacity: 0.6,
    },
    metricText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "700",
      opacity: 0.9,
    },
    actionButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.04)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.15)",
    },
    actionButtonText: {
      fontSize: 11,
      fontWeight: "800",
      color: theme.textPrimary,
      letterSpacing: 1,
    },
  });

const legacyStyling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: spacing.lg,
      marginVertical: spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    iconText: {
      fontSize: 22,
      color: theme.textPrimary,
    },
    textContainer: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      ...typography.bodyLarge,
      fontWeight: "600",
      color: theme.textPrimary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: theme.textSecondary,
      marginTop: 2,
    },
    description: {
      ...typography.caption,
      color: theme.textMuted ?? theme.textSecondary,
      marginTop: 2,
    },
    statusTouchable: {
      marginLeft: spacing.md,
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    circleDone: {
      borderWidth: 1,
      borderColor: theme.accent,
      backgroundColor: theme.accent,
    },
    circleEmpty: {
      borderWidth: 1,
      backgroundColor: "transparent",
    },
  });

export default HabitItemCard;
