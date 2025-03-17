import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";

import testData from "@/constant/data/medicalTest";
import { medicalTestData } from "@/constant/data/medicalTest";

interface StartScreenProps {
  onStart: () => void;
  medicalTestData?: any;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  medicalTestData,
}) => {
  const [medicalTestDetails, setMediacalTestDetails] = useState<
    medicalTestData | undefined
  >();
  const { id } = useLocalSearchParams(); // Get habit ID from route params

  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // const getTestDetails = (id: string | string[]) => {
  //   const res = testData.find((item, index) => item.id === id);
  //   setMediacalTestDetails(res);
  //   return res;
  // };

  // useEffect(() => {
  //   if (id) {
  //     const habitId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
  //     getTestDetails(id);
  //   }
  // }, [id]);

  useEffect(() => {
    setMediacalTestDetails(medicalTestData);
  }, [medicalTestData]);

  return (
    <View style={styles.startContainer}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={themeColors[theme].text}
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>

      <Text style={styles.testTitle}>{medicalTestDetails?.title}</Text>
      <Text style={styles.testDescription}>
        {medicalTestDetails?.description}
      </Text>

      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Get Start!</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    /** Result Screen **/
    startContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      // padding: 0,
    },
    backButton: { position: "absolute", top: 50, left: 0 },
    testTitle: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      color: themeColors[theme].text,
      // color: "white",
    },
    testDescription: {
      textAlign: "center",
      fontSize: 16,
      color: themeColors[theme].text,
      // color: "#ddd",
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
