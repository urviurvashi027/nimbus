import React, { useContext, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ThemeContext from "@/contexts/ThemeContext";
import AppHeader from "@/components/layout/AppHeader";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { ROUTES } from "@/constants/routes";
import type { ColorSet, Spacing, Typography } from "@/theme/types";

const DEFAULT_MAINTENANCE_CALORIES = 2150;

const roundToNearestFifty = (value: number) =>
  Math.max(0, Math.round(value / 50) * 50);

const readFirstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

type CalorieTier = {
  key: string;
  label: string;
  title: string;
  calories: number;
  highlight?: boolean;
};

export default function CalorieThresholdScreen() {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();

  const maintenanceCalories = useMemo(() => {
    const raw =
      readFirstParam(
        params.maintenanceCalories as string | string[] | undefined
      ) ??
      readFirstParam(params.calories as string | string[] | undefined) ??
      readFirstParam(params.targetCalories as string | string[] | undefined) ??
      readFirstParam(params.maintenance as string | string[] | undefined);

    const parsed = Number.parseInt(raw ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0
      ? parsed
      : DEFAULT_MAINTENANCE_CALORIES;
  }, [
    params.calories,
    params.maintenance,
    params.maintenanceCalories,
    params.targetCalories,
  ]);

  const calorieTiers = useMemo<CalorieTier[]>(() => {
    const burnCalories = roundToNearestFifty(
      Math.max(0, maintenanceCalories - 300)
    );
    const buildCalories = roundToNearestFifty(maintenanceCalories + 250);

    return [
      {
        key: "maintenance",
        label: "METABOLIC FLUX",
        title: "Maintenance",
        calories: maintenanceCalories,
      },
      {
        key: "burn",
        label: "OPTIMAL IGNITION",
        title: "Burn (Fat Loss)",
        calories: burnCalories,
        highlight: true,
      },
      {
        key: "build",
        label: "STRUCTURAL GROWTH",
        title: "Build (Muscle)",
        calories: buildCalories,
      },
    ];
  }, [maintenanceCalories]);

  const heroWidth = Math.min(Math.max(width * 0.68, 208), 244);
  const heroHeight = 96;

  const styles = useMemo(
    () => styling(newTheme, spacing, typography, heroWidth, heroHeight),
    [newTheme, spacing, typography, heroWidth, heroHeight]
  );

  const handleSealToPlan = () => {
    const burnCalories = roundToNearestFifty(
      Math.max(0, maintenanceCalories - 300)
    );

    router.push({
      pathname: ROUTES.AUTH.TOOLS_MEAL_PLANNER,
      params: {
        maintenanceCalories: String(maintenanceCalories),
        targetCalories: String(burnCalories),
      },
    });
  };

  return (
    <ScreenView padding={0} bgColor={newTheme.background} style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppHeader
          title="Calorie Intake"
          subtitle="Daily maintenance agni"
          onBack={() => router.back()}
          rightAction={{
            icon: "settings-outline",
            accessibilityLabel: "Open settings",
            onPress: () => router.push(ROUTES.TABS.SETTINGS),
          }}
          containerStyle={styles.header}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />

        <View style={styles.heroSection}>
          <View
            style={[
              styles.heroPill,
              {
                width: heroWidth,
                height: heroHeight,
                borderRadius: heroHeight / 2,
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(228,143,163,0.96)", "rgba(191,97,106,0.96)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              pointerEvents="none"
              style={StyleSheet.absoluteFillObject}
            />

            <Text style={styles.heroValue}>
              {maintenanceCalories}
              <Text style={styles.heroUnit}> kcal</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>The Prescriptions</Text>

        <View style={styles.cardStack}>
          {calorieTiers.map((tier) => (
            <View
              key={tier.key}
              style={[
                styles.card,
                tier.highlight && styles.cardHighlight,
              ]}
            >
              <LinearGradient
                colors={
                  tier.highlight
                    ? ["rgba(228,143,163,0.07)", "rgba(228,143,163,0.02)"]
                    : ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.035)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                pointerEvents="none"
                style={StyleSheet.absoluteFillObject}
              />

              <View style={styles.cardLeft}>
                <View style={styles.cardLabelRow}>
                  <Text style={styles.cardLabel}>{tier.label}</Text>
                  {tier.highlight ? <View style={styles.cardDot} /> : null}
                </View>
                <Text style={styles.cardTitle}>{tier.title}</Text>
              </View>

              <Text
                style={[
                  styles.cardCalories,
                  tier.highlight && styles.cardCaloriesHighlight,
                ]}
              >
                {tier.calories}
                <Text style={styles.cardCaloriesUnit}> kcal</Text>
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.tipWrap}>
          <Text style={styles.tipText}>
            This formula is synthesized from your maintenance estimate.
            Assign the selected Burn target to your Nourish Plan to begin.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Seal to plan"
          onPress={handleSealToPlan}
          style={({ pressed }) => [
            styles.sealButton,
            pressed && styles.sealButtonPressed,
          ]}
        >
          <LinearGradient
            colors={[newTheme.chart4 ?? "#E48FA3", newTheme.error ?? "#BF616A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            pointerEvents="none"
            style={StyleSheet.absoluteFillObject}
          />
          <Ionicons
            name="bookmark"
            size={20}
            color={themeInk}
            style={styles.sealIcon}
          />
          <Text style={styles.sealButtonText}>SEAL TO{"\n"}PLAN</Text>
        </Pressable>
      </ScrollView>
    </ScreenView>
  );
}

const themeInk = "#10120E";

const styling = (
  theme: ColorSet,
  spacing: Spacing,
  typography: Typography,
  heroWidth: number,
  heroHeight: number
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl * 2.6,
    },
    header: {
      marginBottom: spacing.sm,
    },
    headerTitle: {
      ...typography.h2,
      fontSize: 22,
      letterSpacing: -0.4,
    },
    headerSubtitle: {
      ...typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: theme.textSecondary,
      opacity: 0.88,
    },
    heroSection: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    heroPill: {
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(228,143,163,0.08)",
      shadowColor: theme.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 5,
    },
    heroValue: {
      color: themeInk,
      fontFamily: "CormorantGaramond_600SemiBold",
      fontSize: 48,
      lineHeight: 50,
      fontStyle: "italic",
      letterSpacing: -1.1,
    },
    heroUnit: {
      color: themeInk,
      fontFamily: "CormorantGaramond_600SemiBold",
      fontSize: 24,
      lineHeight: 24,
      fontStyle: "italic",
      letterSpacing: -0.4,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontFamily: "CormorantGaramond_500Medium",
      fontSize: 24,
      lineHeight: 28,
      fontStyle: "italic",
      marginBottom: spacing.md,
      marginTop: spacing.xl,
    },
    cardStack: {
      gap: spacing.md,
    },
    card: {
      minHeight: 84,
      borderRadius: 18,
      backgroundColor: theme.surface ?? theme.card,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? theme.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden",
      shadowColor: theme.shadow,
      shadowOpacity: 0.16,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
    cardHighlight: {
      borderColor: newThemeAccent(theme),
      backgroundColor: "rgba(228,143,163,0.05)",
      shadowOpacity: 0.24,
    },
    cardLeft: {
      flex: 1,
      paddingRight: spacing.md,
    },
    cardLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 2,
    },
    cardLabel: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      letterSpacing: 1.4,
      opacity: 0.86,
      fontWeight: "700",
    },
    cardDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: newThemeAccent(theme),
      marginTop: 1,
    },
    cardTitle: {
      color: theme.textPrimary,
      fontFamily: "CormorantGaramond_500Medium",
      fontSize: 21,
      lineHeight: 24,
      fontStyle: "italic",
    },
    cardCalories: {
      color: newThemeAccent(theme),
      fontFamily: "CormorantGaramond_600SemiBold",
      fontSize: 28,
      lineHeight: 30,
      letterSpacing: -0.8,
      fontStyle: "italic",
      textAlign: "right",
    },
    cardCaloriesHighlight: {
      color: newThemeAccent(theme),
    },
    cardCaloriesUnit: {
      fontSize: 16,
      lineHeight: 16,
      fontStyle: "italic",
    },
    tipWrap: {
      alignSelf: "center",
      maxWidth: 282,
      marginTop: spacing.xl,
    },
    tipText: {
      color: theme.textPrimary,
      fontFamily: "CormorantGaramond_500Medium",
      fontSize: 20,
      lineHeight: 29,
      fontStyle: "italic",
      textAlign: "center",
      opacity: 0.96,
    },
    sealButton: {
      width: 114,
      height: 114,
      borderRadius: 57,
      alignSelf: "center",
      marginTop: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(191,97,106,0.6)",
      shadowColor: theme.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
    },
    sealButtonPressed: {
      opacity: 0.96,
      transform: [{ scale: 0.98 }],
    },
    sealIcon: {
      marginBottom: 2,
    },
    sealButtonText: {
      color: themeInk,
      fontFamily: typography.button.fontFamily,
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "800",
      letterSpacing: 1.2,
      textAlign: "center",
    },
  });

const newThemeAccent = (theme: any) => theme.chart4 ?? theme.error ?? "#E48FA3";
