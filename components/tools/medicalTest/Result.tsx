import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import testData from "@/constant/data/medicalTest";

const ResultScreen = () => (
  <View style={styles.resultContainer}>
    <Text style={styles.resultTitle}>My result:</Text>
    <Text style={styles.resultHeading}>{testData.results.title}</Text>

    <Image source={testData.results.image} style={styles.resultImage} />

    <Text style={styles.resultDescription}>{testData.results.description}</Text>

    <View style={styles.resultScores}>
      {Object.entries(testData.results.scores).map(([key, value]) => (
        <Text key={key} style={styles.scoreText}>
          {value} {key}
        </Text>
      ))}
    </View>

    <TouchableOpacity style={styles.shareButton}>
      <Text style={styles.shareButtonText}>Share my result</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.retakeButton}>
      <Text style={styles.retakeButtonText}>Retake test</Text>
    </TouchableOpacity>
  </View>
);

export default ResultScreen;

const styles = StyleSheet.create({
  /** Result Screen **/
  resultContainer: {
    flex: 1,
    backgroundColor: "#EAE6FF",
    alignItems: "center",
    padding: 16,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#4B0082",
  },
  resultHeading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 10,
  },
  resultImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginVertical: 10,
  },
  resultDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },

  resultScores: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  scoreText: { fontSize: 16, fontWeight: "bold", color: "#6C5CE7" },

  shareButton: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  shareButtonText: { fontSize: 16, color: "white", fontWeight: "bold" },

  retakeButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
  },
  retakeButtonText: { fontSize: 16, fontWeight: "bold", color: "#4B0082" },
});
