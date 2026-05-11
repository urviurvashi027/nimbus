import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";
import { forgotPassword } from "@/features/auth/services/loginService";
import { useNimbusAlert } from "@/components/ui/alert/useNimbusAlert";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import { SvaAuthButton } from "@/features/auth/components/SvaAuthButton";
import { SvaAuthInput } from "@/features/auth/components/SvaAuthInput";
import { SvaRecoveryLayout } from "@/features/auth/components/SvaRecoveryLayout";
import { ROUTES } from "@/constants/routes";
import { SVATypography } from "@/theme/typography";

export default function ForgotPasswordScreen() {
  const { nimbusColors, nimbusComponents } = useContext(ThemeContext);
  const styles = useMemo(
    () => createStyles(nimbusColors, nimbusComponents),
    [nimbusColors, nimbusComponents]
  );

  const params = useLocalSearchParams<{ email?: string }>();
  const routeEmail = typeof params.email === "string" ? params.email : "";

  const [email, setEmail] = useState(routeEmail);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();
  const alert = useNimbusAlert();

  useEffect(() => {
    if (routeEmail) {
      setEmail(routeEmail);
    }
  }, [routeEmail]);

  const validate = (value: string) => {
    const trimmed = value.trim();
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!trimmed) return "Email is required.";
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    return "";
  };

  const onSubmit = async () => {
    const trimmed = email.trim();
    const validationError = validate(trimmed);

    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await forgotPassword({ email: trimmed });

      if (result?.success === false) {
        alert.show({
          variant: "error",
          title: "Unable to send code",
          message:
            typeof result?.message === "string"
              ? result.message
              : "We couldn't send a verification code right now. Please try again.",
          primary: { label: "OK" },
        });
        return;
      }

      if (result?.message) {
        toast.show({
          variant: "success",
          title: "Secure code sent",
          message: String(result.message),
        });
      } else {
        toast.show({
          variant: "success",
          title: "Secure code sent",
          message: "Check your email for the verification code.",
        });
      }

      router.replace({
        pathname: ROUTES.PUBLIC.VERIFY_OTP,
        params: { email: trimmed },
      });
      return;
    } catch (error: any) {
      alert.show({
        variant: "error",
        title: "Unable to send code",
        message: error?.message ?? "We couldn't send a verification code.",
        primary: { label: "OK" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SvaRecoveryLayout
        title="Recover Access"
        subtitle="Enter your registered email to receive a secure verification code."
        onBack={() => router.back()}
        footer={
          <Text style={styles.footer}>
            Check your spam folder if you don't receive the email within two
            minutes.
          </Text>
        }
      >
        <View
          style={[
            styles.formShell,
            {
              backgroundColor: nimbusColors.surface.raised,
              borderColor: nimbusColors.border.default,
              shadowColor: nimbusColors.shadow.default,
            },
          ]}
        >
          <SvaAuthInput
            label="EMAIL ADDRESS"
            preset="email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="email@domain.com"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            errorText={errorMsg}
            containerStyle={styles.inputBlock}
          />

          <View style={styles.actionGap} />

          <SvaAuthButton
            label={loading ? "Sending Secure Code..." : "Send Secure Code"}
            onPress={onSubmit}
            loading={loading}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={
                  nimbusComponents?.button.primary.text ??
                  nimbusColors.text.inverse
                }
              />
            }
          />

          <Pressable
            onPress={() => router.replace("/(public)/sign-in")}
            style={styles.secondaryAction}
            hitSlop={10}
          >
            <Text
              style={[styles.secondaryActionText, { color: nimbusColors.text.secondary }]}
            >
              Try another way
            </Text>
          </Pressable>
        </View>
      </SvaRecoveryLayout>
    </>
  );
}

function createStyles(nimbusColors: any, nimbusComponents: any) {
  return StyleSheet.create({
    formShell: {
      width: "100%",
      marginTop: 32,
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
    inputBlock: {
      width: "100%",
    },
    actionGap: {
      height: 22,
    },
    primaryButton: {
      width: "100%",
      minHeight: 56,
      borderRadius: nimbusComponents?.button?.primary?.borderRadius ?? 16,
    },
    primaryButtonText: {
      ...SVATypography.textStyle.button,
    },
    secondaryAction: {
      alignItems: "center",
      paddingTop: 18,
    },
    secondaryActionText: {
      ...SVATypography.textStyle.label,
      letterSpacing: 1.1,
    },
    footer: {
      ...SVATypography.textStyle.caption,
      fontFamily: "Inter_500Medium",
      color: nimbusColors.text.disabled,
      fontSize: 11,
      lineHeight: 18,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 1.8,
    },
  });
}
