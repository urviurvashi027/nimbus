// app/(auth)/SelfCare/test/MedicalTestScreen.tsx

import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";

import MentalHealthTestDetails from "@/components/selfCare/mentalTest/MentalHealthTestDetails";
import QuestionScreen from "@/components/selfCare/mentalTest/QuestionScreen";
import TestResult from "@/components/selfCare/mentalTest/TestResult";

import testData, { medicalTestData } from "@/constant/data/medicalTest";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

type ScoreOption = "Never" | "Rarely" | "Sometimes" | "Often" | "VeryOften";

type StepState = number | "result";

type ResponseEntry = {
  category: string;
  score: number;
};

type ResponsesState = Record<number, ResponseEntry>;

type ResultRow = {
  label: string;
  score: number;
};

// score mapping
const scoreMapping: Record<ScoreOption, number> = {
  Never: 0,
  Rarely: 1,
  Sometimes: 2,
  Often: 3,
  VeryOften: 4,
};

// ────────────────────────────────────────────────────────────────
// Main Screen
// ────────────────────────────────────────────────────────────────

const MedicalTestScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepState>(0);
  const [responses, setResponses] = useState<ResponsesState>({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, ScoreOption>
  >({});
  const [medicalTestDetails, setMedicalTestDetails] = useState<
    medicalTestData | undefined
  >();

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  // Hide default header, we use custom Nimbus header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Load test details based on id from route
  useEffect(() => {
    if (!id) return;
    const testId = Array.isArray(id) ? id[0] : id;
    const found = testData.find((item) => item.id === testId);
    setMedicalTestDetails(found);
  }, [id]);

  // ────────────────────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────────────────────

  const handleStartTest = () => setCurrentStep(1);

  const getScore = (option: ScoreOption): number => scoreMapping[option];

  const handleAnswerSelect = (
    questionId: number,
    category: string,
    selectedOption: ScoreOption
  ) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
    setResponses((prev) => ({
      ...prev,
      [questionId]: { category, score: getScore(selectedOption) },
    }));
  };

  const handleNext = () => {
    if (!medicalTestDetails) return;

    if (
      typeof currentStep === "number" &&
      currentStep < medicalTestDetails.questions.length
    ) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep("result");
    }
  };

  // Reset when closing result
  const handleBackToStart = () => {
    setCurrentStep(0);
    setResponses({});
    setSelectedAnswers({});
  };

  // ────────────────────────────────────────────────────────────────
  // Scoring + Result formatting
  // ────────────────────────────────────────────────────────────────

  const calculated = useMemo(() => {
    const categoryScores: Record<string, number> = {};
    let totalScore = 0;

    Object.values(responses).forEach(({ category, score }) => {
      if (typeof score !== "number" || isNaN(score)) return;
      categoryScores[category] = (categoryScores[category] || 0) + score;
      totalScore += score;
    });

    const categoryPercentages: Record<string, number> = {};
    for (const category in categoryScores) {
      categoryPercentages[category] =
        totalScore > 0 ? (categoryScores[category] / totalScore) * 100 : 0;
    }

    return { totalScore, categoryScores, categoryPercentages };
  }, [responses]);

  const formattedScores: ResultRow[] = useMemo(() => {
    const rows: ResultRow[] = Object.entries(
      calculated.categoryPercentages
    ).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      score: Math.ceil(value),
    }));

    rows.push({ label: "Total Score", score: calculated.totalScore });
    return rows;
  }, [calculated]);

  const resultData = useMemo(() => {
    // You can later wire this to real backend messaging
    return {
      title: "Courageous Optimist",
      quote: "“Life is 10% what happens to us and 90% how we react to it.”",
      image: "anxietyRelease",
      description:
        "It appears from your responses that you’ve cultivated resilience despite early challenges. Take a moment to recognize both your strength and any parts of you that still need care and attention.",
      tips: [
        "Schedule gentle check-ins with a therapist or coach when you feel ready.",
        "Use journaling to notice patterns in your thoughts and emotions.",
        "Lean into safe relationships and communities that feel grounding.",
        "Engage in small daily rituals that make your nervous system feel safe: walks, breathwork, mindful tea, stretching.",
      ],
      result: [
        { label: "Household dysfunction", value: "0%" },
        { label: "Neglect", value: "9%" },
        { label: "Abuse", value: "9%" },
      ],
      results: formattedScores,
    };
  }, [formattedScores]);

  // ────────────────────────────────────────────────────────────────
  // Rendering helpers
  // ────────────────────────────────────────────────────────────────

  const isLoading = !medicalTestDetails;

  const bgColor = medicalTestDetails?.color ?? newTheme.background;

  return (
    <ScreenView
      bgColor={bgColor}
      style={{
        paddingHorizontal: 0,
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2
            : spacing.xl,
      }}
    >
      <View style={styles.container}>
        {/* Nimbus header is shared for all steps */}
        <MedicalTestHeader
          title={medicalTestDetails?.title ?? "Mental Health Test"}
          subtitle={medicalTestDetails?.description ?? ""}
          onBack={() =>
            currentStep === 0 ? navigation.goBack() : handleBackToStart()
          }
        />

        <MedicalTestShell>
          {isLoading && (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color={newTheme.accent} />
            </View>
          )}

          {!isLoading && currentStep === 0 && (
            <MentalHealthTestDetails
              onStart={handleStartTest}
              medicalTestData={medicalTestDetails}
            />
          )}

          {!isLoading && currentStep === "result" && (
            <TestResult data={resultData} />
          )}

          {!isLoading &&
            typeof currentStep === "number" &&
            currentStep > 0 &&
            medicalTestDetails && (
              <QuestionScreen
                questionData={medicalTestDetails.questions[currentStep - 1]}
                totalSteps={medicalTestDetails.questions.length}
                color={medicalTestDetails.progressBarBg}
                currentStep={currentStep}
                onAnswerSelect={handleAnswerSelect}
                onNext={handleNext}
              />
            )}
        </MedicalTestShell>
      </View>
    </ScreenView>
  );
};

// ────────────────────────────────────────────────────────────────
// Internal presentational components
// ────────────────────────────────────────────────────────────────

type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};

const MedicalTestHeader: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = headerStyles(newTheme, spacing, typography);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

type ShellProps = { children: React.ReactNode };

const MedicalTestShell: React.FC<ShellProps> = ({ children }) => {
  const { newTheme, spacing } = useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: newTheme.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
      }}
    >
      {children}
    </View>
  );
};

// ────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────

const styling = (
  theme: ThemeKey,
  newTheme: any,
  spacing: any,
  typography: any
) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

const headerStyles = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    textBlock: {
      paddingRight: spacing.lg,
    },
    title: {
      ...typography.h2,
      color: newTheme.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: newTheme.textSecondary,
      marginTop: spacing.xs,
    },
  });

export default MedicalTestScreen;
