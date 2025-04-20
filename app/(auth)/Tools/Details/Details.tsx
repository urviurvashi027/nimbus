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
import HeaderTipsGrid from "@/components/common/ArticleDetails/Header";
import MetaInfo from "@/components/common/ArticleDetails/MetaInfo";
import AuthorCard from "@/components/common/ArticleDetails/AuthorCard";
import CatalogList from "@/components/common/ArticleDetails/CatalogList";
import ArticleSection from "@/components/common/ArticleDetails/ArticleSection";
import PrimaryButton from "@/components/common/ArticleDetails/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";

import { recipeData } from "@/constant/data/recipeData";
import { articleData } from "@/constant/data/articleDetails";
import { routineDetails } from "@/constant/data/routineData";

// const headerData = {
//   icon: require("../../../../assets/images/recipe/1.png"),
// };

// const sectionsData = [
//   {
//     title: "Create a Routine Together",
//     content:
//       "Creating a routine helps kids understand expectations and reduces morning chaos.",
//   },
//   {
//     title: "Make Sure Your Child Understands",
//     content:
//       "Explain the routine clearly and ensure your child knows what to expect.",
//   },
//   {
//     title: "Rehearse to See If It Works",
//     content: "Do a trial run of the routine before the first day of school.",
//   },
//   {
//     title: "Beat the Buzzer!",
//     content: "Use timers to keep the morning on track and make it fun.",
//   },
//   {
//     title: "Encourage Independence",
//     content: "Let your child take charge of tasks they can do themselves.",
//   },
//   {
//     title: "Feed Right",
//     content: "Start the day with a healthy breakfast to fuel energy and focus.",
//   },
// ];

// const authorInfo = {
//   name: "Alex Tyler",
//   role: "PhD, Developmental Psychology",
//   avatar: "https://example.com/avatar.jpg",
// };

const ParentingTipsScreen = () => {
  const [details, setDetails] = useState<any>();
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionRefs = useRef<(View | null)[]>([]);
  const { id, type } = useLocalSearchParams();

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

  const getArticleDetails = (id: any) => {
    const result = articleData.find((item, index) => {
      return item.id == id;
    });
    setDetails(result);
  };

  const getRecipeDetails = (id: any) => {
    const result = recipeData.find((item, index) => {
      return item.id == id;
    });
    setDetails(result);
  };

  const getRoutineDetails = (id: any) => {
    const result = routineDetails.find((item, index) => {
      return item.id == id;
    });
    setDetails(result);
    console.log("routine details", result);
  };

  const getDetails = (id: any, type: any) => {
    console.log(id, type, "getDetails");
    switch (type) {
      case "recipe":
        getRecipeDetails(id);
        break;
      case "article":
        getArticleDetails(id);
        break;
      case "routine":
        getRoutineDetails(id);
        break;
    }
  };

  const onPrimaryButtonClick = () => {
    router.push({
      pathname: "/Tools/RoutineList/RouitneList",
      params: { id: details.id, type: "routine" },
    });
  };

  useEffect(() => {
    if (id) {
      const typeId = Array.isArray(id) ? id[0] : id; // ✅ Ensure id is a string
      getDetails(typeId, type);
    }
  }, [id]);

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

        <Text style={styles.title}>
          {details?.title}
          {/* 8 Parenting Tips that Help You Master the Morning Chaos */}
        </Text>

        <MetaInfo
          points={details.metaInfo.points}
          time={details.metaInfo.time}
        />

        <AuthorCard author={details.authorInfo} />

        <CatalogList
          // catalog={sectionsData}
          catalog={details.sectionData}
          onPress={scrollToSection}
        />

        {/* {details?.sectionsData.map((section: any, index: number) => ( */}
        {Array.isArray(details?.sectionData) &&
          details.sectionData.map((section: any, index: number) => (
            <ArticleSection
              key={index}
              ref={(el: any) => (sectionRefs.current[index] = el)}
              title={section.title}
              content={section.content}
            />
          ))}

        {/* <PrimaryButton title="+ Add to my routine" onPress={() => {}} /> */}
      </ScrollView>
      <View style={styles.fixedButtonWrapper}>
        {details?.actionButton && (
          <PrimaryButton
            title={details.actionButton}
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
