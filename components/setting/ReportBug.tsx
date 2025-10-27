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
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "../common/ThemedComponent/StyledButton";
import InputField from "../common/ThemedComponent/StyledInput";
import { getDeviceDetails } from "@/utils/helper";
import { reportBug } from "@/services/settingService";
import Toast from "react-native-toast-message";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ReportBugModal({ visible, onClose }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
    console.log(description, os, device, "bug");
    setLoading(true);
    try {
      // simulate API call
      const payload = {
        title: description,
        description: title,
        severity: "high",
        os: os,
        device: device,
      };
      await new Promise((r) => setTimeout(r, 900));

      const result = await reportBug(payload);
      if (result && result.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent",
          position: "bottom",
        });
      }

      if (result && result.error_code) {
        alert("some error occurred");
      }

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
      transparent={false} // <- make modal full-screen (more predictable)
      statusBarTranslucent={true}
      onRequestClose={resetAndClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardWrapper}
        >
          {/* touch outside to dismiss keyboard */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Describe the issue: what happened, steps to reproduce, device/OS, screen, etc."
                      multiline
                      numberOfLines={6}
                      inputStyle={{
                        minHeight: 120,
                        fontSize: 16,
                        textAlignVertical: "top",
                        includeFontPadding: false,
                      }}
                      helperText={`${description.length} / 1000`}
                    />

                    <View style={{ height: 14 }} />

                    <StyledButton
                      label={loading ? "Reporting..." : "Report"}
                      onPress={submitBug}
                      disabled={loading || !description.trim()}
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardWrapper: {
      flex: 1,
    },
    card: {
      flex: 1, // fill whole modal
      backgroundColor: theme.background,
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: Platform.OS === "ios" ? 34 : 22,
      // remove top-border radii if you want full-bleed appearance
      // borderTopLeftRadius: 0,
      // borderTopRightRadius: 0,
    },
    headerRow: {
      height: 48,
      justifyContent: "center",
    },
    scroll: {
      flex: 1,
    },
    // flexGrow makes content fill and allow scroll when needed
    scrollContent: {
      paddingBottom: 8,
      flexGrow: 1,
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
