import { useNavigation, useRouter } from "expo-router";
import { useOnboarding } from "@/context/OnBoardingContext";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
} from "react-native";
import { onboardingSteps } from "@/constant/data/onboardingData";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";

export default function OnboardingScreen() {
  const { onboardingData, setDynamicAnswer, setProfileInfo } = useOnboarding();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const stepData = onboardingSteps[currentStep];

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Details",
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
      },
    });
  }, [navigation]);

  const handleSelect = async (option: string) => {
    setDynamicAnswer(stepData.key, option);
    //  setDynamicAnswer({ [stepData.key]: option });
    // setOnboardingData({ [stepData.key]: option }); // <-- Dynamically store using key
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1); // Go to next question
    } else {
      router.push("/(public)/ProfileScreen");
      // router.push("/(public)/(onboarding)/screen/OnboardingFinalSubmit"); // After last step, submit
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/onboarding.png")}
      style={styles.background}
    >
      {/* Sun and Bird Animation if needed */}

      <View style={styles.container}>
        <Text style={styles.title}>{stepData.question}</Text>

        {stepData.options.map((option, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.option}
            onPress={() => handleSelect(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {/* (Optional) Progress Dots */}
        <View style={styles.dotsContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep ? styles.activeDot : {},
              ]}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    background: { flex: 1, alignItems: "center", justifyContent: "center" },
    container: { width: "90%", alignItems: "center", marginTop: 200 },
    title: {
      fontSize: 24,
      color: "white",
      marginBottom: 30,
      textAlign: "center",
    },
    header: {
      color: themeColors[theme]?.text,
    },
    option: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 10,
      width: "100%",
      marginBottom: 15,
    },
    optionText: { textAlign: "center", fontSize: 18 },
    dotsContainer: { flexDirection: "row", marginTop: 30 },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "red",
      margin: 5,
      opacity: 0.5,
    },
    activeDot: { opacity: 1, backgroundColor: "#FFFFFF" },
  });
