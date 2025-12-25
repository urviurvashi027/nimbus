import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
// import { themeColors } from "@/constant/theme/Colors";

export default function NewUserScreen() {
  // const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const handleOnboardingStart = () => {
    // router.push("/(auth)/OnBoarding/onboardingScreen");
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Invite to embark on your habit journey.
        </Text>
        <Text style={styles.subtitle}>
          Promote rituals to build consistency over time.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleOnboardingStart}
        >
          <Text style={styles.primaryButtonText}>Toggle your onboarding</Text>
        </TouchableOpacity>

        <View style={styles.stepContainer}>
          <Text style={styles.stepBullet}>1</Text>
          <Text style={styles.stepContent}>
            Settings to get started with your habit
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepBullet}>2</Text>
          <Text style={styles.stepContent}>
            Keep your list of the habits visible to you
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepBullet}>3</Text>
          <Text style={styles.stepContent}>Read them on this screen again</Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepBullet}>4</Text>
          <Text style={styles.stepContent}>Honor your habit space here</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.stepContainer}>
          <Text style={styles.stepBullet}>5</Text>
          <Text style={styles.stepContent}>
            Monitor this weekly habit tracker for your growth journey to develop
            a mindset
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepBullet}>7</Text>
          <Text style={styles.stepContent}>
            Save your habit visual form Create better focus visually, reflect on
            what you’ve done. It’s about mindful progress not your speed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "red",
      // paddingTop: 50,
    },
    backButton: {
      position: "absolute",
      top: 50,
      left: 20,
      zIndex: 10,
    },
    content: {
      paddingHorizontal: 24,
      paddingBottom: 40,
      paddingTop: 80,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 13,
      textAlign: "center",
      color: "#999",
      marginBottom: 50,
    },
    primaryButton: {
      backgroundColor: "#FADADD",
      borderRadius: 10,
      paddingVertical: 12,
      marginBottom: 40,
    },
    primaryButtonText: {
      textAlign: "center",
      fontSize: 15,
      fontWeight: "600",
    },
    stepContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 25,
    },
    stepBullet: {
      width: 24,
      height: 24,
      borderRadius: 12,
      paddingVertical: 3,
      backgroundColor: "#FADADD",
      textAlign: "center",
      fontWeight: "700",
      marginRight: 12,
    },
    stepContent: {
      fontSize: 14,
      color: "#333",
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: "#ccc",
      // marginTop: 14,
      marginBottom: 34,
    },
  });
