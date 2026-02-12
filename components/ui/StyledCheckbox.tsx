// Checkbox.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// Theme colors (can later be moved to a central theme file)
const colors = {
  background: "#1C1E1A",
  border: "#A3BE8C",
  checkedBg: "#A3BE8C",
  checkmark: "#ECEFF4",
  text: "#ECEFF4",
  textSecondary: "#A1A69B",
  disabled: "#5C6157",
};

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
          <Text style={styles.label}>{label}</Text>
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
    color: colors.text,
    fontSize: 14,
  },
});
