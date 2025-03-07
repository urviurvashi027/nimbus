import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import testData from "@/constant/data/medicalTest";
import StartScreen from "@/components/tools/medicalTest/GetStarted";
import ResultScreen from "@/components/tools/medicalTest/Result";
import QuestionScreen from "@/components/tools/medicalTest/QuestionScreen";

const MedicalTestScreen = () => {
  const [currentStep, setCurrentStep] = useState<number | "result">(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleStartTest = () => setCurrentStep(1);

  const handleAnswerSelect = (questionId: any, answer: any) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleNext = () => {
    if (
      typeof currentStep === "number" &&
      currentStep < testData.questions.length
    ) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep("result"); // Go to result screen
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 0 ? (
        <StartScreen onStart={handleStartTest} />
      ) : currentStep === "result" ? (
        <ResultScreen />
      ) : (
        <QuestionScreen
          questionData={testData.questions[currentStep - 1]}
          totalSteps={testData.questions.length}
          currentStep={currentStep}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
        />
      )}
    </View>
  );
};

export default MedicalTestScreen;

const styles = StyleSheet.create({
  /** Result Screen **/
  container: {
    flex: 1,
    // backgroundColor: themeColors[theme].background,
    paddingHorizontal: 16,
  },
});
