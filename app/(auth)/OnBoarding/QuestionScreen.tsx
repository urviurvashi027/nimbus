import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ONBOARDING_QUESTIONS } from "../../../constant/data/onboardingQuestion";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import ChoiceItem from "./component/ChoiceItem";
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import OnboardingHeader from "./component/OnboardingHeader";

const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const navigation = useNavigation();
  const { theme, newTheme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const styles = styling(theme, newTheme);

  const question = ONBOARDING_QUESTIONS[step];
  const TOTAL = ONBOARDING_QUESTIONS.length;

  const toggleAnswer = (id: string) => {
    if (question.type === "single") {
      setAnswers({ ...answers, [question.id]: id });
    } else if (question.type === "multiple") {
      const existing = answers[question.id] || [];
      setAnswers({
        ...answers,
        [question.id]: existing.includes(id)
          ? existing.filter((x: string) => x !== id)
          : [...existing, id],
      });
    }
  };

  const next = () => {
    if (step < TOTAL - 1) setStep(step + 1);
    else {
      console.log("Submit answers:", step, answers);
      router.push("/stateScreen/SuccessScreen");
    }
  };

  return (
    <ScreenView style={{ padding: 10, marginTop: 0 }}>
      <View style={styles.container}>
        <OnboardingHeader step={step + 1} totalSteps={TOTAL} />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{question.title}</Text>
          <Text style={styles.subtitle}>{question.subtitle}</Text>
        </View>

        {question.type !== "time" && (
          <View>
            {question.choices?.map((c) => (
              <ChoiceItem
                key={c.id}
                choice={c}
                selected={
                  question.type === "single"
                    ? answers[question.id] === c.id
                    : answers[question.id]?.includes(c.id)
                }
                onPress={() => toggleAnswer(c.id)}
              />
            ))}
          </View>
        )}

        {/* TODO: Time Picker UI for type==="time" */}

        <StyledButton
          label="Continue"
          onPress={next}
          style={{ marginTop: 30 }}
        />
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 10,
    },
    title: {
      marginTop: 30,
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      color: newTheme.textPrimary,
      marginBottom: 10,
      lineHeight: 32,
    },
    titleContainer: {
      //   textAlign: "center",
    },
    subtitle: {
      textAlign: "center",
      fontSize: 14,
      color: newTheme.textSecondary,
      lineHeight: 22,
      marginBottom: 20,
    },
    choiceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 2,
      borderColor: newTheme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    choiceText: {
      fontSize: 16,
      color: newTheme.textPrimary,
    },
  });

export default OnboardingFlow;
