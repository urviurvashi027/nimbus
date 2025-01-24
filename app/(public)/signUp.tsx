import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  useColorScheme,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useNavigation, useRouter } from "expo-router";
import { themeColors } from "@/constant/Colors";
import { ScreenView, TextInput } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

type ThemeKey = "basic" | "light" | "dark";

export default function signUp() {
  const navigation = useNavigation();
  const { onLogin, onRegister } = useAuth();
  const router = useRouter();

  const colorScheme = useColorScheme();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setfullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Sign In",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
        // marginBottom: 20,
        // height: 40,
      },
    });
  }, [navigation]);

  const onCreateAccount = () => {
    if (!email && !password && !fullName && !username) {
      if (Platform.OS != "android") {
        setVisible(true);
      } else {
        ToastAndroid.show(
          "Please enter all the required fields",
          ToastAndroid.BOTTOM
        );
      }
      return;
    }

    onSignUpClick();
    // router.replace("/routine");
  };

  const onSignUpClick = async () => {
    const result = await onRegister!(username, fullName, email, password);
    if (result && result.success) router.replace("/(public)/signIn");
    if (result && result.error) {
      alert(result.msg);
    }
  };

  const styles = styling(theme);

  return (
    <ScreenView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create An Account</Text>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          placeholderTextColor="gray"
          onChangeText={(value) => setfullName(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter User Name"
          placeholderTextColor="gray"
          onChangeText={(value) => setUsername(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="gray"
          onChangeText={(value) => setEmail(value)}
        ></TextInput>
      </View>

      <View
        style={{
          marginTop: 30,
        }}
      >
        <TextInput
          secureTextEntry={true}
          placeholderTextColor="gray"
          style={styles.input}
          placeholder="Enter Password"
          onChangeText={(value) => setPassword(value)}
        ></TextInput>
      </View>

      {/* Sign In Button */}
      <View>
        <TouchableOpacity style={styles.createButton} onPress={onCreateAccount}>
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Create Account Button */}
      {/* <View> */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.replace("/(public)/signIn")}
      >
        <Text style={styles.signBtnText}>Sign In</Text>
      </TouchableOpacity>
      {/* </View> */}
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      paddingTop: 95,
    },
    titleContainer: {
      // justifyContent: "center",
      // alignItems: "center",
      justifyContent: "center", // Centers vertically
      alignItems: "center",
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
      // borderColor: themeColors.basic.GRAY,
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
      // alignContent: "center",
    },
  });
