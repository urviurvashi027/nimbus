import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import { NimbusInput } from "@/components/common/themeComponents/NimbusInput";
import { NimbusButton } from "@/components/common/themeComponents/NimbusButton";
import { useNimbusAlert } from "@/components/common/alert/useNimbusAlert";
import { setPassword as resetPassword } from "@/services/loginService";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

// import { normalizeApiError } from "@/utils/normalizeApiError";

// ✅ Replace with your real service function name
// import { resetPassword } from "@/services/loginService";

export default function ResetPasswordScreen() {
  const { newTheme } = useContext(ThemeContext);
  const s = useMemo(() => styles(newTheme), [newTheme]);
  const alert = useNimbusAlert();

  const toast = useNimbusToast();

  // expected params from OTP screen
  const { email, otp } = useLocalSearchParams<{
    email?: string;
    otp?: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const p = password.trim();
    const c = confirm.trim();

    if (!p) return "Please enter a new password.";
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(p)) return "Add at least 1 uppercase letter.";
    if (!/[0-9]/.test(p)) return "Add at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(p)) return "Add at least 1 special character.";
    if (!c) return "Please confirm your password.";
    if (p !== c) return "Passwords don’t match.";
    if (!email) return "Missing email. Please restart the reset flow.";
    if (!otp) return "Missing OTP. Please verify again.";
    return "";
  };

  const submit = async () => {
    const e = validate();
    if (e) {
      setErrMsg(e);
      return;
    }

    setLoading(true);
    setErrMsg("");

    try {
      // ✅ match your backend contract here
      // common patterns:
      // { email, otp, new_password }
      // OR { recipient: email, otp, password }
      const res = await resetPassword({
        email: String(email).trim(),
        otp: String(otp).trim(),
        password: password.trim(),
      });

      if (res?.success) {
        toast.show({
          variant: "success",
          title: "Password updated",
          message: "You can now sign in with your new password.",
        });

        // send them to sign in
        router.push("/(public)/sign-in");
        return;
      }

      // backend returns success:false with message/error_code
      alert.show({
        variant: "error",
        title: "Couldn’t update password",
        message: String(res?.message ?? "Please try again."),
        primary: { label: "OK" },
      });
    } catch (err: any) {
      //   const apiErr = normalizeApiError(err);

      alert.show({
        variant: "error",
        title: "Couldn’t update password",
        message: err.message,
        primary: { label: "OK" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView style={s.container} bgColor={newTheme.background}>
      <View style={s.header}>
        <Text style={s.title}>Set new password</Text>
        <Text style={s.subtitle}>
          Choose a strong password you’ll remember. You can always change it
          later in settings.
        </Text>
      </View>

      <NimbusInput
        label="New password"
        preset="password"
        enablePasswordToggle
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          if (errMsg) setErrMsg("");
        }}
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={{ height: 14 }} />

      <NimbusInput
        label="Confirm password"
        preset="password"
        enablePasswordToggle
        value={confirm}
        onChangeText={(v) => {
          setConfirm(v);
          if (errMsg) setErrMsg("");
        }}
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {!!errMsg && (
        <Text style={[s.errorText, { color: newTheme.error }]}>{errMsg}</Text>
      )}

      <View style={{ height: 18 }} />

      <NimbusButton
        label={loading ? "Updating password…" : "Update password"}
        onPress={submit}
        disabled={loading}
        style={{ borderRadius: 16 }}
      />

      <View style={{ height: 10 }} />

      <Text style={s.helper}>
        Tip: Use at least 8 characters with a number and a symbol.
      </Text>
    </ScreenView>
  );
}

const styles = (t: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 86,
      paddingHorizontal: 20,
      flex: 1,
    },
    header: {
      marginTop: 24,
      marginBottom: 26,
    },
    title: {
      color: t.textPrimary,
      fontSize: 30,
      fontWeight: "800",
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
      textAlign: "center",
      color: t.textSecondary,
      fontSize: 13,
      fontWeight: "600",
    },
  });
