import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton"; // reuse your styled button
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";

import RelaxMenIcon from "@/assets/images/logoNew/1.svg";
import MeditationWomenIcon from "@/assets/images/logoNew/2.svg";
// import SoundscapeIcon from "../../assets/images/buttonLogo/selfcare/soundscape.svg";

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme, newTheme } = useContext(ThemeContext);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const styles = styling(theme, newTheme);

  const firstBtnSegmentBtnClick = () => {
    router.push("/(public)/demo");
  };

  const secondBtnSegmentBtnClick = () => {
    router.push("/(public)/signIn");
  };

  return (
    <ScreenView style={{ padding: 10, marginTop: 0 }}>
      <View style={styles.container}>
        {/* Top Illustrations */}
        <View style={styles.illustrationWrapper}>
          <View style={styles.imageContainer}>
            <RelaxMenIcon width={width * 0.8} height={width * 0.8} />
          </View>
        </View>

        {/* Hero / Tagline */}
        <Text style={styles.tagline}>
          🌩️ Nimbus — Your Everyday Growth Companion
        </Text>

        {/* Headline */}
        <Text style={styles.headline}>
          Stronger mind. Healthier body. Happier you.
        </Text>

        {/* Supporting text */}
        <Text style={styles.helper}>
          Track your growth, master your routines, and unlock the best version
          of yourself — one step at a time.
        </Text>

        <View style={{ marginTop: 40 }} />

        {/* Buttons */}

        <StyledButton
          label="I’m new to Nimbus"
          style={{ borderRadius: 12 }}
          onPress={firstBtnSegmentBtnClick}
        />

        <Pressable onPress={secondBtnSegmentBtnClick}>
          <Text style={styles.secondaryButton}>
            I’m already have an account
          </Text>
        </Pressable>
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: newTheme.background,
      justifyContent: "flex-start",
    },
    imageContainer: {
      borderRadius: 40,
      padding: 20,
      backgroundColor: newTheme.background,
    },
    illustrationWrapper: {
      marginTop: 70,
      alignItems: "center",
    },
    illustrationItem: {
      width: 100,
      height: 100,
    },
    label: {
      position: "absolute",
      backgroundColor: newTheme.textPrimary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    labelText: {
      fontSize: 12,
      fontWeight: "600",
      color: newTheme.textSecondary,
    },
    title: {
      marginTop: 30,
      textAlign: "center",
    },
    subtitle: {
      color: newTheme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
      marginTop: 12,
      textAlign: "center",
    },

    helper: {
      color: newTheme.textPrimary,
      fontSize: 14,
      marginTop: 6,
      textAlign: "center",
    },
    secondaryButton: {
      marginTop: 16,
      color: newTheme.textPrimary,
      fontSize: 14,
      textAlign: "center",
      fontWeight: "600",
    },
    tagline: {
      marginTop: 30,
      textAlign: "center",
      fontSize: 14,
      fontWeight: "700",
      color: "#A3BE8C", // accent green
    },

    headline: {
      color: "#ECEFF4",
      fontSize: 28,
      fontWeight: "700",
      marginTop: 12,
      textAlign: "center",
    },
  });

export default OnboardingScreen;
