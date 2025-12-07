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

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";

import MentalHealthTestDetails from "@/components/selfCare/mentalTest/getStartedScreen/MentalHealthTestDetails";
import MentalHealthQuestion from "@/components/selfCare/mentalTest/getStartedScreen/MentalHealthQuestion";
import MentalHealthTestResult, {
  ResultData,
} from "@/components/selfCare/mentalTest/getStartedScreen/MentalHealthTestResult";
import MedicalTestShell from "@/components/selfCare/mentalTest/getStartedScreen/MedicalTestShell";
import MedicalTestHeader from "@/components/selfCare/mentalTest/getStartedScreen/MentalTestHeader";

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

const MentalHealthGetStartedScreen: React.FC = () => {
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

  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

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
    console.log(questionId, category, selectedOption, "selected option");
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

  const resultData: ResultData = useMemo(() => {
    // You can later wire this to real backend messaging
    return {
      title: "Courageous Optimist",
      quote: "“Life is 10% what happens to us and 90% how we react to it.”",
      image: "result",
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

  // const bgColor = medicalTestDetails?.color ?? newTheme.background;

  return (
    <ScreenView
      // bgColor={bgColor}
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
            <MentalHealthTestResult data={resultData} />
          )}

          {!isLoading &&
            typeof currentStep === "number" &&
            currentStep > 0 &&
            medicalTestDetails && (
              <MentalHealthQuestion
                questionData={medicalTestDetails.questions[currentStep - 1]}
                totalSteps={medicalTestDetails.questions.length}
                // color={medicalTestDetails.progressBarBg}
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
// Styles
// ────────────────────────────────────────────────────────────────

const styling = (newTheme: any, spacing: any, typography: any) =>
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

export default MentalHealthGetStartedScreen;
