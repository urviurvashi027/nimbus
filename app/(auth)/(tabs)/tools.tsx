import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { ScreenView } from "@/components/Themed";
// import MasterClass from "@/components/tools/VideoListCard";
import { ThemeKey } from "@/components/Themed";
import TrendingCardCarousel from "@/components/tools/common/TrendingCardCarousel";
import MoodTrackerModal from "../Tools/MoodTracker/MoodTracker";
import { LifeHacks, OrganisedReels } from "@/constant/data/reelsData";
import ReelCard from "@/components/common/ReelCard";

import { recipeData } from "@/constant/data/recipeData";
import { articleData } from "@/constant/data/articleDetails";
import { routineDetails } from "@/constant/data/routineData";

const Tools: React.FC = () => {
  const navigation = useNavigation();
  // const [selectedButton, setSelectedButton] = useState("");

  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  // const [showSleepTagsModal, setShowSleepTagsModal] = useState(false);
  // const [showThingsToDoTagsModal, setShowThingsToDoTagsModal] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const reels = [
    {
      id: "1",
      title: "Me+ AI Helps You Generate Cleaning...",
      badgeText: "Me+ Clean ✨",
      views: "1M+",
      thumbnail: require("../../../assets/images/gratitude.png"),
    },
    {
      id: "2",
      title: "The FlyLady Cleaning Method",
      badgeText: "15-min Clean",
      views: "5M+",
      thumbnail: require("../../../assets/images/overeat.png"),
    },
    {
      id: "3",
      title: "Test",
      badgeText: "15-min Clean",
      views: "5M+",
      thumbnail: require("../../../assets/images/selfAffirmation.png"),
    },
  ];

  const buttons = [
    {
      id: 1,
      label: "Routine",
      action: "navigate",
      screen: "/(auth)/Tools/Routine/Routine",
      icon: require("../../../assets/images/tools/1.png"),
    },
    {
      id: 2,
      label: "Mood Tracker",
      action: "modal",
      screen: "moodTracker",
      icon: require("../../../assets/images/tools/2.png"),
    },
    {
      id: 3,
      label: "Recipe",
      action: "navigate",
      screen: "/(auth)/Tools/Recipe/Recipe",
      icon: require("../../../assets/images/tools/3.png"),
    },
    {
      id: 4,
      label: "Article",
      action: "navigate",
      screen: "/(auth)/Tools/Article/Article",
      icon: require("../../../assets/images/tools/4.png"),
    },
    {
      id: 5,
      label: "Calorie Cal",
      action: "navigate",
      screen: "/(auth)/Tools/CalorieCal/CalorieCalculator",
      icon: require("../../../assets/images/tools/5.png"),
    },
    {
      id: 6,
      label: "Protein Cal",
      action: "navigate",
      screen: "/(auth)/Tools/ProtienCal/ProteinCalculator",
      icon: require("../../../assets/images/tools/6.png"),
    },
    {
      id: 7,
      label: "Body Shape Cal",
      action: "navigate",
      screen: "/(auth)/Tools/BodyShapeCal/BodyShapeCalculator",
      icon: require("../../../assets/images/tools/7.png"),
    },
    {
      id: 8,
      label: "AI Scanner",
      action: "navigate",
      screen: "/(auth)/Tools/AIScanner/AIScanner",
      icon: require("../../../assets/images/tools/5.png"),
    },
    {
      id: 9,
      label: "Products",
      action: "navigate",
      screen: "/(auth)/Tools/AIScanner/AIScanner",
      icon: require("../../../assets/images/tools/5.png"),
    },
  ];

  // router.push("/(auth)/Tools/BodyShapeCal/BodyShapeCalculator")

  const handleButtonPress = (button: any) => {
    console.log("coming here");
    if (button.action === "navigate") {
      // router.push("/");
      router.push(button.screen);
    } else if (button.action === "modal") {
      getModalInfo(button.screen);
    }
  };

  const getModalInfo = (modalName: string) => {
    console.log(modalName, "modalName");
    switch (modalName) {
      case "moodTracker":
        setShowMoodTracker(true);
        break;
    }
  };

  const handleCardPress = (id: string) => {
    console.log("Pressed card id:", id);
  };

  const handleSelectMood = (selectedMood: string) => {
    setMood(selectedMood);
    console.log("Selected Mood:", selectedMood);
  };

  const onClickOfArticleAll = () => {
    router.push("/(auth)/Tools/Article/Article");
  };

  const onClickOfRoutineAll = () => {
    router.push("/(auth)/Tools/Routine/Routine");
  };

  const onClickOfRecipeAll = () => {
    router.push("/(auth)/Tools/Recipe/Recipe");
  };

  const onClickOfSkincareRoutineAll = () => {
    console.log("I am clicked");
    router.push({
      pathname: "/(auth)/Tools/Routine/Routine",
      params: { filter: "Skincare" },
    });
  };

  const onClickOfHacksRoutineAll = () => {
    router.push({
      pathname: "/(auth)/Tools/Routine/Routine",
      params: { filter: "Hacks" },
    });
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleText}>Toolss</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {buttons.map((button) => (
            <View style={styles.buttonContainer} key={button.id}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleButtonPress(button)}
              >
                {/* <View> */}
                {/* source={button.icon} */}
                <Image
                  style={styles.buttonIcon}
                  alt={button.label}
                  // source={require("../../../assets/images/options/drink.png")}
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
        {/* <MasterClass /> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Reel Scroll */}
          <Text style={styles.header}>To be Organized</Text>
          <FlatList
            data={reels}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
            renderItem={({ item }) => (
              <ReelCard
                title={item.title}
                views={item.views}
                badgeText={item.badgeText}
                thumbnail={item.thumbnail}
                onPress={() => console.log("Clicked:", item.title)}
              />
            )}
          />
          <TrendingCardCarousel
            title="Routine"
            data={routineDetails}
            onPress={handleCardPress}
            onClickOfAll={onClickOfRoutineAll}
          />

          <TrendingCardCarousel
            title="Article"
            data={articleData}
            onPress={handleCardPress}
            onClickOfAll={onClickOfArticleAll}
          />

          <TrendingCardCarousel
            title="Recipe"
            data={recipeData}
            onPress={handleCardPress}
            onClickOfAll={onClickOfRecipeAll}
          />

          <TrendingCardCarousel
            title="Hello Beautiful"
            data={routineDetails}
            onPress={handleCardPress}
            onClickOfAll={onClickOfSkincareRoutineAll}
          />

          <TrendingCardCarousel
            title="Life Hacks You Can't Miss"
            data={routineDetails}
            onPress={handleCardPress}
            onClickOfAll={onClickOfHacksRoutineAll}
          />
        </ScrollView>

        {/* <ScrollView>
          <TrendingCardCarousel
            title="New and Trending"
            data={routineDate}
            onPress={handleCardPress}
          />
        </ScrollView> */}

        {/* Mood Tracker Modal */}
        {mood && <Text style={{ marginTop: 20 }}>Selected Mood: {mood}</Text>}
        <MoodTrackerModal
          visible={showMoodTracker}
          onClose={() => setShowMoodTracker(false)}
          onSelectMood={handleSelectMood}
        />
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
    },
    screenTitle: {
      paddingHorizontal: 10,
      marginBottom: 30,
    },
    screenTitleText: {
      fontSize: 30,
      fontWeight: "bold",
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 20,
      marginBottom: 10,
      marginTop: 10,
    },
    scrollView: {
      // height: 100,
      marginBottom: 20,
    },
    buttonContainer: {
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
      // backgroundColor: "#007BFF",
      // justifyContent: "center",
      // alignItems: "center",
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

export default Tools;
