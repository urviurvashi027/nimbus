// ReportBugModal.tsx
import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../common/ThemedComponent/StyledInput";
import StyledButton from "../../common/themeComponents/StyledButton";
import { getDeviceDetails } from "@/utils/helper";
import { reportBug } from "@/services/settingService";

export default function ReportBugModal({ visible, onClose }: any) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetAndClose = () => {
    setDescription("");
    setLoading(false);
    setSubmitted(false);
    onClose();
  };

  const submitBug = async () => {
    if (!description.trim()) return;

    const { os, device } = await getDeviceDetails();
    setLoading(true);

    try {
      const payload = {
        title: description,
        description,
        severity: "high",
        os,
        device,
      };

      const result = await reportBug(payload);
      if (result?.success) setSubmitted(true);
    } catch (e) {
      console.warn("Bug report failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.card}>
              {/* Header */}
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
              >
                <View style={styles.titleBlock}>
                  <Text style={styles.emoji}>🐞</Text>
                  <Text style={styles.title}>Report a Bug</Text>
                  <Text style={styles.subtitle}>
                    Help us improve Nimbus by telling us what happened.
                  </Text>
                </View>

                {!submitted ? (
                  <>
                    <InputField
                      label="Bug Details"
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Describe the issue..."
                      multiline
                      numberOfLines={6}
                      helperText={`${description.length} / 1000`}
                      inputStyle={{
                        minHeight: 120,
                        textAlignVertical: "top",
                      }}
                    />

                    <View style={styles.btnStack}>
                      {/* Cancel FIRST */}
                      <StyledButton
                        label="Cancel"
                        variant="secondary"
                        onPress={resetAndClose}
                        fullWidth
                      />

                      {/* Primary action SECOND */}
                      <StyledButton
                        label={loading ? "Reporting..." : "Report Bug"}
                        onPress={submitBug}
                        disabled={!description.trim() || loading}
                        fullWidth
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.successBlock}>
                    <Text style={styles.successEmoji}>✅</Text>
                    <Text style={styles.successTitle}>
                      Thanks — report sent!
                    </Text>
                    <StyledButton label="Done" onPress={resetAndClose} />
                  </View>
                )}
              </ScrollView>

              <Text style={styles.footerText}>
                Tip: Include device & OS version for faster debugging.
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    card: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 30,
    },
    headerRow: {
      height: 48,
      justifyContent: "center",
    },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    titleBlock: {
      alignItems: "center",
      marginBottom: 14,
    },
    emoji: { fontSize: 34, marginBottom: 4 },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 13,
      maxWidth: 480,
    },
    btnStack: {
      marginTop: 20,
      gap: 12,
    },
    successBlock: { alignItems: "center", paddingVertical: 30 },
    successEmoji: { fontSize: 36, marginBottom: 10 },
    successTitle: {
      fontSize: 18,
      color: theme.textPrimary,
      fontWeight: "700",
      marginBottom: 12,
    },
    footerText: {
      textAlign: "center",
      marginTop: 16,
      color: theme.textSecondary,
      fontSize: 12,
    },
  });
