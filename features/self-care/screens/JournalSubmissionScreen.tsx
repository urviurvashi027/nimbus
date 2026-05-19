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
import { format } from "date-fns";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemeContext from "@/contexts/ThemeContext";
import AppHeader from "@/components/layout/AppHeader";
import StyledButton from "@/components/ui/theme-components/StyledButton";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { ROUTES } from "@/constants/routes";

type JournalSubmissionParams = {
  journalId?: string | string[];
  journalTitle?: string | string[];
  journalSummary?: string | string[];
  journalTags?: string | string[];
  journalThemeTag?: string | string[];
  questionCount?: string | string[];
  sealedAtLabel?: string | string[];
};

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

const truncate = (value: string, max: number) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
};

export default function JournalSubmissionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<JournalSubmissionParams>();
  const { newTheme: theme, svaTypography, spacing, typography } =
    useContext(ThemeContext);

  const journalTitle = parseParam(params.journalTitle) ?? "Untitled Chronicle";
  const journalSummary = parseParam(params.journalSummary) ?? "";
  const journalTags = useMemo(
    () => parseTagList(params.journalTags),
    [params.journalTags]
  );
  const journalThemeTag =
    parseParam(params.journalThemeTag) ?? journalTags[0] ?? "reflection";
  const sealedAtLabel =
    parseParam(params.sealedAtLabel) ??
    format(new Date(), "MMM dd, yyyy").toUpperCase();
  const answeredQuestions = useMemo(() => {
    const parsed = Number.parseInt(parseParam(params.questionCount) ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
  }, [params.questionCount]);

  const styles = useMemo(
    () => styling(theme, svaTypography, spacing, typography),
    [theme, svaTypography, spacing, typography]
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleReturnToArchive = () => {
    router.replace(ROUTES.AUTH.SELF_CARE_JOURNAL_ARCHIVE);
  };

  const stats = [
    {
      label: "Questions",
      value: String(answeredQuestions).padStart(2, "0"),
    },
    {
      label: "Tags",
      value: String(Math.max(journalTags.length, 1)).padStart(2, "0"),
    },
    {
      label: "State",
      value: "SEALED",
    },
  ];

  const summaryText =
    journalSummary ||
    "Three guided reflections have been preserved in the archive.";

  return (
    <ScreenView bgColor={theme.background} style={styles.screen}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <View style={styles.root}>
        <AppHeader
          title="Chronicle Vault"
          subtitle="Archived and ready when you return."
          onBack={handleReturnToArchive}
          rightAction={{
            icon: "archive-outline",
            accessibilityLabel: "Back to archive",
            onPress: handleReturnToArchive,
          }}
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
            <View style={styles.heroSealRow}>
              <View style={styles.heroSealOuter}>
                <View style={styles.heroSealInner}>
                  <Ionicons name="checkmark" size={34} color={theme.accent} />
                </View>
              </View>

              <View style={styles.heroCopy}>
                <Text style={styles.heroEyebrow}>SEALED ENTRY</Text>
                <Text style={styles.heroTitle}>Entry secured</Text>
                <Text style={styles.heroDescription}>
                  Your reflection has been sealed into the SVA archive.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>LATEST CHRONICLE</Text>
              <Text style={styles.summaryDate}>{sealedAtLabel}</Text>
            </View>

            <Text style={styles.summaryTitle} numberOfLines={2}>
              {journalTitle}
            </Text>

            <Text style={styles.summaryText} numberOfLines={4}>
              {truncate(summaryText, 260)}
            </Text>

            <View style={styles.summaryFooter}>
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>
                  #{journalThemeTag.toUpperCase()}
                </Text>
              </View>

              <View style={styles.metaPill}>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={theme.textSecondary}
                />
                <Text style={styles.metaText}>
                  {answeredQuestions} QUESTIONS
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.metricsRow}>
            {stats.map((item) => (
              <View key={item.label} style={styles.metricCard}>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteLabel}>ARCHIVE NOTE</Text>
            <Text style={styles.noteText}>
              Return whenever you want to revisit this thread or begin a new
              one from the same quiet place.
            </Text>
          </View>

          <StyledButton
            label="Return to Archive"
            onPress={handleReturnToArchive}
            variant="primary"
            fullWidth
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
      borderRadius: 30,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      padding: 20,
      marginBottom: spacing.lg,
      shadowColor: theme.shadow,
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    heroSealRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
    },
    heroSealOuter: {
      width: 132,
      height: 132,
      borderRadius: 66,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.08)",
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 4,
    },
    heroSealInner: {
      width: 92,
      height: 92,
      borderRadius: 46,
      borderWidth: 1,
      borderColor: theme.accent,
      backgroundColor: theme.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    heroCopy: {
      flex: 1,
    },
    heroEyebrow: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.4,
      color: theme.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
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
    heroDescription: {
      ...typography.body,
      color: theme.textSecondary,
      marginTop: 10,
    },
    summaryCard: {
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
    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    summaryLabel: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.2,
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    summaryDate: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    summaryTitle: {
      fontFamily:
        svaTypography?.textStyle.authTitle.fontFamily ??
        "CormorantGaramond_500Medium",
      fontSize: 28,
      lineHeight: 30,
      color: theme.accent,
      fontStyle: "italic",
      marginBottom: 12,
      letterSpacing: -0.2,
    },
    summaryText: {
      fontFamily:
        svaTypography?.textStyle.body.fontFamily ?? "Inter_400Regular",
      fontSize: 16,
      lineHeight: 26,
      color: theme.textPrimary,
      opacity: 0.96,
    },
    summaryFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 18,
    },
    tagChip: {
      paddingHorizontal: 12,
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
    metaPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    metaText: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      letterSpacing: 1.1,
    },
    metricsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: spacing.lg,
    },
    metricCard: {
      flex: 1,
      borderRadius: 22,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingVertical: 16,
      paddingHorizontal: 14,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
    metricValue: {
      fontFamily:
        svaTypography?.textStyle.displayMedium.fontFamily ??
        "CormorantGaramond_500Medium",
      fontSize: 24,
      lineHeight: 26,
      color: theme.textPrimary,
      marginBottom: 6,
    },
    metricLabel: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2,
      color: theme.textSecondary,
      textTransform: "uppercase",
      textAlign: "center",
    },
    noteCard: {
      borderRadius: 24,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: spacing.xl,
    },
    noteLabel: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ?? "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.1,
      color: theme.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    noteText: {
      ...typography.body,
      color: theme.textPrimary,
      lineHeight: 26,
    },
  });
