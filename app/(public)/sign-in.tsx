// app/(public)/signIn.tsx (or wherever your route is)
import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

import { ScreenView } from "@/components/Themed";
import { NimbusInput } from "@/components/common/themeComponents/NimbusInput";
import { NimbusButton } from "@/components/common/themeComponents/NimbusButton";
import { NimbusOAuthButtons } from "@/components/public/NimbusOAuthButtons";
import { StyledCheckbox } from "@/components/common/ThemedComponent/StyledCheckbox";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

export default function SignIn() {
  const { newTheme } = useContext(ThemeContext);
  const { onLogin } = useAuth();
  const insets = useSafeAreaInsets();

  const s = useMemo(() => styles(newTheme), [newTheme]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();

  // ✅ No useHeaderHeight — just give consistent breathing room below transparent header
  const topPad = insets.top + 56; // tweak 52–64 if you want a bit more/less

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
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: newTheme.textPrimary,
        }}
      />

      <ScreenView
        style={[s.container, { paddingTop: topPad }]}
        bgColor={newTheme.background}
      >
        {/* Title */}
        <View style={s.header}>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>
            Sign in to continue your Nimbus journey.
          </Text>
        </View>

        <View style={{ height: 18 }} />

        <NimbusInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="John Cena"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <View style={{ height: 14 }} />

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

        <View style={{ height: 14 }} />

        <View style={s.row}>
          <StyledCheckbox
            checked={rememberMe}
            onToggle={() => setRememberMe((v) => !v)}
            label={<Text style={s.rememberText}>Remember me</Text>}
          />

          <Pressable
            onPress={() => router.push("/(public)/forgot-password")}
            hitSlop={10}
          >
            <Text style={s.link}>Forgot password?</Text>
          </Pressable>
        </View>

        <View style={{ height: 18 }} />

        <NimbusButton
          label={loading ? "Signing in..." : "Sign in"}
          onPress={submit}
          disabled={loading}
        />

        <View style={{ height: 22 }} />

        <Pressable onPress={() => router.push("/(public)/register")}>
          <Text style={s.footerText}>
            Don’t have an account?{" "}
            <Text style={s.footerStrong}>Create one</Text>
          </Text>
        </Pressable>

        <View style={{ height: 26 }} />
        {/* 
        <NimbusOAuthButtons
          onGoogle={() => console.log("TODO: Google OAuth")}
          onApple={() => console.log("TODO: Apple OAuth")}
          hideApple={Platform.OS !== "ios"}
        /> */}
      </ScreenView>
    </>
  );
}

const styles = (t: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
    },
    header: {
      marginTop: 4,
    },
    title: {
      color: t.textPrimary,
      fontSize: 30,
      fontWeight: "800", // ✅ lighter than 900
      letterSpacing: -0.2,
    },
    subtitle: {
      marginTop: 8,
      color: t.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "500",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rememberText: {
      color: t.textPrimary,
      fontWeight: "600",
    },
    link: {
      color: t.accent, // ✅ premium (no underline)
      fontWeight: "700",
    },

    footerText: {
      color: t.textSecondary,
      textAlign: "center",
      fontWeight: "600",
    },
    footerStrong: {
      color: t.textPrimary,
      fontWeight: "800",
    },
  });
