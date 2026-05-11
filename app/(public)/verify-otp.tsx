import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";
import { forgotPassword, verifyOtp } from "@/features/auth/services/loginService";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import { SvaAuthButton } from "@/features/auth/components/SvaAuthButton";
import { SvaAuthTextAction } from "@/features/auth/components/SvaAuthTextAction";
import { SvaOtpCodeInput } from "@/features/auth/components/SvaOtpCodeInput";
import { SvaRecoveryLayout } from "@/features/auth/components/SvaRecoveryLayout";
import { ROUTES } from "@/constants/routes";
import { SVATypography } from "@/theme/typography";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function VerifyOtpScreen() {
  const { svaColors, svaComponents } = useContext(ThemeContext);
  const styles = useMemo(
    () => createStyles(svaColors, svaComponents),
    [svaColors, svaComponents]
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
          pathname: ROUTES.PUBLIC.RESET_PASSWORD,
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
            <Text style={[styles.emailCopy, { color: svaColors.text.secondary }]}>
              Not your email?
            </Text>

            <SvaAuthTextAction
              onPress={() =>
                router.replace({
                  pathname: ROUTES.PUBLIC.FORGOT_PASSWORD,
                  params: { email },
                })
              }
              variant="link"
              hitSlop={8}
            >
              Edit Email
            </SvaAuthTextAction>
          </View>
        }
      >
        <View
          style={[
            styles.codeShell,
            {
              backgroundColor: svaColors.surface.raised,
              borderColor: svaColors.border.default,
              shadowColor: svaColors.shadow.default,
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
            <Text style={[styles.errorText, { color: svaColors.state.error }]}>
              {errorMsg}
            </Text>
          ) : null}

          <View style={styles.buttonGap} />

          <SvaAuthButton
            label={verifying ? "Verifying..." : "Verify & Unlock"}
            onPress={onVerify}
            loading={verifying}
            style={styles.primaryButton}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={svaColors.text.inverse}
              />
            }
          />

          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={[styles.resendText, { color: svaColors.text.disabled }]}>
                RESEND CODE IN {formatTimer(timer)}
              </Text>
            ) : (
              <Pressable onPress={resendCode} disabled={resending} hitSlop={10}>
                <Text
                  style={[
                    styles.resendAction,
                    { color: svaColors.brand.primary },
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

function createStyles(svaColors: any, svaComponents: any) {
  return StyleSheet.create({
    emailRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 4,
    },
    emailCopy: {
      ...SVATypography.textStyle.authLabel,
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
      ...SVATypography.textStyle.authBody,
    },
    buttonGap: {
      height: 20,
    },
    primaryButton: {
      width: "100%",
      minHeight: 56,
      borderRadius: svaComponents?.button?.primary?.borderRadius ?? 16,
    },
    resendRow: {
      marginTop: 14,
      alignItems: "center",
    },
    resendText: {
      ...SVATypography.textStyle.authTinyLabel,
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    resendAction: {
      ...SVATypography.textStyle.authTinyLabel,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  });
}
