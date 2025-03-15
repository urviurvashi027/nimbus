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
import SleepModal from "../Tools/Sleep/Sleep";
import WaterIntakeModal from "../Tools/WaterIntake/WaterIntake";
import ThingsToDoModal from "../Tools/ThingsToDo/ThingsToDo";
import { ScreenView } from "@/components/Themed";
import MasterClass from "@/components/tools/VideoListCard";
import { ThemeKey } from "@/components/Themed";

// import DrinkIcon from "@/assets/images/Options/drink.png";
// import ThingToDoIcon from "@/assets/images/Options/things.png";
// import FitnessIcon from "@/assets/images/Options/Fitness.png";
// import ReflectionIcon from "@/assets/images/Options/Reflection.png";
// import SleepIcon from "@/assets/images/Options/Sleep.png";
// import SoundsScapeIcon from "@/assets/images/Options/SoundsScape.png";
// import MeditationIcon from "@/assets/images/Options/Meditation.png";
// import TestIcon from "@/assets/images/Options/Test.png";
// import TherapyIcon from "@/assets/images/Options/drink.png";

// const { theme, toggleTheme } = useContext(ThemeContext);

const Tools: React.FC = () => {
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
      screen: "/(auth)/Tools/test",
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
      screen: "/(auth)/Tools/Meditation/Meditation",
      icon: require("../../../assets/images/options/meditation.png"),
    },
    {
      id: 4,
      label: "Workout",
      action: "navigate",
      screen: "/(auth)/Tools/Workout/Workout",
      icon: require("../../../assets/images/options/fitness.png"),
    },
    {
      id: 5,
      label: "Soundscape",
      action: "navigate",
      screen: "/(auth)/Tools/Soundscape/Soundscape",
      icon: require("../../../assets/images/options/soundscape.png"),
    },
    {
      id: 6,
      label: "Reflection",
      action: "navigate",
      screen: "/(auth)/Tools/Reflections/Reflection",
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

        {/* Sleep Modal */}
        <SleepModal
          visible={showSleepTagsModal}
          onClose={() => setShowSleepTagsModal(false)}
        />

        {/* Water Modal */}
        <WaterIntakeModal
          visible={showWaterIntakekModal}
          onClose={() => {
            // console.log("on closse modal clicked");
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

export default Tools;
