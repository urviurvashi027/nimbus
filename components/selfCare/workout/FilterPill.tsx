// components/FilterPill.tsx
import ThemeContext from "@/context/ThemeContext";
import React, { FC, useContext } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";

export interface FilterPillProps {
  label: string;
  isActive?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
}

export const FilterPill: FC<FilterPillProps> = ({
  label,
  isActive = false,
  onPress,
  style,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        isActive ? styles.pillActive : styles.pillInactive,
        style,
      ]}
    >
      <Text style={isActive ? styles.textActive : styles.textInactive}>
        {label}
      </Text>
    </Pressable>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    pill: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 999,
      marginRight: 8,
    },
    pillInactive: {
      backgroundColor: theme.surfaceMuted,
    },
    pillActive: {
      backgroundColor: theme.accent, // Nimbus green highlight
    },
    textInactive: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
    textActive: {
      color: theme.background,
      fontSize: 14,
      fontWeight: "600",
    },
  });

export default FilterPill;
