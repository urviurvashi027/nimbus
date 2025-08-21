import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import { BlurView } from "@react-native-community/blur";

import testData from "@/constant/data/medicalTest";
import { getImage } from "@/utils/getImage";
import { medicalTestData, imageMap } from "@/constant/data/medicalTest";

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

  const styles = styling(theme, medicalTestDetails?.color);

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
    console.log("medicalTestData", medicalTestData);
    setMediacalTestDetails(medicalTestData);
  }, [medicalTestData]);

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name="arrow-back"
              size={24}
              color={themeColors.basic.text}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          {/* <Text style={styles.title}>ME+</Text> */}
          <TouchableOpacity>
            <Text style={styles.shareIcon}>⤴</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.heading1}>
            Trauma Test: {medicalTestDetails?.image}
          </Text>
          <Text style={styles.heading2}>{medicalTestDetails?.title}</Text>
          {/* Illustration */}
          {medicalTestDetails?.image && (
            <Image
              source={getImage(medicalTestDetails.image)}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          {/* Description Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description of contents</Text>
            <Text style={styles.cardDescription}>
              {medicalTestDetails?.description}
            </Text>
          </View>
          {/* Description Card */}
          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>Description of contents</Text>
            <Text style={styles.cardDescription}>
              {medicalTestDetails?.description}
            </Text>
          </View> */}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What You Will Get</Text>

            {medicalTestDetails?.content.map(
              (
                section: { title: string; body: string },
                sectionIndex: number
              ) => (
                <View key={sectionIndex} style={{ marginBottom: 16 }}>
                  {/* Section Title */}
                  <Text style={styles.sectionTitle}>{section.title}</Text>

                  {/* Section Body */}
                  {(section.body || "")
                    .split("\n")
                    .map((line: string, lineIndex: number) => (
                      <Text
                        key={lineIndex}
                        style={[
                          styles.cardDescription,
                          { marginBottom: line.trim() === "" ? 10 : 0 }, // spacing for empty lines
                        ]}
                      >
                        {line}
                      </Text>
                    ))}
                </View>
              )
            )}
          </View>
          {/* Description Card */}
          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>What You will'get</Text>
            {medicalTestDetails?.content.body
              .split("\n")
              .map((line: string, index: number) => (
                <Text
                  key={index}
                  style={[
                    styles.cardDescription,
                    { marginBottom: line === "" ? 10 : 0 },
                  ]}
                >
                  {line}
                </Text>
              ))} */}
          {/* <Text style={styles.cardDescription}>
              Welcome to our self-screening questionnaire for childhood trauma.
              Throughout our childhood, we have all felt the anguish of
              rejection, neglect, and even bullying from someone else. Yet, when
              does the pain we experience start to transition into lasting
              trauma?
            </Text> */}
          {/* </View> */}
          {/* Spacer to prevent content from being hidden behind the button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed Button */}
      {/* Fixed Button + Blur */}
      <View style={styles.fixedButtonContainer}>
        {/* <BlurView
          style={styles.blurBackground}
          blurType="light"
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        > */}
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Get Start!</Text>
        </TouchableOpacity>
        {/* </BlurView> */}
      </View>
    </View>

    // </View>
    // <View style={styles.startContainer}>
    //   <TouchableOpacity style={styles.backButton}>
    //     <Ionicons
    //       name="arrow-back"
    //       size={24}
    //       color={themeColors[theme].text}
    //       onPress={() => navigation.goBack()}
    //     />
    //   </TouchableOpacity>

    //   <Text style={styles.testTitle}>{medicalTestDetails?.title}</Text>
    //   <Text style={styles.testDescription}>
    //     {medicalTestDetails?.description}
    //   </Text>

    //   <TouchableOpacity style={styles.startButton} onPress={onStart}>
    //     <Text style={styles.startButtonText}>Get Start!</Text>
    //     <Ionicons name="arrow-forward" size={20} color="white" />
    //   </TouchableOpacity>
    // </View>
  );
};

export default StartScreen;

const styling = (theme: ThemeKey, color?: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // height: "100%",
      backgroundColor: "#f5e9fa",
    },
    scrollContent: {
      paddingBottom: 150, // extra space for button clearance
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: themeColors.basic.darkGrey,
      textAlign: "center",
      marginVertical: 15,
    },
    backArrow: {
      fontSize: 24,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
    },
    shareIcon: {
      fontSize: 20,
    },
    mainContent: {
      padding: 20,
    },
    heading1: {
      fontSize: 24,
      fontWeight: "400",
      color: "#000",
    },
    heading2: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 20,
    },
    image: {
      width: "100%",
      height: 200,
      marginBottom: 20,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    cardTitle: {
      fontWeight: "bold",
      fontSize: 18,
      color: color,
      marginBottom: 10,
    },
    blurBackground: {
      borderRadius: 30,
      overflow: "hidden",
    },
    cardDescription: {
      fontSize: 14,
      color: "#555",
      lineHeight: 20,
      textAlign: "left", // <<< fix
      alignSelf: "stretch",
    },
    fixedButtonContainer: {
      position: "absolute",
      bottom: 30,
      left: 20,
      right: 20,
    },
    button: {
      backgroundColor: "#8f48ff",
      padding: 15,
      borderRadius: 25,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },

    /** Result Screen **/
    startContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      // padding: 0,
    },
    backButton: { position: "absolute", top: 40, left: 0 },
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
