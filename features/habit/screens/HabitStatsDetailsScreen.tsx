import { View, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ScreenView } from "@/components/ui/Themed";
import ThemeContext from "@/contexts/ThemeContext";
import StatsDetails from "@/features/habit/components/habit-statistics/StatsDetails";

export const HabitStatsDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScreenView style={styles.gestureContainer}>
      <View style={styles.container}>
        <StatsDetails habitId={id as string} onBack={() => navigation.goBack()} />
      </View>
    </ScreenView>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    gestureContainer: {
      backgroundColor: newTheme.background,
    },
    container: {},
  });
