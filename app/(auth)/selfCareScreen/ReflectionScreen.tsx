// src/app/(auth)/selfCareScreen/Reflections/Reflection.tsx (or similar)

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";

import ReflectionEntryModal from "@/components/selfCare/reflection/ReflectionEntryModal";
import ReflectionItemCard from "@/components/selfCare/reflection/ReflectionItemCard";
import ReflectionHeader from "@/components/selfCare/reflection/ReflectionHeader";
import ReflectionForYouSection from "@/components/selfCare/reflection/ReflectionForYouSection";
import ReflectionForYouSkeleton from "@/components/selfCare/reflection/ReflectionForYouSkeleton";
import ReflectionLibrarySkeleton from "@/components/selfCare/reflection/ReflectionLibrarySkeleton";

import { getJournalList } from "@/services/selfCareService";

const Reflection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<
    { id: number; text: string }[]
  >([]);
  const [templateId, setTemplateId] = useState<number | undefined>();

  const [favList, setFavList] = useState<any[] | undefined>();
  const [journalList, setJournalList] = useState<any[] | undefined>();

  const [showForYou, setShowForYou] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const colorPalette = [
    // Rosewood (warm calm)
    { bgColor: "rgba(233, 168, 160, 0.14)", color: "#E0A39B" },

    // Sage (signature Nimbus)
    { bgColor: "rgba(167, 201, 180, 0.14)", color: "#A7C9B4" },

    // Sand / Gold (premium highlight)
    { bgColor: "rgba(224, 199, 129, 0.14)", color: "#E0C781" },

    // Mist / Sky (clean + modern)
    { bgColor: "rgba(152, 190, 214, 0.14)", color: "#98BED6" },

    // Mauve (soft luxury)
    { bgColor: "rgba(192, 167, 207, 0.14)", color: "#C0A7CF" },
  ];

  const getJournalListData = async () => {
    try {
      setIsLoading(true);
      const result = await getJournalList();
      if (result && Array.isArray(result)) {
        const processedList = result.map((item: any) => ({
          ...item,
          image: { uri: item.icon },
        }));
        const topThreeItems = processedList.slice(0, 3);

        setFavList(topThreeItems);
        setJournalList(processedList);
        setShowForYou(true);
        setShowLibrary(true);
      } else {
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    } finally {
      setIsLoading(false);
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

  const handlePressTemplate = (questions: any[], tempId: number | string) => {
    setTemplateId(Number(tempId));
    setSelectedQuestions(questions);
    setModalVisible(true);
  };

  const handleFeaturedCardClick = (item: any) => {
    // If your featured card should also open modal with its own questions:
    if (item.questions && Array.isArray(item.questions)) {
      handlePressTemplate(item.questions, item.id);
    }
  };

  const onModalClosed = (selectedAns?: any) => {
    if (selectedAns?.length) {
      console.log(selectedAns, "Selected Answers");
    }
    setModalVisible(false);
  };

  // Header for the vertical list: For You + "All"
  const renderListHeader = () => (
    <View>
      {showForYou && favList && favList.length > 0 && (
        <ReflectionForYouSection
          data={favList}
          colorPalette={colorPalette}
          onPressCard={handleFeaturedCardClick}
        />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All</Text>
      </View>
    </View>
  );

  // Loading state → skeletons (header stays sticky)
  if (isLoading) {
    return (
      <ScreenView
        style={{
          paddingTop:
            Platform.OS === "ios"
              ? spacing["xxl"] + spacing["xxl"] * 0.4
              : spacing.xl,
          paddingHorizontal: spacing.md,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <ReflectionHeader onBack={() => navigation.goBack()} />
            <ReflectionForYouSkeleton />
            <ReflectionLibrarySkeleton />
          </View>
        </SafeAreaView>
      </ScreenView>
    );
  }

  // Loaded state
  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.4
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header (non-scrollable) */}
          <ReflectionHeader onBack={() => navigation.goBack()} />

          {/* Vertical scroll for For You + All list */}
          {showLibrary && journalList && (
            <FlatList
              data={journalList}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={renderListHeader}
              renderItem={({ item }) => (
                <ReflectionItemCard item={item} onPress={handlePressTemplate} />
              )}
              contentContainerStyle={{
                paddingBottom: spacing.xl * 2,
              }}
            />
          )}
        </View>

        {/* Reflection Entry  Modal */}
        <ReflectionEntryModal
          visible={modalVisible}
          onClose={onModalClosed}
          templateId={templateId}
          questions={selectedQuestions}
        />
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textSecondary,
    },
  });

export default Reflection;
