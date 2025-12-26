import React, { useContext } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

type Provider = "google" | "apple";

export function NimbusOAuthButtons({
  onGoogle,
  onApple,
  hideApple,
}: {
  onGoogle: () => void;
  onApple: () => void;
  hideApple?: boolean;
}) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <View style={{ marginTop: 20 }}>
      {/* Divider */}
      <View style={s.dividerRow}>
        <View style={s.divider} />
        <Text style={s.orText}>or</Text>
        <View style={s.divider} />
      </View>

      <OAuthButton provider="google" onPress={onGoogle} />
      {!hideApple && <View style={{ height: 12 }} />}
      {!hideApple && <OAuthButton provider="apple" onPress={onApple} />}
    </View>
  );

  function OAuthButton({
    provider,
    onPress,
  }: {
    provider: Provider;
    onPress: () => void;
  }) {
    const meta =
      provider === "google"
        ? { label: "Continue with Google", icon: "logo-google" as const }
        : { label: "Continue with Apple", icon: "logo-apple" as const };

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [s.oauthBtn, pressed && { opacity: 0.9 }]}
      >
        <View style={s.oauthIconWrap}>
          <Ionicons name={meta.icon} size={18} color={newTheme.textPrimary} />
        </View>
        <Text style={s.oauthText}>{meta.label}</Text>
        <View style={{ width: 18 }} />
      </Pressable>
    );
  }
}

const styles = (t: any) =>
  StyleSheet.create({
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    divider: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: t.borderMuted ?? t.border,
      marginHorizontal: 10,
    },
    orText: { color: t.textSecondary, fontWeight: "700" },

    oauthBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.borderMuted ?? t.border,
    },
    oauthIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.surfaceMuted ?? t.cardRaised ?? t.surface,
    },
    oauthText: {
      color: t.textPrimary,
      fontWeight: "800",
      fontSize: 15,
    },
  });
