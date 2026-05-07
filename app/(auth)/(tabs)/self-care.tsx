import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";

// application level import
import ThemeContext from "@/contexts/ThemeContext";
import { ROUTES } from "@/constants/routes";

import {
  buttons as NavigationButton,
  NavigationButtonType,
} from "@/constants/data/selfCareButton";
import { banners } from "@/constants/data/banner";

import { ScreenView } from "@/components/ui/Themed";
import TrendingCardCarousel from "@/components/layout/TrendingCardCarousel";
import HorizontalListCardScroll from "@/components/layout/HorizontalListCardScroll";
import HorizontalBanner from "@/components/layout/HorizontalBanner";
import PricingModal from "@/components/ui/PricingModal";
import NavigationIconButton from "@/components/ui/NavigationIconButton";
import SleepScreen from "../self-care/sleep";
import ThingsToDoModal from "../self-care/thingsToDo";

import {
  getMeditationAudioList,
  // getMentalTestList,
} from "@/features/self-care/services/selfCareService";
import {
  getRoutineList,
  getSoundscapeList,
} from "@/features/tools/services/toolService";

import {
  MeditationAudioListItem,
} from "@/features/self-care/types/selfCareTypes";
import { SoundscapeTrackListItem } from "@/features/tools/types/toolsTypes";

const SelfCare: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string | number>("");

  const [meditationList, setMeditationList] = useState<
    MeditationAudioListItem[]
  >([]);

  const [soundscapeTrackList, setSoundscapeTrackList] = useState<
    SoundscapeTrackListItem[]
  >([]);

  // Modal States
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSleepTagsModal, setShowSleepTagsModal] = useState(false);
  const [showThingsToDoTagsModal, setShowThingsToDoTagsModal] = useState(false);
  const [routineList, setRoutineList] = useState<any[] | undefined>();

  const { newTheme, spacing, typography } = useContext(ThemeContext);

  const styles = styling(newTheme, spacing, typography);

  // Funstion called on click of navigation button clicked
  const handleNavigationButtonPress = (button: NavigationButtonType) => {
    // console.log(button.screen, button, "button");
    if (button.action === "navigate") {
      router.push(button.screen);
    } else if (button.action === "modal") {
      modalHandler(button.screen);
    }
  };

  const getMeditationTrackList = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getMeditationAudioList();

      // TEMP: Handle current direct array vs future object structure
      let dataToProcess: any[] = [];

      // if (Array.isArray(result)) {
      //   // Current format
      //   dataToProcess = result;
      // }

      // FUTURE: Handle { success, message, data } format
      if (result && result.success && Array.isArray(result.data)) {
        dataToProcess = result.data;
      }

      if (dataToProcess.length > 0) {
        const processedAudio = dataToProcess.map((item: any) => {
          return {
            ...item, // Spread operator to keep original properties
            isLocked: false,
            coachName: item.coach_name || "UU",
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

  const getSoundscapeTrackList = async () => {
    try {
      const result = await getSoundscapeList();

      // TEMP: Handle current direct array vs future object structure
      let dataToProcess: any[] = [];

      // if (Array.isArray(result)) {
      //   // Current format
      //   dataToProcess = result;
      // }

      // FUTURE: Handle { success, message, data } format
      if (result && result.success && Array.isArray(result.data)) {
        dataToProcess = result.data;
      }

      if (dataToProcess.length > 0) {
        const processedArticles = dataToProcess.map((tracks: any) => {
          return {
            ...tracks, // Spread operator to keep original properties
            duration: tracks.duration || "3",
            image: {
              uri: tracks.image,
            },
          };
        });
        setSoundscapeTrackList(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  // helper function to enable the modal
  const modalHandler = (modalName: string) => {
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
      case "soundscape":
        router.push(ROUTES.AUTH.SELF_CARE_SOUNDSCAPE);
        break;
      case "meditation":
        router.push(ROUTES.AUTH.SELF_CARE_MEDITATION);
        break;
      case "routine":
        router.push(ROUTES.AUTH.TOOLS_ROUTINE_TEMPLATE);
        break;
    }
  };

  const handleBannerPress = (id: string) => {
    console.log("Banner pressed:", id);
  };

  const getRoutineData = async (category?: string) => {
    // need to add filters functionality and category param changes
    try {
      const result = await getRoutineList(category);
      // Check if 'result' and 'result.data' exist and is an array
      if (result && result.success && Array.isArray(result.data)) {
        const processedArticles = result.data.map((article: any) => {
          // Return a new object with the original properties plus the new ones
          return {
            ...article, // Spread operator to keep original properties
            title: article.name,
            image: article.image ? { uri: article.image } : null,
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

  useEffect(() => {
    setSelectedButton("");
    getMeditationTrackList();
    getSoundscapeTrackList();
    getRoutineData();
    // getMentalListData();
  }, []);

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios" ? spacing["xxl"] + spacing["xxl"] : spacing.xl,
        paddingHorizontal: spacing.md,
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
          contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 30 }}
        >
          {NavigationButton.map((button: NavigationButtonType) => (
            <NavigationIconButton
              key={button.id}
              icon={button.iconName}
              label={button.label}
              spacingGap={8}
              isActive={selectedButton === button.id}
              onPress={() => {
                setSelectedButton(button.id);
                handleNavigationButtonPress(button);
              }}
            />
          ))}
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Workout Video List Section */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingTop: 0, paddingLeft: 0, paddingBottom: 20 }}
          >
            {workoutVideoList.map((card) => (
              <VideoClassCard
                key={card.id}
                title={card.title}
                coachName={card?.coachName}
                thumbnail={card.image}
                onPress={() => handleWorkoutVideoClicked(card)}
              />
            ))}
          </ScrollView> */}

          {/* { Soundscpae List Section} */}
          <HorizontalListCardScroll
            title="Sonic Atmospheres"
            description="The sound of nature gives you better sleep."
            backgroundColor="#fff9d2"
            itemList={soundscapeTrackList}
            onClickOfAll={() => onClickOfAll("soundscape")}
          />

          {/* AudioBook List Section */}
          <TrendingCardCarousel
            type="rotuine"
            title="Guided Rituals"
            data={routineList ?? []}
            onClickOfAll={() => onClickOfAll("routine")}
            onPress={handleCardPress}
          />

          <HorizontalBanner data={banners} onPress={handleBannerPress} />

          {/* Meditation List Section */}
          <HorizontalListCardScroll
            title="Pure Zen"
            description="Now is a great time to be present. Now is good, too. And now"
            backgroundColor="#fadfdd"
            itemList={meditationList}
            onClickOfAll={() => onClickOfAll("meditation")}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Modal Details */}
      {/* Sleep Modal */}
      <SleepScreen
        visible={showSleepTagsModal}
        onClose={() => setShowSleepTagsModal(false)}
      />

      {/* Pricing Modal */}
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

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    screenTitle: {
      marginBottom: spacing.xl,
    },
    screenTitleText: {
      ...typography.h1,
      color: newTheme.textPrimary,
    },
    navigationScrollView: {
      marginBottom: spacing.md,
    },
    scrollContent: {
      paddingBottom: 130,
    },
  });

export default SelfCare;
