import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";

// Example SVG imports
import OnboardingIcon from "@/assets/images/logoNew/2.svg";
import ForgotPasswordIcon from "@/assets/images/logoNew/2.svg";
import RegisterIcon from "@/assets/images/logoNew/2.svg";
import ResetPasswordIcon from "@/assets/images/logoNew/2.svg";
import { Href, router } from "expo-router";

type SuccessType =
  | "finishedOnboarding"
  | "finishedForgotPassword"
  | "finishedRegister"
  | "finishedResetPassword";

type SuccessScreenProps = {
  type: SuccessType;
  onButtonPress: () => void;
};

// Config mapping
const successConfig: Record<
  SuccessType,
  {
    image: React.ReactNode;
    title: string;
    subtitle: string;
    buttonLabel: string;
    route: Href;
  }
> = {
  finishedOnboarding: {
    image: <OnboardingIcon width={120} height={120} />,
    title: "Welcome to Nimbus 🎉",
    subtitle: "Your growth journey starts now.",
    buttonLabel: "Go to Dashboard",
    route: "/(public)/signIn",
  },
  finishedForgotPassword: {
    image: <ForgotPasswordIcon width={120} height={120} />,
    title: "Check Your Email 📧",
    subtitle: "We’ve sent you a link to reset your password.",
    buttonLabel: "Back to Login",
    route: "/(public)/signIn",
  },
  finishedRegister: {
    image: <RegisterIcon width={120} height={120} />,
    title: "Account Created ✅",
    subtitle: "You’re ready to explore Nimbus.",
    buttonLabel: "Start Exploring",
    route: "/(public)/signIn",
  },
  finishedResetPassword: {
    image: <ResetPasswordIcon width={120} height={120} />,
    title: "You’re All Set!",
    subtitle: "Your password has been successfully updated.",
    buttonLabel: "Go to Homepage",
    route: "/(public)/signIn",
  },
};

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  type,
  onButtonPress,
}) => {
  const { image, title, route, subtitle, buttonLabel } =
    successConfig[type] ?? successConfig.finishedResetPassword;

  const handlePress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      router.replace(route);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.imageWrapper}>{image}</View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* CTA */}
      <StyledButton
        label={buttonLabel}
        onPress={handlePress}
        style={{ borderRadius: 24, marginTop: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1E1A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageWrapper: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
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

export default SuccessScreen;
