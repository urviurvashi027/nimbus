import React, { useContext, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemeContext from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import { SVATypography } from "@/theme/typography";
import { SvaAuthInput } from "@/features/auth/components/SvaAuthInput";
import { SvaAuthButton } from "@/features/auth/components/SvaAuthButton";

import type { TextInput } from "react-native";

export default function SignIn() {
  const { svaColors, svaComponents } = useContext(ThemeContext);
  const { onLogin } = useAuth();
  const toast = useNimbusToast();
  const insets = useSafeAreaInsets();

  const memberIdRef = useRef<TextInput>(null);
  const accessCodeRef = useRef<TextInput>(null);

  const [memberId, setMemberId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = useMemo(
    () => createStyles(svaColors, svaComponents, insets.top, insets.bottom),
    [svaColors, svaComponents, insets.top, insets.bottom]
  );

  const submit = async () => {
    if (!memberId.trim() || !accessCode.trim()) {
      Alert.alert(
        "Missing details",
        "Please enter your member ID and access code."
      );
      return;
    }

    setLoading(true);
    try {
      const result = await onLogin?.(memberId.trim(), accessCode);

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Welcome back",
          message: "Access granted",
        });
        router.replace("/(auth)/(tabs)");
        return;
      }

      toast.show({
        variant: "error",
        title: "Login failed",
        message: "Unable to verify your access.",
      });
    } catch (error: any) {
      toast.show({
        variant: "error",
        title: "Login failed",
        message: error?.message ?? "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: svaColors.bg.base }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.cardShell}>
              <View
                style={[
                  styles.outerCard,
                  {
                    backgroundColor: svaColors.surface.base,
                  },
                ]}
              >
                <View
                  style={[
                    styles.brandStrip,
                    {
                      backgroundColor: svaColors.bg.base,
                      borderBottomColor: svaColors.border.muted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.brandWordmark,
                      { color: svaColors.brand.primary },
                    ]}
                  >
                    SVA
                  </Text>
                </View>

                <View style={styles.heroBody}>
                  <Text
                    style={[
                      styles.heroTitle,
                      {
                        color: svaColors.text.primary,
                        textShadowColor: "rgba(0,0,0,0.2)",
                      },
                    ]}
                  >
                    Welcome to your sanctuary.
                  </Text>

                  <Text
                    style={[
                      styles.heroSubtitle,
                      { color: svaColors.text.secondary },
                    ]}
                  >
                    Deep Health & Burnout Prevention AI
                  </Text>

                  <View
                    style={[
                      styles.formShell,
                      {
                        backgroundColor: svaColors.surface.raised,
                        borderColor: svaColors.border.default,
                        shadowColor: svaColors.shadow.default,
                      },
                    ]}
                  >
                    <SvaAuthInput
                      ref={memberIdRef}
                      label="MEMBER ID"
                      placeholder="Enter your unique ID"
                      value={memberId}
                      onChangeText={setMemberId}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => accessCodeRef.current?.focus()}
                      editable={!loading}
                      containerStyle={styles.inputBlock}
                      inputStyle={styles.inputText}
                      labelStyle={styles.inputLabel}
                    />

                    <View style={styles.inputGap} />

                    <SvaAuthInput
                      ref={accessCodeRef}
                      label="ACCESS CODE"
                      preset="password"
                      showPasswordToggle
                      placeholder="••••••••"
                      value={accessCode}
                      onChangeText={setAccessCode}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={submit}
                      editable={!loading}
                      containerStyle={styles.inputBlock}
                      inputStyle={styles.inputText}
                      labelStyle={styles.inputLabel}
                    />

                    <View style={styles.buttonStack}>
                      <SvaAuthButton
                        label={loading ? "Entering Sanctuary..." : "Enter Sanctuary"}
                        onPress={submit}
                        loading={loading}
                        style={styles.primaryButton}
                        textStyle={styles.primaryButtonText}
                        rightIcon={
                          <Ionicons
                            name="arrow-forward"
                            size={18}
                            color={svaComponents?.button.primary.text ?? svaColors.text.inverse}
                          />
                        }
                      />

                      <View style={styles.secondaryButtonGap} />

                      <SvaAuthButton
                        label="Register for Sanctuary"
                        onPress={() => router.push("/(public)/register")}
                        variant="secondary"
                        disabled={loading}
                        style={styles.secondaryButton}
                        textStyle={styles.secondaryButtonText}
                        leftIcon={
                          <Ionicons
                            name="person-add-outline"
                            size={18}
                            color={svaColors.text.primary}
                          />
                        }
                      />
                    </View>
                  </View>

                  <Pressable
                    onPress={() => router.push("/(public)/forgot-password")}
                    style={styles.forgotAccess}
                    hitSlop={10}
                  >
                    <Text
                      style={[
                        styles.forgotAccessText,
                        { color: svaColors.text.secondary },
                      ]}
                    >
                      Lost Access
                    </Text>

                    <View style={styles.forgotAccessDecor}>
                      <View
                        style={[
                          styles.forgotAccessLine,
                          { backgroundColor: svaColors.border.default },
                        ]}
                      />
                      <View
                        style={[
                          styles.forgotAccessDot,
                          { backgroundColor: svaColors.border.default },
                        ]}
                      />
                      <View
                        style={[
                          styles.forgotAccessLine,
                          { backgroundColor: svaColors.border.default },
                        ]}
                      />
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(
  svaColors: any,
  svaComponents: any,
  topInset: number,
  bottomInset: number
) {
  const styles = StyleSheet.create({
    flex: {
      flex: 1,
    },
    screen: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      width: "100%",
      maxWidth: "100%",
      alignSelf: "center",
      paddingTop: topInset,
      paddingBottom: bottomInset,
      paddingHorizontal: 0,
      justifyContent: "flex-start",
    },
    cardShell: {
      width: "100%",
      flex: 1,
    },
    outerCard: {
      borderRadius: 0,
      borderWidth: 0,
      flex: 1,
      overflow: "hidden",
    },
    brandStrip: {
      height: 66,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    brandWordmark: {
      ...SVATypography.textStyle.button,
      fontFamily: "Inter_700Bold",
      fontSize: 18,
      fontWeight: "700",
      letterSpacing: 4.8,
    },
    heroBody: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 20,
      alignItems: "center",
    },
    heroTitle: {
      ...SVATypography.textStyle.displayMedium,
      fontFamily: "CormorantGaramond_500Medium",
      fontSize: 30,
      fontWeight: "500",
      lineHeight: 33,
      letterSpacing: -0.4,
      textAlign: "center",
    },
    heroSubtitle: {
      ...SVATypography.textStyle.subtitle,
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      lineHeight: 20,
      marginTop: 8,
      textAlign: "center",
    },
    formShell: {
      width: "100%",
      marginTop: 32,
      borderRadius: 26,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 18,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 2,
    },
    inputBlock: {
      width: "100%",
    },
    inputLabel: {
      color: svaColors.text.secondary,
    },
    inputText: {
      color: svaColors.text.primary,
    },
    inputGap: {
      height: 18,
    },
    buttonStack: {
      marginTop: 24,
    },
    primaryButton: {
      width: "100%",
      minHeight: 56,
      borderRadius: svaComponents?.button?.primary?.borderRadius ?? 16,
    },
    primaryButtonText: {
      ...SVATypography.textStyle.button,
      fontFamily: "Inter_600SemiBold",
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButtonGap: {
      height: 12,
    },
    secondaryButton: {
      width: "100%",
      minHeight: 52,
      borderRadius: 15,
    },
    secondaryButtonText: {
      ...SVATypography.textStyle.button,
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      fontWeight: "600",
    },
    forgotAccess: {
      alignItems: "center",
      marginTop: "auto",
      paddingTop: 24,
    },
    forgotAccessText: {
      ...SVATypography.textStyle.label,
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 1.1,
    },
    forgotAccessDecor: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    forgotAccessLine: {
      width: 38,
      height: 1,
      opacity: 0.14,
    },
    forgotAccessDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      marginHorizontal: 14,
      opacity: 0.14,
    },
  });

  return styles;
}
