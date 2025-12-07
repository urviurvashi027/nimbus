import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

export type DifficultyOptionKey = "easy" | "medium" | "hard";

interface DifficultyTabsProps {
  activeKey: DifficultyOptionKey;
  onChange: (key: DifficultyOptionKey) => void;
  style?: ViewStyle;
}

const OPTIONS: { key: DifficultyOptionKey; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

const DifficultyTabs: React.FC<DifficultyTabsProps> = ({
  activeKey,
  onChange,
  style,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={[styles.container, style]}>
      {OPTIONS.map((opt) => {
        const isActive = opt.key === activeKey;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.9}
          >
            <Text style={isActive ? styles.textActive : styles.textInactive}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    pill: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 999,
      backgroundColor: newTheme.surfaceMuted,
      marginRight: spacing.sm,
    },
    pillActive: {
      backgroundColor: "#6DFF8C", // Nimbus neon green
    },
    textInactive: {
      ...typography.bodySmall,
      color: newTheme.textSecondary,
      fontWeight: "500",
    },
    textActive: {
      ...typography.bodySmall,
      color: "#062814",
      fontWeight: "600",
    },
  });

export default DifficultyTabs;
