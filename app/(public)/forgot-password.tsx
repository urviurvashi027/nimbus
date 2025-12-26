import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import { NimbusInput } from "@/components/common/themeComponents/NimbusInput";
import { NimbusButton } from "@/components/common/themeComponents/NimbusButton";

import { useNimbusAlert } from "@/components/common/alert/useNimbusAlert";

import { forgotPassword } from "@/services/loginService";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

export default function ForgotPasswordScreen() {
  const { newTheme } = useContext(ThemeContext);
  const s = useMemo(() => styles(newTheme), [newTheme]);

  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();

  const alert = useNimbusAlert();
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
    <ScreenView style={s.container} bgColor={newTheme.background}>
      <View style={s.header}>
        <Text style={s.title}>Forgot password</Text>
        <Text style={s.subtitle}>
          Enter your email and we’ll send a one-time code to reset your
          password.
        </Text>
      </View>

      <View style={{ height: 18 }} />

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
        <Text style={[s.errorText, { color: newTheme.error }]}>{errMsg}</Text>
      )}

      <View style={{ height: 18 }} />

      <NimbusButton
        label={loading ? "Sending secure code…" : "Send secure code"}
        // label={loading ? "Sending OTP..." : "Get OTP"}
        onPress={submit}
        disabled={loading}
        style={{ borderRadius: 16 }}
      />

      <View style={{ height: 12 }} />

      <Text style={s.helper}>
        If you don’t see the email, check your spam folder.
      </Text>
    </ScreenView>
  );
}

const styles = (t: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 86, // gives breathing room from top/back button area
      paddingHorizontal: 20,
      flex: 1,
    },
    header: {
      marginTop: 24, // 👈 THIS creates space below back arrow
      marginBottom: 28, // 👈 Separates header from form
    },
    title: {
      color: t.textPrimary,
      fontSize: 30,
      fontWeight: "800", // reduced from 900 -> more premium
      letterSpacing: -0.2,
    },
    subtitle: {
      marginTop: 10,
      color: t.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "600",
    },
    errorText: {
      marginTop: 10,
      fontWeight: "700",
    },
    helper: {
      marginTop: 6,
      textAlign: "center",
      color: t.textSecondary,
      fontSize: 13,
      fontWeight: "600",
    },
  });
