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
import {
  buttons as NavigationButton,
  NavigationButtonType,
} from "@/constant/data/toolsButton";
import { themeColors } from "@/constant/Colors";

import { ScreenView } from "@/components/Themed";
import { ThemeKey } from "@/components/Themed";
import TrendingCardCarousel from "@/components/tools/common/TrendingCardCarousel";
import MoodTrackerModal from "../Tools/MoodTracker/MoodTracker";
import VideoScroller from "@/components/tools/videoScroller/VideoScroller";
import AudiobookScroller from "@/components/tools/audioScroller/AudioScroller";

import {
  getArticleList,
  getRecipeList,
  getRoutineList,
} from "@/services/toolService";

const Tools: React.FC = () => {
  const navigation = useNavigation();
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  // Data set states
  const [articleList, setArticleList] = useState<any[] | undefined>();
  const [recipeList, setRecipeList] = useState<any[] | undefined>();
  const [routineSkincare, setRoutineSkincareList] = useState<
    any[] | undefined
  >();
  const [routineWellness, setRoutineWellnessList] = useState<
    any[] | undefined
  >();
  const [routineFitness, setRutineFitnessList] = useState<any[] | undefined>();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  // ------------------------------- API CALLS ---------------------------------------

  // Fetch Recipe List
  const getRecipeListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getRecipeList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedRecipes = result.map((article: any) => {
          // Return a new object with the original properties plus the new ones
          return {
            ...article, // Spread operator to keep original properties
            image: {
              uri: article.image,
            },
          };
        });
        setRecipeList(processedRecipes);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  // Fetch article List
  const getArticleListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getArticleList();
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
        setArticleList(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  // Fetch article List
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
        if (category === "beauty") {
          setRoutineSkincareList(processedArticles);
        } else if (category === "wellness") {
          setRoutineWellnessList(processedArticles);
        } else if (category === "fitness") {
          setRutineFitnessList(processedArticles);
        }
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getArticleListData();
    getRecipeListData();
    getRoutineData("fitness");
    getRoutineData("beauty");
    getRoutineData("wellness");
  }, []);

  const handleNavigationButtonPress = (button: any) => {
    if (button.action === "navigate") {
      router.push(button.screen);
    } else if (button.action === "modal") {
      getModalInfo(button.screen);
    }
  };

  const getModalInfo = (modalName: string) => {
    switch (modalName) {
      case "moodTracker":
        setShowMoodTracker(true);
        break;
    }
  };

  const handleCardPress = (id: string, type: string) => {
    router.push({
      pathname: "/(auth)/Tools/Details/Details",
      params: { id: id, type: type },
    });
  };

  const handleSelectMood = (selectedMood: string) => {
    setMood(selectedMood);
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
      <SafeAreaView style={{ flex: 1, padding: 0 }}>
        <View style={styles.screenTitle}>
          <Text style={styles.screenTitleText}>Tools</Text>
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

        {/* Verticle Scroll View */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 16, paddingLeft: 0, paddingBottom: 20 }}
        >
          {/* Reel Scroll */}
          <VideoScroller />
          {/* Audio Book Scroll */}
          <AudiobookScroller />

          {/* Wellness Routine Template */}
          <TrendingCardCarousel
            type="routine"
            title="Wellness Routine"
            data={routineWellness ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfRoutineAll}
          />

          {/* Article Template */}
          <TrendingCardCarousel
            title="Article"
            type="article"
            data={articleList ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfArticleAll}
          />
          {/* Recipe Template */}
          <TrendingCardCarousel
            type="recipe"
            title="Quick Recipe"
            data={recipeList ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfRecipeAll}
          />

          {/* Skin Care Routine Template */}
          <TrendingCardCarousel
            type="routine"
            title="Hello Beautiful"
            data={routineSkincare ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfSkincareRoutineAll}
          />

          {/* Fitness Routine Template */}
          <TrendingCardCarousel
            type="routine"
            title="Life Hacks You Can't Miss"
            data={routineFitness ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfHacksRoutineAll}
          />
        </ScrollView>

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
    navigationScrollView: {
      marginBottom: 20,
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

export default Tools;
