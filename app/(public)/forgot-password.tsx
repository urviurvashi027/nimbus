import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/contexts/ThemeContext";

import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { NimbusInput } from "@/components/ui/theme-components/NimbusInput";
import { NimbusButton } from "@/components/ui/theme-components/NimbusButton";
import { useNimbusAlert } from "@/components/ui/alert/useNimbusAlert";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import AppHeader from "@/components/layout/AppHeader";

import { forgotPassword } from "@/features/auth/services/loginService";

export default function ForgotPasswordScreen() {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(
    () => styling(newTheme, spacing, typography),
    [newTheme, spacing, typography]
  );

  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();
  const alert = useNimbusAlert();
  const navigation = useNavigation();

  // Hide the native header
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const validate = (value: string) => {
    const v = value.trim();
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!v) return "Email is required.";
    if (!emailRegex.test(v)) return "Please enter a valid email address.";
    return "";
  };

  const onChangeEmail = (v: string) => {
    setEmail(v);
    if (errMsg) setErrMsg(""); // clear once user starts fixing
  };

  const submit = async () => {
    const v = email.trim();
    const e = validate(v);

    if (e) {
      setErrMsg(e);
      return;
    }

    setLoading(true);
    setErrMsg("");

    try {
      const result = await forgotPassword({ email: v });

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "OTP sent",
          message: "Check your email for the verification code.",
        });

        router.replace({
          pathname: "/(public)/verify-otp",
          params: { email: v },
        });
        return;
      }

      if (!result?.success) {
        alert.show({
          variant: "error",
          title: "Unable to send code",
          message:
            typeof result?.message === "string"
              ? result.message
              : "We couldn’t send a verification code right now. Please try again.",
          primary: { label: "OK" },
        });
        return;
      }
    } catch (err: any) {
      alert.show({
        variant: "error",
        title: "Unable to send code",
        message: err.message,
        primary: { label: "OK" }, // just closes
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView>
      <AppHeader
        title="Forgot password"
        subtitle="Enter your email and we’ll send a one-time code to reset your password."
        onBack={() => router.back()}
      />

      <View style={{ marginTop: spacing.md }} />

      <NimbusInput
        label="Email"
        preset="email"
        value={email}
        onChangeText={onChangeEmail}
        placeholder="john@domain.com"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {!!errMsg && (
        <Text style={[styles.errorText, { color: newTheme.error }]}>
          {errMsg}
        </Text>
      )}

      <View style={{ marginTop: spacing.lg }} />

      <NimbusButton
        label={loading ? "Sending secure code…" : "Send secure code"}
        onPress={submit}
        disabled={loading}
      />

      <View style={{ marginTop: spacing.sm }} />

      <Text style={styles.helper}>
        If you don’t see the email, check your spam folder.
      </Text>
    </ScreenView>
  );
}

const styling = (t: any, spacing: any, typography: any) =>
  StyleSheet.create({
    errorText: {
      marginTop: spacing.xs,
      fontWeight: "700",
      ...typography.caption,
    },
    helper: {
      marginTop: spacing.xs,
      textAlign: "center",
      color: t.textSecondary,
      fontWeight: "600",
      ...typography.caption,
    },
  });
