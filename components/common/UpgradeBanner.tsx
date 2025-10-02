// components/UpgradeBanner.tsx
import React from "react";
import {
  View,
  Pressable,
  Text as RNText,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

/**
 * UpgradeBanner
 *
 * Props:
 * - title: main heading (default: "Upgrade Plan Now!")
 * - subtitle: small description
 * - cta: short CTA label (default: "Upgrade")
 * - onPress: called when CTA or banner pressed
 * - style: optional container style override
 */
type Props = {
  title?: string;
  subtitle?: string;
  cta?: string;
  onPress?: (e?: GestureResponderEvent) => void;
  style?: ViewStyle;
};

export default function UpgradeBanner({
  title = "Upgrade Plan Now!",
  subtitle = "Enjoy all the benefits and explore more possibilities",
  cta = "Upgrade",
  onPress,
  style,
}: Props) {
  const { theme, newTheme } = React.useContext(ThemeContext);

  // precompute colors from theme (fallbacks if your theme doesn't provide)
  const bg = "#9b84f7"; // purple-ish
  const bgTint = newTheme?.surface || "rgba(255,255,255,0.04)";
  const textPrimary = newTheme?.textPrimary || "#fff";
  const textSecondary = newTheme?.textSecondary || "rgba(255,255,255,0.9)";
  const ctaBg = newTheme?.background || "#fff";
  const ctaText = newTheme?.surface || "#111";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}. ${cta}`}
      style={({ pressed }) => [
        styles.wrapper,
        { backgroundColor: bg, shadowColor: "#000" },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        {/* left: icon */}
        <View style={[styles.iconWrap, { backgroundColor: bgTint }]}>
          <MaterialCommunityIcons name="crown-outline" size={22} color="#fff" />
        </View>

        {/* center: texts */}
        <View style={styles.textWrap}>
          <RNText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.title, { color: textPrimary }]}
          >
            {title}
          </RNText>
          <RNText
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.subtitle, { color: textSecondary }]}
          >
            {subtitle}
          </RNText>
        </View>

        {/* right: CTA pill */}
        <View style={styles.ctaWrap}>
          <RNText style={[styles.ctaText, { color: ctaText }]}>{cta}</RNText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    // subtle elevation/shadow
    ...PlatformIOSShadow(),
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    // subtle inner shadow feel
    opacity: 0.95,
  },
  textWrap: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.95,
  },
  ctaWrap: {
    backgroundColor: "",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.88,
  },
});

/** small helper to provide iOS + Android shadow consistently */
function PlatformIOSShadow() {
  return {
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    // Android elevation
    elevation: 6,
  } as ViewStyle;
}
