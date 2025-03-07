import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For back icon
import { useNavigation } from "expo-router";

import journalData from "@/constant/data/journalingList";
import renderItem from "@/components/tools/journaling/JournalingItem";
import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import JournalModal from "@/components/tools/journaling/JorunalingModal";
import JournalItem from "@/components/tools/journaling/JournalingItem";

const Reflection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handlePress = (questions: any) => {
    setSelectedQuestions(questions); // Store selected questions
    setModalVisible(true); // Open modal
  };
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <ScreenView
          style={{ padding: 0, paddingTop: Platform.OS === "ios" ? 50 : 20 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reflection</Text>
          </View>

          {/* Quote Banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>When Work Makes You Angry</Text>
            <Text style={styles.bannerText}>Don't let anger control you!</Text>
            <Image
              source={require("../../../../assets/images/angry.png")}
              style={styles.bannerImage}
            />
          </View>

          {/* Journaling List */}
          <Text style={styles.sectionTitle}>All</Text>
          <FlatList
            data={journalData}
            renderItem={({ item }) => (
              <JournalItem item={item} onPress={handlePress} />
            )}
            // renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Ensures smooth vertical scrolling inside ScrollView
          />
        </ScreenView>
      </ScrollView>
      {/* Journal Modal */}
      <JournalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        questions={selectedQuestions}
      />
    </>
  );
};

export default Reflection;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors[theme].background,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 10,
    },
    banner: {
      backgroundColor: "#2D3142",
      borderRadius: 12,
      padding: 20,
      marginVertical: 10,
      position: "relative",
    },
    bannerTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    bannerText: {
      color: "#ccc",
      fontSize: 14,
      marginTop: 5,
    },
    bannerImage: {
      width: 80,
      height: 80,
      position: "absolute",
      right: 15,
      bottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
      padding: 12,
      marginVertical: 6,
      borderRadius: 12,
    },
    icon: {
      width: 50,
      height: 50,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    description: {
      fontSize: 14,
      color: "#666",
    },
  });
