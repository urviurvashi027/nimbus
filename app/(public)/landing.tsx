import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StyleSheet, Image } from "react-native";
import { router, useNavigation } from "expo-router";

//component
import { View, ScreenView, ThemeKey } from "@/components/Themed";
import SegmentedButton from "@/components/segmentedButton";

// constant
import { themeColors } from "@/constant/theme/Colors";
// context
import ThemeContext from "@/context/ThemeContext";

export default function login() {
  const navigation = useNavigation();

  // const { theme, newTheme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      // headerTransparent: true,
      // headerBackButtonDisplayMode: "minimal",
      // headerTintColor: styles.header.color,
      // headerTitle: "",
    });
  }, [navigation]);

  const firstBtnSegmentBtnClick = () => {
    // router.push("/(public)/onboardingScreen");
    router.push("/(public)/demo");
  };

  const secondBtnSegmentBtnClick = () => {
    console.log("I am clicked");
    router.push("/(public)/signIn");
  };

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  return (
    <ScreenView style={{ padding: 10, marginTop: 0 }}>
      <SafeAreaView>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/loginLatest.png")}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
          ></Image>
        </View>
        <View style={styles.actionControl}>
          <SegmentedButton
            primaryBtnText="Register"
            secondaryBtnText="LogIn"
            onBtnAction={firstBtnSegmentBtnClick}
            onSecondBtnAction={secondBtnSegmentBtnClick}
          ></SegmentedButton>
        </View>
      </SafeAreaView>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    imageContainer: {
      height: "70%",
      borderRadius: 40,
      backgroundColor: newTheme.background,
    },
    actionControl: {
      backgroundColor: newTheme.background,
      justifyContent: "center",
      alignContent: "center",
    },
  });
