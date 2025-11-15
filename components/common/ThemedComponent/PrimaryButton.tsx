// components/common/NimbusPrimaryButton.tsx
import React, { useContext } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  label: string;
  onPress: (e?: GestureResponderEvent) => void;
  disabled?: boolean;
};

const NimbusPrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
}) => {
  const { newTheme } = useContext(ThemeContext);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: newTheme.accent },
        (pressed || disabled) && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.label, { color: newTheme.background }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default NimbusPrimaryButton;
