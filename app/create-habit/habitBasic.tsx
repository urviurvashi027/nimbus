import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { router, useNavigation } from "expo-router";

export default function HabitBasic() {
  const navigation = useNavigation();

  useEffect(() => {
    // console.log(navigation);
    console.log("navigated");
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
    <View style={{ paddingTop: 75 }}>
      <Text>HabitBasic</Text>

      <TouchableOpacity
        // onPress={onContinueClick}
        onPress={() => router.push("/create-habit/habitMetric")}
        style={{
          backgroundColor: "blue",
          padding: 25,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 17,
          }}
        >
          Continues
        </Text>
      </TouchableOpacity>
    </View>
  );
}
