import React, { useContext, useState } from "react";
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
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "../common/ThemedComponent/StyledButton";
import InputField from "../common/ThemedComponent/StyledInput";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ReportBugModal({ visible, onClose }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [bug, setBug] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetAndClose = () => {
    setBug("");
    setLoading(false);
    setSubmitted(false);
    onClose();
  };

  const submitBug = async () => {
    if (!bug.trim()) return;
    setLoading(true);
    try {
      // simulate API call
      await new Promise((r) => setTimeout(r, 900));
      setSubmitted(true);
    } catch (err) {
      console.warn("report failed", err);
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
          <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardWrapper}
            >
              <View style={styles.card}>
                {/* header row */}
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
                  {/* title */}
                  <View style={styles.titleBlock}>
                    <Text style={styles.emoji}>🐞</Text>
                    <Text style={styles.title}>Report a Bug</Text>
                    <Text style={styles.subtitle}>
                      Help us improve Nimbus — tell us what happened and we'll
                      investigate.
                    </Text>
                  </View>

                  {/* form or success */}
                  {!submitted ? (
                    <>
                      <InputField
                        label="Bug Details"
                        value={bug}
                        onChangeText={setBug}
                        placeholder="Describe the issue: what happened, steps to reproduce, device/OS, screen, etc."
                        multiline
                        numberOfLines={6}
                        // keep styles explicit so TextInput doesn't grow unexpectedly
                        inputStyle={{
                          minHeight: 120,
                          fontSize: 16,
                          textAlignVertical: "top",
                          includeFontPadding: false,
                        }}
                        // helperText can show characters count if desired
                        helperText={`${bug.length} / 1000`}
                      />

                      <View style={{ height: 14 }} />

                      <StyledButton
                        label={loading ? "Reporting..." : "Report"}
                        onPress={submitBug}
                        disabled={loading || !bug.trim()}
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
                        Thanks — report sent!
                      </Text>
                      <Text style={styles.successSubtitle}>
                        We received your report and will investigate. Thanks for
                        helping make Nimbus better.
                      </Text>

                      <View style={{ height: 18 }} />

                      <StyledButton label="Done" onPress={resetAndClose} />
                    </View>
                  )}
                </ScrollView>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Tip: include device & OS version for faster debugging.
                  </Text>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)", // dimmed backdrop
      justifyContent: "flex-end", // align card to bottom
    },
    safe: {
      width: "100%",
    },
    keyboardWrapper: {
      width: "100%",
    },
    card: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: Platform.OS === "ios" ? 34 : 22,
      minHeight: 420,
      maxHeight: "90%",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: -6 },
      elevation: 12,
    },
    headerRow: {
      height: 36,
      justifyContent: "center",
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
      marginTop: 10,
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
