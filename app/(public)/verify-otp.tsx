import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";
import { forgotPassword, verifyOtp } from "@/features/auth/services/loginService";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import { SvaAuthButton } from "@/features/auth/components/SvaAuthButton";
import { SvaOtpCodeInput } from "@/features/auth/components/SvaOtpCodeInput";
import { SvaRecoveryLayout } from "@/features/auth/components/SvaRecoveryLayout";
import { SVATypography } from "@/theme/typography";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function VerifyOtpScreen() {
  const { nimbusColors, nimbusComponents } = useContext(ThemeContext);
  const styles = useMemo(
    () => createStyles(nimbusColors, nimbusComponents),
    [nimbusColors, nimbusComponents]
  );

  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" ? params.email.trim() : "";

  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const toast = useNimbusToast();

  useEffect(() => {
    setCode("");
    setErrorMsg("");
    setTimer(RESEND_SECONDS);
  }, [email]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const resendCode = async () => {
    if (!email) {
      setErrorMsg("Email is missing.");
      return;
    }

    setResending(true);
    setErrorMsg("");

    try {
      const result = await forgotPassword({ email });

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Secure code sent",
          message: "We sent a fresh verification code to your email.",
        });
        setTimer(RESEND_SECONDS);
        return;
      }

      setErrorMsg(
        typeof result?.message === "string"
          ? result.message
          : "We couldn't resend the code right now."
      );
    } catch (error: any) {
      setErrorMsg(error?.message ?? "We couldn't resend the code right now.");
    } finally {
      setResending(false);
    }
  };

  const onVerify = async () => {
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Email is missing.");
      return;
    }

    if (code.trim().length !== OTP_LENGTH) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }

    setVerifying(true);

    try {
      const result = await verifyOtp({ recipient: email, otp: code.trim() });

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Access verified",
          message: "Your code was accepted. Set your new password next.",
        });

        router.push({
          pathname: "/(public)/reset-password",
          params: { email, otp: code.trim() },
        });
        return;
      }

      setErrorMsg(
        typeof result?.message === "string"
          ? result.message
          : "We couldn't verify the code. Please try again."
      );
    } catch (error: any) {
      setErrorMsg(error?.message ?? "We couldn't verify the code.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SvaRecoveryLayout
        title="Verify Access"
        subtitle="Enter the secure 6-digit code sent to your email."
        onBack={() => router.back()}
        supportingContent={
          <View style={styles.emailRow}>
            <Text style={[styles.emailCopy, { color: nimbusColors.text.secondary }]}>
              Not your email?
            </Text>

            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/(public)/forgot-password",
                  params: { email },
                })
              }
              hitSlop={8}
            >
              <Text style={[styles.emailAction, { color: nimbusColors.brand.primary }]}>
                Edit Email
              </Text>
            </Pressable>
          </View>
        }
      >
        <View
          style={[
            styles.codeShell,
            {
              backgroundColor: nimbusColors.surface.raised,
              borderColor: nimbusColors.border.default,
              shadowColor: nimbusColors.shadow.default,
            },
          ]}
        >
          <SvaOtpCodeInput
            value={code}
            onChange={(next) => {
              setCode(next);
              if (errorMsg) setErrorMsg("");
            }}
            length={OTP_LENGTH}
            disabled={verifying || resending}
            testID="verify-otp"
          />

          {errorMsg ? (
            <Text style={[styles.errorText, { color: nimbusColors.state.error }]}>
              {errorMsg}
            </Text>
          ) : null}

          <View style={styles.buttonGap} />

          <SvaAuthButton
            label={verifying ? "Verifying..." : "Verify & Unlock"}
            onPress={onVerify}
            loading={verifying}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={nimbusColors.text.inverse}
              />
            }
          />

          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={[styles.resendText, { color: nimbusColors.text.disabled }]}>
                RESEND CODE IN {formatTimer(timer)}
              </Text>
            ) : (
              <Pressable onPress={resendCode} disabled={resending} hitSlop={10}>
                <Text
                  style={[
                    styles.resendAction,
                    { color: nimbusColors.brand.primary },
                  ]}
                >
                  {resending ? "SENDING..." : "RESEND CODE"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </SvaRecoveryLayout>
    </>
  );
}

function createStyles(nimbusColors: any, nimbusComponents: any) {
  return StyleSheet.create({
    emailRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 4,
    },
    emailCopy: {
      ...SVATypography.textStyle.label,
      lineHeight: 18,
    },
    emailAction: {
      ...SVATypography.textStyle.label,
      lineHeight: 18,
      textDecorationLine: "underline",
      textDecorationColor: nimbusColors.brand.primary,
    },
    codeShell: {
      width: "100%",
      marginTop: 30,
      borderRadius: 26,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 20,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 2,
    },
    errorText: {
      marginTop: 14,
      ...SVATypography.textStyle.caption,
      lineHeight: 18,
    },
    buttonGap: {
      height: 20,
    },
    primaryButton: {
      width: "100%",
      minHeight: 56,
      borderRadius: nimbusComponents?.button?.primary?.borderRadius ?? 16,
    },
    primaryButtonText: {
      ...SVATypography.textStyle.button,
    },
    resendRow: {
      marginTop: 14,
      alignItems: "center",
    },
    resendText: {
      ...SVATypography.textStyle.caption,
      fontFamily: "Inter_500Medium",
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    resendAction: {
      ...SVATypography.textStyle.caption,
      fontFamily: "Inter_500Medium",
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  });
}
