import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { ProgressBar } from "react-native-paper"; // For progress bar
import { Ionicons } from "@expo/vector-icons"; // For icons
import { themeColors } from "@/constant/Colors";

const JournalModal = ({ visible, onClose, questions }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [showResult, setShowResult] = useState(false);

  // useEffect(() => {
  //   console.log(questions.length, "i am called");
  //   setShowResult(false);
  // }, []);

  const handleNext = () => {
    if (!answers[0]) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log("answer", answers);
    } else {
      const hasEmpty = answers.some((item) => item.trim() === "");
      if (hasEmpty) {
        console.log("Cannot proceed, array has empty strings");
      } else {
        const result = answers.map((item: any, index: number) => ({
          question: index + 1,
          value: item,
        }));
        console.log(result, "result");
        setShowResult(true);

        // onClose(result); // Close modal when all questions are answered
      }
    }
  };

  const onModalClose = () => {
    setShowResult(false);
    onClose();
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
        <TouchableOpacity style={styles.backButton} onPress={onModalClose}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {showResult ? (
          <>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Successfullly logged your journal !!
              </Text>
              <Image
                style={styles.image}
                source={require("../../../assets/images/success.jpg")}
              ></Image>
              <View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onModalClose}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View>
            <View style={styles.questionProgress}>
              {/* Question Progress */}
              <Text style={styles.questionNumber}>
                Question {currentIndex + 1}/{questions.length}
              </Text>
              <ProgressBar
                progress={(currentIndex + 1) / questions.length}
                color="#6C5CE7"
                style={styles.progressBar}
              />
            </View>
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
                const res = {
                  currentIndex: text,
                };
                // const newData = [...newAnswers, res];
                setAnswers(newAnswers);
              }}
              multiline
            />
            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 46,
    minHeight: 120,
    paddingHorizontal: 20,
    // backgroundColor: "#fff",
    // justifyContent: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: themeColors.basic.primaryColor,
    borderRadius: 10,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: themeColors.basic.secondaryColor,
  },
  closeText: {
    fontSize: 16,
    color: themeColors.basic.mediumGrey,
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  backButton: {
    position: "absolute",
    top: 90,
    left: 20,
  },
  resultContainer: {
    paddingTop: 95,
    alignContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    color: themeColors.basic.mediumGrey,
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    color: themeColors.basic.mediumGrey,
    marginBottom: 10,
  },
  questionProgress: {
    paddingTop: 85,
    paddingBottom: 40,
  },
  progressBar: {
    height: 6,
    borderRadius: 5,
    marginBottom: 10,
    // opacity: 0.1,
    // backgroundColor: color,
    // height: 8,
    // borderRadius: 5,
    // marginTop: 80,
    // marginBottom: 20,
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
    minHeight: "50%",
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
