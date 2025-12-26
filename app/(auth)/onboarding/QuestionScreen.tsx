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
import * as SecureStore from "expo-secure-store";
import { format } from "date-fns";

import { ONBOARDING_QUESTIONS } from "../../../constant/data/onboardingQuestion";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import OnboardingHeader from "./component/OnboardingHeader";
import SignaturePad, { SignaturePadRef } from "./component/SignaturePad";
import ChoiceItem from "./component/ChoiceItem";
import InlineTimePicker from "@/components/common/ThemedComponent/InlinedTimePicker";

import { StoreKey } from "@/constant/Constant";
import { useAuth } from "@/context/AuthContext";
import {
  OnboardingQuestion,
  fetchOnboardingQuestions,
} from "@/services/onboardingService";

const OnboardingFlow = () => {
  const navigation = useNavigation();
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const { resetToPublic, markOnboardingDone } = useAuth();

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pendingSigNext, setPendingSigNext] = useState(false);
  const sigRef = useRef<SignaturePadRef | null>(null);

  const question = questions[step];
  const TOTAL = questions.length;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // ✅ Fetch questions from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingQuestions(true);
        const res = await fetchOnboardingQuestions();
        if (res?.success && Array.isArray(res?.data?.questions)) {
          setQuestions(res.data.questions);
          setStep(0);
          return;
        }
        alert(res?.message ?? "Unable to load onboarding questions.");
      } catch (e: any) {
        alert(e?.message ?? "Unable to load onboarding questions.");
      } finally {
        setLoadingQuestions(false);
      }
    };
    load();
  }, []);

  // Optional: Android hardware back
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleOnBack();
      return true; // prevent default
    });
    return () => sub.remove();
  }, [step]);

  const handleOnBack = async () => {
    if (step > 0) {
      setStep((s) => Math.max(0, s - 1));
    } else {
      await resetToPublic?.(); // ✅ this will stop the guard from pulling you back
    }
  };

  // called when user signs on signature pad
  const onSignatureOK = (dataUrl: string) => {
    // setAnswers((prev) => ({ ...prev, [question.id]: dataUrl }));

    // if user pressed Continue, proceed automatically once we have data
    if (pendingSigNext) {
      setPendingSigNext(false);
      if (step < TOTAL - 1) setStep(step + 1);
      else finishOnboarding(); // we'll add this helper below
    }
  };

  const finishOnboarding = async () => {
    try {
      setIsSubmitting(true);
      // console.log(answers, "ans");
      await markOnboardingDone?.();
      await SecureStore.setItemAsync(StoreKey.ONBOARDING_DONE_KEY, "true");
      router.replace("/(auth)/onboarding/welcomeKickoff");
      console.log("ONBOARDING_DONE set to true");
      //  router.replace("/(auth)/(tabs)"); // ✅ only this
    } catch (err) {
      console.error(err);
      alert("Error Unable to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = async () => {
    if (question.type === "signature") {
      const sig = answers[question.id];

      // If we don't have signature yet, capture it automatically
      if (!sig) {
        setPendingSigNext(true);
        sigRef.current?.read(); // triggers onOK if there's content
        // if empty, onEmpty will fire and pendingSigNext should be cancelled there
        return;
      }
    }

    if (step < TOTAL - 1) setStep(step + 1);
    else await finishOnboarding();
  };

  const clearSignature = () => {
    sigRef.current?.clear();
    setAnswers((prev) => ({ ...prev, [question.id]: null }));
  };

  const toggleAnswer = (choiceId: string) => {
    if (!question) return;
    if (question.type === "single") {
      setAnswers((prev) => ({ ...prev, [question.id]: choiceId }));
      return;
    } else if (question.type === "multiple") {
      setAnswers((prev) => {
        const existing: string[] = prev[question.id] || [];
        const next = existing.includes(choiceId)
          ? existing.filter((x) => x !== choiceId)
          : [...existing, choiceId];
        return { ...prev, [question.id]: next };
      });
    }
  };

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
              // onEmpty={() => setAnswers((p) => ({ ...p, [question.id]: null }))}
              onEmpty={() => {
                setPendingSigNext(false);
                setAnswers((p) => ({ ...p, [question.id]: null }));
                alert("Please add your signature to continue.");
              }}
              penColor={newTheme.accent}
              backgroundColor={newTheme.surface}
              style={{ height: 260 }}
            />

            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Pressable
                style={[
                  styles.smallBtn,
                  {
                    backgroundColor: newTheme.surface,
                    borderWidth: 1,
                    borderColor: newTheme.border,
                  },
                ]}
                onPress={clearSignature}
              >
                <Text
                  style={{ color: newTheme.textPrimary, fontWeight: "700" }}
                >
                  Clear signature
                </Text>
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

const styling = (newTheme: any) =>
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
      borderRadius: 12,
    },
  });

export default OnboardingFlow;
