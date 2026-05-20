import React, { useContext, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import ThemeContext from "@/contexts/ThemeContext";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import AppHeader from "@/components/layout/AppHeader";
import { ROUTES } from "@/constants/routes";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import type { ColorSet, Spacing, Typography } from "@/theme/types";

import {
  ActivityLevelCard,
  GenderTile,
  HeightSlider,
  InsightCard,
  NumericMetricTile,
  NumericMetricTileFooter,
  calculateMaintenanceCalories,
  calculateProteinTarget,
  clampHeightCm,
  deriveArchitecture,
  parseMetricNumber,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
  stepWeight,
  type SomaticGender,
  type SomaticInsight,
} from "@/features/self-care/components/body-vitals";

const INITIAL_VALUES = {
  gender: "masculine" as SomaticGender,
  age: "32",
  weight: "74.5",
  height: "182",
  activityLevel: 0.68,
};

export default function BodyVitalScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(
    () => styling(newTheme, spacing, typography, windowWidth),
    [newTheme, spacing, typography, windowWidth]
  );

  const toast = useNimbusToast();

  const [gender, setGender] = useState<SomaticGender>(INITIAL_VALUES.gender);
  const [age, setAge] = useState(INITIAL_VALUES.age);
  const [weight, setWeight] = useState(INITIAL_VALUES.weight);
  const [height, setHeight] = useState(INITIAL_VALUES.height);
  const [activityLevel, setActivityLevel] = useState(
    INITIAL_VALUES.activityLevel
  );

  const numericProfile = useMemo(() => {
    const parsedAge = parseMetricNumber(age, 32);
    const parsedWeight = parseMetricNumber(weight, 74.5);
    const parsedHeight = clampHeightCm(parseMetricNumber(height, 182));

    return {
      age: parsedAge,
      weight: parsedWeight,
      height: parsedHeight,
      gender,
      activityLevel,
    };
  }, [age, gender, height, activityLevel, weight]);

  const proteinTarget = useMemo(() => {
    return calculateProteinTarget(numericProfile.weight, numericProfile.activityLevel);
  }, [numericProfile.activityLevel, numericProfile.weight]);

  const calorieThreshold = useMemo(() => {
    return calculateMaintenanceCalories({
      age: numericProfile.age,
      heightCm: numericProfile.height,
      weightKg: numericProfile.weight,
      gender: numericProfile.gender,
      activityLevel: numericProfile.activityLevel,
    });
  }, [
    numericProfile.activityLevel,
    numericProfile.age,
    numericProfile.gender,
    numericProfile.height,
    numericProfile.weight,
  ]);

  const architecture = useMemo(() => {
    return deriveArchitecture({
      heightCm: numericProfile.height,
      weightKg: numericProfile.weight,
      activityLevel: numericProfile.activityLevel,
    });
  }, [
    numericProfile.activityLevel,
    numericProfile.height,
    numericProfile.weight,
  ]);

  const insights = useMemo<SomaticInsight[]>(
    () => [
      {
        key: "protein",
        label: "Protein Intake",
        value: `${proteinTarget}g / Day`,
        icon: "flash",
        accent: newTheme.chart4 ?? newTheme.error,
        route: ROUTES.AUTH.SELF_CARE_PROTEIN,
      },
      {
        key: "calorie",
        label: "Calorie Threshold",
        value: `${calorieThreshold} kcal`,
        icon: "flame",
        accent: newTheme.chart3 ?? newTheme.warning,
        route: ROUTES.AUTH.SELF_CARE_CALORIE_THRESHOLD,
      },
        {
          key: "architecture",
          label: "Body Architecture",
          value: architecture,
          icon: "body-outline",
          accent: newTheme.chart5 ?? newTheme.success,
          route: ROUTES.AUTH.SELF_CARE_BODY_ARCHITECTURE,
        },
    ],
    [
      architecture,
      calorieThreshold,
      newTheme.chart3,
      newTheme.chart4,
      newTheme.chart5,
      newTheme.error,
      newTheme.warning,
      newTheme.success,
      proteinTarget,
    ]
  );

  const handleGenerateSummary = () => {
    toast.show({
      variant: "success",
      title: "Biological summary generated",
      message: "Protein, calorie, and architecture outputs are ready.",
    });
  };

  return (
    <ScreenView padding={0} bgColor={newTheme.background} style={styles.screen}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <AppHeader
            title="Somatic Metrics"
            subtitle="Calibrate your physical architecture"
            onBack={() => router.back()}
            rightAction={{
              icon: "person-circle-outline",
              onPress: () => router.push(ROUTES.TABS.SETTINGS),
              accessibilityLabel: "Open profile",
            }}
          />

          <View style={styles.grid}>
            <GenderTile value={gender} onChange={setGender} style={styles.gridTile} />

            <NumericMetricTile
              accentTint="rgba(163,190,140,0.12)"
              label="Age"
              value={age}
              onChangeText={(text) => setAge(sanitizeIntegerInput(text))}
              keyboardType="number-pad"
              maxLength={3}
              trailingIcon="ellipsis-vertical"
              style={styles.gridTile}
            />

            <NumericMetricTile
              accentTint="rgba(163,190,140,0.10)"
              label="Weight"
              value={weight}
              onChangeText={(text) => setWeight(sanitizeDecimalInput(text, 1))}
              keyboardType="decimal-pad"
              maxLength={5}
              style={styles.gridTile}
              footer={
                <NumericMetricTileFooter.StepperRow
                  onDecrement={() => setWeight((current) => stepWeight(current, -0.5))}
                  onIncrement={() => setWeight((current) => stepWeight(current, 0.5))}
                />
              }
            />

            <NumericMetricTile
              accentTint="rgba(125,164,116,0.12)"
              label="Height"
              value={height}
              onChangeText={(text) => setHeight(sanitizeIntegerInput(text))}
              onBlur={() =>
                setHeight((current) => {
                  const next = clampHeightCm(parseMetricNumber(current, 182));
                  return String(next);
                })
              }
              keyboardType="number-pad"
              maxLength={3}
              unit="cm"
              style={styles.gridTile}
              footer={
                <HeightSlider
                  value={numericProfile.height}
                  onChange={(next) => setHeight(String(next))}
                />
              }
            />
          </View>

          <ActivityLevelCard
            value={activityLevel}
            onChange={setActivityLevel}
          />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>INTELLIGENCE OUTPUT</Text>
          </View>

          <View style={styles.insightStack}>
            {insights.map((item) => (
              <InsightCard
                key={item.key}
                label={item.label}
                value={item.value}
                icon={item.icon}
                accent={item.accent}
                onPress={() =>
                  item.key === "protein"
                    ? router.push({
                        pathname: item.route ?? ROUTES.TABS.HOME,
                        params: { protein: String(proteinTarget) },
                      })
                    : router.push(item.route ?? ROUTES.TABS.HOME)
                }
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Generate biological summary"
            onPress={handleGenerateSummary}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <LinearGradient
              colors={[newTheme.buttonPrimary, newTheme.accentPressed]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              pointerEvents="none"
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.primaryButtonText}>
              GENERATE BIOLOGICAL SUMMARY
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}

const styling = (
  theme: ColorSet,
  spacing: Spacing,
  typography: Typography,
  windowWidth: number
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardAvoiding: {
      flex: 1,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl * 2.25,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      alignItems: "stretch",
    },
    gridTile: {
      width: Math.floor((windowWidth - spacing.md * 3) / 2),
      maxWidth: Math.floor((windowWidth - spacing.md * 3) / 2),
      flexGrow: 0,
      flexShrink: 0,
    },
    sectionHeaderRow: {
      marginTop: spacing.md,
      marginBottom: spacing.md,
    },
    sectionHeader: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      letterSpacing: 1.7,
      fontWeight: "700",
      opacity: 0.9,
    },
    insightStack: {
      gap: spacing.md,
    },
    primaryButton: {
      marginTop: spacing.xl,
      minHeight: 54,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(0,0,0,0.08)",
      shadowColor: theme.shadow,
      shadowOpacity: 0.28,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 18,
      elevation: 6,
    },
    primaryButtonPressed: {
      opacity: 0.96,
      transform: [{ scale: 0.99 }],
    },
    primaryButtonText: {
      color: theme.buttonPrimaryText,
      ...typography.button,
      fontWeight: "800",
      letterSpacing: 2.6,
      fontSize: 14,
    },
  });
