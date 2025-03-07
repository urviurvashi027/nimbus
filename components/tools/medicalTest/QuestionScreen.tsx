import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const QuestionScreen = ({
  questionData,
  totalSteps,
  currentStep,
  onAnswerSelect,
  onNext,
}: any) => (
  <View style={styles.questionContainer}>
    <TouchableOpacity style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>

    <Text style={styles.questionNumber}>
      Question {currentStep}/{totalSteps}
    </Text>
    <ProgressBar
      progress={currentStep / totalSteps}
      color="white"
      style={styles.progressBar}
    />

    <Text style={styles.questionText}>{questionData.question}</Text>

    {questionData.image && (
      <Image source={questionData.image} style={styles.questionImage} />
    )}

    <FlatList
      data={questionData.options}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onAnswerSelect(questionData.id, item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      )}
    />

    <TouchableOpacity style={styles.nextButton} onPress={onNext}>
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>
  </View>
);

export default QuestionScreen;

const styles = StyleSheet.create({
  /** Result Screen **/
  questionContainer: { flex: 1, padding: 16 },
  questionNumber: { fontSize: 18, color: "white", marginBottom: 5 },
  progressBar: { height: 6, borderRadius: 5, marginBottom: 20 },
  backButton: { position: "absolute", top: 50, left: 20 },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  questionImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  optionText: { fontSize: 16, fontWeight: "bold", color: "#6C5CE7" },
  nextButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: { fontSize: 18, fontWeight: "bold" },
});
