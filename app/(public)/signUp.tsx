import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  // TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";

import { themeColors } from "@/constant/Colors";
import { ScreenView, TextInput } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeKey } from "@/components/Themed";
import Toast from "react-native-toast-message";

import { getOtp, verifyOtp } from "@/services/loginService";

export default function signUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setfullName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  // Custom regex for email validation.
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const navigation = useNavigation();
  const { onRegister } = useAuth();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Sign In",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
      },
    });
  }, [navigation]);

  const onCreateAccount = () => {
    if (!email || !password || !fullName || !username || !mobile) {
      Toast.show({
        type: "error",
        text1: "Please fill the required field",
        position: "bottom",
      });
    } else {
      // Validate email on change.
      if (!emailRegex.test(email)) {
        Toast.show({
          type: "error",
          text1: "Please enter a valid email address.",
          position: "bottom",
        });
      }

      onSignUpClick();
    }
  };

  const onSignUpClick = async () => {
    const result = await onRegister!(
      username,
      fullName,
      mobile,
      email,
      password
    );
    if (result && result.success) {
      Toast.show({
        type: "success",
        text1: "Account created successfuly",
        position: "bottom",
      });
      router.push("/(public)/onboardingScreen");
      // router.replace("/(public)/signIn");
    }
    if (result && result.error) {
      alert(result.msg);
    }
  };

  const getOtpCall = async () => {
    const result = await getOtp({ phone_number: `+91${mobile}` });
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
      alert(result.error);
    }
  };

  const verifyOtpCall = async (mobileNumber: string, enteredOtp: string) => {
    const result = await verifyOtp({
      phone_number: mobileNumber,
      otp: enteredOtp,
    });
    setLoading(true);

    if (result && result.success) {
      setOtpVerified(true);
      setLoading(false);
      setOtpSent(false);
      Toast.show({
        type: "success",
        text1: "OTP Verified",
        position: "bottom",
      });
    }
    if (result && result.error) {
      Toast.show({
        type: "error",
        text1: "Invalid Otp",
        position: "bottom",
      });
      setOtpVerified(false);
      alert(result.error);
    }
  };

  useEffect(() => {
    if (mobile.length === 10) {
      getOtpCall();
      // setError("");
    } else {
      // setError("Mobile number must be 10 digits");
    }
  }, [mobile]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtpCall(`+91${mobile}`, otp);
      setError("");
    } else {
      // setError("Mobile number must be 10 digits");
    }
  }, [otp]);

  const handleMobileChange = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    setMobile(numeric);
    if (numeric.length === 10) {
      setError("");
    } else {
      setError("Mobile number must be 10 digits");
    }
  };

  const handleOtpChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(cleaned);
  };

  return (
    <ScreenView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create An Account</Text>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          placeholderTextColor="gray"
          onChangeText={(value) => setfullName(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter User Name"
          placeholderTextColor="gray"
          onChangeText={(value) => setUsername(value)}
        ></TextInput>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.codeBox}>
          <Text style={styles.countryCode}>+91</Text>
        </View>
        <TextInput
          style={styles.mobileInput}
          placeholder="Enter Mobile Number"
          placeholderTextColor="gray"
          keyboardType="number-pad"
          maxLength={10}
          value={mobile}
          onChangeText={handleMobileChange}
        />
      </View>

      {/* OTP Input */}
      {otpSent && (
        <View
          style={{
            marginTop: 30,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="gray"
            maxLength={6}
            value={otp}
            onChangeText={handleOtpChange}
          ></TextInput>
        </View>
      )}

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="gray"
          onChangeText={(value) => setEmail(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          secureTextEntry={true}
          placeholderTextColor="gray"
          style={styles.input}
          placeholder="Enter Password"
          onChangeText={(value) => setPassword(value)}
        ></TextInput>
      </View>

      <View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      {/* Sign In Button */}
      <View>
        <TouchableOpacity style={styles.createButton} onPress={onCreateAccount}>
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Create Account Button */}
      {/* <View> */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.replace("/(public)/signIn")}
      >
        <Text style={styles.signBtnText}>Sign In</Text>
      </TouchableOpacity>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      paddingTop: 95,
    },
    titleContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
    },
    header: {
      color: themeColors[theme]?.text,
    },
    createButton: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors[theme].primaryColor,
      marginTop: 50,
    },
    signInButton: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors[theme].backgroundColor,
      borderColor: themeColors[theme].primaryColor,
      marginTop: 20,
      borderWidth: 1,
    },
    createBtnText: {
      color: themeColors[theme].text,
      textAlign: "center",
      fontSize: 17,
    },
    signBtnText: {
      color: themeColors[theme].primaryColor,
      textAlign: "center",
      fontSize: 17,
    },
    inputLabel: {
      color: themeColors[theme].text,
      marginBottom: 10,
    },
    placeholderColor: {},
    title: {
      color: themeColors[theme].text,
      fontSize: 25,
    },
    codeBox: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 8,
    },
    inputContainer: {
      flexDirection: "row",
      marginTop: 30,
      alignItems: "center", // align vertically
      // backgroundColor: "red",
    },
    countryCode: {
      fontSize: 16,
      marginRight: 8,
      width: 40,
      color: "#000",
    },
    mobileInput: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22, // keeps consistent spacing
      minWidth: 200,
      // width: "100%",
      // color: "#000",
    },
    errorText: {
      color: "red",
      fontSize: 13,
      marginTop: 6,
    },
  });
