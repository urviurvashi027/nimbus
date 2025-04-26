import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { ScreenView } from "@/components/Themed";
import MasterClass from "@/components/tools/VideoListCard";
import { ThemeKey } from "@/components/Themed";
import TrendingCardCarousel from "@/components/tools/common/TrendingCardCarousel";
import ReelCard from "@/components/common/ReelCard";
import SleepModal from "../SelfCare/Sleep/Sleep";
import WaterIntakeModal from "../SelfCare/WaterIntake/WaterIntake";
import ThingsToDoModal from "../SelfCare/ThingsToDo/ThingsToDo";
import HorizontalListCardScroll from "@/components/tools/common/HorizontalListCardScroll";
import audioTracks from "@/constant/data/soundtrack";
import {
  buttons as NavigationButton,
  NavigationButtonType,
} from "@/constant/data/selfCareButton";
import { RoutineData, RoutineType } from "@/constant/data/routineData";
import VideoClassCard from "@/components/selfCare/VideoClassCard";
import { masterClassData } from "@/constant/data/videoClass";
import { medTests } from "@/constant/data/medicalTest";
import { meditationsList } from "@/constant/data/meditation";
import HorizontalBanner from "@/components/tools/common/HorizontalBanner";
import { banners } from "@/constant/data/banner";

const SelfCare: React.FC = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState("");

  const [showWaterIntakekModal, setShowWaterIntakekModal] = useState(false);
  const [showSleepTagsModal, setShowSleepTagsModal] = useState(false);
  const [showThingsToDoTagsModal, setShowThingsToDoTagsModal] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // Funstion called on click of navigation button clicked
  const handleNavigationButtonPress = (button: NavigationButtonType) => {
    if (button.action === "navigate") {
      // router.push("/(auth)/SelfCare/WaterIntake/WaterIntake")
      router.push(button.screen);
    } else if (button.action === "modal") {
      getModalInfo(button.screen);
    }
  };

  // helper function to enable the modal
  const getModalInfo = (modalName: string) => {
    switch (modalName) {
      case "Sleep":
        setShowSleepTagsModal(true);
        break;
      case "thingsToDo":
        setShowThingsToDoTagsModal(true);
        break;
      case "waterIntake":
        setShowWaterIntakekModal(true);
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
          {NavigationButton.map((button: NavigationButtonType) => (
            <View style={styles.navigationButtonContainer} key={button.id}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleNavigationButtonPress(button)}
              >
                <Image
                  style={styles.buttonIcon}
                  source={
                    button.icon
                      ? String(button.icon)
                      : require("../../../assets/images/options/drink.png")
                  }
                />
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>{button.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* MasterClass Section */}
        {/* <MasterClass /> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ padding: 16 }}
          >
            {masterClassData.map((card) => (
              <VideoClassCard
                key={card.id}
                title={card.title}
                coachName={card.coachName}
                thumbnail={require("../../../assets/images/workout.jpg")}
                onPress={() => console.log("Clicked on", card.title)}
              />
            ))}
          </ScrollView>

          {/* Well Being Class */}
          <HorizontalListCardScroll
            title="Soundscape"
            description="The sound of nature gives you better sleep."
            backgroundColor="#FFF085"
            itemList={audioTracks}
            onClickOfAll={() => onClickOfAll("soundscape")}
          />

          {/* AudioBook */}
          <TrendingCardCarousel
            title="New and Trendings"
            data={RoutineData}
            onClickOfAll={() => onClickOfAll("routine")}
            onPress={handleCardPress}
          />

          {/* Medical Test */}
          <HorizontalListCardScroll
            title="Medical Test"
            description="Mental health is everything"
            backgroundColor="#B7B1F2"
            noOfRows={2}
            itemList={medTests}
            onClickOfAll={() => onClickOfAll("medicalTest")}
          />

          <HorizontalBanner data={banners} onPress={handleBannerPress} />

          {/* Meditation */}
          <HorizontalListCardScroll
            title="Meditation"
            description="Now is a great time to be present. Now is good, too. And now"
            backgroundColor="#7A73D1"
            itemList={meditationsList}
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

      {/* Water Modal
      <WaterIntakeModal
        visible={showWaterIntakekModal}
        onClose={() => {
          setShowWaterIntakekModal(false);
        }}
      /> */}

      {/* Things To Do Modal */}
      <ThingsToDoModal
        isVisible={showThingsToDoTagsModal}
        onClose={() => setShowThingsToDoTagsModal(false)}
      />
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    screenTitle: {
      paddingHorizontal: 10,
      marginBottom: 30,
    },
    screenTitleText: {
      fontSize: 30,
      fontWeight: "bold",
    },
    navigationScrollView: {
      // height: 100,
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
      marginHorizontal: 8, // Space between buttons
    },
    buttonIcon: {
      width: 60,
      height: 60,
      borderRadius: 25, // Makes the button rounded
    },
    buttonLabel: {
      paddingTop: 10,
      color: themeColors[theme].text,
      fontSize: 10,
    },
  });

export default SelfCare;
