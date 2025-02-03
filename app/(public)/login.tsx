import React from "react";
import { StyleSheet, Image } from "react-native";
import { View, ScreenView } from "@/components/Themed";
import { SafeAreaView } from "react-native";
import SegmentedButton from "@/components/segmentedButton";
import { router } from "expo-router";

export default function login() {
  const firstBtnSegmentBtnClick = () => {
    router.push("/(public)/signUp");
  };

  const secondBtnSegmentBtnClick = () => {
    router.push("/(public)/signIn");
  };

  return (
    <SafeAreaView>
      <ScreenView style={{ padding: 10, marginTop: 0 }}>
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
      </ScreenView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: "70%",
    borderRadius: 40,
  },
  actionControl: {
    justifyContent: "center",
    alignContent: "center",
  },
});
