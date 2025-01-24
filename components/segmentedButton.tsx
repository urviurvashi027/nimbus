import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "./Themed";
import { useThemeColor } from "./Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

type segmentedButtonProps = {
  onBtnAction: () => void;
  onSecondBtnAction: () => void;
  primaryBtnText: string;
  secondaryBtnText: string;
};

type ThemeKey = "basic" | "light" | "dark";

export default function SegmentedButton(props: segmentedButtonProps) {
  const { onBtnAction, onSecondBtnAction, primaryBtnText, secondaryBtnText } =
    props;

  const [activeButton, setActiveButton] = useState<"register" | "login" | null>(
    null
  );

  const colorScheme = useColorScheme();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  useEffect(() => {
    console.log(theme, "theme from segmented button");
  }, [theme]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          activeButton === "register" && styles.activeButton,
        ]}
        onPress={() => {
          setActiveButton("register");
          onBtnAction();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            activeButton === "register" && styles.activeButtonText,
          ]}
        >
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, activeButton === "login" && styles.activeButton]}
        onPress={() => {
          setActiveButton("login");
          onSecondBtnAction();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            activeButton === "login" && styles.activeButtonText,
          ]}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: themeColors[theme]?.primaryColor,
      borderRadius: 8,
      backgroundColor: themeColors[theme]?.background,
      alignItems: "center",
    },
    activeButton: {
      backgroundColor: themeColors[theme]?.primaryColor,
    },
    buttonText: {
      borderColor: themeColors[theme]?.primaryColor,
      fontSize: 18,
      fontWeight: "bold",
    },
    activeButtonText: {
      color: "white",
    },
  });
