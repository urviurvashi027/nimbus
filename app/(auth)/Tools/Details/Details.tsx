// ParentingTipsScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  findNodeHandle,
  UIManager,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import HeaderTipsGrid from "@/components/common/ArticleDetails/Header";
import MetaInfo from "@/components/common/ArticleDetails/MetaInfo";
import AuthorCard from "@/components/common/ArticleDetails/AuthorCard";
import CatalogList from "@/components/common/ArticleDetails/CatalogList";
import ArticleSection from "@/components/common/ArticleDetails/ArticleSection";
import PrimaryButton from "@/components/common/ArticleDetails/PrimaryButton";
import NutritionInfo from "./component/NutritionInfo";

import { getArticleDetails } from "@/services/toolService";

const ParentingTipsScreen = () => {
  const navigation = useNavigation();
  const [details, setDetails] = useState<any>();
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionRefs = useRef<(View | null)[]>([]);
  const { id, type } = useLocalSearchParams();

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //     headerTransparent: true,
  //     headerBackButtonDisplayMode: "minimal",
  //     //  headerTintColor: styles.header.color,
  //     headerTitleStyle: {
  //       fontSize: 18,
  //       color: "red",
  //       paddingTop: 5,
  //     },
  //   });
  // }, [navigation]);

  const scrollToSection = (index: number) => {
    const sectionView = sectionRefs.current[index];
    const scrollViewHandle = findNodeHandle(scrollRef.current);

    if (sectionView && scrollViewHandle) {
      sectionView.measureLayout(
        scrollViewHandle,
        (x: number, y: number) => {
          scrollRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => {
          console.warn("measureLayout failed");
        }
      );
    }
  };

  const getArticleDetailsById = async (id: number) => {
    try {
      // 1. Fetch the single article object from your API
      const result = await getArticleDetails(id);
      const articleObject = result;
      // 2. Check if the result is a valid object
      if (
        articleObject &&
        typeof articleObject === "object" &&
        !Array.isArray(articleObject)
      ) {
        // 3. Process the single article
        const processedArticle = {
          ...articleObject, // Keep all original properties
          action_button: type === "routine" ? "Add to routine" : "",
          image: {
            uri: articleObject.image, // Transform the image property for React Native
          },
        };
        // 4. Wrap the single object in an array before setting the state
        console.log(type, "details here");
        setDetails(processedArticle);
      } else {
        console.error("API response was not a valid object:", articleObject);
        setDetails({}); // Reset state to an empty array
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    // Check if id exists and is a string before using it
    if (id && typeof id === "string") {
      // Convert the string 'id' to a number using parseInt
      const numericId = parseInt(id, 10);
      console.log(typeof id, typeof numericId, "ididid");
      getArticleDetailsById(numericId);
    }
  }, [id]);

  const onPrimaryButtonClick = () => {
    console.log(details.routine_items);
    router.push({
      pathname: "/Tools/RoutineList/RouitneList",
      params: {
        id: details.id,
        type: "routine",
        data: JSON.stringify(details.routine_items),
      },
    });
  };

  if (!details) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <HeaderTipsGrid tips={details} />

        <Text style={styles.title}>{details?.title}</Text>

        {details.meta_info && (
          <MetaInfo
            points={details.meta_info.points}
            time={details.meta_info.time}
          />
        )}

        {details.author_info && <AuthorCard author={details.author_info} />}

        <CatalogList catalog={details.section_data} onPress={scrollToSection} />

        {Array.isArray(details?.section_data) &&
          details.section_data.map((section: any, index: number) => (
            <ArticleSection
              key={index}
              ref={(el: any) => (sectionRefs.current[index] = el)}
              title={section.title}
              content={section.content}
            />
          ))}

        {Array.isArray(details?.instructions) &&
          details.instructions.map((section: any, index: number) => (
            <ArticleSection
              key={index}
              ref={(el: any) => (sectionRefs.current[index] = el)}
              title={section.step}
              content={section.instruction}
            />
          ))}

        {details.nutrition && (
          <NutritionInfo
            title="Nutritional Information"
            data={details.nutrition}
          />
        )}

        {/* // recipe notes todo */}
      </ScrollView>
      <View style={styles.fixedButtonWrapper}>
        {details?.action_button && (
          <PrimaryButton
            title={details.action_button}
            onPress={onPrimaryButtonClick}
          />
        )}
      </View>
    </View>
  );
};

export default ParentingTipsScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 16,
    color: "#000",
  },
  fixedButtonWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
