import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { ScreenView, ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";

const categories = ["All"];

const tests = [
  {
    id: "1",
    title: "Childhood Trauma Test",
    image: require("../../../../assets/images/mentalTest/childhoodTrauma.png"), // Replace with actual image
  },
  {
    id: "2",
    title: "Quick ADHD Test",
    image: require("../../../../assets/images/mentalTest/ADHD.png"),
  },
  {
    id: "3",
    title: "3 Minutes Depression Test",
    image: require("../../../../assets/images/mentalTest/depressionTest.png"),
  },
  {
    id: "4",
    title: "Toxic Personality Test",
    image: require("../../../../assets/images/mentalTest/toxicPersonality.png"),
  },
  {
    id: "5",
    title: "Emotional Quotient",
    image: require("../../../../assets/images/mentalTest/EQ.png"),
  },
  {
    id: "6",
    title: "Inner Self",
    image: require("../../../../assets/images/mentalTest/innerSelf.png"),
  },
  {
    id: "7",
    title: "Self Toxic",
    image: require("../../../../assets/images/mentalTest/selfLove.png"),
  },
];

const MentalHealthTestScreen = () => {
  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onMedicalTestClick = (value: any) => {
    router.push({
      pathname: "/(auth)/Tools/test/getStared",
      params: { id: value.id },
    });
    // router.push("/(auth)/Tools/test/getStared");
  };

  return (
    <ScreenView
      style={{ padding: 0, paddingTop: Platform.OS === "ios" ? 50 : 20 }}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors[theme].text}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Mental Health Test</Text>
        <Text style={styles.subHeader}>May you have a good sleep</Text>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity key={category} style={styles.activeTab}>
              <Text style={styles.activeTabText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Test List */}
        <FlatList
          data={tests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => onMedicalTestClick(item)}
            >
              <Image source={item.image} style={styles.listImage} />
              <Text style={styles.listTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    backButton: {
      marginTop: 40,
      marginBottom: 10,
    },
    header: {
      fontSize: 26,
      color: themeColors[theme].text,
      fontWeight: "bold",
    },
    subHeader: {
      fontSize: 14,
      color: themeColors.basic.subheader,
      marginBottom: 20,
    },
    tabsContainer: {
      marginBottom: 15,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: themeColors.basic.secondaryColor,
      paddingBottom: 6,
      marginRight: 15,
    },
    activeTabText: {
      fontSize: 18,
      color: themeColors.basic.secondaryColor,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    listImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginRight: 15,
    },
    listTitle: {
      fontSize: 16,
      color: themeColors[theme].text,
      fontWeight: "bold",
      flex: 1,
    },
  });

export default MentalHealthTestScreen;
