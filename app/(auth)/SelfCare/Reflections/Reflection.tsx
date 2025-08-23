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

import ThemeContext from "@/context/ThemeContext";

import { themeColors } from "@/constant/Colors";

import { ScreenView } from "@/components/Themed";
import { ThemeKey } from "@/components/Themed";
import JournalModal from "@/components/selfCare/journaling/JorunalingModal";
import JournalItem from "@/components/selfCare/journaling/JournalItem";
import ReflectionFeaturedCard from "@/components/selfCare/reflection/ReflectionFeatureCard";

import { getJournalList } from "@/services/selfCareService";

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

const Reflection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<
    { id: number; text: string }[]
  >([]);
  const [showForYou, setShowForYou] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);

  const [favList, setFavList] = useState<any[] | undefined>();
  const [journalList, setJournalList] = useState<any[] | undefined>();

  const [templateId, setTemplateId] = useState<number>();

  const handlePress = (questions: any[], templateId: number) => {
    setTemplateId(templateId);
    setSelectedQuestions(questions); // Store selected questions
    setModalVisible(true); // Open modal
  };
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const colorPalette = [
    { bgColor: "#fadbd8", color: "#f19c94" },
    { bgColor: "#d5f5e3", color: "#acebc8" },
    { bgColor: "#f8e187", color: "#fbedb7" },
    { bgColor: "#d6eaf8", color: "#95c9ed" },
    { bgColor: "#E8DAEF", color: "#c7a5d8" },
  ];

  const styles = styling(theme);

  const getJournalListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getJournalList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedList = result.map((item: any) => {
          // Return a new object with the original properties plus the new ones
          return {
            ...item, // Spread operator to keep original properties
            image: {
              uri: item.icon,
            },
          };
        });
        const topThreeItems = processedList.slice(0, 3);
        setFavList(topThreeItems);
        setJournalList(processedList);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getJournalListData();
  }, []);

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
                  data={favList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <ReflectionFeaturedCard
                      data={item}
                      onPress={handleFeaturedCardClick}
                      cardColor={colorPalette[index % colorPalette.length]}
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
              data={journalList}
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
            templateId={templateId}
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
      // paddingHorizontal: 10,
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
    // description: {
    //   fontSize: 14,
    //   color: "#666",
    // },
  });
