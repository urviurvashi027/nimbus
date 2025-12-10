import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
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
  onToggle: (id: string, actual_count: any) => void;
}

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
    () => styling(newTheme, spacing, typography),
    [newTheme, spacing, typography]
  );

  const handleToggle = (e: GestureResponderEvent) => {
    e.stopPropagation(); // don’t trigger card navigation
    onToggle(id, actual_count);
  };

  const handleHabitClick = () => {
    router.push({
      pathname: "/(auth)/habit/details",
      params: { id, date: selectedDate },
    });
  };

  // line below title: “Every day • 8:00 AM”
  const subtitle = time ? `${frequency} • ${time}` : frequency;

  // soft tint for icon background if color is provided
  const iconBgStyle = color
    ? { backgroundColor: `${color}33` } // #RRGGBB + 0.2 alpha
    : null;
  const accentBorderStyle = color ? { borderColor: color } : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleHabitClick}
      activeOpacity={0.9}
    >
      {/* Icon */}
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

      {/* Text info */}
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

      {/* Status circle */}
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

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: spacing.lg,
      marginVertical: spacing.sm,
      // subtle lift
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },

    // Icon
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surface, // overridden with tint when color passed
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    iconText: {
      fontSize: 22,
      color: theme.textPrimary,
    },

    // Text
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

    // Status
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
