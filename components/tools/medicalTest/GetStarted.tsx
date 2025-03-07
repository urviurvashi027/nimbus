import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import testData from "@/constant/data/medicalTest";

const StartScreen = ({ onStart }: any) => {
  console.log(testData, "testDAT");

  return (
    <View style={styles.startContainer}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.testTitle}>{testData.title}</Text>
      <Text style={styles.testDescription}>{testData.description}</Text>

      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Get Start!</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  /** Result Screen **/
  startContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
  backButton: { position: "absolute", top: 50, left: 20 },
  testTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  testDescription: {
    textAlign: "center",
    fontSize: 16,
    color: "#ddd",
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: "purple",
    padding: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  startButtonText: { color: "white", fontSize: 18, marginRight: 10 },
});
