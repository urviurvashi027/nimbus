import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import StyledButton from "@/components/common/themeComponents/StyledButton";

import {
  getJournalEntry,
  submitJournalEntry,
} from "@/services/selfCareService";

interface JournalModalProps {
  visible: boolean;
  onClose: (answers?: any[]) => void;
  questions: { id?: number; text: string }[];
  templateId?: number | string;
}

const ReflectionEntryModal: React.FC<JournalModalProps> = ({
  visible,
  onClose,
  questions = [],
  templateId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ id: number; answer: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  // Prepare local state when modal opens
  useEffect(() => {
    if (visible && questions.length) {
      setCurrentIndex(0);
      setShowResult(false);
      setSubmitting(false);
      setAnswers(
        questions.map((q, index) => ({
          id: q.id ?? index + 1,
          answer: "",
        }))
      );
    }
  }, [questions, visible]);

  const currentAnswer = answers[currentIndex]?.answer ?? "";
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCurrentEmpty = currentAnswer.trim().length === 0;

  const handleNext = async () => {
    if (isCurrentEmpty) return;

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // Last question → submit
    const hasEmpty = answers.some((item) => item.answer.trim() === "");
    if (hasEmpty) return;

    const payload = {
      template_id: templateId,
      answers,
    };
    await submitJournal(payload);
  };

  const submitJournal = async (data: any) => {
    try {
      setSubmitting(true);
      const result = await submitJournalEntry!(data);
      if (result?.status === "success") {
        setShowResult(true);
        await getJournalListData();
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    } finally {
      setSubmitting(false);
    }
  };

  const getJournalListData = async () => {
    try {
      const result = await getJournalEntry();
      if (result && Array.isArray(result)) {
        console.log(result);
      } else {
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const handleClose = () => {
    setShowResult(false);
    onClose(answers);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={newTheme.textSecondary}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Reflection Journal</Text>
              {/* Spacer to balance layout */}
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.headerDivider} />

            {showResult ? (
              // ✅ Success state
              <View style={styles.resultContainer}>
                <View style={styles.resultBadge}>
                  <Ionicons
                    name="checkmark"
                    size={28}
                    color={newTheme.buttonPrimaryText}
                  />
                </View>
                <Text style={styles.resultTitle}>Journal saved</Text>
                <Text style={styles.resultSubtitle}>
                  You’ve logged this reflection. Come back anytime to continue
                  your journey.
                </Text>
                {/* <Image
                  style={styles.image}
                  source={require("../../../assets/images/actionLogo/success.jpg")}
                /> */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Text style={styles.closeText}>Back to reflections</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // 📝 Question flow
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeaderRow}>
                    <Text style={styles.questionNumber}>
                      Question {currentIndex + 1} of {questions.length}
                    </Text>
                    <Text style={styles.progressPercent}>
                      {Math.round(
                        ((currentIndex + 1) / questions.length) * 100
                      )}
                      %
                    </Text>
                  </View>
                  <ProgressBar
                    progress={(currentIndex + 1) / questions.length}
                    color={newTheme.accent}
                    style={styles.progressBar}
                  />
                </View>

                {/* Question */}
                <Text style={styles.questionText}>
                  {questions[currentIndex]?.text}
                </Text>

                {/* Input card */}
                <View style={styles.inputCard}>
                  <TextInput
                    style={styles.input}
                    placeholder="Type your response here..."
                    placeholderTextColor={newTheme.textSecondary}
                    value={currentAnswer}
                    onChangeText={(text) => {
                      const updated = [...answers];
                      if (updated[currentIndex]) {
                        updated[currentIndex].answer = text;
                        setAnswers(updated);
                      }
                    }}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* Spacer so button doesn’t overlap content */}
                <View style={{ height: 80 }} />
              </ScrollView>
            )}

            {!showResult && (
              <View style={styles.bottomBar}>
                <StyledButton
                  label={isLastQuestion ? "Save Journal" : "Next"}
                  onPress={handleNext}
                  variant="primary"
                  fullWidth={true}
                  disabled={isCurrentEmpty || submitting}
                  loading={submitting}
                  style={{ marginTop: 12 }}
                />
                {/* <TouchableOpacity
                  style={[
                    styles.nextButton,
                    (isCurrentEmpty || submitting) && styles.nextButtonDisabled,
                  ]}
                  activeOpacity={isCurrentEmpty || submitting ? 1 : 0.9}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>
                    {isLastQuestion ? "Save Journal" : "Next"}
                  </Text>
                  <Ionicons
                    name={isLastQuestion ? "checkmark" : "arrow-forward"}
                    size={20}
                    color={newTheme.buttonPrimaryText}
                  />
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: newTheme.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
    },

    /* Header */
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      ...typography.h3,
      color: newTheme.textPrimary,
    },
    headerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: newTheme.borderMuted,
      marginBottom: spacing.lg,
    },

    /* Scroll content */
    scrollContent: {
      paddingBottom: spacing.lg,
    },

    /* Progress */
    progressSection: {
      marginBottom: spacing.lg,
    },
    progressHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
    questionNumber: {
      ...typography.caption,
      color: newTheme.textSecondary,
    },
    progressPercent: {
      ...typography.caption,
      color: newTheme.textSecondary,
    },
    progressBar: {
      height: 6,
      borderRadius: 999,
      backgroundColor: newTheme.surfaceMuted,
    },

    /* Question */
    questionText: {
      ...typography.h2,
      fontSize: 22,
      lineHeight: 30,
      color: newTheme.textPrimary,
      marginBottom: spacing.md,
    },

    /* Input card */
    inputCard: {
      backgroundColor: newTheme.surfaceMuted,
      borderRadius: 18,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: newTheme.borderMuted,
      minHeight: 220,
    },
    input: {
      ...typography.body,
      color: newTheme.textPrimary,
      minHeight: 180,
    },

    /* Bottom bar */
    bottomBar: {
      paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.md,
      paddingTop: spacing.sm,
      backgroundColor: newTheme.background,
    },
    nextButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: newTheme.buttonPrimary,
      borderRadius: 999,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      alignSelf: "center",
      minWidth: 220,
      shadowColor: newTheme.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
      columnGap: 6,
    },
    nextButtonDisabled: {
      opacity: 0.4,
    },
    nextButtonText: {
      ...typography.button,
      color: newTheme.buttonPrimaryText,
      marginRight: spacing.xs,
    },

    /* Result */
    resultContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    resultBadge: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: newTheme.buttonPrimary,
      marginBottom: spacing.md,
    },
    resultTitle: {
      ...typography.h2,
      color: newTheme.textPrimary,
      textAlign: "center",
      marginBottom: spacing.xs,
    },
    resultSubtitle: {
      ...typography.body,
      color: newTheme.textSecondary,
      textAlign: "center",
      marginBottom: spacing.md,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: spacing.lg,
      borderRadius: 24,
    },
    closeButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: newTheme.buttonPrimary,
      backgroundColor: "transparent",
    },
    closeText: {
      ...typography.button,
      color: newTheme.buttonPrimary,
    },
  });

export default ReflectionEntryModal;
