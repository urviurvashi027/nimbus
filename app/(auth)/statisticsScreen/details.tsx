import { View, Text, StyleSheet, Platform, Button } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import StatsDetails from "@/components/habitStatistics/StatsDetails";

const StatsScreen = () => {
  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styling(newTheme);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <SafeAreaView>
          <ScrollView>
            <StatsDetails />
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ScreenView>
  );
};

export default StatsScreen;
const styling = (newTheme: any) =>
  StyleSheet.create({
    gestureContainer: {
      backgroundColor: newTheme.background,
    },
    container: {},
    header: {
      color: newTheme.textPrimary,
    },
  });
