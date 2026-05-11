// Checkbox.tsx
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import ThemeContext from "@/contexts/ThemeContext";

export type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
};

export const StyledCheckbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  disabled,
}) => {
  const { newTheme, svaColors } = useContext(ThemeContext);

  const colors = {
    background: svaColors.bg.base || newTheme.background,
    border: svaColors.brand.primary || newTheme.accent,
    checkedBg: svaColors.brand.primary || newTheme.accent,
    checkmark: svaColors.text.inverse || newTheme.buttonPrimaryText || "#10120E",
    text: svaColors.text.primary || newTheme.textPrimary,
    textSecondary: svaColors.text.secondary || newTheme.textSecondary,
    disabled: svaColors.text.disabled || newTheme.textDisabled,
  };

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        disabled && { opacity: 0.5 },
        pressed && { opacity: 0.7 },
      ]}
      hitSlop={8}
    >
      <View
        style={[
          styles.box,
          { borderColor: disabled ? colors.disabled : colors.border },
          checked && {
            backgroundColor: colors.checkedBg,
            borderColor: colors.checkedBg,
          },
        ]}
      >
        {checked && (
          <Svg width={14} height={14} viewBox="0 0 24 24">
            <Path
              d="M20 6L9 17l-5-5"
              stroke={colors.checkmark}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>
      {label ? (
        typeof label === "string" ? (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        ) : (
          label
        )
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 14,
  },
});
