import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Alert } from "react-native";
import { router, useNavigation } from "expo-router";

import { TextInput, ScreenView } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { Button } from "@/components/Themed";
import { ThemeKey } from "@/components/Themed";

export default function signIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { onLogin } = useAuth();

  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: styles.header.color,
      headerTitle: "",
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
      },
    });
  }, [navigation]);

  const styles = styling(theme);

  const onLoginClick = async () => {
    try {
      const result = await onLogin!(username, password);
      if (result?.success) {
        router.replace("/(auth)/(tabs)"); // Navigate on success
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const _login = (username: string, password: string) => {
    if (username === "" || password === "")
      Alert.alert("Error", "Please enter a username and password");
    else onLoginClick();
  };

  return (
    <ScreenView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
      </View>
      <View
        style={{
          marginTop: 30,
          backgroundColor: themeColors.basic.primaryColor,
        }}
      >
        <TextInput
          placeholder="Username"
          placeholderTextColor="#cfcac9"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View
        style={{
          marginTop: 30,
          backgroundColor: themeColors.basic.primaryColor,
        }}
      >
        <TextInput
          placeholderTextColor="#cfcac9"
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <Button
        style={styles.btn}
        textStyle={styles.signBtnText}
        title="Log in"
        onPress={() => _login(username, password)}
      />
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    btn: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors[theme].backgroundColor,
      borderColor: themeColors[theme].primaryColor,
      marginTop: 20,
      borderWidth: 1,
    },
    btnText: {
      color: themeColors[theme]?.text,
      fontWeight: 800,
      fontSize: 18,
    },
    container: {
      paddingTop: 95,
    },
    titleContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
    },
    header: {
      color: themeColors[theme]?.text,
    },
    createButton: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors[theme].primaryColor,
      marginTop: 50,
    },
    signInButton: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors[theme].backgroundColor,
      borderColor: themeColors[theme].primaryColor,
      marginTop: 20,
      borderWidth: 1,
    },
    createBtnText: {
      color: themeColors[theme].text,
      textAlign: "center",
      fontSize: 17,
    },
    signBtnText: {
      color: themeColors[theme].primaryColor,
      textAlign: "center",
      fontSize: 17,
    },
    inputLabel: {
      color: themeColors[theme].text,
      marginBottom: 10,
    },
    placeholderColor: {},
    title: {
      color: themeColors[theme].text,
      fontSize: 25,
    },
  });
