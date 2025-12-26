import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { format } from "date-fns";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import OnboardingHeader from "./component/OnboardingHeader";
import ChoiceItem from "./component/ChoiceItem";
import InlineTimePicker from "@/components/common/ThemedComponent/InlinedTimePicker";
import SignaturePad, { SignaturePadRef } from "./component/SignaturePad";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import { useAuth } from "@/context/AuthContext";

import {
  PersonaQuestion, // or OnboardingQuestion (use your actual type name)
  // PersonaAnswerValue,
  // PersonaAnswersMap,
  fetchPersonaQuestions,
  submitPersonaAnswers,
} from "@/services/onboardingService";

import { serializePersonaAnswers } from "@/services/onboardingService";

const SIGNATURE_LOCAL_ID = -999; // local-only id (we will NOT send this to backend)

const makeSignatureQuestion = (): PersonaQuestion => ({
  id: SIGNATURE_LOCAL_ID,
  title: "Confirm & sign ✍️",
  subtitle: "This is only for your record — we won’t upload your signature.",
  type: "signature",
  choices: [],
});

export default function OnboardingFlow() {
  const navigation = useNavigation();
  const { newTheme } = useContext(ThemeContext);
  const styles = useMemo(() => styling(newTheme), [newTheme]);

  const { resetToPublic, markOnboardingDone, getUserDetails } = useAuth();

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<PersonaQuestion[]>([]);
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<any>({});
  const [errMsg, setErrMsg] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // signature
  const sigRef = useRef<SignaturePadRef | null>(null);
  const [pendingSigNext, setPendingSigNext] = useState(false);

  const question = questions[step];
  const TOTAL = questions.length;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ✅ Fetch questions from backend and append signature as the LAST step
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingQuestions(true);
        setErrMsg("");

        console.log("Fetching persona questions...");

        const res = await fetchPersonaQuestions();

        // Contract: { success, message, data: PersonaQuestion[] }
        if (res?.success && Array.isArray(res?.data)) {
          const list = [...res.data, makeSignatureQuestion()];
          setQuestions(list);
          setStep(0);
          return;
        }

        setErrMsg(res?.message ?? "Unable to load onboarding questions.");
      } catch (e: any) {
        setErrMsg(
          typeof e?.message === "string"
            ? e.message
            : "Unable to load onboarding questions."
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    load();
  }, []);

  // Android hardware back
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleOnBack();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, questions.length]);

  const handleOnBack = async () => {
    setErrMsg("");
    if (step > 0) setStep((s) => Math.max(0, s - 1));
    else await resetToPublic?.();
  };

  // -------------------------
  // Validation per step
  // -------------------------
  const validateCurrentStep = () => {
    if (!question) return "Loading…";

    const v = answers[question.id];

    if (question.type === "single") {
      if (!v || typeof v !== "string") return "Please select one option.";
    }

    if (question.type === "multiple") {
      if (!Array.isArray(v) || v.length === 0)
        return "Please select at least one option.";
    }

    if (question.type === "time") {
      if (!(v instanceof Date)) return "Please select a time.";
    }

    if (question.type === "signature") {
      // we only gate on "completed", not image
      if (v !== true) return "Please sign to continue.";
    }

    return "";
  };

  // -------------------------
  // Answer toggles
  // -------------------------
  const toggleAnswer = (choiceId: string) => {
    if (!question) return;
    setErrMsg("");

    if (question.type === "single") {
      setAnswers((prev: any) => ({ ...prev, [question.id]: choiceId }));
      return;
    }

    if (question.type === "multiple") {
      setAnswers((prev: any) => {
        const existing = Array.isArray(prev[question.id])
          ? (prev[question.id] as string[])
          : [];
        const next = existing.includes(choiceId)
          ? existing.filter((x) => x !== choiceId)
          : [...existing, choiceId];
        return { ...prev, [question.id]: next };
      });
    }
  };

  const setTime = (d: Date) => {
    if (!question) return;
    setErrMsg("");
    setAnswers((prev: any) => ({ ...prev, [question.id]: d }));
  };

  // -------------------------
  // Signature handlers (no upload)
  // -------------------------
  const onSignatureOK = (_dataUrl: string) => {
    if (!question) return;

    // mark local boolean only
    setAnswers((prev: any) => ({ ...prev, [question.id]: true }));

    if (pendingSigNext) {
      setPendingSigNext(false);
      goNextOrSubmit();
    }
  };

  const clearSignature = () => {
    if (!question) return;
    sigRef.current?.clear();
    setAnswers((prev: any) => ({ ...prev, [question.id]: false }));
  };

  // -------------------------
  // Submit to backend (omit signature)
  // -------------------------
  const buildSubmitPayload = () => {
    const payload: Record<string, any> = {};

    Object.entries(answers).forEach(([qidStr, val]) => {
      const qid = Number(qidStr);

      // ❌ do not send signature at all
      if (qid === SIGNATURE_LOCAL_ID) return;

      // ✅ convert Date to what backend expects
      if (val instanceof Date) {
        // safest: send ISO; if backend expects "HH:mm:ss", switch to format(val, "HH:mm:ss")
        payload[String(qid)] = val.toISOString();
        return;
      }

      payload[String(qid)] = val;
    });
    console.log(payload, "payload");
    return payload;
  };

  const finishOnboarding = async () => {
    try {
      setSubmitting(true);
      setErrMsg("");

      const payload = serializePersonaAnswers(answers, {
        skipIds: [SIGNATURE_LOCAL_ID],
      });
      const res = await submitPersonaAnswers(payload);

      // const payload = buildSubmitPayload();
      // const res = await submitPersonaAnswers({ answers: payload });

      if (res.success) await getUserDetails?.();

      if (!res?.success) {
        setErrMsg(
          res?.message ?? "Unable to submit answers. Please try again."
        );
        return;
      }

      // ✅ mark onboarding done AFTER successful submit
      await markOnboardingDone?.();

      router.replace("/(auth)/onboarding/welcomeKickoff");
    } catch (e: any) {
      setErrMsg(
        typeof e?.message === "string"
          ? e.message
          : "Unable to finish onboarding. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goNextOrSubmit = async () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else await finishOnboarding();
  };

  const next = async () => {
    if (!question) return;

    setErrMsg("");

    // signature step: trigger read + proceed when onSignatureOK fires
    if (question.type === "signature") {
      const done = answers[question.id] === true;
      if (!done) {
        setPendingSigNext(true);
        sigRef.current?.read(); // triggers onOK if signature exists
        return;
      }
    }

    const e = validateCurrentStep();
    if (e) {
      setErrMsg(e);
      return;
    }

    await goNextOrSubmit();
  };

  // -------------------------
  // UI states
  // -------------------------
  if (loadingQuestions) {
    return (
      <ScreenView style={{ padding: 16 }} bgColor={newTheme.background}>
        <View style={{ marginTop: 80, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 12, color: newTheme.textSecondary }}>
            Loading your onboarding…
          </Text>
        </View>
      </ScreenView>
    );
  }

  if (!question) {
    return (
      <ScreenView style={{ padding: 16 }} bgColor={newTheme.background}>
        <View style={{ marginTop: 80 }}>
          <Text style={{ color: newTheme.textPrimary, fontSize: 18 }}>
            No onboarding questions found.
          </Text>
          {!!errMsg && (
            <Text style={{ marginTop: 10, color: newTheme.error }}>
              {errMsg}
            </Text>
          )}
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView
      style={{ padding: 10, marginTop: 0 }}
      bgColor={newTheme.background}
    >
      <View style={styles.container}>
        <OnboardingHeader
          step={step + 1}
          totalSteps={TOTAL}
          onBack={handleOnBack}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{question.title}</Text>
          {!!question.subtitle && (
            <Text style={styles.subtitle}>{question.subtitle}</Text>
          )}
        </View>

        {!!errMsg && (
          <Text style={[styles.errorText, { color: newTheme.error }]}>
            {errMsg}
          </Text>
        )}

        {question.type !== "time" && question.type !== "signature" && (
          <View style={{ marginTop: 10 }}>
            {question.choices?.map((c) => (
              <ChoiceItem
                key={c.id}
                choice={c}
                selected={
                  question.type === "single"
                    ? answers[question.id] === c.id
                    : Array.isArray(answers[question.id]) &&
                      (answers[question.id] as string[]).includes(c.id)
                }
                onPress={() => toggleAnswer(c.id)}
              />
            ))}
          </View>
        )}

        {question.type === "time" && (
          <View style={{ marginTop: 12 }}>
            <InlineTimePicker
              label="Select a time"
              value={
                answers[question.id] instanceof Date
                  ? (answers[question.id] as Date)
                  : new Date()
              }
              minuteStep={5}
              use12h={true}
              onChange={(d) => {
                // optional: you can store formatted string instead if backend expects HH:mm:ss
                console.log("Time picked:", d, format(d, "HH:mm:ss"));
                setTime(d);
              }}
            />
          </View>
        )}

        {question.type === "signature" && (
          <View style={{ marginTop: 12 }}>
            <SignaturePad
              ref={sigRef}
              onOK={onSignatureOK}
              onEmpty={() => {
                setPendingSigNext(false);
                setAnswers((p: any) => ({ ...p, [question.id]: false }));
                setErrMsg("Please sign to continue.");
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
                  style={{ color: newTheme.textPrimary, fontWeight: "600" }}
                >
                  Clear
                </Text>
              </Pressable>

              <View style={{ flex: 1 }} />
            </View>
          </View>
        )}

        <StyledButton
          label={submitting ? "Finishing…" : "Continue"}
          onPress={next}
          disabled={submitting}
          style={{ marginTop: 26 }}
        />
      </View>
    </ScreenView>
  );
}

const styling = (t: any) =>
  StyleSheet.create({
    container: { paddingTop: 10 },
    titleContainer: {},
    title: {
      marginTop: 22,
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      color: t.textPrimary,
      marginBottom: 8,
      lineHeight: 32,
    },
    subtitle: {
      textAlign: "center",
      fontSize: 14,
      color: t.textSecondary,
      lineHeight: 22,
      marginBottom: 14,
    },
    errorText: {
      textAlign: "center",
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
    },
    smallBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
    },
  });
