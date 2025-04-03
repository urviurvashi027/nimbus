// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
import { useLocalSearchParams, useNavigation } from "expo-router";
import testData from "@/constant/data/medicalTest";
import { router } from "expo-router";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import AnalyzingResult from "./AnalyzingResult";

interface ResultScreenProps {
  data: any;
}
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ImageKey, getImage } from "@/utils/getImage";
import { Ionicons } from "@expo/vector-icons";

type result = {
  title: string;
  quote: string;
  image: ImageKey;
  results: any;
  description: string;
  tips: any;
};

const resultDataRes: result = {
  title: "Courageous Optimist",
  quote: "“Life is 10% what happens to us and 90% how we react to it.”",
  image: "anxietyRelease",
  results: [
    { label: "Household dysfunction", value: "0%" },
    { label: "Neglect", value: "9%" },
    { label: "Abuse", value: "9%" },
  ],
  description: `It appears from your responses that you have demonstrated a high level of resilience despite the difficult moments in your early years.

It may be helpful to acknowledge both the strength gained from overcoming challenges as well as any residual effects that might need attention.`,
  tips: [
    "Regular Check-ins With a Counselor: Even if you feel mostly okay, it’s good to have someone professional you can talk to when you need it.",
    "Journaling: Writing about your daily experiences can help you understand and manage your emotions better.",
    "Peer Support: Engage with friends or groups that share your interests to maintain a sense of connection.",
    "Skill Development: Activities such as workshops or online courses can help you focus on personal growth and build confidence.",
  ],
};

export default function TestResult(props: any) {
  const { data, ...rest } = props;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [resultData, setResult] = useState<result>();

  //   useEffect(() => {
  //     console.log(data, "data");
  //     setResult(data);
  //   }, [data]);

  useEffect(() => {
    console.log(data?.title, "here", props, data);
    setResult(data);
  }, [data]);

  const styles = styling(theme);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors.basic.text}
            // onPress={() => navigation.goBack()}
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <Text style={styles.title}>My result:</Text>
        <TouchableOpacity>
          <Text style={styles.shareIcon}>⤴</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.resultCard}>
          {/* <Text style={styles.resultLabel}>My result:</Text> */}
          <Text style={styles.resultTitle}>{resultData?.title}</Text>
          <Text style={styles.quote}>{resultData?.quote}</Text>

          {/* Illustration */}
          {resultData?.image && (
            <Image
              source={getImage(resultData?.image)}
              // source={require("../../../assets/images/illustration.png")} // replace with your image
              style={styles.image}
              resizeMode="contain"
            />
          )}

          {/* Percentages */}
          <View style={styles.percentagesContainer}>
            {resultData?.results.map((item: any, index: number) => (
              <View key={index} style={styles.percentageBlock}>
                <Text style={styles.percentageValue}>{`${item.score}%`}</Text>
                <Text style={styles.percentageLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Description of contents:</Text>
          <Text style={styles.cardDescription}>{resultData?.description}</Text>

          {/* Tips */}
          <Text style={[styles.cardTitle, { marginTop: 20 }]}>
            Self-Intervention Tips:
          </Text>
          {resultData?.tips.map((tip: any, idx: number) => (
            <Text key={idx} style={styles.tipText}>
              {`${idx + 1}. ${tip}`}
            </Text>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Share my result</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Retake test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E8D9F1",
    },
    header: {
      flexDirection: "row",

      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
    },
    shareIcon: {
      fontSize: 20,
    },
    resultCard: {
      backgroundColor: "#fff",
      margin: 20,
      padding: 20,
      borderRadius: 20,
    },
    resultLabel: {
      fontSize: 14,
      color: "#444",
      marginBottom: 4,
    },
    resultTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#000",
    },
    quote: {
      fontSize: 14,
      color: "#555",
      marginVertical: 8,
      fontStyle: "italic",
    },
    image: {
      width: "100%",
      height: 200,
      marginVertical: 10,
    },
    percentagesContainer: {
      flexDirection: "row",
      flexWrap: "nowrap", // allows to move to the next line if needed
      // backgroundColor: "red",
      justifyContent: "space-between",
      marginTop: 10,
    },
    percentageBlock: {
      flex: 1,
      alignItems: "center",
    },
    percentageValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
    },
    percentageLabel: {
      fontSize: 12,
      color: "#555",
      textAlign: "center",
    },
    contentCard: {
      backgroundColor: "#fff",
      margin: 20,
      padding: 20,
      borderRadius: 20,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#222",
    },
    cardDescription: {
      fontSize: 14,
      color: "#555",
      lineHeight: 20,
    },
    tipText: {
      marginTop: 8,
      fontSize: 14,
      color: "#555",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    button: {
      backgroundColor: "#8f48ff",
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 20,
      flex: 1,
      marginHorizontal: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
