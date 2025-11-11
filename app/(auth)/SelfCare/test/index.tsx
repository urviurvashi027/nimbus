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
// import { themeColors } from "@/constant/theme/Colors";
import { medTests } from "@/constant/data/medicalTest";
import { getMentalTestList } from "@/services/selfCareService";

const categories = ["All"];

const MentalHealthTestScreen = () => {
  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onMedicalTestClick = (value: any) => {
    router.push({
      pathname: "/(auth)/SelfCare/test/getStared",
      params: { id: value.id },
    });
    // router.push("/(auth)/Tools/test/getStared");
  };

  // TODO ADD MEDTEST API DATA

  const getMentalListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getMentalTestList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        console.log(result);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  // useEffect(() => {
  //   getMentalListData();
  // }, []);

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
            color={newTheme.textSecondary}
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
          data={medTests}
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

const styling = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
    },
    backButton: {
      marginTop: 40,
      marginBottom: 10,
    },
    header: {
      fontSize: 26,
      color: theme.textPrimary,
      fontWeight: "bold",
    },
    subHeader: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 20,
    },
    tabsContainer: {
      marginBottom: 15,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.textSecondary,
      paddingBottom: 6,
      marginRight: 15,
    },
    activeTabText: {
      fontSize: 18,
      color: theme.textSecondary,
      // color: themeColors.basic.secondaryColor,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    listImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginRight: 15,
    },
    listTitle: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: "bold",
      flex: 1,
    },
  });

export default MentalHealthTestScreen;
