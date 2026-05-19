import React, { useContext, useLayoutEffect, useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "@/components/layout/AppHeader";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { NimbusButton } from "@/components/ui/theme-components/NimbusButton";
import ThemeContext from "@/contexts/ThemeContext";
import { ROUTES } from "@/constants/routes";
import { getBreathWorkDetailById } from "@/features/self-care/utils/breathworkLibrary";
import type { ColorSet, Spacing, Typography } from "@/theme/types";

type BreathWorkDetailParams = {
  breathworkId?: string | string[];
};

const parseParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export default function BreathWorkDetailScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<BreathWorkDetailParams>();
  const { newTheme: theme, spacing, typography } = useContext(ThemeContext);

  const breathworkId = parseParam(params.breathworkId) ?? "";
  const detail = useMemo(
    () => getBreathWorkDetailById(breathworkId),
    [breathworkId]
  );

  const styles = useMemo(
    () => styling(theme, spacing, typography),
    [theme, spacing, typography]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleStartBreathWork = () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync().catch(() => {});
    }

    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_SESSION,
      params: {
        breathworkId: detail.id,
      },
    });
  };

  return (
    <ScreenView bgColor={theme.background} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title="Breath Prelude"
          subtitle="A quiet threshold before the practice begins."
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
          <View
            style={[styles.heroCard, { borderColor: detail.palette.accent }]}
          >
            <Image
              source={detail.image}
              style={styles.heroImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["rgba(9, 11, 8, 0.02)", "rgba(9, 11, 8, 0.84)"]}
              style={StyleSheet.absoluteFill}
            />

            <View
              pointerEvents="none"
              style={[
                styles.heroGlowPrimary,
                { backgroundColor: detail.palette.accentSoft },
              ]}
            />
            <View pointerEvents="none" style={styles.heroGlowSecondary} />

            <View style={styles.heroCopy}>
              <Text style={styles.heroKicker}>CURATED BREATHWORK</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {detail.title}
              </Text>
              <Text style={styles.heroSubtext}>{detail.subtitle}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>DESCRIPTION</Text>
              <View
                style={[
                  styles.sectionPill,
                  {
                    backgroundColor: detail.palette.tagBg,
                    borderColor: detail.palette.tagBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sectionPillText,
                    { color: detail.palette.tagText },
                  ]}
                >
                  {detail.toneLabel.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.sectionBody}>{detail.description}</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>CONTEXT</Text>
            <Text style={styles.sectionBody}>{detail.context}</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>STEPS TO PERFORM</Text>
            <View style={styles.listStack}>
              {detail.steps.map((step, index) => (
                <View key={step} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepNumber,
                      {
                        backgroundColor: detail.palette.tagBg,
                        borderColor: detail.palette.tagBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumberText,
                        { color: detail.palette.tagText },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>BENEFITS</Text>
            <View style={styles.listStack}>
              {detail.benefits.map((benefit) => (
                <View key={benefit} style={styles.bulletRow}>
                  <View
                    style={[
                      styles.bulletIcon,
                      { backgroundColor: detail.palette.accentSoft },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={detail.palette.accent}
                    />
                  </View>
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>TIPS</Text>
            <View style={styles.listStack}>
              {detail.tips.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <View
                    style={[
                      styles.tipIcon,
                      {
                        backgroundColor: detail.palette.tagBg,
                        borderColor: detail.palette.tagBorder,
                      },
                    ]}
                  />
                  <Text style={styles.listText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          <NimbusButton
            label="Play Breath Work"
            onPress={handleStartBreathWork}
            accessibilityLabel="Play Breath Work"
            accessibilityHint="Starts the selected breathwork practice"
            leftIcon={
              <Ionicons
                name="play"
                size={18}
                color={theme.buttonPrimaryText}
              />
            }
            style={[styles.startButton, { backgroundColor: detail.palette.accent }]}
          />
        </ScrollView>
      </View>
    </ScreenView>
  );
}

const styling = (theme: ColorSet, spacing: Spacing, typography: Typography) =>
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
      gap: spacing.lg,
    },
    heroCard: {
      height: 336,
      borderRadius: 32,
      overflow: "hidden",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor:
        theme.border ?? theme.borderMuted ?? "rgba(255,255,255,0.06)",
      marginBottom: spacing.lg,
      shadowColor: theme.shadow,
      shadowOpacity: 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    heroGlowPrimary: {
      position: "absolute",
      top: -40,
      right: -10,
      width: 160,
      height: 160,
      borderRadius: 999,
      opacity: 0.8,
    },
    heroGlowSecondary: {
      position: "absolute",
      bottom: -56,
      left: -28,
      width: 190,
      height: 190,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.1)",
      opacity: 0.58,
    },
    heroCopy: {
      position: "absolute",
      left: 20,
      right: 20,
      bottom: 20,
      gap: 6,
    },
    heroKicker: {
      ...typography.smallCaption,
      letterSpacing: 2.2,
      color: "#D5DBC8",
      textTransform: "uppercase",
      opacity: 0.92,
    },
    heroTitle: {
      ...typography.h1,
      color: "#F4F2E8",
    },
    heroSubtext: {
      ...typography.body,
      color: "#E6E8D7",
      maxWidth: 320,
      opacity: 0.88,
    },
    startButton: {
      alignSelf: "stretch",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.06)",
      shadowColor: theme.shadow,
      shadowOpacity: 0.22,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    sectionCard: {
      borderRadius: 28,
      padding: spacing.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor:
        theme.border ?? theme.borderMuted ?? "rgba(255,255,255,0.06)",
      shadowColor: theme.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    sectionLabel: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    sectionPill: {
      alignSelf: "flex-start",
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    sectionPillText: {
      ...typography.smallCaption,
      letterSpacing: 1.3,
      textTransform: "uppercase",
    },
    sectionBody: {
      ...typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    listStack: {
      gap: spacing.md,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    stepNumber: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      marginTop: 1,
    },
    stepNumberText: {
      ...typography.smallCaption,
      letterSpacing: 0.8,
    },
    stepText: {
      flex: 1,
      ...typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    bulletIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    listText: {
      flex: 1,
      ...typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    tipIcon: {
      width: 10,
      height: 10,
      borderRadius: 999,
      borderWidth: 1,
      marginTop: 7,
    },
  });
