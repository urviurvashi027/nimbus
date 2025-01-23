import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Text, View, TextInput, ScreenView } from "@/components/Themed";
import { Alert, SafeAreaView, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Colors, { primaryColor } from "@/constant/Colors";
import SegmentedButton from "@/components/segmentedButton";
import { router } from "expo-router";

export default function login() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  // const { login } = useAuth();

  // const _login = (username: string, password: string) => {
  //   if (username === "" || password === "")
  //     Alert.alert("Error", "Please enter a username and password");
  //   else login(username, password);
  // };

  const firstBtnSegmentBtnClick = () => {
    // console.log(`firstSegmentBtnClick is clicked`);
    router.push("/(public)/signUp");
  };

  const secondBtnSegmentBtnClick = () => {
    // console.log(`secondBtnSegmentBtnClick is clicked`);
    router.push("/(public)/signIn");
  };

  return (
    <SafeAreaView>
      <ScreenView style={{ padding: 10, marginTop: 0 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/loginNew.jpg")}
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
          {/* <View>
            <Text>Usernames</Text>
            <TextInput
              placeholder="username"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View>
            <Text>Password</Text>
            <TextInput
              placeholder="password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <Button
            style={{ marginTop: 20 }}
            title="Log in"
            onPress={() => _login(username, password)}
          /> */}
        </View>
      </ScreenView>
    </SafeAreaView>
  );
}

const Button = ({
  title,
  onPress,
  style,
}: {
  title: string;
  onPress: () => void;
  style?: any;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    // backgroundColor: primaryColor,
    height: "70%",
    borderRadius: 40,
  },
  actionControl: {
    justifyContent: "center",
    alignContent: "center",
  },
});
