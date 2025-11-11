import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
// application level import
import ThemeContext from "@/context/ThemeContext";
// import { themeColors } from "@/constant/theme/Colors";
import {
  buttons as NavigationButton,
  NavigationButtonType,
} from "@/constant/data/selfCareButton";
import { banners } from "@/constant/data/banner";
// Need to remove these data once api is integrated
import { medTests } from "@/constant/data/medicalTest";

import { ScreenView } from "@/components/Themed";
import { ThemeKey } from "@/components/Themed";
import TrendingCardCarousel from "@/components/tools/common/TrendingCardCarousel";
import HorizontalListCardScroll from "@/components/tools/common/HorizontalListCardScroll";
import VideoClassCard from "@/components/selfCare/VideoClassCard";
import HorizontalBanner from "@/components/tools/common/HorizontalBanner";
import PricingModal from "@/components/common/PricingModal";
import SleepModal from "../SelfCare/Sleep/Sleep";
import ThingsToDoModal from "../SelfCare/ThingsToDo/ThingsToDo";

import {
  getMeditationAudioList,
  getMentalTestList,
  getWorkoutVideo,
} from "@/services/selfCareService";
import { getRoutineList, getSoundscapeList } from "@/services/toolService";

const SelfCare: React.FC = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState("");

  const [videoList, setVideoList] = useState<any[]>([]);
  const [meditationList, setMeditationList] = useState<any[]>([]);
  const [libraryTracks, setLibraryTracks] = useState<any[]>([]);
  const [medicalListData, setMedicalListData] = useState<any[]>([]);

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSleepTagsModal, setShowSleepTagsModal] = useState(false);
  const [showThingsToDoTagsModal, setShowThingsToDoTagsModal] = useState(false);
  const [routineList, setRoutineList] = useState<any[] | undefined>();

  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  // Funstion called on click of navigation button clicked
  const handleNavigationButtonPress = (button: NavigationButtonType) => {
    if (button.action === "navigate") {
      router.push(button.screen);
    } else if (button.action === "modal") {
      getModalInfo(button.screen);
    }
  };

  const getWorkoutListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getWorkoutVideo();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedVideo = result.map((item: any) => {
          return {
            ...item, // Spread operator to keep original properties
            isLocked: false,
            coachName: "UU",
            image: {
              uri: item.image,
            },
          };
        });

        setVideoList(processedVideo);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const getMeditationlList = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getMeditationAudioList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedAudio = result.map((item: any) => {
          return {
            ...item, // Spread operator to keep original properties
            isLocked: false,
            coachName: "UU",
            image: {
              uri: item.image,
            },
          };
        });
        setMeditationList(processedAudio);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const getSoundscapeListData = async () => {
    try {
      const result = await getSoundscapeList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedArticles = result.map((tracks: any) => {
          return {
            ...tracks, // Spread operator to keep original properties
            duration: tracks.duration || "3",
            image: {
              uri: tracks.image,
            },
          };
        });
        setLibraryTracks(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getSoundscapeListData();
  }, []);

  useEffect(() => {
    getWorkoutListData();
    getMeditationlList();
  }, []);

  // helper function to enable the modal
  const getModalInfo = (modalName: string) => {
    switch (modalName) {
      case "Sleep":
        setShowSleepTagsModal(true);
        break;
      case "thingsToDo":
        setShowThingsToDoTagsModal(true);
        break;
    }
  };

  const handleCardPress = (id: string) => {
    console.log("Pressed card id:", id);
  };

  // function to be called on click of all button horizontalListCard
  const onClickOfAll = (title: string) => {
    switch (title) {
      case "medicalTest":
        router.push("/(auth)/SelfCare/test");
        break;
      case "soundscape":
        router.push("/(auth)/SelfCare/Soundscape/Soundscape");
        break;
      case "meditation":
        router.push("/(auth)/SelfCare/Meditation/Meditation");
        break;
      case "routine":
        router.push("/(auth)/Tools/Routine/Routine");
        break;
    }
  };

  const handleBannerPress = (id: string) => {
    console.log("Banner pressed:", id);
  };

  const handleWorkoutVideoClicked = (card: any) => {
    if (card.isLocked) {
      setShowPricingModal(true);
    } else {
      setShowPricingModal(false);
    }
  };

  const getRoutineData = async (category?: string) => {
    // need to add filters functionality and category param changes
    try {
      const result = await getRoutineList(category);
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedArticles = result.map((article: any) => {
          // Return a new object with the original properties plus the new ones
          return {
            ...article, // Spread operator to keep original properties
            image: {
              uri: article.image,
            },
          };
        });
        setRoutineList(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  // TODO ADD MEDTEST API DATA
  const getMentalListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getMentalTestList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        console.log(result, "medialTestk");
        setMedicalListData(result);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", typeof result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getRoutineData();
    // getMentalListData();
  }, []);

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <SafeAreaView style={{ flex: 1, padding: 0 }}>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleText}>Self Care</Text>
        </View>
        {/* Navigation Button */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navigationScrollView}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          {NavigationButton.map((button: NavigationButtonType) => {
            const IconComponent = button.icon;
            return (
              <View style={styles.navigationButtonContainer} key={button.id}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNavigationButtonPress(button)}
                >
                  <IconComponent
                    width={styles.buttonIcon.width}
                    height={styles.buttonIcon.height}
                  />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>{button.label}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* MasterClass Section */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingTop: 16, paddingLeft: 0, paddingBottom: 20 }}
          >
            {videoList.map((card) => (
              <VideoClassCard
                key={card.id}
                title={card.title}
                coachName={card?.coachName}
                thumbnail={card.image}
                onPress={() => handleWorkoutVideoClicked(card)}
              />
            ))}
          </ScrollView>

          {/* {Soundscpae} */}
          <HorizontalListCardScroll
            title="Soundscape"
            description="The sound of nature gives you better sleep."
            backgroundColor="#fff9d2"
            itemList={libraryTracks}
            onClickOfAll={() => onClickOfAll("soundscape")}
          />

          {/* AudioBook */}
          <TrendingCardCarousel
            type="rotuine"
            title="New and Trendings"
            data={routineList ?? []}
            onClickOfAll={() => onClickOfAll("routine")}
            onPress={handleCardPress}
          />

          {/* Medical Test */}
          <HorizontalListCardScroll
            title="Medical Test"
            description="Mental health is everything"
            backgroundColor="#cbc7f6"
            noOfRows={2}
            itemList={medTests}
            onClickOfAll={() => onClickOfAll("medicalTest")}
          />

          <HorizontalBanner data={banners} onPress={handleBannerPress} />

          {/* Meditation */}
          <HorizontalListCardScroll
            title="Meditation"
            description="Now is a great time to be present. Now is good, too. And now"
            backgroundColor="#fadfdd"
            itemList={meditationList}
            onClickOfAll={() => onClickOfAll("meditation")}
          />

          {/* Motivation */}
        </ScrollView>
      </SafeAreaView>

      {/* Modal Details */}
      {/* Sleep Modal */}
      <SleepModal
        visible={showSleepTagsModal}
        onClose={() => setShowSleepTagsModal(false)}
      />

      <PricingModal
        visible={showPricingModal}
        onClose={() => {
          setShowPricingModal(false);
        }}
        onSeizePress={() => {
          console.log("onSeizeClicked");
        }}
      />

      {/* Things To Do Modal */}
      <ThingsToDoModal
        isVisible={showThingsToDoTagsModal}
        onClose={() => setShowThingsToDoTagsModal(false)}
      />
    </ScreenView>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    screenTitle: {
      marginBottom: 30,
    },
    screenTitleText: {
      fontSize: 30,
      fontWeight: "bold",
      color: newTheme.textPrimary,
    },
    navigationScrollView: {
      marginBottom: 20,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 20,
      marginBottom: 10,
      marginTop: 10,
    },
    navigationButtonContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    content: {
      padding: 0,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 25, // Makes the button rounded
      marginRight: 12, // Space between buttons
    },
    buttonIcon: {
      width: 60,
      height: 60,
      borderRadius: 25, // Makes the button rounded
    },
    buttonLabel: {
      paddingTop: 10,
      // alignContent: "center",
      // justifyContent: "center",
      alignItems: "center",
      color: newTheme.textPrimary,
      fontSize: 10,
    },
  });

export default SelfCare;
