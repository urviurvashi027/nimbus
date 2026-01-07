import ThemeContext from "@/context/ThemeContext";
import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const ErrorCard = ({
  message,
  onRetry,
  accent,
  surface,
  text,
}: {
  message: string;
  onRetry: () => void;
  accent: string;
  surface: string;
  text: string;
}) => {
  const { newTheme } = useContext(ThemeContext);
  //   const styles = styling(newTheme);

  return (
    <View
      style={{
        backgroundColor: surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: newTheme.error,
      }}
    >
      <Text style={{ color: text, marginBottom: 12 }}>{message}</Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 10,
          backgroundColor: accent ?? newTheme.buttonPrimary,
        }}
      >
        <Text style={{ color: newTheme.buttonPrimaryText, fontWeight: "700" }}>
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
};
