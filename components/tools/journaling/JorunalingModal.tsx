import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { ProgressBar } from "react-native-paper"; // For progress bar
import { Ionicons } from "@expo/vector-icons"; // For icons

const JournalModal = ({ visible, onClose, questions }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose(); // Close modal when all questions are answered
    }
  };

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setAnswers(Array(questions.length).fill("")); // Reset answers as well if needed
    }
  }, [questions, visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Progress Bar */}
        <ProgressBar
          progress={(currentIndex + 1) / questions.length}
          color="#6C5CE7"
          style={styles.progressBar}
        />

        {/* Question */}
        <Text style={styles.question}>{questions[currentIndex]}</Text>

        {/* Answer Input */}
        <TextInput
          style={styles.input}
          placeholder="Type your response here..."
          value={answers[currentIndex]}
          onChangeText={(text) => {
            const newAnswers = [...answers];
            newAnswers[currentIndex] = text;
            setAnswers(newAnswers);
          }}
          multiline
        />

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 5,
    marginTop: 80,
    marginBottom: 20,
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    minHeight: 100,
    fontSize: 16,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default JournalModal;
