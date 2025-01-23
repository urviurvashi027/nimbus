import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import { router, useNavigation } from "expo-router";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

type ThemeKey = "basic" | "light" | "dark";

export default function HabitBasic() {
  const { habitData, setHabitData } = useContext(HabitContext);
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  useEffect(() => {
    // console.log(navigation);
    console.log("navigated");
    navigation.setOptions({
      headerShown: true,
      // headerStyle: {
      //   backgroundColor: "#f4511e",
      // },
      headerTransparent: true,
      headerTitle: "Habit Basic Details",
    });
  }, [navigation]);

  const styles = styling(theme);

  useEffect(() => {
    console.log(habitData, "habitData from basic");
  }, [habitData]);

  const onContinueClick = () => {
    console.log("continue clicked habit Schedules");
    router.push("/create-habit/habitMetric");
  };

  return (
    <ScreenView style={{ paddingTop: 75 }}>
      <Text>Habit Basic</Text>

      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Continue"
        onPress={onContinueClick}
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
