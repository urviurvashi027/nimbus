import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "@/components/layout/AppHeader";
import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import ThemeContext from "@/contexts/ThemeContext";
import { getBreathWorkDetailById } from "@/features/self-care/utils/breathworkLibrary";
import {
  BREATH_PATTERNS,
  type BreathPattern,
  type BreathPhase,
} from "@/features/self-care/utils/mindPractices";
import type { ColorSet, Spacing, Typography } from "@/theme/types";

type BreathWorkSessionParams = {
  breathworkId?: string | string[];
};

const parseParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const BOX_FRAME_RADIUS = 28;

const formatPhaseTimeline = (phases: BreathPhase[]) =>
  phases.map((phase) => `${phase.label} ${phase.seconds}s`).join(" · ");

const getMotionVariant = (patternId: string) =>
  patternId === "box-breath" ? "box" : "orb";

const getPhaseCue = (
  pattern: BreathPattern,
  phase: BreathPhase,
  phaseIndex: number
) => {
  const label = phase.label.toLowerCase();

  if (pattern.id === "box-breath") {
    switch (phaseIndex) {
      case 0:
        return "Climb the left edge with a smooth inhale.";
      case 1:
        return "Pause at the top and keep the frame steady.";
      case 2:
        return "Move down the right edge and let the breath leave.";
      case 3:
        return "Rest at the bottom edge before the next inhale.";
      default:
        return "Stay with the square and keep the count even.";
    }
  }

  switch (pattern.id) {
    case "coherent-breath":
      if (label === "inhale") {
        return "Take in the same calm count you will return on the way out.";
      }
      if (label === "exhale") {
        return "Let the exhale stay just as smooth and even.";
      }
      return "Keep the body easy and the tempo quiet.";
    case "release-breath":
      if (label === "inhale") {
        return "Invite the breath in without lifting the shoulders.";
      }
      if (label === "exhale") {
        return "Let the longer exhale do the loosening.";
      }
      return "Stay soft while the breath settles.";
    case "sleep-breath":
      if (label === "inhale") {
        return "Take a gentle breath and keep the room dim.";
      }
      if (label === "hold") {
        return "Hold lightly, with no strain.";
      }
      if (label === "exhale") {
        return "Let the exhale get quieter as you go.";
      }
      return "Allow the next round to arrive slowly.";
    case "grounding":
    default:
      if (label === "inhale") {
        return "Draw the breath in with a steady, rooted count.";
      }
      if (label === "hold") {
        return "Keep the frame still for a clean pause.";
      }
      if (label === "exhale") {
        return "Release with the same deliberate pace.";
      }
      return `Stay with the ${phase.label.toLowerCase()} for ${phase.seconds} seconds.`;
  }
};

const getPulseScaleRange = (phaseLabel: string): number[] => {
  switch (phaseLabel.toLowerCase()) {
    case "inhale":
      return [0.94, 1.08];
    case "exhale":
      return [1.08, 0.94];
    default:
      return [1, 1];
  }
};

type BreathMotionCanvasProps = {
  motionVariant: "box" | "orb";
  currentPhase: BreathPhase;
  phaseIndex: number;
  phaseProgress: Animated.Value;
  motionSize: number;
  accent: string;
  motionFrameBorder: string;
  shadow: string;
  typography: Typography;
  textSecondary: string;
  surface: string;
  motionCoreStart: string;
  motionCoreEnd: string;
  motionGlow: string;
};

const motionStyling = (typography: Typography) =>
  StyleSheet.create({
    motionStage: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
      position: "relative",
    },
    squareFrame: {
      borderWidth: 1,
      borderRadius: BOX_FRAME_RADIUS,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    squareGlow: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.18,
    },
    edgeLabel: {
      position: "absolute",
      ...typography.smallCaption,
      textTransform: "uppercase",
      letterSpacing: 1.8,
      backgroundColor: "rgba(0,0,0,0.18)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      overflow: "hidden",
    },
    edgeTop: {
      top: 12,
      alignSelf: "center",
    },
    edgeBottom: {
      bottom: 12,
      alignSelf: "center",
    },
    edgeLeft: {
      left: 12,
      top: "50%",
      transform: [{ translateY: -10 }, { rotate: "-90deg" }],
    },
    edgeRight: {
      right: 12,
      top: "50%",
      transform: [{ translateY: -10 }, { rotate: "90deg" }],
    },
    breathOrb: {
      position: "absolute",
      shadowOpacity: 0.32,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
    },
    breathOrbTrack: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    orbFrame: {
      borderWidth: 1,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    orbGlow: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.18,
    },
    orbCore: {
      position: "absolute",
      shadowOpacity: 0.28,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 5,
    },
    orbLabel: {
      ...typography.smallCaption,
      position: "absolute",
      bottom: 18,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
  });

const BreathMotionCanvas = ({
  motionVariant,
  currentPhase,
  phaseIndex,
  phaseProgress,
  motionSize,
  accent,
  motionFrameBorder,
  shadow,
  typography,
  textSecondary,
  surface,
  motionCoreStart,
  motionCoreEnd,
  motionGlow,
}: BreathMotionCanvasProps) => {
  const s = useMemo(() => motionStyling(typography), [typography]);
  const frameSize = Math.max(220, motionSize - 40);
  const ballSize = 26;
  const cornerInset = Math.max(0, BOX_FRAME_RADIUS - ballSize / 2);

  if (motionVariant === "box") {
    const segments = [
      {
        startX: 0,
        startY: frameSize - ballSize - cornerInset,
        endX: 0,
        endY: cornerInset,
      },
      {
        startX: cornerInset,
        startY: 0,
        endX: frameSize - ballSize - cornerInset,
        endY: 0,
      },
      {
        startX: frameSize - ballSize,
        startY: cornerInset,
        endX: frameSize - ballSize,
        endY: frameSize - ballSize - cornerInset,
      },
      {
        startX: frameSize - ballSize - cornerInset,
        startY: frameSize - ballSize,
        endX: cornerInset,
        endY: frameSize - ballSize,
      },
    ];

    const segment = segments[phaseIndex] ?? segments[0];
    const scale = phaseProgress.interpolate({
      inputRange: [0, 1],
      outputRange: getPulseScaleRange(currentPhase.label),
    });
    const translateX = phaseProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [segment.startX, segment.endX],
    });
    const translateY = phaseProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [segment.startY, segment.endY],
    });

    const edges = [
      {
        label: "Inhale",
        position: "left",
        active: phaseIndex === 0,
      },
      {
        label: "Hold",
        position: "top",
        active: phaseIndex === 1,
      },
      {
        label: "Exhale",
        position: "right",
        active: phaseIndex === 2,
      },
      {
        label: "Hold",
        position: "bottom",
        active: phaseIndex === 3,
      },
    ] as const;

    return (
        <View
          style={[
            s.motionStage,
            {
              width: motionSize,
              minHeight: motionSize + 8,
              alignSelf: "center",
            },
          ]}
      >
        <View
          style={[
            s.squareFrame,
            {
              width: frameSize,
              height: frameSize,
              backgroundColor: surface,
              borderColor: motionFrameBorder,
              shadowColor: shadow,
            },
          ]}
        >
          <View
            style={[
              s.squareGlow,
              {
                backgroundColor: motionGlow,
              },
            ]}
          />

          {edges.map((edge) => (
            <Text
              key={`${edge.position}-${edge.label}`}
              style={[
                s.edgeLabel,
                edge.position === "top" && s.edgeTop,
                edge.position === "right" && s.edgeRight,
                edge.position === "bottom" && s.edgeBottom,
                edge.position === "left" && s.edgeLeft,
                {
                  color: edge.active ? accent : textSecondary,
                  opacity: edge.active ? 1 : 0.72,
                },
              ]}
            >
              {edge.label}
            </Text>
          ))}

          <Animated.View
            style={[
              s.breathOrbTrack,
              {
                width: ballSize,
                height: ballSize,
                transform: [
                  { translateX },
                  { translateY },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                s.breathOrb,
                {
                  width: ballSize,
                  height: ballSize,
                  borderRadius: ballSize / 2,
                  shadowColor: shadow,
                  transform: [{ scale }],
                },
              ]}
            >
              <LinearGradient
                colors={[motionCoreStart, motionCoreEnd]}
                start={{ x: 0.15, y: 0.15 }}
                end={{ x: 0.85, y: 0.85 }}
                style={{
                  flex: 1,
                  borderRadius: ballSize / 2,
                }}
              />
            </Animated.View>
          </Animated.View>

        </View>
      </View>
    );
  }

  const orbSize = frameSize * 0.54;
  const label = currentPhase.label.toLowerCase();
  const translateY = phaseProgress.interpolate({
    inputRange: [0, 1],
    outputRange:
      label === "inhale"
        ? [10, -8]
        : label === "exhale"
        ? [-8, 10]
        : [0, 0],
  });
  const scale = phaseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: getPulseScaleRange(currentPhase.label),
  });

  return (
    <View
      style={[
        s.motionStage,
        {
          width: motionSize,
          minHeight: motionSize + 8,
          alignSelf: "center",
        },
      ]}
    >
      <View
        style={[
          s.orbFrame,
          {
            width: frameSize,
            height: frameSize,
            backgroundColor: surface,
            borderColor: accent,
            shadowColor: shadow,
          },
        ]}
      >
        <View
          style={[
            s.orbGlow,
            {
              backgroundColor: motionGlow,
            },
          ]}
        />

        <Animated.View
          style={[
            s.orbCore,
            {
              width: orbSize,
              height: orbSize,
              borderRadius: orbSize / 2,
              shadowColor: shadow,
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          <LinearGradient
            colors={[motionCoreStart, motionCoreEnd]}
            start={{ x: 0.15, y: 0.15 }}
            end={{ x: 0.85, y: 0.85 }}
            style={{
              flex: 1,
              borderRadius: orbSize / 2,
            }}
          />
        </Animated.View>

        <Text style={[s.orbLabel, { color: textSecondary }]}>
          {currentPhase.label.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

export default function BreathWorkSessionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<BreathWorkSessionParams>();
  const { newTheme: theme, spacing, typography } = useContext(ThemeContext);

  const breathworkId = parseParam(params.breathworkId) ?? "";
  const detail = useMemo(
    () => getBreathWorkDetailById(breathworkId),
    [breathworkId]
  );
  const pattern = useMemo(
    () =>
      BREATH_PATTERNS.find((item) => item.id === detail.id) ??
      BREATH_PATTERNS[0],
    [detail.id]
  );
  const phases = pattern.phases.length ? pattern.phases : BREATH_PATTERNS[0].phases;
  const motionVariant = getMotionVariant(pattern.id);
  const phaseTimeline = useMemo(() => formatPhaseTimeline(phases), [phases]);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(phases[0]?.seconds ?? 0);
  const [roundCount, setRoundCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const phaseProgress = useRef(new Animated.Value(0)).current;
  const phaseIndexRef = useRef(0);

  const styles = useMemo(
    () => styling(theme, spacing, typography),
    [theme, spacing, typography]
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setSecondsRemaining(phases[0]?.seconds ?? 0);
    setRoundCount(0);
    setHasStarted(false);
    phaseProgress.stopAnimation();
    phaseProgress.setValue(0);
  }, [breathworkId, phaseProgress, phases]);

  useEffect(() => {
    if (!hasStarted) {
      return undefined;
    }

    const currentPhase = phases[phaseIndex] ?? phases[0];
    if (!currentPhase) return undefined;

    phaseProgress.stopAnimation();
    phaseProgress.setValue(0);

    const animation = Animated.timing(phaseProgress, {
      toValue: 1,
      duration: currentPhase.seconds * 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [hasStarted, phaseIndex, phases, phaseProgress]);

  useEffect(() => {
    if (!hasStarted) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => {
        if (current > 1) {
          return current - 1;
        }

        const nextIndex = (phaseIndexRef.current + 1) % phases.length;
        phaseIndexRef.current = nextIndex;
        setPhaseIndex(nextIndex);

        if (nextIndex === 0) {
          setRoundCount((value) => value + 1);
        }

        if (Platform.OS !== "web") {
          void Haptics.selectionAsync().catch(() => {});
          if (nextIndex === 0) {
            void Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            ).catch(() => {});
          }
        }

        return phases[nextIndex]?.seconds ?? 0;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [hasStarted, phases]);

  const currentPhase = useMemo(
    () => phases[phaseIndex] ?? phases[0] ?? { label: "Inhale", seconds: 4 },
    [phases, phaseIndex]
  );
  const phaseCue = hasStarted
    ? getPhaseCue(pattern, currentPhase, phaseIndex)
    : "Tap play to begin the 4-4-4-4 cycle.";
  const motionSize = Math.min(Math.max(width - spacing.md * 2 - 8, 260), 332);
  const currentRound = hasStarted ? roundCount + 1 : 0;
  const motionCoreStart = theme.chart5;
  const motionCoreEnd = theme.chart2;
  const motionGlow = "rgba(121, 169, 242, 0.10)";
  const motionFrameBorder = theme.chart6;

  const handleStart = useCallback(() => {
    setHasStarted(true);

    if (Platform.OS !== "web") {
      void Haptics.selectionAsync().catch(() => {});
    }
  }, []);

  const handleRestart = () => {
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setSecondsRemaining(phases[0]?.seconds ?? 0);
    setRoundCount(0);
    setHasStarted(false);
    phaseProgress.stopAnimation();
    phaseProgress.setValue(0);

    if (Platform.OS !== "web") {
      void Haptics.selectionAsync().catch(() => {});
    }
  };

  useEffect(() => {
    setSecondsRemaining(currentPhase.seconds);
  }, [currentPhase]);

  return (
    <ScreenView bgColor={theme.background} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title="Breath Session"
          subtitle={phaseTimeline}
          onBack={() => router.back()}
          rightActions={[
            {
              icon: "refresh-outline",
              accessibilityLabel: "Restart session",
              onPress: handleRestart,
            },
          ]}
          containerStyle={styles.header}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.xl * 2.5 },
          ]}
        >
          <View style={[styles.heroCard, { borderColor: detail.palette.accent }]}>
            <Image
              source={detail.image}
              style={styles.heroImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["rgba(8, 10, 7, 0.02)", "rgba(8, 10, 7, 0.86)"]}
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
              <Text style={styles.heroKicker}>GUIDED RHYTHM</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {detail.title}
              </Text>
              <Text style={styles.heroSubtext}>{detail.description}</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start breathwork"
            accessibilityHint="Starts the 4-4-4-4 breathwork pattern"
            disabled={hasStarted}
            onPress={hasStarted ? undefined : handleStart}
            style={({ pressed }) => [
              styles.phaseCard,
              {
                borderColor: theme.border ?? theme.borderMuted,
              },
              pressed && !hasStarted && styles.phaseCardPressed,
              hasStarted && styles.phaseCardDisabled,
            ]}
          >
            <View style={styles.phaseTopRow}>
              <View style={styles.phaseTitleBlock}>
                <Text style={styles.phaseLabel}>
                  {currentPhase.label.toUpperCase()}
                </Text>
                <Text style={styles.phaseStartPrompt}>
                  {hasStarted ? "Breathwork in progress" : "Tap start to begin"}
                </Text>
              </View>

              <View style={styles.phaseActions}>
                <View
                  style={[
                    styles.phaseStartBadge,
                    {
                      backgroundColor: hasStarted
                        ? theme.surfaceMuted
                        : detail.palette.accent,
                      borderColor: hasStarted
                        ? theme.borderMuted
                        : detail.palette.accent,
                    },
                  ]}
                >
                  <Ionicons
                    name="play"
                    size={14}
                    color={hasStarted ? theme.textSecondary : theme.buttonPrimaryText}
                  />
                  <Text
                    style={[
                      styles.phaseStartText,
                      {
                        color: hasStarted
                          ? theme.textSecondary
                          : theme.buttonPrimaryText,
                      },
                    ]}
                  >
                    Start
                  </Text>
                </View>

                <View
                  style={[
                    styles.phasePill,
                    {
                      backgroundColor: detail.palette.tagBg,
                      borderColor: detail.palette.tagBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.phasePillText,
                      { color: detail.palette.tagText },
                    ]}
                  >
                    {secondsRemaining}s
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.phaseCue}>{phaseCue}</Text>

            <View style={styles.metricRow}>
              <View style={styles.metricBlock}>
                <Text style={styles.metricValue}>
                  {phaseIndex + 1}/{phases.length}
                </Text>
                <Text style={styles.metricLabel}>Phase</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricBlock}>
                <Text style={styles.metricValue}>{currentRound}</Text>
                <Text style={styles.metricLabel}>Round</Text>
              </View>
            </View>
          </Pressable>

          <View style={[styles.motionCard, { borderColor: theme.border ?? theme.borderMuted }]}>
            <BreathMotionCanvas
              motionVariant={motionVariant}
              currentPhase={currentPhase}
              phaseIndex={phaseIndex}
              phaseProgress={phaseProgress}
              motionSize={motionSize}
              accent={detail.palette.accent}
              shadow={theme.shadow}
              typography={typography}
              textSecondary={theme.textSecondary}
              surface={theme.surface}
              motionCoreStart={motionCoreStart}
              motionCoreEnd={motionCoreEnd}
              motionGlow={motionGlow}
              motionFrameBorder={motionFrameBorder}
            />
          </View>

          <View style={styles.sequenceCard}>
            <Text style={styles.sequenceLabel}>SEQUENCE</Text>
            <View style={styles.sequenceRow}>
              {phases.map((phase, index) => {
                const selected = index === phaseIndex;
                return (
                  <View
                    key={`${phase.label}-${phase.seconds}-${index}`}
                    style={[
                      styles.sequenceChip,
                      selected && [
                        styles.sequenceChipSelected,
                        {
                          borderColor: detail.palette.accent,
                          backgroundColor: detail.palette.accentSoft,
                        },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.sequenceChipLabel,
                        {
                          color: selected
                            ? detail.palette.accent
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {phase.label}
                    </Text>
                    <Text
                      style={[
                        styles.sequenceChipValue,
                        {
                          color: selected
                            ? detail.palette.accent
                            : theme.textPrimary,
                        },
                      ]}
                    >
                      {phase.seconds}s
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>WHY THIS RHYTHM</Text>
            <Text style={styles.insightText}>{detail.context}</Text>
            <Text style={styles.insightSubtext}>{detail.benefits[0]}</Text>
            <View style={styles.tipRow}>
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={detail.palette.accent}
              />
              <Text style={styles.tipText}>{detail.tips[0]}</Text>
            </View>
          </View>
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
      height: 300,
      borderRadius: 32,
      overflow: "hidden",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.06)",
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
      top: -36,
      right: -12,
      width: 160,
      height: 160,
      borderRadius: 999,
      opacity: 0.8,
    },
    heroGlowSecondary: {
      position: "absolute",
      bottom: -50,
      left: -24,
      width: 180,
      height: 180,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.1)",
      opacity: 0.56,
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
    motionCard: {
      borderRadius: 32,
      borderWidth: 1,
      borderColor: theme.border ?? theme.borderMuted,
      alignItems: "center",
      overflow: "hidden",
      backgroundColor: theme.surface,
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    phaseCard: {
      borderRadius: 28,
      padding: spacing.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border ?? theme.borderMuted,
      gap: spacing.md,
    },
    phaseCardPressed: {
      transform: [{ scale: 0.99 }],
    },
    phaseCardDisabled: {
      opacity: 0.84,
    },
    phaseTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    phaseTitleBlock: {
      flex: 1,
      gap: 4,
    },
    phaseLabel: {
      ...typography.h2,
      color: theme.textPrimary,
      letterSpacing: -0.2,
    },
    phaseStartPrompt: {
      ...typography.caption,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    phaseActions: {
      alignItems: "flex-end",
      gap: 8,
    },
    phaseStartBadge: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
    },
    phaseStartText: {
      ...typography.smallCaption,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },
    phasePill: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    phasePillText: {
      ...typography.smallCaption,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },
    phaseCue: {
      ...typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    metricRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingTop: spacing.xs,
    },
    metricBlock: {
      flex: 1,
      alignItems: "center",
    },
    metricValue: {
      ...typography.h3,
      color: theme.textPrimary,
    },
    metricLabel: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 4,
    },
    metricDivider: {
      width: 1,
      height: 38,
      backgroundColor: theme.borderMuted ?? "rgba(255,255,255,0.08)",
    },
    sequenceCard: {
      borderRadius: 28,
      padding: spacing.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border ?? theme.borderMuted,
      gap: spacing.md,
    },
    sequenceLabel: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    sequenceRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    sequenceChip: {
      minWidth: 92,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.08)",
      backgroundColor: theme.surfaceMuted,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 2,
    },
    sequenceChipSelected: {
      borderWidth: 1,
    },
    sequenceChipLabel: {
      ...typography.smallCaption,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },
    sequenceChipValue: {
      ...typography.button,
      fontSize: 14,
      lineHeight: 18,
    },
    insightCard: {
      borderRadius: 28,
      padding: spacing.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border ?? theme.borderMuted,
      gap: spacing.sm,
    },
    insightLabel: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    insightText: {
      ...typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    insightSubtext: {
      ...typography.caption,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    tipText: {
      flex: 1,
      ...typography.caption,
      color: theme.textSecondary,
      lineHeight: 18,
    },
  });
