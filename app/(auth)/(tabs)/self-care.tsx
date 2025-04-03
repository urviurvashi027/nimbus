import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import SleepModal from "../SelfCare/Sleep/Sleep";
import WaterIntakeModal from "../SelfCare/WaterIntake/WaterIntake";
import ThingsToDoModal from "../SelfCare/ThingsToDo/ThingsToDo";
import { ScreenView } from "@/components/Themed";
import MasterClass from "@/components/tools/VideoListCard";
import { ThemeKey } from "@/components/Themed";
import TrendingCardCarousel from "@/components/tools/common/TrendingCardCarousel";

const SelfCare: React.FC = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState("");

  const [showWaterIntakekModal, setShowWaterIntakekModal] = useState(false);
  const [showSleepTagsModal, setShowSleepTagsModal] = useState(false);
  const [showThingsToDoTagsModal, setShowThingsToDoTagsModal] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const buttons = [
    {
      id: 1,
      label: "Test",
      action: "navigate",
      screen: "/(auth)/SelfCare/test",
      icon: require("../../../assets/images/options/test.png"),
    },
    {
      id: 2,
      label: "Drink",
      action: "modal",
      screen: "waterIntake",
      icon: require("../../../assets/images/options/drink.png"),
    },
    {
      id: 3,
      label: "Meditation",
      action: "navigate",
      screen: "/(auth)/SelfCare/Meditation/Meditation",
      icon: require("../../../assets/images/options/meditation.png"),
    },
    {
      id: 4,
      label: "Workout",
      action: "navigate",
      screen: "/(auth)/SelfCare/Workout/Workout",
      icon: require("../../../assets/images/options/fitness.png"),
    },
    {
      id: 5,
      label: "Soundscape",
      action: "navigate",
      screen: "/(auth)/SelfCare/Soundscape/Soundscape",
      icon: require("../../../assets/images/options/soundscape.png"),
    },
    {
      id: 6,
      label: "Reflection",
      action: "navigate",
      screen: "/(auth)/SelfCare/Reflections/Reflection",
      icon: require("../../../assets/images/options/reflection.png"),
    },
    {
      id: 7,
      label: "Sleep",
      action: "modal",
      screen: "Sleep",
      icon: require("../../../assets/images/options/sleep.png"),
    },
    {
      id: 8,
      label: "Things To Do",
      action: "modal",
      screen: "thingsToDo",
      icon: require("../../../assets/images/options/things.png"),
    },
  ];

  const data = [
    {
      id: "1",
      // title: "Restart your life in 50 days!",
      image: require("../../../assets/images/routine/1.png"), // make sure these match your design
    },
    {
      id: "2",
      // title: "Less Awkward First Date Tricks",
      image: require("../../../assets/images/routine/2.png"),
    },
    {
      id: "3",
      // title: "Restart your life in 50 days!",
      image: require("../../../assets/images/routine/3.png"), // make sure these match your design
    },
    {
      id: "4",
      // title: "Less Awkward First Date Tricks",
      image: require("../../../assets/images/routine/4.png"),
    },
    {
      id: "5",
      // title: "Restart your life in 50 days!",
      image: require("../../../assets/images/routine/5.png"), // make sure these match your design
    },
    {
      id: "6",
      // title: "Less Awkward First Date Tricks",
      image: require("../../../assets/images/routine/6.png"),
    },
    {
      id: "7",
      // title: "Restart your life in 50 days!",
      image: require("../../../assets/images/routine/7.png"), // make sure these match your design
    },
    {
      id: "8",
      // title: "Less Awkward First Date Tricks",
      image: require("../../../assets/images/routine/8.png"),
    },
    {
      id: "9",
      // title: "Restart your life in 50 days!",
      image: require("../../../assets/images/routine/9.png"), // make sure these match your design
    },
  ];

  const handleButtonPress = (button: any) => {
    if (button.action === "navigate") {
      // router.push("/");
      router.push(button.screen);
    } else if (button.action === "modal") {
      getModalInfo(button.screen);
    }
  };

  const getModalInfo = (modalName: string) => {
    switch (modalName) {
      case "Sleep":
        setShowSleepTagsModal(true);
        break;
      case "thingsToDo":
        setShowThingsToDoTagsModal(true);
        break;
      case "waterIntake":
        setShowWaterIntakekModal(true);
        break;
    }
  };

  const handleCardPress = (id: string) => {
    console.log("Pressed card id:", id);
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <View style={styles.container}>
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
        <MasterClass />

        <ScrollView>
          <TrendingCardCarousel
            title="New and Trending"
            data={data}
            onPress={handleCardPress}
          />
        </ScrollView>

        {/* Sleep Modal */}
        <SleepModal
          visible={showSleepTagsModal}
          onClose={() => setShowSleepTagsModal(false)}
        />

        {/* Water Modal */}
        <WaterIntakeModal
          visible={showWaterIntakekModal}
          onClose={() => {
            setShowWaterIntakekModal(false);
          }}
        />

        {/* Things To Do Modal */}
        <ThingsToDoModal
          isVisible={showThingsToDoTagsModal}
          onClose={() => setShowThingsToDoTagsModal(false)}
        />
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      // flex: 1,
    },
    scrollView: {
      height: 100,
      marginBottom: 20,
    },
    buttonContainer: {
      alignItems: "center",
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

export default SelfCare;
