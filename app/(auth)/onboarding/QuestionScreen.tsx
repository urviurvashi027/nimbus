import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  BackHandler,
} from "react-native";
import { router, useNavigation } from "expo-router";

import { ONBOARDING_QUESTIONS } from "../../../constant/data/onboardingQuestion";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import OnboardingHeader from "./component/OnboardingHeader";
import SignaturePad, { SignaturePadRef } from "./component/SignaturePad";
import ChoiceItem from "./component/ChoiceItem";
import InlineTimePicker from "@/components/common/ThemedComponent/InlinedTimePicker";
import { format } from "date-fns";

const LANDING_ROUTE = "/(public)/landingScreen"; // <-- change if your route is different

const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  const question = ONBOARDING_QUESTIONS[step];
  const TOTAL = ONBOARDING_QUESTIONS.length;

  // signature ref
  const sigRef = useRef<SignaturePadRef | null>(null);

  // called when user signs on signature pad
  const onSignatureOK = (dataUrl: string) => {
    // store the dataUrl (base64 image) in answers keyed by question.id
    setAnswers((prev) => ({ ...prev, [question.id]: dataUrl }));
  };

  const clearSignature = () => {
    sigRef.current?.clear();
    setAnswers((prev) => ({ ...prev, [question.id]: null }));
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
    // if signature step, must ensure signature present
    if (question.type === "signature") {
      const sig = answers[question.id];
      if (!sig) {
        alert(
          "Please sign to continue We need your signature to finish the contract."
        );
        return;
      }
    }
    if (step < TOTAL - 1) setStep(step + 1);
    else {
      try {
        setIsSubmitting(true);
        console.log("Submit answers:", step, answers);
        router.push("/onboarding/welcomeKickoff");
        // router.push("/stateScreen/SuccessScreen");
      } catch (err) {
        console.error(err);
        alert("Error Unable to submit. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // --- BACK: previous step or landing ---
  const handleOnBack = () => {
    if (step > 0) {
      setStep((s) => Math.max(0, s - 1));
    } else {
      // First question → leave the flow
      router.replace(LANDING_ROUTE);
    }
  };

  // Optional: Android hardware back
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleOnBack();
      return true; // prevent default
    });
    return () => sub.remove();
  }, [step]);

  return (
    <ScreenView style={{ padding: 10, marginTop: 0 }}>
      <View style={styles.container}>
        <OnboardingHeader
          step={step + 1}
          totalSteps={TOTAL}
          onBack={handleOnBack}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{question.title}</Text>
          <Text style={styles.subtitle}>{question.subtitle}</Text>
        </View>

        {question.type !== "time" && question.type !== "signature" && (
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

        {question.type === "time" && (
          <InlineTimePicker
            label="Select a time"
            value={
              // if user already picked, keep it; else default to now at minuteStep
              answers[question.id] instanceof Date
                ? answers[question.id]
                : new Date()
            }
            minuteStep={5}
            use12h={true}
            onChange={(d) => {
              const formatted = format(d, "HH:mm:ss");
              console.log("Time picked:", d, formatted);
              setAnswers((prev) => ({ ...prev, [question.id]: d }));
            }}
          />
        )}

        {/* Signature step render */}
        {question.type === "signature" && (
          <View style={{ marginTop: 12 }}>
            <SignaturePad
              ref={sigRef}
              onOK={onSignatureOK}
              onEmpty={() => setAnswers((p) => ({ ...p, [question.id]: null }))}
              penColor={newTheme.accent}
              backgroundColor={newTheme.surface}
              style={{ height: 260 }}
            />

            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              <Pressable
                style={[styles.smallBtn, { backgroundColor: newTheme.surface }]}
                onPress={() => clearSignature()}
              >
                <Text style={{ color: newTheme.textPrimary }}>Clear</Text>
              </Pressable>

              <Pressable
                style={[styles.smallBtn, { backgroundColor: newTheme.surface }]}
                onPress={() => sigRef.current?.read()}
              >
                <Text style={{ color: newTheme.textPrimary }}>Save</Text>
              </Pressable>

              <View style={{ flex: 1 }} />
            </View>
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
    smallBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
    },
  });

export default OnboardingFlow;
