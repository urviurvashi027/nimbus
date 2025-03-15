import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";

const QuestionScreen = ({
  questionData,
  totalSteps,
  currentStep,
  onAnswerSelect,
  onNext,
}: any) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onOptionSelect = (option: any) => {
    console.log(option, questionData.id, "option selected");
    setSelectedOption(option);
    onAnswerSelect(questionData.id, questionData.category, option);
  };

  const onNextClick = () => {
    setSelectedOption(null);
    onNext();
  };

  return (
    <View style={styles.questionContainer}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.closeText}>Close</Text>
      </View>

      {/* Question Progress */}
      <Text style={styles.questionNumber}>
        Question {currentStep}/{totalSteps}
      </Text>
      <ProgressBar
        progress={currentStep / totalSteps}
        color={themeColors.basic.secondaryColor}
        style={styles.progressBar}
      />

      {/* Question */}
      <View>
        <Text style={styles.questionText}>{questionData.question}</Text>

        {/* /end/ */}
        {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={themeColors[theme].text} />
      </TouchableOpacity> */}

        {/* <Text style={styles.questionNumber}>
        Question {currentStep}/{totalSteps}
      </Text>
      <ProgressBar
        progress={currentStep / totalSteps}
        color="white"
        style={styles.progressBar}
      />

      <Text style={styles.questionText}>{questionData.question}</Text> */}

        {questionData.image && (
          <Image source={questionData.image} style={styles.questionImage} />
        )}

        {/* Options */}
        {questionData.options.map((option: any, index: any) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => onOptionSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        {/* <FlatList
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
      /> */}

        <TouchableOpacity style={styles.nextButton} onPress={onNextClick}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuestionScreen;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    /** Result Screen **/
    questionContainer: {
      flex: 1,
      padding: 16,
      // backgroundColor: themeColors.basic.primaryColor,
    },
    questionNumber: {
      fontSize: 16,
      color: themeColors[theme].text,
      marginBottom: 5,
    },
    progressBar: { height: 6, borderRadius: 5, marginBottom: 20 },
    //new
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    backText: {
      fontSize: 24,
      color: themeColors[theme].text,
    },
    closeText: {
      fontSize: 16,
      color: themeColors[theme].text,
      // color: "white",
    },
    selectedOption: {
      backgroundColor: "#A29BFE",
    },
    selectedOptionText: {
      color: themeColors[theme].text,
      // color: "white",
    },
    //end

    backButton: { position: "absolute", top: 50, left: 20 },
    questionText: {
      fontSize: 20,
      fontWeight: "bold",
      color: themeColors[theme].text,
      marginBottom: 20,
    },
    questionImage: {
      width: "100%",
      height: 150,
      borderRadius: 10,
      marginBottom: 10,
    },
    optionButton: {
      // themeColors.basic.secondaryColor
      backgroundColor: themeColors.basic.secondaryColor,
      padding: 15,
      borderRadius: 30,
      marginBottom: 10,
      alignItems: "center",
    },
    optionText: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeColors[theme].text,
      // backgroundColor: themeColors[theme].text,
    },
    nextButton: {
      backgroundColor: "#A2CADE",
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
      marginTop: 20,
    },
    nextButtonText: { fontSize: 18, fontWeight: "bold" },
  });
