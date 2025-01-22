import { StyleSheet, TouchableOpacity } from "react-native";

import { View, Text } from "@/components/Themed";
import { router } from "expo-router";

export default function TabOneScreen() {
  const onContinueClick = () => {
    console.log("pushed");
    router.push("/create-habit/habitBasic");
  };

  return (
    <View>
      <Text>You are logged in</Text>

      <TouchableOpacity
        onPress={onContinueClick}
        // onPress={() => router.push("/create-habit/habitBasic")}
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
          Continuee
        </Text>
      </TouchableOpacity>
    </View>
  );
}
