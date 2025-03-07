import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

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

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
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
            onPress={() => router.push("/(auth)/Tools/test/getStared")}
          >
            <Image source={item.image} style={styles.listImage} />
            <Text style={styles.listTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  tabsContainer: {
    marginBottom: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6C5CE7",
    paddingBottom: 6,
    marginRight: 15,
  },
  activeTabText: {
    fontSize: 16,
    color: "#6C5CE7",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
});

export default MentalHealthTestScreen;
