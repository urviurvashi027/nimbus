import {
  View,
  Text,
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

import { ScreenView } from "@/components/Themed";
import { ThemeKey } from "@/components/Themed";
import TrendingCardCarousel from "@/components/common/TrendingCardCarousel";
import MoodTrackerModal from "../toolsScreen/MoodTracker/MoodTracker";
import VideoScroller from "@/components/tools/videoScroller/VideoScroller";
import AudiobookScroller from "@/components/tools/audioScroller/AudioScroller";

import {
  getArticleList,
  getRecipeList,
  getRoutineList,
} from "@/services/toolService";
import NavigationIconButton from "@/components/common/NavigationIconButton";

const Tools: React.FC = () => {
  const navigation = useNavigation();

  // Ui states
  const [selectedButton, setSelectedButton] = useState<string | number>("");
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
  const [routineFitness, setRoutineFitnessList] = useState<any[] | undefined>();

  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

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
          setRoutineFitnessList(processedArticles);
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
      pathname: "/(auth)/toolsScreen/Details/Details",
      params: { id: id, type: type },
    });
  };

  const handleSelectMood = (selectedMood: string) => {
    setMood(selectedMood);
  };

  const onClickOfArticleAll = () => {
    router.push("/(auth)/toolsScreen/ArticleScreen");
  };

  const onClickOfRoutineAll = () => {
    router.push("/(auth)/toolsScreen/RoutineScreen");
  };

  const onClickOfRecipeAll = () => {
    router.push("/(auth)/toolsScreen/RecipeScreen");
  };

  const onClickOfSkincareRoutineAll = () => {
    router.push({
      pathname: "/(auth)/toolsScreen/RoutineScreen",
      params: { filter: "Skincare" },
    });
  };

  const onClickOfHacksRoutineAll = () => {
    router.push({
      pathname: "/(auth)/toolsScreen/RoutineScreen",
      params: { filter: "Hacks" },
    });
  };

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
          <Text style={styles.screenTitleText}>Tools</Text>
        </View>
        {/* Navigation Button */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navigationScrollView}
          contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 30 }}
        >
          {NavigationButton.map((button: NavigationButtonType) => {
            return (
              <NavigationIconButton
                key={button.id}
                icon={button.iconName}
                label={button.label}
                isActive={selectedButton === button.id}
                onPress={() => {
                  setSelectedButton(button.id);
                  handleNavigationButtonPress(button);
                }}
              />
            );
          })}
        </ScrollView>

        {/* Verticle Scroll View */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 0, paddingLeft: 0, paddingBottom: 20 }}
        >
          <VideoScroller />
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

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
    },
    screenTitle: {
      marginBottom: 30,
    },
    screenTitleText: {
      fontSize: 30,
      fontWeight: "bold",
      color: newTheme.textPrimary,
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
      color: newTheme.textPrimary,
      fontSize: 10,
    },
  });

export default Tools;
