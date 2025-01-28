import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "../../../context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";

type ThemeKey = "basic" | "light" | "dark";

export default function Setting() {
  //  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  //  const styles = styling(theme);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  return (
    <ScreenView>
      <Text>Text</Text>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.basic.secondaryColor,
    },
  });
