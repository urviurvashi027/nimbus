import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function HabitMetric() {
  const navigation = useNavigation();

  useEffect(() => {
    console.log(navigation);
    navigation.setOptions({
      headerShown: true,
      // headerStyle: {
      //   backgroundColor: "#f4511e",
      // },
      headerTransparent: true,
      headerTitle: "Habit Metric Details",
    });
  }, [navigation]);

  return (
    <View>
      <Text>Habit Metric</Text>
    </View>
  );
}
