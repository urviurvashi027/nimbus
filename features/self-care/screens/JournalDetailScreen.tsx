import React, { useContext, useEffect, useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "@/components/layout/AppHeader";
import ThemeContext from "@/contexts/ThemeContext";
import { NimbusButton } from "@/components/ui/theme-components/NimbusButton";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { ROUTES } from "@/constants/routes";

type JournalDetailParams = {
  journalId?: string | string[];
  journalTitle?: string | string[];
  journalDescription?: string | string[];
  journalTags?: string | string[];
  journalDateLabel?: string | string[];
};

const HERO_IMAGE = require("../../../assets/images/mt.jpg");

const parseParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const parseTagList = (value?: string | string[]) => {
  const raw = parseParam(value);
  if (!raw) return [];

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#+/, "").toLowerCase());
};

const formatTagLabel = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function JournalDetailScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<JournalDetailParams>();
  const { newTheme: theme, svaTypography, spacing, typography } =
    useContext(ThemeContext);

  const journalId = parseParam(params.journalId) ?? "";
  const journalTitle = parseParam(params.journalTitle) ?? "Untitled Chronicle";
  const journalDescription =
    parseParam(params.journalDescription) ??
    "A quiet threshold before the first question.";
  const journalDateLabel = parseParam(params.journalDateLabel) ?? "";
  const journalTags = useMemo(
    () => parseTagList(params.journalTags),
    [params.journalTags]
  );

  const styles = useMemo(
    () => styling(theme, svaTypography, spacing, typography),
    [theme, svaTypography, spacing, typography]
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const primaryTag = journalTags[0] ?? "reflection";
  const journalBenefits = [
    "Clarify the feeling before you write.",
    "Move through a focused three-step flow.",
    "Seal the chronicle into your archive.",
  ];

  const handleStartJournal = () => {
    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_JOURNAL_ENTRY,
      params: {
        journalId,
        journalTitle,
        journalDescription,
        journalTags: journalTags.join(","),
        journalDateLabel,
      },
    });
  };

  return (
    <ScreenView bgColor={theme.background} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title="Chronicle Prelude"
          subtitle="A quiet threshold before the first question."
          onBack={() => router.back()}
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
            <Image source={HERO_IMAGE} style={styles.heroImage} contentFit="cover" />
            <LinearGradient
              colors={["rgba(9, 11, 8, 0.02)", "rgba(9, 11, 8, 0.84)"]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroGlowTop} />
            <View style={styles.heroGlowBottom} />

            <View style={styles.heroTextBlock}>
              <Text style={styles.heroKicker}>GUIDED JOURNAL</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {journalTitle}
              </Text>
              <Text style={styles.heroSubtext}>
                3 guided prompts · begin when ready
              </Text>
            </View>
          </View>

          <View style={styles.descriptionCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>ABOUT THIS JOURNAL</Text>
              {!!journalDateLabel && (
                <Text style={styles.cardMeta}>{journalDateLabel}</Text>
              )}
            </View>

            <Text style={styles.descriptionText}>{journalDescription}</Text>

            {!!journalTags.length && (
              <View style={styles.tagsRow}>
                {journalTags.map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{formatTagLabel(tag).toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>WHY IT HELPS</Text>
              <View style={styles.miniPill}>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={theme.textSecondary}
                />
                <Text style={styles.miniPillText}>{primaryTag.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.benefitList}>
              {journalBenefits.map((benefit) => (
                <View key={benefit} style={styles.benefitRow}>
                  <View style={styles.benefitIcon}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={theme.background}
                    />
                  </View>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <NimbusButton
            label="Start Journal"
            onPress={handleStartJournal}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={theme.buttonPrimaryText}
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
  theme: any,
  svaTypography: any,
  spacing: any,
  typography: any
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
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    heroCard: {
      height: 320,
      borderRadius: 30,
      overflow: "hidden",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      marginBottom: spacing.lg,
      shadowColor: theme.shadow,
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
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.4,
      color: theme.textSecondary,
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
      color: theme.textPrimary,
    },
    heroSubtext: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 10,
      letterSpacing: 0.3,
    },
    descriptionCard: {
      borderRadius: 28,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: spacing.lg,
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },
    benefitCard: {
      borderRadius: 28,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: spacing.xl,
      shadowColor: theme.shadow,
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
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.2,
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    cardMeta: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    descriptionText: {
      fontFamily:
        svaTypography?.textStyle.body.fontFamily ?? "Inter_400Regular",
      fontSize: 16,
      lineHeight: 26,
      color: theme.textPrimary,
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
      color: theme.chart2 ?? theme.accent,
      letterSpacing: 1.1,
    },
    miniPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    miniPillText: {
      ...typography.smallCaption,
      color: theme.textSecondary,
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
      backgroundColor: theme.accent,
      marginTop: 2,
    },
    benefitText: {
      flex: 1,
      ...typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    ctaButton: {
      width: "100%",
    },
  });
