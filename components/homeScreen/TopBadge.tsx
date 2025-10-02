import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type Variant = "pill" | "circle";

export interface TopBadgeProps {
  count?: number | string;
  label?: string; // small label like "pts" or "level"
  iconName?: string; // Ionicons name (optional)
  onPress?: (e?: GestureResponderEvent) => void;
  style?: ViewStyle;
  variant?: Variant;
  small?: boolean;
}

/**
 * Reusable top-right badge used for points/score/level.
 * Use `variant="pill"` for text + count, `variant="circle"` for compact circle.
 */
export default function TopBadge({
  count,
  label,
  iconName,
  onPress,
  style,
  variant = "circle",
  small = false,
}: TopBadgeProps) {
  const { newTheme } = React.useContext(ThemeContext);

  const colors = {
    bg: newTheme.accent || "#cfe8c3",
    bgMuted: newTheme.surface,
    textPrimary: newTheme.textPrimary,
    textOnAccent: newTheme.background,
    border: newTheme.divider,
  };

  const classes = styles(colors, small);

  const content =
    variant === "circle" ? (
      <View style={classes.circle}>
        {iconName ? (
          <Ionicons
            name={iconName as any}
            size={small ? 14 : 16}
            color={colors.textOnAccent}
          />
        ) : (
          <Text style={classes.circleText}>{String(count ?? "")}</Text>
        )}
      </View>
    ) : (
      <View style={classes.pill}>
        {iconName && (
          <Ionicons
            name={iconName as any}
            size={small ? 14 : 16}
            color={colors.textOnAccent}
            style={{ marginRight: 8 }}
          />
        )}
        <Text numberOfLines={1} style={classes.pillCount}>
          {count ?? ""}
        </Text>
        {label ? <Text style={classes.pillLabel}> {label}</Text> : null}
      </View>
    );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[classes.container, style]}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[classes.container, style]}>{content}</View>;
}

const styles = (colors: any, small: boolean) =>
  StyleSheet.create({
    container: {
      // helpful defaults when used absolutely: wrap content, add shadow
      alignSelf: "flex-end",
      borderRadius: 14,
      overflow: "hidden",
      // subtle shadow
      ...PlatformSelectShadow(),
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bg,
      paddingVertical: small ? 6 : 10,
      paddingHorizontal: small ? 8 : 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillCount: {
      fontWeight: "700",
      color: colors.textOnAccent,
      fontSize: small ? 13 : 15,
      lineHeight: small ? 16 : 18,
    },
    pillLabel: {
      color: colors.textOnAccent,
      opacity: 0.95,
      fontSize: small ? 11 : 13,
      marginLeft: 6,
    },
    circle: {
      width: small ? 36 : 44,
      height: small ? 36 : 44,
      borderRadius: small ? 18 : 22,
      backgroundColor: colors.bg,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    circleText: {
      color: colors.textOnAccent,
      fontWeight: "700",
      fontSize: small ? 14 : 16,
    },
  });

// tiny helper for cross-platform shadow
function PlatformSelectShadow() {
  return {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  };
}
