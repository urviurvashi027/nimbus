import React, { useContext, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { postOnboardingData } from "@/services/loginService";
import { router, useNavigation } from "expo-router";
import { useOnboarding } from "@/context/OnBoardingContext";
import { ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

const OnboardingFinalSubmit: React.FC = ({}) => {
  const { onboardingData, resetOnboardingData } = useOnboarding();
  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);
  const navigation = useNavigation();
  useEffect(() => {
    submit();
  }, []);

  const submit = async () => {
    try {
      await postOnboardingData(onboardingData);
      resetOnboardingData();
      router.push("/(auth)/(tabs)/setting");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Submitting your answers...</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#8C52FF",
    },
    header: {
      color: themeColors[theme]?.text,
    },
    text: { fontSize: 18, color: "white", marginBottom: 20 },
  });

export default OnboardingFinalSubmit;
