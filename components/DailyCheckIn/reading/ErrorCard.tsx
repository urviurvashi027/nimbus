import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export const ErrorCard = ({
  msg,
  onRetry,
  colors,
}: {
  msg: string;
  onRetry: () => void;
  colors: any;
}) => (
  <View
    style={{
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
    }}
  >
    <Text style={{ color: colors.textPrimary, marginBottom: 10 }}>{msg}</Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{
        alignSelf: "flex-start",
        backgroundColor: colors.accent,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: colors.background, fontWeight: "700" }}>Retry</Text>
    </TouchableOpacity>
  </View>
);
