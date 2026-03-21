import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeContext from "@/contexts/ThemeContext";

type OnboardingHeaderProps = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
};

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  step,
  totalSteps,
}) => {
  const progress = (step / totalSteps) * 100;
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  return (
    <View style={styles.container}>
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

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      marginTop: 50,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
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
