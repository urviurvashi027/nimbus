import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { PieChart } from "react-native-chart-kit";

import testData from "@/constant/data/medicalTest";
import { router } from "expo-router";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";

interface ResultScreenProps {
  data: any;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ data }) => {
  console.log(data, "data Result");

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  return (
    <View style={styles.resultContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.closeText}>Close</Text>
      </View>
      <Text style={styles.resultTitle}>My result:</Text>
      <Text style={styles.resultHeading}>{data.title}</Text>

      <Image source={data.image} style={styles.resultImage} />

      <Text style={styles.resultDescription}>{data.description}</Text>

      <PieChart
        data={data.chartDetails}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: "#FFF",
          backgroundGradientFrom: "#FFF",
          backgroundGradientTo: "#FFF",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />
      {/* <View style={styles.resultScores}>
      {Object.entries(chartDetails.scores).map(([key, value]) => (
        <Text key={key} style={styles.scoreText}>
          {value} {key}
        </Text>
      ))}
    </View> */}

      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share my result</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => router.push("/(auth)/Tools/test")}
      >
        <Text style={styles.retakeButtonText}>Retake test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResultScreen;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    /** Result Screen **/
    resultContainer: {
      flex: 1,
      backgroundColor: "#EAE6FF",
      alignItems: "center",
      padding: 16,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    backText: {
      fontSize: 24,
      color: themeColors[theme].text,
    },
    closeText: {
      fontSize: 16,
      color: themeColors[theme].text,
      // color: "white",
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
