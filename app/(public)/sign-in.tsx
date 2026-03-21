// app/(public)/signIn.tsx
import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Stack, router, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemeContext from "@/contexts/ThemeContext";

import { ScreenView } from "@/components/ui/theme-components/ScreenView";
import { NimbusInput } from "@/components/ui/theme-components/NimbusInput";
import { NimbusButton } from "@/components/ui/theme-components/NimbusButton";
import { StyledCheckbox } from "@/components/ui/StyledCheckbox";
import { useNimbusToast } from "@/components/ui/toast/useNimbusToast";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function SignIn() {
  const { newTheme, tokens, typography, spacing } = useContext(ThemeContext);
  const { onLogin } = useAuth();
  const navigation = useNavigation();
  // const insets = useSafeAreaInsets(); // Not needed anymore

  // Hide the native header
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Pass all theme objects to styling function
  const styles = useMemo(
    () => styling(newTheme, tokens, typography, spacing),
    [newTheme, tokens, typography, spacing]
  );

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
    <ScreenView>
      {/* Nimbus Shared Header */}
      <AppHeader
        title="Welcome back"
        subtitle="Sign in to continue your Nimbus journey."
        onBack={() => router.back()}
      />

      <View style={{ marginTop: spacing.md }} />

      <NimbusInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="John Cena"
        autoCapitalize="none"
        returnKeyType="next"
      />

      <View style={{ marginTop: spacing.md }} />

      <NimbusInput
        label="Password"
        preset="password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        enablePasswordToggle
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      <View style={{ marginTop: spacing.md }} />

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

      <View style={{ marginTop: spacing.lg }} />

      <NimbusButton
        label={loading ? "Signing in..." : "Sign in"}
        onPress={submit}
        disabled={loading}
      />

      <View style={{ marginTop: spacing.xl }} />

      <Pressable onPress={() => router.push("/(public)/register")}>
        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text style={styles.footerStrong}>Create one</Text>
        </Text>
      </Pressable>
    </ScreenView>
  );
}

const styling = (t: any, tokens: any, typography: any, spacing: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rememberText: {
      ...typography.body,
      fontSize: 14,
      color: t.textPrimary,
      fontWeight: "600",
    },
    link: {
      ...typography.button,
      fontSize: 14,
      color: t.accent,
    },
    footerText: {
      ...typography.body,
      color: t.textSecondary,
      textAlign: "center",
    },
    footerStrong: {
      ...typography.button,
      color: t.textPrimary,
    },
  });
