import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StyledButton } from "@/components/ui/StyledButton";

// Example SVG imports
import OnboardingIcon from "@/assets/images/onboarding.png";
import ThemeContext from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ROUTES } from "@/constants/routes";

export const OnboardingSuccessScreen = () => {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  return (
    <View style={styles.container}>
      {/* Success Image */}
      <Image
        source={OnboardingIcon}
        style={styles.icon}
        contentFit="contain"
      />

      {/* Header */}
      <Text style={styles.title}>You’re All Set!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your profile is ready. Let’s start building your mindful routines.
      </Text>

      {/* CTA Button */}
      <StyledButton
        label="Go to Dashboard"
        onPress={() => router.replace(ROUTES.TABS.HOME)}
        style={{ marginTop: 40, width: "100%" }}
      />
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: newTheme.background,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },
    icon: {
      width: 200,
      height: 200,
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: "#ECEFF4",
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: "#A1A69B",
      textAlign: "center",
    },
  });
