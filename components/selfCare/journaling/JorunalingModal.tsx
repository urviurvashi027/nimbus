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
import {
  getJournalEntry,
  submitJournalEntry,
} from "@/services/selfCareService";

const JournalModal = ({ visible, onClose, questions, templateId }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (!answers[0]) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const hasEmpty = answers.some((item: any) => item.answer?.trim() === "");
      if (hasEmpty) {
        console.log("Cannot proceed, array has empty strings");
      } else {
        const res = {
          template_id: templateId,
          answers: answers,
        };
        submitJournal(res);
      }
    }
  };

  const submitJournal = async (data: any) => {
    try {
      const result = await submitJournalEntry!(data);
      if (result.status === "success") {
        setShowResult(true);
        getJournalListData();
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const onModalClose = () => {
    setShowResult(false);
    onClose();
  };

  useEffect(() => {
    if (visible && questions.length) {
      setCurrentIndex(0);
      setAnswers(
        questions.map((q: any, index: number) => {
          return {
            id: q.id ?? index + 1,
            answer: "",
          };
        })
      );
    }
  }, [questions, visible]);

  const getJournalListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getJournalEntry();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        console.log(result);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

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
            <Text style={styles.question}>{questions[currentIndex]?.text}</Text>
            {/* Answer Input */}
            <TextInput
              style={styles.input}
              placeholder="Type your response here..."
              value={answers[currentIndex]?.answer ?? ""}
              onChangeText={(text) => {
                const newAnswers = [...answers];
                if (newAnswers[currentIndex]) {
                  newAnswers[currentIndex].answer = text;
                  setAnswers(newAnswers);
                }
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
