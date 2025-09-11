import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";

import { themeColors } from "@/constant/theme/Colors";
import { ScreenView, TextInput } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeKey } from "@/components/Themed";
import Toast from "react-native-toast-message";
import { useOnboarding } from "@/context/OnBoardingContext";

export default function signUp() {
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  // const { onboardingData, setDynamicAnswer, setProfileInfo } = useOnboarding();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const navigation = useNavigation();
  const router = useRouter();

  const handleProfileSubmit = async () => {
    if (!age || !height || !weight) {
      alert("Please fill all fields");
      return;
    }

    // setProfileInfo({ age, height, weight });
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push("/(auth)/OnBoarding/OnboardingFinalSubmit");
    // router.push("/(public)/OnboardingFinalSubmit");
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      // headerTitle: "abdbd",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
      },
    });
  }, [navigation]);

  const onCreateAccount = () => {
    if (!age || !weight || !height) {
      Toast.show({
        type: "error",
        text1: "Please fill the required field",
        position: "bottom",
      });
    } else {
      handleProfileSubmit();
      // Validate email on change.
      //   if (!emailRegex.test(email)) {
      //     Toast.show({
      //       type: "error",
      //       text1: "Please enter a valid email address.",
      //       position: "bottom",
      //     });
      //   }

      // router.push("/(public)/OnboardingFinalSubmit");
    }
  };

  return (
    <ScreenView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Basic Details</Text>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Your age"
          placeholderTextColor="gray"
          onChangeText={(value) => setAge(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Your Weight"
          placeholderTextColor="gray"
          onChangeText={(value) => setWeight(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Your Height"
          placeholderTextColor="gray"
          onChangeText={(value) => setHeight(value)}
        ></TextInput>
      </View>

      {/* <View
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
      </View> */}

      {/* <View
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
      </View> */}

      {/* Sign In Button */}
      <View>
        <TouchableOpacity style={styles.createButton} onPress={onCreateAccount}>
          <Text style={styles.createBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Create Account Button */}
      {/* <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.replace("/(public)/signIn")}
      >
        <Text style={styles.signBtnText}>Sign In</Text>
      </TouchableOpacity> */}
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
  });
