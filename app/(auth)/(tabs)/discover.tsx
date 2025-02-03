import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect } from "react";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

// const { theme, toggleTheme } = useContext(ThemeContext);

type ThemeKey = "basic" | "light" | "dark";

export default function Discover() {
  const colorScheme = useColorScheme();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  // const handleToggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   if (!theme) console.log("theme is not set");
  //   console.log("toggling theme", theme, newTheme);
  //   toggleTheme(newTheme);
  // };

  // const styless = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     padding: 24,
  //     paddingTop: 75,
  //     backgroundColor: theme === "dark" ? "black" : "white",
  //   },
  //   text: {
  //     color: theme === "dark" ? "white" : "black",
  //   },
  //   button: {
  //     color: theme === "dark" ? "black" : "white",
  //   },
  // });

  useEffect(() => {
    console.log(theme, "dicover theme");
  }, [theme]);

  const styles = styling(theme);

  return (
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
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: theme === "dark" ? "black" : "white",
//   },
//   text: {
//     color: theme === "dark" ? "white" : "black",
//   },
//   button: {
//     color: theme === "dark" ? "black" : "white",
//   },
// });

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
