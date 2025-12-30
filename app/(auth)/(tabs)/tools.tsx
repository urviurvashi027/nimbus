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
import { FILTER_MAP } from "../toolsScreen/RoutineScreen";

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
  const [routineChores, setRoutineChoresList] = useState<any[] | undefined>();

  const { newTheme, spacing, typography } = useContext(ThemeContext);

  const styles = styling(newTheme, spacing, typography);

  // ------------------------------- API CALLS ---------------------------------------

  // Fetch Recipe List
  const getRecipeListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getRecipeList();

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
        const processedRecipes = dataToProcess.map((article: any) => {
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
        const processedArticles = dataToProcess.map((article: any) => {
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
      if (result && result.success && Array.isArray(result.data)) {
        const processedArticles = result.data.map((article: any) => {
          // Return a new object with the original properties plus the new ones
          return {
            ...article, // Spread operator to keep original properties
            title: article.name,
            image: article.image ? { uri: article.image } : null,
          };
        });
        if (category === FILTER_MAP.Beauty) {
          setRoutineSkincareList(processedArticles);
        }
        else if (category === FILTER_MAP.Wellness) {
          setRoutineWellnessList(processedArticles);
        }
        else if (category === FILTER_MAP.Chores) {
          setRoutineChoresList(processedArticles);
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
    getRoutineData(FILTER_MAP.Chores);
    getRoutineData(FILTER_MAP.Beauty);
    getRoutineData(FILTER_MAP.Wellness);
  }, []);

  const handleNavigationButtonPress = (button: any) => {
    if (button.action === "navigate") {
      router.push(button.screen);
    }
    else if (button.action === "modal") {
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
      pathname: "/(auth)/toolsScreen/ContentDetailsScreen",
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
            title="Mindful Rituals"
            data={routineWellness ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfRoutineAll}
          />

          {/* Article Template */}
          <TrendingCardCarousel
            title="Daily Insights"
            type="article"
            data={articleList ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfArticleAll}
          />
          {/* Recipe Template */}
          <TrendingCardCarousel
            type="recipe"
            title="Holistic Nourishment"
            data={recipeList ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfRecipeAll}
          />

          {/* Skin Care Routine Template */}
          <TrendingCardCarousel
            type="routine"
            title="Glow & Radiance"
            data={routineSkincare ?? []}
            onPress={handleCardPress}
            onClickOfAll={onClickOfSkincareRoutineAll}
          />

          {/* Fitness Routine Template */}
          <TrendingCardCarousel
            type="routine"
            title="Essential Living"
            data={routineChores ?? []}
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

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
    },
    screenTitle: {
      marginBottom: spacing.xl,
    },
    screenTitleText: {
      ...typography.h1,
      color: newTheme.textPrimary,
    },
    header: {
      ...typography.h3,
      marginLeft: spacing.lg,
      marginBottom: spacing.sm,
      marginTop: spacing.sm,
    },
    navigationScrollView: {
      marginBottom: spacing.md,
    },
    navigationButtonContainer: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    content: {
      padding: 0,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 25,
      marginHorizontal: spacing.xs,
    },
    buttonIcon: {
      width: 60,
      height: 60,
      borderRadius: 25,
    },
    buttonLabel: {
      paddingTop: spacing.xs,
      color: newTheme.textPrimary,
      fontSize: 10,
    },
  });

export default Tools;
