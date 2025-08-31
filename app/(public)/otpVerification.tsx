import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Alert } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
// context
import { useAuth } from "@/context/AuthContext";
import ThemeContext from "@/context/ThemeContext";
// types
import { ColorSet } from "@/types/themeTypes";
// compenent
import { ScreenView } from "@/components/Themed";
import { ThemeKey } from "@/components/Themed";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import { getOtp, verifyOtp } from "@/services/loginService";
import Toast from "react-native-toast-message";

const OTP_LENGTH = 6;

type OtpVerificationMode = "embedded" | "forgotPassword";

type OtpVerificationScreenProps = {
  isEmbedded?: boolean; // new prop to allow embedding
  mode?: OtpVerificationMode;
  mobile?: string;
  email?: string;
  onVerified?: () => void;
};

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  isEmbedded = false,
  mode = "forgotPassword",
  email,
  mobile,
  onVerified,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailVal, setEmailVal] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  // error state
  const [error, setError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // api state
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation();

  const { mobile: mobileParamVal, email: emailParamVal } =
    useLocalSearchParams();

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  useEffect(() => {}, [mobile]);

  useEffect(() => {
    console.log(emailParamVal, "emailParamVal");
    if (emailParamVal) {
      const email = Array.isArray(emailParamVal)
        ? emailParamVal[0]
        : emailParamVal;
      setEmailVal(email);
      // const mobile = Array.isArray(mobileParamVal)
      //   ? mobileParamVal[0]
      //   : mobileParamVal;
      // setPhoneNumber(mobile);
      console.log(email, mobile, "here ");
    }
  }, [emailParamVal]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: newTheme.textPrimary,
      headerTitle: "",
    });
  }, [navigation]);

  useEffect(() => {
    // only in case of called as component
    if (email && mobile && email.length > 0) {
      setEmailVal(email);
      setPhoneNumber(mobile);
      getOtpCall(mobile, email);
    }
  }, [mobile, email]);

  // api call
  const getOtpCall = async (mobile: string, email: string) => {
    const result = await getOtp({ recipient: email });
    if (result && result.success) {
      setOtpSent(true);
      setLoading(false);
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

  const verifyOtpCall = async (enteredOtp: string) => {
    console.log(emailVal, "emailVal");
    const result = await verifyOtp({
      recipient: emailVal,
      otp: enteredOtp,
    });
    setLoading(true);

    if (result && result.success) {
      setOtpVerified(true);
      setLoading(false);
      setOtpSent(false);
      if (mode === "embedded" && onVerified) {
        onVerified();
      }
      if (mode === "forgotPassword") {
        router.replace({
          pathname: "/(public)/setPassword",
          params: { otp: enteredOtp, email: emailVal },
        });
        // router.replace("/(public)/setPassword");
      }
      Toast.show({
        type: "success",
        text1: "OTP Verified",
        position: "bottom",
      });
    }
    if (result && result.error_code) {
      Toast.show({
        type: "error",
        text1: `${result.message}`,
        position: "bottom",
      });
      setOtpVerified(false);
      // alert(result.message);
    }
  };

  // countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      } else {
        inputs.current[index]?.blur();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      Alert.alert("Error", "Please enter the complete OTP");
      return;
    }
    try {
      const r = { otp: code, email: emailVal };
      console.log(r, "result paylod");
      verifyOtpCall(code);
      // duplicate
      if (mode === "embedded" && onVerified) {
        onVerified();
      }
      if (mode === "forgotPassword") {
        console.log("coming here", mode);
        console.log(email, code, otp, mobile);
        router.replace("/(public)/setPassword");

        router.replace({
          pathname: "/(public)/setPassword",
          params: { email: email, otp: code },
        });
      }
      // Alert.alert("Success", "OTP Verified Successfully");
      //   console.log(response.data);
    } catch (error) {
      Alert.alert("Error", "OTP Verification Failed");
      console.error(error);
    }
  };

  const content = (
    <>
      <Text style={styles.title}>Enter OTP Code 🔒</Text>
      <Text style={styles.subtitle}>
        Check your email inbox for a password reset code. Enter the code below
        to continue.
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.otpBox, digit ? styles.otpFilled : null]}
          />
        ))}
      </View>

      {/* Timer + Resend */}
      {timer > 0 ? (
        <Text style={styles.timerText}>
          You can resend the code in{" "}
          <Text style={{ color: newTheme.accent }}>{timer} seconds</Text>
        </Text>
      ) : (
        <Pressable onPress={() => setTimer(60)}>
          <Text style={[styles.timerText, { color: newTheme.accent }]}>
            Resend code
          </Text>
        </Pressable>
      )}
      <StyledButton label="Verify" onPress={handleSubmit} />
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
    otpRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    otpBox: {
      width: 50,
      height: 50,
      borderWidth: 2,
      borderRadius: 12,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "600",
      color: newTheme.textPrimary,
      borderColor: newTheme.surface,
      backgroundColor: newTheme.surface,
    },
    otpFilled: {
      borderColor: newTheme.accent,
    },
    timerText: {
      color: newTheme.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
  });

export default OtpVerificationScreen;
