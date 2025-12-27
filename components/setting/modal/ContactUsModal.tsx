import React, { useContext, useMemo, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

import ThemeContext from "@/context/ThemeContext";
import InputField from "../../common/themeComponents/StyledInputOld";
import StyledButton from "../../common/themeComponents/StyledButton";

import { getDeviceDetails } from "@/utils/helper";
import { contactUs } from "@/services/contactService";
import { ContactAttachment, ContactCategory } from "@/types/contactTypes";

const CATEGORIES: { key: ContactCategory; label: string; icon: string }[] = [
  { key: "BUG", label: "Report a Bug", icon: "💬" },
  { key: "FEATURE", label: "Request Feature", icon: "✨" },
  { key: "FEEDBACK", label: "Share Feedback", icon: "🧩" },
  { key: "CONTACT", label: "Message Us", icon: "🐞" },
];

export default function ContactUsModal({ visible, onClose }: any) {
  const { newTheme } = useContext(ThemeContext);
  const styles = useMemo(() => styling(newTheme), [newTheme]);

  const [category, setCategory] = useState<ContactCategory>("BUG");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<ContactAttachment | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const resetAndClose = () => {
    setCategory("BUG");
    setSubject("");
    setBody("");
    setAttachment(null);
    setLoading(false);
    setSubmitted(false);
    setErrMsg("");
    onClose();
  };

  const canSubmit =
    subject.trim().length > 0 && body.trim().length > 0 && !loading;

  const pickAttachment = async () => {
    setErrMsg("");
    const res = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: ["image/*", "application/pdf", "text/plain"],
    });

    if (res.canceled) return;

    const f = res.assets?.[0];
    if (!f?.uri) return;

    setAttachment({
      uri: f.uri,
      name: f.name ?? "attachment",
      mimeType: f.mimeType,
      size: f.size,
    });
  };

  const removeAttachment = () => setAttachment(null);

  const submit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setErrMsg("");

    try {
      const { os, device } = await getDeviceDetails();

      // console.log("Submitting contact us:", {
      //   category,
      //   subject: subject.trim(),
      //   message: body.trim(),
      //   // os,
      //   // device,
      //   screenshot: attachment,
      // });

      const result = await contactUs({
        category,
        subject: subject.trim(),
        message: body.trim(),
        // os,
        // device,
        screenshot: attachment,
      });

      if (result?.success) setSubmitted(true);
      else
        setErrMsg(
          result?.message ?? "Unable to send message. Please try again."
        );
    } catch (e: any) {
      setErrMsg(
        typeof e?.message === "string"
          ? e.message
          : "Unable to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const headerEmoji = CATEGORIES.find((c) => c.key === category)?.icon ?? "💬";

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
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.titleBlock}>
                  <Text style={styles.emoji}>{headerEmoji}</Text>
                  <Text style={styles.title}>Contact us</Text>
                  <Text style={styles.subtitle}>
                    Send a message to Nimbus support. We usually reply within
                    24–48 hours.
                  </Text>
                </View>

                {!submitted ? (
                  <>
                    {/* Category */}
                    <Text
                      style={[
                        styles.sectionLabel,
                        { color: newTheme.textSecondary },
                      ]}
                    >
                      Category
                    </Text>

                    <View style={styles.categoryWrap}>
                      {CATEGORIES.map((c) => {
                        const active = c.key === category;
                        return (
                          <TouchableOpacity
                            key={c.key}
                            onPress={() => setCategory(c.key)}
                            style={[
                              styles.categoryPill,
                              {
                                backgroundColor: active
                                  ? newTheme.surface
                                  : newTheme.background,
                                borderColor: active
                                  ? newTheme.accent
                                  : newTheme.border,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: newTheme.textPrimary,
                                fontWeight: "600",
                              }}
                            >
                              {c.icon} {c.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Subject */}
                    <InputField
                      label="Subject"
                      value={subject}
                      onChangeText={(v: string) => {
                        setSubject(v);
                        if (errMsg) setErrMsg("");
                      }}
                      placeholder="Short summary"
                      helperText={`${subject.length} / 120`}
                      maxLength={120}
                    />

                    {/* Body */}
                    <InputField
                      label="Message"
                      value={body}
                      onChangeText={(v: string) => {
                        setBody(v);
                        if (errMsg) setErrMsg("");
                      }}
                      placeholder={
                        category === "BUG"
                          ? "What happened? Steps to reproduce, expected vs actual…"
                          : category === "FEATURE"
                          ? "Describe the feature and why it helps you…"
                          : "Write your message…"
                      }
                      multiline
                      numberOfLines={7}
                      helperText={`${body.length} / 1000`}
                      maxLength={1000}
                      inputStyle={{
                        minHeight: 150,
                        textAlignVertical: "top",
                      }}
                    />

                    {/* Attachment */}
                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={[
                          styles.sectionLabel,
                          { color: newTheme.textSecondary },
                        ]}
                      >
                        Attachment (optional)
                      </Text>

                      {!attachment ? (
                        <TouchableOpacity
                          onPress={pickAttachment}
                          style={[
                            styles.attachRow,
                            {
                              borderColor: newTheme.border,
                              backgroundColor: newTheme.surface,
                            },
                          ]}
                        >
                          <Ionicons
                            name="attach"
                            size={18}
                            color={newTheme.textSecondary}
                          />
                          <Text
                            style={{
                              color: newTheme.textPrimary,
                              fontWeight: "600",
                            }}
                          >
                            Add file
                          </Text>
                          <View style={{ flex: 1 }} />
                          <Text style={{ color: newTheme.textSecondary }}>
                            png / jpg / pdf / txt
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={[
                            styles.attachRow,
                            {
                              borderColor: newTheme.border,
                              backgroundColor: newTheme.surface,
                            },
                          ]}
                        >
                          <Ionicons
                            name="document-text"
                            size={18}
                            color={newTheme.textSecondary}
                          />
                          <Text
                            style={{
                              color: newTheme.textPrimary,
                              fontWeight: "600",
                              flex: 1,
                            }}
                            numberOfLines={1}
                          >
                            {attachment.name}
                          </Text>
                          <TouchableOpacity onPress={removeAttachment}>
                            <Ionicons
                              name="close"
                              size={18}
                              color={newTheme.textSecondary}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {!!errMsg && (
                      <Text
                        style={[styles.errorText, { color: newTheme.error }]}
                      >
                        {errMsg}
                      </Text>
                    )}

                    {/* Buttons */}
                    <View style={styles.btnStack}>
                      <StyledButton
                        label="Cancel"
                        variant="secondary"
                        onPress={resetAndClose}
                        fullWidth
                      />

                      <StyledButton
                        label={loading ? "Sending…" : "Send"}
                        onPress={submit}
                        disabled={!canSubmit}
                        fullWidth
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.successBlock}>
                    <Text style={styles.successEmoji}>✅</Text>
                    <Text style={styles.successTitle}>Message sent</Text>
                    <Text
                      style={[
                        styles.successSub,
                        { color: newTheme.textSecondary },
                      ]}
                    >
                      Thanks — we’ve received your request.
                    </Text>
                    <View style={{ height: 14 }} />
                    <StyledButton label="Done" onPress={resetAndClose} />
                  </View>
                )}
              </ScrollView>

              <Text style={styles.footerText}>
                Tip: For bugs, include steps + screenshot for faster resolution.
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
    headerRow: { height: 48, justifyContent: "center" },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 20 },

    titleBlock: { alignItems: "center", marginBottom: 14 },
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
      maxWidth: 520,
      lineHeight: 18,
    },

    sectionLabel: {
      fontSize: 12,
      fontWeight: "700",
      marginTop: 10,
      marginBottom: 8,
    },

    categoryWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 10,
    } as any,
    categoryPill: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
    },

    attachRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 12,
    } as any,

    btnStack: { marginTop: 20, gap: 12 },

    errorText: { marginTop: 12, fontSize: 13, fontWeight: "600" },

    successBlock: { alignItems: "center", paddingVertical: 30 },
    successEmoji: { fontSize: 36, marginBottom: 10 },
    successTitle: {
      fontSize: 18,
      color: theme.textPrimary,
      fontWeight: "700",
      marginBottom: 6,
    },
    successSub: { textAlign: "center", fontSize: 13 },

    footerText: {
      textAlign: "center",
      marginTop: 16,
      color: theme.textSecondary,
      fontSize: 12,
    },
  });
