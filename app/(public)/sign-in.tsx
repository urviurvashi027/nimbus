// app/(public)/signIn.tsx
import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/contexts/ThemeContext";
import { NimbusColorSet } from "@/theme/types";
import { SVATypography } from "@/theme/typography";
import { SVASpacing } from "@/theme/spacing";

import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { NimbusInput } from "@/components/ui/theme-components/NimbusInput";
import { NimbusButton } from "@/components/ui/theme-components/NimbusButton";
import { StyledCheckbox } from "@/components/ui/StyledCheckbox";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function SignIn() {
  const { nimbusColors } = useContext(ThemeContext);
  const { onLogin } = useAuth();
  const navigation = useNavigation();

  // Hide the native header
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Pass all theme objects to styling function
  const styles = useMemo(() => styling(nimbusColors), [nimbusColors]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();

  const submit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "Missing details",
        "Please enter your username and password."
      );
      return;
    }

    setLoading(true);
    try {
      const result = await onLogin?.(username.trim(), password);
      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Welcome back",
          message: "Welcome back",
        });
        router.replace("/(auth)/(tabs)");
        return;
      }
      toast.show({
        variant: "error",
        title: "Login failed",
        message: "Login failed",
      });
    } catch (e: any) {
      toast.show({
        variant: "error",
        title: "Login failed",
        message: e?.message ?? "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView style={{ paddingHorizontal: SVASpacing.layout.screenPadding }}>
      {/* Nimbus Shared Header */}
      <AppHeader
        title="Welcome back"
        subtitle="Sign in to continue your Nimbus journey."
        onBack={() => router.back()}
        titleStyle={SVATypography.textStyle.heading2}
        subtitleStyle={SVATypography.textStyle.body}
      />

      <View style={{ marginTop: SVASpacing.scale.md }} />

      <NimbusInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="John Cena"
        autoCapitalize="none"
        returnKeyType="next"
        labelStyle={SVATypography.textStyle.inputLabel}
        inputStyle={[SVATypography.textStyle.input, { height: SVASpacing.component.inputHeight }]}
      />

      <View style={{ marginTop: SVASpacing.scale.md }} />

      <NimbusInput
        label="Password"
        preset="password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        enablePasswordToggle
        returnKeyType="done"
        onSubmitEditing={submit}
        labelStyle={SVATypography.textStyle.inputLabel}
        inputStyle={[SVATypography.textStyle.input, { height: SVASpacing.component.inputHeight }]}
      />

      <View style={{ marginTop: SVASpacing.scale.md }} />

      <View style={styles.row}>
        <StyledCheckbox
          checked={rememberMe}
          onToggle={() => setRememberMe((v) => !v)}
          label={<Text style={styles.rememberText}>Remember me</Text>}
        />

        <Pressable
          onPress={() => router.push("/(public)/forgot-password")}
          hitSlop={10}
        >
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: SVASpacing.scale.lg }} />

      <NimbusButton
        label={loading ? "Signing in..." : "Sign in"}
        onPress={submit}
        disabled={loading}
        textStyle={SVATypography.textStyle.button}
        style={{ height: SVASpacing.component.buttonHeight }}
      />

      <View style={{ marginTop: SVASpacing.scale.xl }} />

      <Pressable onPress={() => router.push("/(public)/register")}>
        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text style={styles.footerStrong}>Create one</Text>
        </Text>
      </Pressable>
    </ScreenView>
  );
}

const styling = (c: NimbusColorSet) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rememberText: {
      ...SVATypography.textStyle.subtitle,
      fontSize: 14,
      color: c.text.primary,
      fontWeight: "600",
    },
    link: {
      ...SVATypography.textStyle.button,
      fontSize: 14,
      color: c.brand.primary,
    },
    footerText: {
      ...SVATypography.textStyle.body,
      color: c.text.secondary,
      textAlign: "center",
    },
    footerStrong: {
      ...SVATypography.textStyle.button,
      color: c.text.primary,
    },
  });
