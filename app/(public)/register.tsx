import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";

import InputField from "@/components/common/ThemedComponent/StyledInput";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import OtpVerificationScreen from "./otpVerification";
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import SignUpPasswordScreen from "./signUpPassword";

const TOTAL_STEPS = 4;

const RegistrationFlow = () => {
  const [step, setStep] = useState<number>(1);

  // input state
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // error state
  const [error, setError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const { onRegister } = useAuth();

  const nextStep = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

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

  // API Call
  const onSignUpClick = async (password: string) => {
    if (error) return;
    const result = await onRegister!(
      username,
      fullName,
      mobile,
      email,
      password
    );
    // success handled
    if (result && result.success) {
      Toast.show({
        type: "success",
        text1: "Account created successfuly",
        position: "bottom",
      });
      router.push("/OnBoarding/QuestionScreen");
    }
    // failure handled
    if (result.error_code || !result.success) {
      let msg =
        typeof result.message === "string"
          ? result.message
          : JSON.stringify(result.message); // if object with field errors
      Toast.show({
        type: "error",
        text1: "Something went wrong: Retry again later",
        position: "bottom",
      });
      alert(msg);
    }
  };

  // Input Validation
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
      setError(false);
      setErrMsg("");
    }
  };

  const validatePhone = (text: string) => {
    setMobile(text);
    if (text.length === 0) {
      setError(true);
      setErrMsg("Mobile number is required");
    } else if (!/^[0-9]{10}$/.test(text)) {
      setError(true);
      setErrMsg("Enter a valid 10-digit number");
    } else {
      setError(false);
      setErrMsg("");
    }
  };

  const validateCountryCode = (text: string) => {
    setCountryCode(text);
    if (text.length < 2 || text.length > 3) {
      setError(true);
      setErrMsg("Code must be 2–3 digits");
    } else if (!/^\\+?[0-9]{2,3}$/.test(text)) {
      setError(true);
      setErrMsg("Invalid code");
    } else {
      setError(false);
      setError(true);
      setErrMsg("");
    }
  };

  // Button and callback handler

  const onSetNewPasswordHandler = (password: string) => {
    setPassword(password);
    onSignUpClick(password);
  };

  const nextStepHandler = () => {
    if (!error) nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>Welcome! 👋</Text>
            <Text style={styles.subtitle}>
              Let’s start your journey. Tell us your full name and email to get
              going.
            </Text>
            <InputField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
            />
            <View style={{ height: 20 }} />
            <InputField
              label="Email"
              preset="email"
              value={email}
              onChangeText={validateEmail}
              placeholder="john@domain.com"
            />
            <View style={{ marginTop: 40 }} />
            <View>
              <Text style={{ color: newTheme.error }}>{errMsg}</Text>
            </View>
            <View style={{ marginTop: 10 }} />
            <StyledButton label="Next" onPress={nextStepHandler} />
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.title}>Almost There 🚀</Text>
            <Text style={styles.subtitle}>
              Choose a unique username and add your mobile number so we can stay
              connected.
            </Text>
            <InputField
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="johnny123"
            />
            <View style={{ height: 20 }} />
            {/* Country code + Phone row */}
            <View style={styles.phoneRow}>
              <View style={{ flex: 0.2, marginRight: 10 }}>
                <InputField
                  label="Code"
                  value={countryCode}
                  onChangeText={validateCountryCode}
                  placeholder="+91"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={{ flex: 0.8 }}>
                <InputField
                  label="Mobile Number"
                  value={mobile}
                  onChangeText={validatePhone}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={{ marginTop: 40 }} />
            <View>
              <Text style={{ color: newTheme.error }}>{errMsg}</Text>
            </View>
            <View style={{ marginTop: 10 }} />
            <StyledButton label="Next" onPress={nextStepHandler} />
          </View>
        );

      case 3:
        return (
          <OtpVerificationScreen
            isEmbedded={true}
            mode="embedded"
            email={email}
            mobile={mobile}
            onVerified={() => {
              nextStepHandler();
            }}
          />
        );

      case 4:
        return <SignUpPasswordScreen submitHanlder={onSetNewPasswordHandler} />;

      default:
        return null;
    }
  };

  return (
    <ScreenView style={styles.mainContainer} bgColor={newTheme.background}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {step > 1 ? (
            <Pressable onPress={prevStep}>
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Path
                  d="M15 18l-6-6 6-6"
                  stroke="#ECEFF4"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} /> // keeps space even if hidden
          )}
          <Text style={styles.progressText}>
            {step} / {TOTAL_STEPS}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(step / TOTAL_STEPS) * 100}%` },
            ]}
          />
        </View>

        {/* Step Content */}
        <View style={{ flex: 1, marginTop: 30 }}>{renderStep()}</View>
      </View>
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 20,
    },
    backButton: { width: 40, alignItems: "flex-start" },
    backPlaceholder: { width: 40 }, // invisible placeholder
    progressText: {
      color: newTheme.textPrimary,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: "auto",
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    progressBarWrapper: {
      height: 6,
      borderRadius: 6,
      backgroundColor: newTheme.surface,
      marginTop: 12,
    },
    progressBarFill: {
      height: 6,
      borderRadius: 6,
      backgroundColor: newTheme.accent,
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

export default RegistrationFlow;
