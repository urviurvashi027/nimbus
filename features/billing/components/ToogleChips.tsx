import React from "react";
import { View, Text, Pressable } from "react-native";

type ToggleChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: any;
  badgeLabel?: string;
};

export const ToggleChip = ({
  label,
  active,
  onPress,
  theme,
  badgeLabel,
}: ToggleChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          paddingVertical: 10,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
          backgroundColor: active ? theme.accent : "transparent",
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text
        style={{
          color: active ? theme.background : theme.textSecondary,
          fontWeight: "600",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      {badgeLabel && active && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 999,
            backgroundColor: theme.background,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: theme.accent,
            }}
          >
            {badgeLabel.toUpperCase()}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
