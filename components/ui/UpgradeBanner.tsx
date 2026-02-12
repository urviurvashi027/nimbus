import React from "react";
import { View, Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  title?: string;
  subtitle?: string;
  cta?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function UpgradeBanner({
  title = "Unlock Nimbus Plus",
  subtitle = "Go premium to create unlimited routines and unlock all features.",
  cta = "Upgrade",
  onPress,
  style,
}: Props) {
  const { newTheme } = React.useContext(ThemeContext);

  const primary = newTheme?.accent ?? "#A7C57A";
  const surface = newTheme?.surface ?? "#1E1E1E";
  const textPrimary = newTheme?.textPrimary ?? "#fff";
  const textSecondary = newTheme?.textSecondary ?? "rgba(255,255,255,0.7)";
  const ctaBg = newTheme?.accent ?? "#A7C57A";
  const ctaText = newTheme?.background ?? "#0D0D0D";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      {/* OUTER GRADIENT BORDER */}
      <LinearGradient
        colors={[primary, "rgba(167,197,122,0.2)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.borderContainer, style]}
      >
        {/* INNER CONTENT CARD */}
        <View style={[styles.innerCard, { backgroundColor: surface }]}>
          {/* ICON */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: newTheme.surface },
            ]}
          >
            <MaterialCommunityIcons
              name="crown-outline"
              size={26}
              color={primary}
            />
          </View>

          {/* TEXT */}
          <View style={styles.textBlock}>
            <Text style={[styles.title, { color: textPrimary }]}>{title}</Text>
            <Text
              style={[styles.subtitle, { color: textSecondary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          </View>

          {/* CTA PILL */}
          <View style={[styles.cta, { backgroundColor: ctaBg }]}>
            <Text style={[styles.ctaText, { color: ctaText }]}>{cta}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  borderContainer: {
    borderRadius: 18,
    padding: 1.5, // border thickness
    marginHorizontal: 16,
    marginTop: 12,
  },
  innerCard: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
  },
  cta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
