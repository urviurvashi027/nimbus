import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Alert } from "react-native";
import { router, useNavigation } from "expo-router";

//context
import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

//constant

// components
import { ScreenView } from "@/components/Themed";
import InputField from "@/components/common/ThemedComponent/StyledInput";
import {
  AppleIcon,
  GoogleIcon,
  StyledButton,
} from "@/components/common/ThemedComponent/StyledButton";
import { ThemeKey } from "@/components/Themed";
import { StyledCheckbox } from "@/components/common/ThemedComponent/StyledCheckbox";

export default function signIn() {
  // input state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, SetRememberMe] = useState(false);

  const { onLogin } = useAuth();

  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: styles.header.color,
      headerTitle: "",
    });
  }, [navigation]);

  const onLoginClick = async () => {
    try {
      const result = await onLogin!(username, password);
      if (result?.success) {
        router.replace("/(auth)/(tabs)"); // Navigate on success
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const handleSignUpClick = () => {
    router.replace("/(public)/demo");
    // router.replace("/(public)/signUp");
  };

  const handleForgotPasswordClick = () => {
    // router.replace("/(public)/otpVerification");
    router.replace("/(public)/forgotPassword");
  };

  const _login = (username: string, password: string) => {
    if (username === "" || password === "")
      Alert.alert("Error", "Please enter a username and password");
    else onLoginClick();
  };

  return (
    <ScreenView style={styles.mainContainer} bgColor={newTheme.background}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Join Nimbus Today</Text>
        <Text style={styles.titleDescription}>
          Start your habit journey with Nimbus, Its quick and easy
        </Text>
      </View>
      <View
        style={{
          marginTop: 30,
        }}
      >
        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="John Cena"
        />
      </View>
      <View
        style={{
          marginTop: 30,
        }}
      >
        <InputField
          label="Password"
          preset="password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={true}
        />
      </View>
      <View style={{ height: 20 }} />

      <View>
        <StyledCheckbox
          checked={rememberMe}
          onToggle={() => SetRememberMe(!rememberMe)}
          label={<Text style={styles.rememberMeText}>Remember Me To DO</Text>}
        />
      </View>
      <View style={{ height: 20 }} />

      <StyledButton
        label="Sign in"
        style={{ borderRadius: 12 }}
        onPress={() => _login(username, password)}
      />

      <View style={{ height: 20 }} />

      <Pressable onPress={handleSignUpClick}>
        <Text style={styles.signTextContainer}>
          Do not have an account?{" "}
          <Text style={{ color: newTheme.textPrimary }}>Sign up</Text>
        </Text>
      </Pressable>

      <View style={{ height: 10 }} />
      <Pressable onPress={handleForgotPasswordClick}>
        <Text style={styles.signTextContainer}>
          <Text style={{ color: newTheme.textPrimary }}>Forgot Password</Text>
        </Text>
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={{ color: "#A1A69B" }}>or</Text>
        <View style={styles.divider} />
      </View>

      {/* Social buttons */}
      <StyledButton
        label="Continue with Google"
        variant="secondary"
        onPress={() => {}}
        leftIcon={<GoogleIcon />}
        style={{ borderRadius: 12, marginBottom: 12 }}
      />
      <StyledButton
        label="Continue with Apple"
        variant="secondary"
        onPress={() => {}}
        leftIcon={<AppleIcon />}
        style={{ borderRadius: 12 }}
      />
    </ScreenView>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    mainContainer: {
      paddingTop: 95,
    },
    titleContainer: {
      paddingTop: 20,
    },
    title: {
      paddingBottom: 5,
      color: newTheme.textPrimary,
      fontSize: 25,
    },
    titleDescription: {
      fontSize: 14,
      color: newTheme.textSecondary,
    },
    rememberMeText: {
      color: newTheme.textPrimary,
    },
    header: {
      color: newTheme.textPrimary,
    },
    signTextContainer: {
      color: newTheme.textSecondary,
      fontSize: 14,
      textAlign: "center",
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: newTheme.divider,
      marginHorizontal: 8,
    },
  });
