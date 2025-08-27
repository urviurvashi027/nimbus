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
import { themeColors } from "@/constant/theme/Colors";

const QuestionScreen = ({
  questionData,
  totalSteps,
  color,
  currentStep,
  onAnswerSelect,
  onNext,
}: any) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme, color);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onOptionSelect = (option: any) => {
    setSelectedOption(option);
    onAnswerSelect(questionData.id, questionData.category, option);
  };

  const onNextClick = () => {
    if (selectedOption) {
      setSelectedOption(null);
      onNext();
    }
  };

  return (
    <View style={styles.questionContainer}>
      {/* Top Bar */}

      <TouchableOpacity style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={themeColors.basic.primaryColor}
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>

      <View style={styles.questionProgress}>
        {/* Question Progress */}
        <Text style={styles.questionNumber}>
          Question {currentStep}/{totalSteps}
        </Text>
        <ProgressBar
          progress={currentStep / totalSteps}
          color={themeColors.basic.primaryColor}
          style={styles.progressBar}
        />
      </View>

      {/* Question */}
      <View style={styles.questionDetails}>
        <Text style={styles.selectAnswerText}>Select an answer</Text>
        <Text style={styles.questionText}>{questionData.question}</Text>

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

        <TouchableOpacity style={styles.nextButton} onPress={onNextClick}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuestionScreen;

const styling = (theme: ThemeKey, color: string) =>
  StyleSheet.create({
    /** Result Screen **/
    questionContainer: {
      flex: 1,
      paddingVertical: 16,
      minHeight: 120,
      // backgroundColor: themeColors.basic.primaryColor,
    },
    questionDetails: {
      padding: 20,
      paddingBottom: 60,
      borderRadius: 20,
      backgroundColor: themeColors.basic.primaryColor,
    },
    selectAnswerText: {
      color: themeColors.basic.lightGrey,
      fontSize: 13,
      paddingBottom: 5,
    },
    questionNumber: {
      fontSize: 16,
      color: themeColors.basic.primaryColor,
      marginBottom: 10,
    },
    questionProgress: {
      paddingVertical: 45,
    },
    progressBar: {
      height: 6,
      borderRadius: 5,
      marginBottom: 20,
      // opacity: 0.1,
      backgroundColor: color,
    },
    //new
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    backText: {
      fontSize: 24,
      color: themeColors.basic.primaryColor,
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

    backButton: { position: "absolute", top: 10, left: 0 },
    questionText: {
      fontSize: 20,
      minHeight: 70,
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
      backgroundColor: themeColors.basic.primaryColor,
      padding: 15,
      borderWidth: 1,
      borderColor: themeColors.basic.lightGrey,
      borderRadius: 30,
      marginBottom: 10,
      alignItems: "center",
    },
    optionText: {
      fontSize: 16,
      // fontWeight: "bold",
      color: themeColors[theme].text,
      // backgroundColor: themeColors[theme].text,
    },
    nextButton: {
      backgroundColor: color,
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
      marginTop: 20,
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColors.basic.primaryColor,
    },
  });
