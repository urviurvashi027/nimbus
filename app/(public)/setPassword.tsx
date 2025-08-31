import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputField from "@/components/common/ThemedComponent/StyledInput";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton"; // reusable button we created earlier
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { setPassword as setPasswordCall } from "@/services/loginService";
import Toast from "react-native-toast-message";

type SetPasswordMode = "embedded" | "forgotPassword";

type SetPasswordScreenProps = {
  isEmbedded?: boolean; // embed mode
  //   onSuccess?: () => void;
  mode?: SetPasswordMode;
  otp?: string;
  email?: string;
  submitHanlder?: (password: string) => void;
};

const SetPasswordScreen: React.FC<SetPasswordScreenProps> = ({
  isEmbedded = false,
  mode = "forgotPassword",
  otp,
  email,
  submitHanlder,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [paramEmailData, setParamEmailData] = useState<string>("");
  const [paramOtpData, setParamOtpData] = useState<string>("");

  const navigation = useNavigation();

  const { email: emailParamVal, otp: otpParamVal } = useLocalSearchParams();

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: newTheme.textPrimary,
      headerTitle: "",
    });
  }, [navigation]);

  const setPasswordHandler = () => {
    console.log("setPasswordHandler called");
    onSetPassword();
  };

  const onSetPassword = async () => {
    const r = {
      email: paramEmailData,
      otp: paramOtpData,
      password: password,
    };
    const result = await setPasswordCall(r);
    if (result && result.success) {
      router.replace("/(public)/signIn");
      Toast.show({
        type: "success",
        text1: "Password Set",
        position: "bottom",
      });
    }
    if (result && result.error_code) {
      alert(result.message);
    }
  };

  useEffect(() => {
    if (emailParamVal && otpParamVal) {
      const email = Array.isArray(emailParamVal)
        ? emailParamVal[0]
        : emailParamVal;
      setParamEmailData(email);
      const otp = Array.isArray(otpParamVal) ? otpParamVal[0] : otpParamVal;
      setParamOtpData(otp);
    }
  }, [emailParamVal, otpParamVal]);

  const handleSave = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (mode === "embedded" && submitHanlder) {
      submitHanlder(password);
    }
    if (mode === "forgotPassword") {
      setPasswordHandler();
    }
    Alert.alert("Success", "Password reset successfully!");
  };

  const content = (
    <>
      <Text style={styles.title}>{isEmbedded}Secure Your Account 🔒 </Text>
      <Text style={styles.subtitle}>
        Create a new password for your Habilty account. Make sure it's secure
        and easy to remember.
      </Text>

      <InputField
        label="New Password"
        preset="password"
        enablePasswordToggle
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <View style={{ height: 20 }} />

      <InputField
        label="Confirm New Password"
        preset="password"
        enablePasswordToggle
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
      />

      <View style={{ marginTop: 40 }} />

      <StyledButton label="Save New Password" onPress={handleSave} />
    </>
  );

  if (isEmbedded) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <ScreenView
      style={styles.mainContainer}
      padding={0}
      bgColor={newTheme.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    mainContainer: {
      paddingTop: 95,
    },
    container: {
      flex: 1,
      backgroundColor: newTheme.background,
    },
    title: {
      color: newTheme.textPrimary,
      fontSize: 22,
      fontWeight: "700",
      marginTop: 10,
      marginBottom: 8,
    },
    subtitle: {
      color: newTheme.textSecondary,
      fontSize: 14,
      marginBottom: 24,
      lineHeight: 20,
    },
  });

export default SetPasswordScreen;
