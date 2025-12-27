import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Stack, router } from "expo-router";
import Toast from "react-native-toast-message";

import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

import { NimbusAuthLayout } from "@/components/public/NimbusAuthLayout";
import { NimbusInput } from "@/components/common/themeComponents/NimbusInput";
import { NimbusButton } from "@/components/common/themeComponents/NimbusButton";

import NimbusOtpVerifyStep from "@/components/public/NimbusOtpVerifyStep";
import NimbusPasswordStep from "@/components/public/NimbusPasswordStep";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

const TOTAL_STEPS = 4;
type Step = 1 | 2 | 3 | 4;

export default function RegistrationScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RegistrationFlowInner />
    </>
  );
}

function RegistrationFlowInner() {
  const { newTheme } = useContext(ThemeContext);
  const { onRegister } = useAuth();

  const [step, setStep] = useState<Step>(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useNimbusToast();

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1) as Step);

  //   const back =
  //     step > 1 ? () => setStep((s) => Math.max(1, s - 1) as Step) : undefined;

  const back = () => {
    setErrMsg(""); // optional: clear error when going back
    if (step > 1) {
      setStep((s) => Math.max(1, s - 1) as Step);
    } else {
      router.replace("/(public)/landing");
    }
  };

  const title = (txt: string) => (
    <Text
      style={{ color: newTheme.textPrimary, fontSize: 28, fontWeight: "900" }}
    >
      {txt}
    </Text>
  );

  const subtitle = (txt: string) => (
    <Text
      style={{
        color: newTheme.textSecondary,
        marginTop: 10,
        marginBottom: 22,
        lineHeight: 20,
      }}
    >
      {txt}
    </Text>
  );

  const error = () =>
    errMsg ? (
      <Text style={{ color: newTheme.error, marginTop: 12, fontWeight: "800" }}>
        {errMsg}
      </Text>
    ) : null;

  const validateStep1 = () => {
    setErrMsg("");
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!fullName.trim()) return setErrMsg("Full name is required."), false;
    if (!email.trim()) return setErrMsg("Email is required."), false;
    if (!emailRegex.test(email.trim()))
      return setErrMsg("Please enter a valid email address."), false;
    return true;
  };

  const validateStep2 = () => {
    setErrMsg("");
    if (!username.trim()) return setErrMsg("Username is required."), false;

    const codeOk = /^\+?[0-9]{2,3}$/.test(countryCode.trim());
    if (!codeOk) return setErrMsg("Country code must be like +91."), false;

    if (!/^[0-9]{10}$/.test(mobile.trim()))
      return setErrMsg("Enter a valid 10-digit mobile number."), false;

    return true;
  };

  const completeSignup = async (pwd: string) => {
    setLoading(true);
    setErrMsg("");

    try {
      const result = await onRegister?.(username, fullName, mobile, email, pwd);

      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Account created",
          message: "Account created sucessfull",
        });
        console.log("coming here succsess page");
        // router.replace("/(auth)/onboarding/QuestionScreen");
        return;
      }

      const msg =
        typeof result?.message === "string"
          ? result.message
          : JSON.stringify(result?.message ?? "Signup failed");
      setErrMsg(msg);
      toast.show({
        variant: "error",
        title: "Signup failed",
        message: "Signup failed",
      });
    } catch (e: any) {
      setErrMsg(e?.message ?? "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NimbusAuthLayout step={step} total={TOTAL_STEPS} onBack={back}>
      {step === 1 && (
        <>
          {title("Welcome! 👋")}
          {subtitle(
            "Let’s start your journey. Tell us your full name and email to get going."
          )}

          <NimbusInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
          />
          <View style={{ height: 16 }} />
          <NimbusInput
            label="Email"
            preset="email"
            value={email}
            onChangeText={setEmail}
            placeholder="john@domain.com"
          />

          {error()}

          <View style={{ height: 18 }} />
          <NimbusButton
            label="Next"
            onPress={() => validateStep1() && next()}
          />
        </>
      )}

      {step === 2 && (
        <>
          {title("Almost There 🚀")}
          {subtitle(
            "Choose a unique username and add your mobile number so we can stay connected."
          )}

          <NimbusInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="johnny123"
          />
          <View style={{ height: 16 }} />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 0.3 }}>
              <NimbusInput
                label="Code"
                preset="phone"
                value={countryCode}
                onChangeText={setCountryCode}
                placeholder="+91"
                keyboardType="phone-pad"
                maxLength={4}
              />
            </View>
            <View style={{ flex: 0.7 }}>
              <NimbusInput
                label="Mobile Number"
                preset="phone"
                value={mobile}
                onChangeText={setMobile}
                placeholder="9876543210"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {error()}

          <View style={{ height: 18 }} />
          <NimbusButton
            label="Send OTP"
            onPress={() => validateStep2() && next()}
          />
        </>
      )}

      {step === 3 && (
        <NimbusOtpVerifyStep
          username={username}
          email={email}
          onVerified={() => next()}
          onError={(msg) => setErrMsg(msg)}
        />
      )}

      {step === 4 && (
        <NimbusPasswordStep
          loading={loading}
          onSubmit={(pwd) => completeSignup(pwd)}
        />
      )}
    </NimbusAuthLayout>
  );
}
