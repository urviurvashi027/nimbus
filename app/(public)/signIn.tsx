import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";
import { Text, View, TextInput, ScreenView } from "@/components/Themed";
import { Alert, SafeAreaView, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors, { primaryColor, themeColors } from "@/constant/Colors";
import SegmentedButton from "@/components/segmentedButton";
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { Button } from "@/components/Themed";

type ThemeKey = "basic" | "light" | "dark";

export default function signIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { onLogin, onRegister } = useAuth();

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Sign In",
    });
  }, [navigation]);

  useEffect(() => {
    console.log(theme, "dicover theme");
  }, [theme]);

  const styles = styling(theme);

  const onLoginClick = async () => {
    const result = await onLogin!(username, password);
    if (result && result.success) router.replace("/(auth)/(tabs)");
    if (result && result.error) {
      alert(result.msg);
    }
  };

  const _login = (username: string, password: string) => {
    if (username === "" || password === "")
      Alert.alert("Error", "Please enter a username and password");
    else onLoginClick();
  };

  return (
    <ScreenView>
      <View
        style={{
          paddingTop: 70,
          marginTop: 30,
        }}
      >
        <Text style={styles.inputLabel}>Usernames</Text>
        <TextInput
          placeholder="username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View
        style={{
          marginTop: 30,
        }}
      >
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          placeholderTextColor="gray"
          placeholder="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Log in"
        onPress={() => _login(username, password)}
      />
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      marginTop: 60,
    },
    btn: {
      marginTop: 60,
      backgroundColor: themeColors[theme]?.primaryColor,
      padding: 20,
      alignItems: "center",
      borderRadius: 10,
    },
    btnText: {
      color: themeColors[theme]?.text,
      fontWeight: 800,
      fontSize: 18,
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: themeColors.basic.GRAY,
    },
    inputLabel: {
      marginBottom: 10,
    },
  });
