import React, { useContext, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";
import { useNimbusAlert } from "@/components/ui/alert/useNimbusAlert";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import { setPassword as updatePassword } from "@/features/auth/services/loginService";
import { SvaAuthButton } from "@/features/auth/components/SvaAuthButton";
import { SvaAuthInput } from "@/features/auth/components/SvaAuthInput";
import { SvaRecoveryLayout } from "@/features/auth/components/SvaRecoveryLayout";
import { ROUTES } from "@/constants/routes";
import { SVATypography } from "@/theme/typography";

export default function ResetPasswordScreen() {
  const { svaColors, svaComponents } = useContext(ThemeContext);
  const styles = useMemo(
    () => createStyles(svaColors, svaComponents),
    [svaColors, svaComponents]
  );

  const params = useLocalSearchParams<{ email?: string; otp?: string }>();
  const email = typeof params.email === "string" ? params.email.trim() : "";
  const otp = typeof params.otp === "string" ? params.otp.trim() : "";

  const [password, setPasswordValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();
  const alert = useNimbusAlert();

  const validate = () => {
    const nextPassword = password.trim();
    const nextConfirm = confirm.trim();

    if (!nextPassword) return "Please enter a new password.";
    if (nextPassword.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(nextPassword)) return "Add at least 1 uppercase letter.";
    if (!/[0-9]/.test(nextPassword)) return "Add at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(nextPassword)) {
      return "Add at least 1 special character.";
    }
    if (!nextConfirm) return "Please confirm your password.";
    if (nextPassword !== nextConfirm) return "Passwords do not match.";
    if (!email) return "Missing email. Please restart the reset flow.";
    if (!otp) return "Missing verification code. Please verify again.";
    return "";
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await updatePassword({
        email,
        otp,
        password: password.trim(),
      });

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Password updated",
          message: "You can now sign in with your new password.",
        });

        router.replace(ROUTES.PUBLIC.SIGN_IN);
        return;
      }

        alert.show({
          variant: "error",
          title: "Couldn't update password",
          message: String(result?.message ?? "Please try again."),
          primary: { label: "OK" },
        });
      } catch (error: any) {
        alert.show({
          variant: "error",
          title: "Couldn't update password",
          message: error?.message ?? "Please try again.",
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
        title="Set New Password"
        subtitle="Choose a strong password you'll remember."
        onBack={() => router.back()}
        footer={
          <Text style={styles.footer}>
            Use at least 8 characters with a number and a symbol.
          </Text>
        }
      >
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
            label="NEW PASSWORD"
            preset="password"
            showPasswordToggle
            value={password}
            onChangeText={(value) => {
              setPasswordValue(value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="Enter new password"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            containerStyle={styles.inputBlock}
          />

          <View style={styles.inputGap} />

          <SvaAuthInput
            label="CONFIRM PASSWORD"
            preset="password"
            showPasswordToggle
            value={confirm}
            onChangeText={(value) => {
              setConfirm(value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="Confirm new password"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            containerStyle={styles.inputBlock}
          />

          {errorMsg ? (
            <Text style={[styles.errorText, { color: svaColors.state.error }]}>
              {errorMsg}
            </Text>
          ) : null}

          <View style={styles.buttonGap} />

          <SvaAuthButton
            label={loading ? "Updating Password..." : "Update Password"}
            onPress={submit}
            loading={loading}
            style={styles.primaryButton}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={svaColors.text.inverse}
              />
            }
          />
        </View>
      </SvaRecoveryLayout>
    </>
  );
}

function createStyles(svaColors: any, svaComponents: any) {
  return StyleSheet.create({
    formShell: {
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
    inputBlock: {
      width: "100%",
    },
    inputGap: {
      height: 18,
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
    footer: {
      ...SVATypography.textStyle.authFootnote,
      color: svaColors.text.disabled,
      textAlign: "center",
    },
  });
}
