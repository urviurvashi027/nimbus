import React, { useContext, useCallback, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import InputField from "../common/ThemedComponent/StyledInput";
import { StyledButton } from "../common/ThemedComponent/StyledButton";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ReportFeedbackModal({ visible, onClose }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_LEN = 1000;

  const resetAndClose = useCallback(() => {
    setText("");
    setLoading(false);
    setSubmitted(false);
    onClose();
  }, [onClose]);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // simulate API call — replace with real call
      await new Promise((res) => setTimeout(res, 900));
      setSubmitted(true);
    } catch (err) {
      console.warn("Feedback submit failed", err);
      // optionally show a toast / alert here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={resetAndClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardWrapper}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.card}>
                {/* top back icon (same placement as ReportBugModal) */}
                <View style={styles.headerRow}>
                  <TouchableOpacity onPress={resetAndClose}>
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={newTheme.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.titleBlock}>
                    <Text style={styles.emoji}>💬</Text>
                    <Text style={styles.title}>Send Feedback</Text>
                    <Text style={styles.subtitle}>
                      Tell us what you love or what could be improved — short
                      and specific helps us act faster.
                    </Text>
                  </View>

                  {!submitted ? (
                    <>
                      <InputField
                        label="Feedback Details"
                        value={text}
                        onChangeText={(t) => setText(t.slice(0, MAX_LEN))}
                        placeholder="Enter your feedback..."
                        multiline
                        numberOfLines={6}
                        helperText={`${text.length} / ${MAX_LEN}`}
                        autoGrow
                        minHeight={120}
                        maxHeight={260}
                        inputStyle={{ fontSize: 15 }}
                      />

                      <View style={{ height: 16 }} />

                      <StyledButton
                        label={loading ? "Sending..." : "Submit"}
                        onPress={submit}
                        disabled={loading || !text.trim()}
                        style={{ borderRadius: 12 }}
                      />

                      <TouchableOpacity
                        style={styles.cancel}
                        onPress={resetAndClose}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.successBlock}>
                      <Text style={styles.successEmoji}>✅</Text>
                      <Text style={styles.successTitle}>
                        Thanks — feedback sent!
                      </Text>
                      <Text style={styles.successSubtitle}>
                        We received your feedback and will review it. Thanks for
                        helping improve Nimbus.
                      </Text>

                      <View style={{ height: 18 }} />

                      <StyledButton
                        label="Done"
                        onPress={() => {
                          resetAndClose();
                        }}
                      />
                    </View>
                  )}
                </ScrollView>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Tip: include device & OS version for faster debugging.
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)", // slightly darker than before so underlying settings are less visible
      justifyContent: "flex-end", // bottom-sheet style (same as ReportBugModal)
    },
    keyboardWrapper: {
      width: "100%",
    },
    safeArea: {
      width: "100%",
    },
    card: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingHorizontal: 18,
      paddingBottom: Platform.OS === "ios" ? 34 : 22,
      minHeight: 380,
      maxHeight: "90%",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: -6 },
      elevation: 12,
    },
    headerRow: {
      height: 36,
      justifyContent: "flex-start",
    },
    scroll: {
      marginTop: 6,
    },
    scrollContent: {
      paddingBottom: 8,
    },
    titleBlock: {
      alignItems: "center",
      marginBottom: 12,
    },
    emoji: {
      fontSize: 34,
      marginBottom: 8,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 6,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 13,
      textAlign: "center",
      maxWidth: 520,
    },
    cancel: {
      marginTop: 12,
      alignItems: "center",
    },
    cancelText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    successBlock: {
      alignItems: "center",
      paddingVertical: 22,
    },
    successEmoji: {
      fontSize: 36,
      marginBottom: 8,
    },
    successTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 6,
    },
    successSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      maxWidth: 520,
    },
    footer: {
      marginTop: 10,
      alignItems: "center",
    },
    footerText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
  });
