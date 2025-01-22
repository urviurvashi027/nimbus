import {
  Button,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { View, Text } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

type ThemeKey = "basic" | "light" | "dark";

export default function TabTwoScreen() {
  const { user, logout } = useAuth();

  const colorScheme = useColorScheme();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  useEffect(() => {
    console.log("two", user);
  }, []);

  useEffect(() => {
    console.log(theme, "dicover theme");
  }, [theme]);

  if (!user) return <Text>Loading...</Text>;

  const styles = styling(theme);

  return (
    <View className="flex-1 flex flex-col justify-center px-4 items-center">
      <Text>Account</Text>
      <Text>{user?.username || "No username"}</Text>
      <Button title="Log out" onPress={logout} />
      <View style={styles.container}>
        <Text style={styles.text}>Current Theme: {theme}</Text>
        <Text style={styles.text}>System Theme: {colorScheme}</Text>
        <TouchableOpacity
          onPress={() => toggleTheme("light")}
          style={{
            marginTop: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: theme === "dark" ? "#fff" : "#000",
          }}
        >
          <Text style={styles.button}>Light Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleTheme("dark")}
          style={{
            marginTop: 20,
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: theme === "dark" ? "#fff" : "#000",
          }}
        >
          <Text style={styles.button}>Dark Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => useSystemTheme()}
          style={{
            marginTop: 20,
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: theme === "dark" ? "#fff" : "#000",
          }}
        >
          <Text style={styles.button}>System Theme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 75,
      backgroundColor: themeColors[theme]?.themeColor,
    },
    text: {
      color: themeColors[theme]?.text,
    },
    button: {
      color: themeColors[theme]?.button,
    },

    // container: {
    //   flex: 1,
    //   justifyContent: "center",
    //   backgroundColor: themeColors[theme]?.themeColor,
    //   paddingHorizontal: 20,
    // },
    textStyle: {
      color: themeColors[theme]?.white,
    },
    textInputStyle: {
      borderColor: themeColors[theme]?.gray,
      padding: 10,
      borderWidth: 2,
      borderRadius: 5,
      width: "100%",
      marginTop: 20,
      color: themeColors[theme]?.white,
    },
    touchableStyle: {
      backgroundColor: themeColors[theme]?.sky,
      padding: 10,
      borderRadius: 6,
      width: "100%",
      height: 57,
      justifyContent: "center",
      marginTop: 20,
    },
    buttonTextStyle: {
      textAlign: "center",
      color: themeColors[theme]?.commonWhite,
      fontSize: 20,
      fontWeight: "500",
    },
  });
