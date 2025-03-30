import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

import StartScreen from "@/components/tools/medicalTest/GetStarted";
import ResultScreen from "@/components/tools/medicalTest/Result";
import QuestionScreen from "@/components/tools/medicalTest/QuestionScreen";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";

import testData, { medicalTestData } from "@/constant/data/medicalTest";
import TestResult from "@/components/tools/medicalTest/TestResult";

type ScoreOption = "Never" | "Rarely" | "Sometimes" | "Often" | "VeryOften";
// Score mapping
const scoreMapping = {
  Never: 0,
  Rarely: 1,
  Sometimes: 2,
  Often: 3,
  VeryOften: 4,
};

const MedicalTestScreen = () => {
  const [responses, setResponses] = useState({});

  const [currentStep, setCurrentStep] = useState<number | "result">(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [medicalTestDetails, setMediacalTestDetails] = useState<
    medicalTestData | undefined
  >();
  const { id } = useLocalSearchParams();

  const handleStartTest = () => setCurrentStep(1);

  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // questionId, category, selectedOption;
  const handleAnswerSelect = (
    questionId: number,
    category: string,
    selectedOption: any
  ) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: selectedOption });
    setResponses((prev) => ({
      ...prev,
      [questionId]: { category, score: getScore(selectedOption) },
    }));
  };

  const getScore = (option: ScoreOption): number => scoreMapping[option];

  useEffect(() => {
    console.log(responses, "responses from useEffect");
  }, [responses]);
  // const getScore = () => {

  // }

  // Calculate Scores
  const calculateScores = () => {
    let totalScore = 0;
    let categoryScores: Record<string, number> = {};
    // let categoryScores = {};

    Object.values(responses).forEach(({ category, score }: any) => {
      if (typeof score !== "number" || isNaN(score)) {
        console.warn(`Invalid score detected for category ${category}:`, score);
        return;
      }
      categoryScores[category] = (categoryScores[category] || 0) + score;
      totalScore += score;
    });

    // Handle empty scores to prevent NaN issues
    if (totalScore === 0) {
      console.warn(
        "Total score is 0, ensuring category percentages are valid."
      );
    }

    // let categoryPercentages = {};
    let categoryPercentages: any = {};
    for (const category in categoryScores) {
      // (categoryPercentages["label"] = category),
      //   (categoryPercentages["value"] =
      //     totalScore > 0 ? (categoryScores[category] / totalScore) * 100 : 0);
      // { label: "Household dysfunction", value: "0%" },
      categoryPercentages[category] =
        totalScore > 0 ? (categoryScores[category] / totalScore) * 100 : 0;
    }

    console.log(
      { totalScore, categoryScores, categoryPercentages },
      "percentage result"
    );

    return { totalScore, categoryScores, categoryPercentages };
  };

  const generateChartData = (categoryPercentages: Record<string, number>) => {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ]; // Define a color set
    let colorIndex = 0;

    return Object.keys(categoryPercentages).map((category) => {
      const chartEntry = {
        name: category,
        population: categoryPercentages[category],
        color: colors[colorIndex % colors.length], // Assign a color dynamically
        legendFontColor: "#7F7F7F",
        legendFontSize: 14,
      };
      colorIndex++; // Increment color index for next category
      return chartEntry;
    });
  };

  const formattedScores = (data: any) => [
    ...Object.entries(data.categoryPercentages).map(([key, value]) => ({
      label: capitalizeFirstLetter(key),
      score: Math.ceil(value as number),
    })),
    { label: "Total Score", score: data.totalScore },
  ];

  // Utility to capitalize
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getResultData = () => {
    const scoreResult = calculateScores();
    // Normalize scores to percentages
    const chartDetails = generateChartData(scoreResult.categoryPercentages);
    console.log(formattedScores(scoreResult));
    const resultData = {
      title: "Courageous Optimist",
      quote: "“Life is 10% what happens to us and 90% how we react to it.”",
      image: "anxietyRelease",
      // description: medicalTestDetails?.description,
      description: `It appears from your responses that you have demonstrated a high level of resilience despite the difficult moments in your early years.
It may be helpful to acknowledge both the strength gained from overcoming challenges as well as any residual effects that might need attention.`,
      tips: [
        "Regular Check-ins With a Counselor: Even if you feel mostly okay, it’s good to have someone professional you can talk to when you need it.",
        "Journaling: Writing about your daily experiences can help you understand and manage your emotions better.",
        "Peer Support: Engage with friends or groups that share your interests to maintain a sense of connection.",
        "Skill Development: Activities such as workshops or online courses can help you focus on personal growth and build confidence.",
      ],
      result: [
        { label: "Household dysfunction", value: "0%" },
        { label: "Neglect", value: "9%" },
        { label: "Abuse", value: "9%" },
      ],
      // image: medicalTestDetails?.image,
      results: formattedScores(scoreResult),
      // chartDetails: chartDetails,
      //  scores: nedds to be added
    };
    console.log(resultData, "resultDataresultData");
    return resultData;
  };

  // useEffect(() => {
  //   console.log(selectedAnswers, "selectedAnswers");
  // }, [selectedAnswers]);

  const handleNext = () => {
    if (medicalTestDetails)
      if (
        typeof currentStep === "number" &&
        currentStep < medicalTestDetails.questions.length
      ) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep("result"); // Go to result screen
      }
  };

  const getTestDetails = (id: string | string[]) => {
    const res = testData.find((item, index) => item.id === id);
    setMediacalTestDetails(res);
    return res;
  };

  useEffect(() => {
    if (id) {
      const habitId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
      getTestDetails(id);
    }
  }, [id]);

  return (
    <ScreenView
      bgColor={medicalTestDetails?.color}
      style={{
        padding: 0,
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        // backgroundColor: "blue",
      }}
    >
      <View style={styles.container}>
        {currentStep === 0 ? (
          <StartScreen
            onStart={handleStartTest}
            medicalTestData={medicalTestDetails}
          />
        ) : currentStep === "result" ? (
          <TestResult data={getResultData()} />
        ) : (
          // <ResultScreen data={getResultData()} />
          <QuestionScreen
            questionData={medicalTestDetails?.questions[currentStep - 1]}
            totalSteps={medicalTestDetails?.questions.length}
            color={medicalTestDetails?.progressBarBg}
            // color="blue"
            currentStep={currentStep}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
          />
        )}
      </View>
    </ScreenView>
  );
};

export default MedicalTestScreen;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    /** Result Screen **/
    container: {
      flex: 1,
      // backgroundColor: "blue",
      // backgroundColor: themeColors[theme].background,
      // paddingHorizontal: 0,
    },
  });
