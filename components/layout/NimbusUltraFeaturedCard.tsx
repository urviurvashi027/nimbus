// src/components/common/NimbusUltraFeaturedCard.tsx

import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

const { width: SCREEN_W } = Dimensions.get("window");
const DEFAULT_CARD_WIDTH = SCREEN_W * 0.84;

export interface NimbusUltraFeaturedCardProps {
  title: string;
  subtitle?: string; // "3 min · Reflection"
  description?: string; // supporting line
  image: ImageSourcePropType;
  onPress: () => void;

  // Optional “premium tint”
  tint?: string; // e.g. cardColor.bgColor (soft highlight)
  accent?: string; // e.g. cardColor.color (chip/underline accent)

  // Optional badge (category / vibe)
  badge?: string; // "Relaxing" | "Focus" | "Breathwork"
  width?: number;
}

const NimbusUltraFeaturedCard: React.FC<NimbusUltraFeaturedCardProps> = ({
  title,
  subtitle,
  description,
  image,
  onPress,
  tint,
  accent,
  badge,
  width,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);

  const cardWidth = width ?? DEFAULT_CARD_WIDTH;

  // Use Nimbus theme colors by default; allow tint/accent from caller
  const colors = useMemo(() => {
    return {
      base: newTheme.cardRaised ?? "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.10)",
      inner: "rgba(255,255,255,0.06)",
      text: newTheme.textPrimary,
      sub: newTheme.textSecondary,
      accent: accent ?? newTheme.accent,
      tint: tint ?? "rgba(180, 210, 190, 0.10)", // soft sage glow
    };
  }, [newTheme, tint, accent]);

  const styles = styling(newTheme, spacing, typography, colors, cardWidth);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Soft tint layer */}
      <View style={styles.tintLayer} />

      {/* Inner content */}
      <View style={styles.inner}>
        <View style={styles.topRow}>
          {/* Image tile */}
          <View style={styles.imageWrap}>
            <Image source={image} style={styles.image} />
            <View style={styles.imageSheen} />
          </View>

          <View style={styles.textWrap}>
            {badge ? (
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText} numberOfLines={1}>
                  {badge}
                </Text>
              </View>
            ) : null}

            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>

            {subtitle ? (
              <Text
                style={styles.subtitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Description footer (lightweight, no heavy band) */}
        {description ? (
          <View style={styles.footer}>
            <View style={styles.footerAccent} />
            <Text
              style={styles.description}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styling = (
  newTheme: any,
  spacing: any,
  typography: any,
  c: {
    base: string;
    border: string;
    inner: string;
    text: string;
    sub: string;
    accent: string;
    tint: string;
  },
  cardWidth: number
) =>
  StyleSheet.create({
    card: {
      width: cardWidth,
      minHeight: 152,
      marginRight: spacing.md,
      marginVertical: spacing.md,
      borderRadius: 24,
      backgroundColor: c.base,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },

    tintLayer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: c.tint,
      opacity: 1,
    },

    inner: {
      padding: spacing.lg,
      gap: spacing.md,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },

    imageWrap: {
      width: 74,
      height: 74,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.04)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    imageSheen: {
      position: "absolute",
      top: -30,
      left: -20,
      width: 120,
      height: 60,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.10)",
      transform: [{ rotate: "-12deg" }],
    },

    textWrap: {
      flex: 1,
      minWidth: 0,
      gap: 6,
    },

    badge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.06)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 99,
      backgroundColor: c.accent,
      opacity: 0.95,
    },
    badgeText: {
      ...typography.caption,
      color: c.sub,
      fontWeight: "700",
    },

    title: {
      ...typography.h3,
      fontSize: 18,
      color: c.text,
      fontWeight: "900",
      letterSpacing: 0.2,
    },
    subtitle: {
      ...typography.caption,
      color: c.sub,
    },

    footer: {
      flexDirection: "row",
      gap: 10,
      alignItems: "flex-start",
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.08)",
    },
    footerAccent: {
      width: 3,
      height: "100%",
      borderRadius: 99,
      backgroundColor: c.accent,
      opacity: 0.65,
    },
    description: {
      ...typography.body,
      color: c.text,
      opacity: 0.85,
      lineHeight: 19,
      flex: 1,
    },
  });

export default NimbusUltraFeaturedCard;
