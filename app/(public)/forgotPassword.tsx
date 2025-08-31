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
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import Toast from "react-native-toast-message";
import { forgotPassword, getOtp } from "@/services/loginService";

type ForgotPasswordScreenProps = {
  submitHanlder?: (password: string) => void;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  submitHanlder,
}) => {
  const [email, setEmail] = useState<string>("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState<string>("");

  // error state
  const [error, setError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // api state
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  // useEffect
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: newTheme.textPrimary,
      headerTitle: "",
    });
  }, [navigation]);

  // input validation
  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (text.length === 0) {
      setError(true);
      setErrMsg("Email is required");
    } else if (!emailRegex.test(text)) {
      setError(true);
      setErrMsg("Please enter a valid email address");
    } else {
      console.log("coming here else email");
      setError(false);
      setErrMsg("");
    }
  };

  // button click
  const handleSave = () => {
    getOtpCall();
    // router.replace("/(public)/otpVerification");
  };

  // api call
  const getOtpCall = async () => {
    console.log(email, mobile, "email");
    const result = await forgotPassword({ email: email });
    // const result = await getOtp({ recipient: email });
    if (result && result.success) {
      setOtpSent(true);
      setLoading(false);
      router.replace({
        pathname: "/(public)/otpVerification",
        params: { mobile: mobile, email: email },
      });
      Toast.show({
        type: "success",
        text1: "OTP sent",
        position: "bottom",
      });
    }
    if (result && result.error) {
      setOtpSent(false);
      alert(result.error);
    }
  };

  return (
    <ScreenView
      style={styles.mainContainer}
      padding={0}
      bgColor={newTheme.background}
    >
      <Text style={styles.title}>Forgot password 🔒 </Text>
      <Text style={styles.subtitle}>
        Create a new password for your Nimbus account. Make sure it's secure and
        easy to remember.
      </Text>

      <InputField
        label="Email"
        preset="email"
        value={email}
        onChangeText={validateEmail}
        placeholder="john@domain.com"
      />

      <View style={{ height: 20 }} />

      <View>
        <Text style={{ color: newTheme.error }}>{errMsg}</Text>
      </View>

      <View style={{ marginTop: 20 }} />

      <StyledButton label="Get Otp" onPress={handleSave} />
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
      // padding: 20,
      // justifyContent: "center",
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "flex-start",
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

export default ForgotPasswordScreen;
