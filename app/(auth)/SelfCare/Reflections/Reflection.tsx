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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For back icon
import { useNavigation } from "expo-router";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import JournalModal from "@/components/selfCare/journaling/JorunalingModal";
import JournalItem from "@/components/selfCare/journaling/JournalingItem";
import ReflectionFeaturedCard from "@/components/selfCare/reflection/ReflectionFeatureCard";
// dummy data

import journalData from "@/constant/data/journalingList";

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

interface Track {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: any; // Image source (can be refined later)
  // source: any; // Audio source (can be refined later)
  category: string;
  isLocked: boolean;
  color: any;
}

const forYou: Track[] = [
  {
    id: "1",
    title: "Self Affirmation",
    duration: "61 min",
    image: require("../../../../assets/images/journaling/selfAffirmation.png"), // Replace with actual image
    // source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    category: "All",
    isLocked: false,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "16",
    title: "Practice Gratitude",
    duration: "3 min",
    image: require("../../../../assets/images/journaling/gratitude.png"), // Replace with actual image
    // source: require("../../../../assets/audio/soundscape/seagulls.mp3"), // Replace with actual audio file
    category: "All",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    isLocked: false,
    color: {
      cardColor: "#C1D8C3",
      descriptionColor: "#6A9C89",
    },
  },
];

const Reflection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showForYou, setShowForYou] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);

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

  const handleFeaturedCardClick = (data: any) => {
    console.log("card is clicked");
  };

  const onModalClosed = (selectedAns?: any) => {
    if (selectedAns?.length) console.log(selectedAns, "SA");
    setModalVisible(false);
  };

  return (
    <>
      <ScreenView
        style={{ padding: 0, paddingTop: Platform.OS === "ios" ? 40 : 20 }}
      >
        <View style={styles.container}>
          <ScrollView>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>

            <Text style={styles.header}>Reflection</Text>
            <Text style={styles.subHeader}>
              Immense Yourself in true nature.
            </Text>

            {/* "For You" Section */}
            {showForYou ? (
              <View>
                <FlatList
                  horizontal
                  data={forYou}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <ReflectionFeaturedCard
                      data={item}
                      onPress={handleFeaturedCardClick}
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="start"
                  snapToInterval={CARD_WIDTH + 10} // card width + margin
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                />
              </View>
            ) : null}

            {/* Journaling List */}
            <Text style={styles.sectionTitle}>All</Text>
            <FlatList
              data={journalData}
              renderItem={({ item }) => (
                <JournalItem item={item} onPress={handlePress} />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Ensures smooth vertical scrolling inside ScrollView
            />
          </ScrollView>
          {/* Journal Modal */}
          <JournalModal
            visible={modalVisible}
            onClose={onModalClosed}
            questions={selectedQuestions}
          />
        </View>
      </ScreenView>
    </>
  );
};

export default Reflection;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: themeColors[theme].background,
      paddingHorizontal: 16,
    },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    subHeader: {
      fontSize: 14,
      color: themeColors.basic.subheader,
      marginBottom: 20,
    },
    header: {
      fontSize: 26,
      fontWeight: "bold",
      color: themeColors[theme].text,
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
