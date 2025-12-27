import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import NimbusOtpVerifyStep from "@/components/public/NimbusOtpVerifyStep"; // adjust path

export default function OtpVerificationScreen() {
  const { newTheme } = useContext(ThemeContext);
  const s = useMemo(() => styles(newTheme), [newTheme]);

  const { email } = useLocalSearchParams<{ email: string }>();
  const [errMsg, setErrMsg] = useState("");

  return (
    <ScreenView style={s.container} bgColor={newTheme.background}>
      <NimbusOtpVerifyStep
        email={email ?? ""}
        title="Reset password 🔒"
        subtitle={(e) => `Enter the code sent to ${e} to reset your password.`}
        onVerified={(otp: string) => {
          console.log("verified");
          router.replace({
            pathname: "/(public)/reset-password",
            params: { email, otp: otp },
          });
        }}
        onError={setErrMsg}
      />

      {!!errMsg && (
        <Text style={[s.error, { color: newTheme.error }]}>{errMsg}</Text>
      )}
    </ScreenView>
  );
}

const styles = (t: any) =>
  StyleSheet.create({
    container: { paddingTop: 86, paddingHorizontal: 20, flex: 1 },
    error: { marginTop: 12, fontWeight: "700" },
  });
