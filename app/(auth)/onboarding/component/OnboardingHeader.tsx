import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";

type OnboardingHeaderProps = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
};

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  step,
  totalSteps,
  onBack,
}) => {
  const router = useRouter();

  const progress = (step / totalSteps) * 100;

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {/* <Pressable
        onPress={onBack || (() => router.back())}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={22} color="#ECEFF4" />
      </Pressable> */}

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Step Info */}
      <Text style={styles.stepText}>
        {step} / {totalSteps}
      </Text>
    </View>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    container: {
      marginTop: 50,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    backButton: {
      padding: 6,
      marginRight: 12,
    },
    progressBar: {
      flex: 1, // take available space
      height: 6,
      backgroundColor: newTheme.surface,
      borderRadius: 3,
      overflow: "hidden",
      marginHorizontal: 12,
    },
    progressFill: {
      height: "100%",
      backgroundColor: newTheme.accent, // purple accent
      borderRadius: 3,
    },
    stepText: {
      color: newTheme.textPrimary,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

export default OnboardingHeader;
