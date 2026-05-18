import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "@/components/layout/AppHeader";
import { NimbusButton } from "@/components/ui/theme-components/NimbusButton";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import ThemeContext from "@/contexts/ThemeContext";
import { ROUTES } from "@/constants/routes";
import {
  buildSoundscapeBenefits,
  buildSoundscapeSubtitle,
  formatSoundscapeTagLabel,
  getSoundscapeById,
  mockSoundscapeSessions,
} from "@/features/self-care/utils/soundscapeLibrary";
import type {
  Spacing,
  SvaColorSet,
  Typography,
  TypographyTokens,
} from "@/theme/types";

type SoundscapeDetailParams = {
  soundscapeId?: string | string[];
};

const FAVORITES_KEY = "soundscape_favorites_v1";

const parseParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export default function SoundscapeDetailScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<SoundscapeDetailParams>();
  const { svaColors, svaTypography, spacing, typography } =
    useContext(ThemeContext);

  const soundscapeId = parseParam(params.soundscapeId) ?? "";

  const soundscape = useMemo(
    () => getSoundscapeById(soundscapeId) ?? mockSoundscapeSessions[0],
    [soundscapeId]
  );

  const styles = useMemo(
    () => styling(svaColors, svaTypography, spacing, typography),
    [svaColors, svaTypography, spacing, typography]
  );

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const isFavorite = favoriteSet.has(soundscape.id);
  const benefits = useMemo(
    () => buildSoundscapeBenefits(soundscape),
    [soundscape]
  );
  const subtitle = useMemo(() => buildSoundscapeSubtitle(soundscape), [soundscape]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    let active = true;

    const loadFavorites = async () => {
      try {
        const raw = await AsyncStorage.getItem(FAVORITES_KEY);
        if (!raw) return;

        const parsed: unknown = JSON.parse(raw);
        if (active && Array.isArray(parsed)) {
          setFavoriteIds(parsed.map(String));
        }
      } catch (error) {
        console.warn("Unable to load soundscape favorites:", error);
      }
    };

    void loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleFavorite = useCallback(async () => {
    try {
      const nextFavorites = isFavorite
        ? favoriteIds.filter((id) => id !== soundscape.id)
        : [soundscape.id, ...favoriteIds];

      setFavoriteIds(nextFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    } catch (error) {
      console.warn("soundscape favorite toggle failed", error);
    }
  }, [favoriteIds, isFavorite, soundscape.id]);

  const handleShare = useCallback(async () => {
    await Share.share({
      message: `${soundscape.title} · ${soundscape.description}`,
    });
  }, [soundscape.description, soundscape.title]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleStartSoundscape = useCallback(() => {
    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_SOUNDSCAPE_PLAYER,
      params: {
        soundscapeId: soundscape.id,
      },
    });
  }, [soundscape.id]);

  const ctaLabel = "Start Soundscape";

  return (
    <ScreenView bgColor={svaColors.bg.base} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title="Soundscape Prelude"
          subtitle="A quiet threshold before the sound begins."
          onBack={handleBack}
          rightActions={[
            {
              icon: isFavorite ? "heart" : "heart-outline",
              accessibilityLabel: isFavorite
                ? "Remove from favorites"
                : "Add to favorites",
              onPress: () => void handleToggleFavorite(),
            },
            {
              icon: "share-outline",
              accessibilityLabel: "Share soundscape",
              onPress: () => void handleShare(),
            },
          ]}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
          containerStyle={styles.header}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.xl * 2.5 },
          ]}
        >
          <View style={styles.heroCard}>
            <Image
              source={soundscape.image}
              style={styles.heroImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["rgba(9, 11, 8, 0.02)", "rgba(9, 11, 8, 0.84)"]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroGlowTop} />
            <View style={styles.heroGlowBottom} />

            <View style={styles.heroTextBlock}>
              <Text style={styles.heroKicker}>CURATED SOUNDSCAPE</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {soundscape.title}
              </Text>
              <Text style={styles.heroSubtext}>{subtitle}</Text>
            </View>
          </View>

          <View style={styles.descriptionCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>ABOUT THIS SOUNDSCAPE</Text>
              <Text style={styles.cardMeta}>{soundscape.category}</Text>
            </View>

            <Text style={styles.descriptionText}>{soundscape.description}</Text>

            <View style={styles.tagsRow}>
              {soundscape.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>
                    #{formatSoundscapeTagLabel(tag).toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>WHY IT HELPS</Text>
              <View style={styles.miniPill}>
                <Ionicons
                  name="musical-notes-outline"
                  size={14}
                  color={svaColors.text.secondary}
                />
                <Text style={styles.miniPillText}>
                  {soundscape.category.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.benefitList}>
              {benefits.map((benefit) => (
                <View key={benefit} style={styles.benefitRow}>
                  <View style={styles.benefitIcon}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={svaColors.bg.base}
                    />
                  </View>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <NimbusButton
            label={ctaLabel}
            onPress={handleStartSoundscape}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={svaColors.text.inverse}
              />
            }
            style={styles.ctaButton}
          />
        </ScrollView>
      </View>
    </ScreenView>
  );
}

const styling = (
  theme: SvaColorSet,
  svaTypography: TypographyTokens | undefined,
  spacing: Spacing,
  typography: Typography
) =>
  StyleSheet.create({
    screen: {
      paddingHorizontal: spacing.md,
      paddingTop:
        Platform.OS === "ios"
          ? spacing["xxl"] + spacing["xxl"] * 0.4
          : spacing.xl,
    },
    root: {
      flex: 1,
    },
    header: {
      marginBottom: spacing.md,
    },
    headerTitle: {
      fontFamily:
        svaTypography?.textStyle.displayMedium.fontFamily ??
        "CormorantGaramond_500Medium",
      fontSize: 34,
      lineHeight: 34,
      letterSpacing: -0.8,
      color: theme.text.primary,
    },
    headerSubtitle: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.2,
      textTransform: "uppercase",
      color: theme.text.secondary,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    heroCard: {
      height: 320,
      borderRadius: 30,
      overflow: "hidden",
      backgroundColor: theme.surface.base,
      borderWidth: 1,
      borderColor: theme.border.subtle,
      marginBottom: spacing.lg,
      shadowColor: theme.shadow.default,
      shadowOpacity: 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    heroGlowTop: {
      position: "absolute",
      top: -46,
      right: -24,
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: "rgba(163, 190, 140, 0.16)",
    },
    heroGlowBottom: {
      position: "absolute",
      bottom: -56,
      left: -30,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: "rgba(163, 190, 140, 0.08)",
    },
    heroTextBlock: {
      position: "absolute",
      left: spacing.lg,
      right: spacing.lg,
      bottom: spacing.lg,
    },
    heroKicker: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.4,
      color: theme.text.secondary,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    heroTitle: {
      fontFamily:
        svaTypography?.textStyle.displayMedium.fontFamily ??
        "CormorantGaramond_500Medium",
      fontSize: 34,
      lineHeight: 34,
      letterSpacing: -0.8,
      color: theme.text.primary,
    },
    heroSubtext: {
      ...typography.caption,
      color: theme.text.secondary,
      marginTop: 10,
      letterSpacing: 0.3,
    },
    descriptionCard: {
      borderRadius: 28,
      backgroundColor: theme.surface.base,
      borderWidth: 1,
      borderColor: theme.border.subtle,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: spacing.lg,
      shadowColor: theme.shadow.default,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },
    benefitCard: {
      borderRadius: 28,
      backgroundColor: theme.surface.base,
      borderWidth: 1,
      borderColor: theme.border.subtle,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: spacing.xl,
      shadowColor: theme.shadow.default,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 14,
    },
    cardLabel: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.2,
      color: theme.text.secondary,
      textTransform: "uppercase",
    },
    cardMeta: {
      ...typography.smallCaption,
      color: theme.text.secondary,
      textTransform: "uppercase",
    },
    descriptionText: {
      fontFamily:
        svaTypography?.textStyle.body.fontFamily ?? "Outfit_400Regular",
      fontSize: 16,
      lineHeight: 26,
      color: theme.text.primary,
      opacity: 0.96,
    },
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 18,
    },
    tagChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "rgba(163,190,140,0.12)",
      borderWidth: 1,
      borderColor: "rgba(163,190,140,0.16)",
    },
    tagText: {
      ...typography.smallCaption,
      color: theme.brand.primary,
      letterSpacing: 1.1,
    },
    miniPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.bg.subtle,
      borderWidth: 1,
      borderColor: theme.border.subtle,
    },
    miniPillText: {
      ...typography.smallCaption,
      color: theme.text.secondary,
      letterSpacing: 1,
    },
    benefitList: {
      gap: 12,
    },
    benefitRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    benefitIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.brand.primary,
      marginTop: 2,
    },
    benefitText: {
      flex: 1,
      ...typography.body,
      color: theme.text.primary,
      lineHeight: 24,
    },
    ctaButton: {
      width: "100%",
    },
  });
