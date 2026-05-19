import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

import AppHeader from "@/components/layout/AppHeader";
import PillFilters from "@/components/ui/PillFilters";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import ThemeContext from "@/contexts/ThemeContext";
import { ROUTES } from "@/constants/routes";
import BreathRecommendationSection from "@/features/self-care/components/breathwork/BreathRecommendationSection";
import BreathStackCard from "@/features/self-care/components/breathwork/BreathStackCard";
import {
  BREATH_FILTERS,
  BREATH_PATTERNS,
  filterBreathPatterns,
  formatBreathToneLabel,
  type BreathPattern,
  type BreathTone,
} from "@/features/self-care/utils/mindPractices";
import {
  BREATH_RECOMMENDATIONS,
  getBreathRecommendationById,
} from "@/features/self-care/utils/breathworkLibrary";
import type {
  ColorSet,
  Spacing,
  Typography,
  TypographyTokens,
} from "@/theme/types";

type BreathSelection = BreathTone | "all";

export const BreathWorkScreen = () => {
  const navigation = useNavigation();
  const {
    newTheme: theme,
    svaTypography,
    spacing,
    typography,
  } = useContext(ThemeContext);

  const [selectedTone, setSelectedTone] = useState<BreathSelection>("all");
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    BREATH_RECOMMENDATIONS[0]?.id ?? BREATH_PATTERNS[0]?.id ?? ""
  );

  const styles = useMemo(
    () => styling(theme, svaTypography, spacing, typography),
    [theme, svaTypography, spacing, typography]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const visiblePatterns = useMemo(
    () => filterBreathPatterns(BREATH_PATTERNS, selectedTone),
    [selectedTone]
  );

  const activePattern = useMemo(
    () =>
      visiblePatterns.find((item) => item.id === selectedPatternId) ??
      visiblePatterns[0] ??
      BREATH_PATTERNS[0],
    [selectedPatternId, visiblePatterns]
  );

  const activeRecommendation = useMemo(
    () => getBreathRecommendationById(activePattern?.id ?? selectedPatternId),
    [activePattern?.id, selectedPatternId]
  );

  useEffect(() => {
    if (!visiblePatterns.some((pattern) => pattern.id === selectedPatternId)) {
      setSelectedPatternId(
        visiblePatterns[0]?.id ?? BREATH_PATTERNS[0]?.id ?? ""
      );
    }
  }, [selectedPatternId, visiblePatterns]);

  const handleSelectPattern = useCallback((pattern: BreathPattern) => {
    setSelectedTone(pattern.tone);
    setSelectedPatternId(pattern.id);
    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_DETAIL,
      params: {
        breathworkId: pattern.id,
      },
    });
  }, []);

  const handlePlayPattern = useCallback((pattern: BreathPattern) => {
    setSelectedTone(pattern.tone);
    setSelectedPatternId(pattern.id);
    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_SESSION,
      params: {
        breathworkId: pattern.id,
      },
    });
  }, []);

  const handleSelectRecommendation = useCallback(
    (item: (typeof BREATH_RECOMMENDATIONS)[number]) => {
      setSelectedTone(item.tone);
      setSelectedPatternId(item.id);
      router.push({
        pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_DETAIL,
        params: {
          breathworkId: item.id,
        },
      });
    },
    []
  );

  const handlePlayRecommendation = useCallback(
    (item: (typeof BREATH_RECOMMENDATIONS)[number]) => {
      setSelectedTone(item.tone);
      setSelectedPatternId(item.id);
      router.push({
        pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_SESSION,
        params: {
          breathworkId: item.id,
        },
      });
    },
    []
  );

  const selectedToneLabel =
    selectedTone === "all" ? "All tones" : formatBreathToneLabel(selectedTone);

  const quoteCopy =
    activeRecommendation?.mantra ?? activePattern?.benefit ?? "";

  return (
    <ScreenView bgColor={theme.background} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title="Breath Work"
          subtitle="Choose a rhythm, then narrow the stack below."
          onBack={() => router.back()}
          containerStyle={styles.header}
        />

        <FlatList
          testID="breathwork-library-list"
          data={visiblePatterns}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <BreathRecommendationSection
                items={BREATH_RECOMMENDATIONS}
                selectedId={activePattern?.id ?? ""}
                onSelect={handleSelectRecommendation}
                onPlay={handlePlayRecommendation}
              />

              <PillFilters
                options={BREATH_FILTERS}
                selectedValue={selectedTone}
                onChange={setSelectedTone}
                scrollable
                contentContainerStyle={styles.filterRow}
                selectedPillStyle={styles.filterPillActive}
                inactivePillStyle={styles.filterPillInactive}
                selectedLabelStyle={styles.filterTextActive}
                inactiveLabelStyle={styles.filterTextInactive}
              />

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>STACKED RHYTHMS</Text>
                  <Text style={styles.sectionTitle}>
                    {selectedToneLabel} collection
                  </Text>
                </View>

                <View style={styles.countPill}>
                  <MaterialCommunityIcons
                    name="weather-windy"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text style={styles.countText}>
                    {visiblePatterns.length} rhythm
                    {visiblePatterns.length === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <BreathStackCard
              item={item}
              recommendation={getBreathRecommendationById(item.id)}
              onPress={handleSelectPattern}
              onPlay={handlePlayPattern}
              selected={item.id === activePattern?.id}
            />
          )}
          ListFooterComponent={
            <View
              style={[
                styles.quoteCard,
                { borderColor: activeRecommendation.palette.accent },
              ]}
            >
              <View
                style={[
                  styles.quoteIconWrap,
                  {
                    backgroundColor: activeRecommendation.palette.tagBg,
                    borderColor: activeRecommendation.palette.accent,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="repeat"
                  size={18}
                  color={activeRecommendation.palette.tagText}
                />
              </View>

              <Text
                style={[
                  styles.quoteText,
                  { color: activeRecommendation.palette.text },
                ]}
              >
                {`"${quoteCopy}"`}
              </Text>

              <Text style={styles.quoteMeta} numberOfLines={1}>
                {activePattern?.title}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={40}
                color={theme.textSecondary}
              />
              <Text style={styles.emptyTitle}>No rhythms in this filter.</Text>
              <Text style={styles.emptyText}>
                Switch the tone chip to bring the library back.
              </Text>
            </View>
          }
        />
      </View>
    </ScreenView>
  );
};

const styling = (
  theme: ColorSet,
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
    listContent: {
      paddingBottom: spacing.xl * 3,
    },
    filterRow: {
      paddingVertical: spacing.xs,
      paddingRight: spacing.md,
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    filterPillInactive: {
      backgroundColor: theme.surface,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    filterPillActive: {
      backgroundColor: theme.surfaceMuted,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    filterTextInactive: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 11,
      letterSpacing: 1.1,
      color: theme.textSecondary,
    },
    filterTextActive: {
      color: theme.textPrimary,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    sectionEyebrow: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 2.6,
      color: theme.textSecondary,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    sectionTitle: {
      ...typography.h3,
      color: theme.textPrimary,
    },
    countPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
    },
    countText: {
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 10,
      letterSpacing: 1,
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    quoteCard: {
      marginTop: spacing.xl,
      borderRadius: 28,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 4,
    },
    quoteIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.08)",
    },
    quoteText: {
      fontFamily:
        svaTypography?.textStyle.authTitle.fontFamily ??
        "CormorantGaramond_500Medium",
      fontSize: 22,
      lineHeight: 30,
      color: theme.textPrimary,
      textAlign: "center",
      fontStyle: "italic",
      letterSpacing: -0.2,
    },
    quoteMeta: {
      marginTop: spacing.sm,
      fontFamily:
        svaTypography?.textStyle.authTinyLabel.fontFamily ??
        "Inter_600SemiBold",
      fontSize: 10,
      lineHeight: 12,
      letterSpacing: 1.4,
      color: theme.textSecondary,
      textTransform: "uppercase",
      textAlign: "center",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xl,
    },
    emptyTitle: {
      ...typography.h3,
      color: theme.textPrimary,
      marginTop: spacing.sm,
      marginBottom: 4,
    },
    emptyText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: "center",
      maxWidth: 280,
    },
  });

export default BreathWorkScreen;
