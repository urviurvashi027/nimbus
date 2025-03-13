import React, { useState, useEffect, useContext } from "react";
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
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { ScreenView, ThemeKey } from "@/components/Themed";

const categories = ["All", "Stress & Anxiety", "Self-Care", "Beginner"];

type Meditations = {
  id: string;
  title: string;
  duration: string;
  description?: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio
  category: string;
};

const meditations = [
  {
    id: "1",
    title: "Accept Yourself",
    duration: "10 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../../../assets/images/meditation/acceptYourself.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    // z: require("../../../../assets/images/meditation/acceptYourself.png"),
    category: "All",
  },
  {
    id: "2",
    title: "Anxiety release",
    duration: "10 min",
    image: require("../../../../assets/images/meditation/anxietyRelease.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    category: "Stress & Anxiety",
  },
  {
    id: "3",
    title: "🧘 Find Inner Strength in 5 minutes.",
    duration: "5 min",
    image: require("../../../../assets/images/meditation/innerStrength.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    category: "Self-Care",
  },
  {
    id: "4",
    title: "Deal with work stress",
    duration: "10 min",
    // image: require("./assets/work_stress.jpg"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../../../assets/images/meditation/stress.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    category: "All",
  },
];

const recommendations = [
  {
    id: "1",
    title: "Deal with work stress",
    duration: "10 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
  },
];

const Meditation = () => {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<Meditations | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlayPause = async (track: Meditations) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        await sound?.pauseAsync();
      } else {
        await sound?.playAsync();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(track.source);
    setSound(newSound);
    setCurrentTrack(track);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  // Filter meditations dynamically
  const filteredMeditations = meditations.filter(
    (item) => item.category === currentCategory || currentCategory === "All"
  );

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
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
        {/* Header */}
        <Text style={styles.header}>Meditate</Text>
        <Text style={styles.subHeader}>Find peace through meditation.</Text>

        {/* new Featured section  */}
        <Text style={styles.heading}>For you</Text>
        <View style={styles.card}>
          <Image
            source={require("../../../../assets/images/reflection.png")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Accept Yourself</Text>
            <Text style={styles.duration}>10 min</Text>
            <Text style={styles.description}>
              Feeling unconditional love and acceptance towards yourself and the
              world !!
            </Text>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setCurrentCategory(category)}
                style={styles.tabContainer}
              >
                <Text
                  style={[
                    styles.tabText,
                    currentCategory === category && styles.activeTabText,
                  ]}
                >
                  {category}
                </Text>
                {currentCategory === category && (
                  <View style={styles.activeTabIndicator} />
                )}
                {/* Bottom border */}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Wrap FlatList inside View to prevent shrinking */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredMeditations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 1 }} // ✅ Ensures it fills space
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No meditations found</Text>
            )} // ✅ Prevents collapsing
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handlePlayPause(item)}
              >
                <Image source={item.image} style={styles.listImage} />
                <View style={styles.listText}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listDuration}>{item.duration}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Bottom Audio Player */}
        {currentTrack && (
          <View style={styles.bottomPlayer}>
            <Image source={currentTrack.image} style={styles.playerImage} />
            <View style={styles.playerText}>
              <Text style={styles.playerTitle}>{currentTrack.title}</Text>
              <Text style={styles.playerDuration}>
                {currentTrack.duration} · Meditation
              </Text>
            </View>
            <TouchableOpacity onPress={() => handlePlayPause(currentTrack)}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={24}
                color={styles.iconColor.color}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentTrack(null)}>
              <Ionicons name="close" size={24} color={styles.iconColor.color} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    iconColor: {
      color: themeColors.basic.primaryColor,
    },
    header: {
      fontSize: 26,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    subHeader: {
      fontSize: 16,
      color: themeColors[theme].text,
      marginBottom: 20,
    },
    tabsWrapper: { marginBottom: 5 },
    featuredCard: {
      backgroundColor: "#EEE",
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: "#999",
      marginTop: 20,
    },
    flatListContainer: { flex: 1 },
    tabsContainer: { marginBottom: 10, paddingHorizontal: 0 },
    tabContainer: {
      alignItems: "center",
      marginRight: 15,
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    tab: {
      marginRight: 15,
      paddingVertical: 5,
      paddingHorizontal: 10,
      height: 60,
    },
    activeTab: { borderBottomWidth: 2, borderBottomColor: "red" },
    tabText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
    },
    activeTabText: {
      color: themeColors.basic.secondaryColor,
      fontWeight: "bold",
    },
    activeTabIndicator: {
      height: 2,
      width: "100%",
      backgroundColor: themeColors.basic.secondaryColor,
      marginTop: 3,
    },

    listItem: {
      flexDirection: "row",
      padding: 10,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    listImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    listText: { flex: 1 },
    listTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    listDuration: { fontSize: 14, color: "#777" },
    bottomPlayer: {
      position: "absolute",
      bottom: 100,
      left: 0,
      right: 0,
      backgroundColor: "#333",
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    playerImage: { width: 50, height: 50, borderRadius: 10 },
    playerText: { flex: 1, marginLeft: 10 },
    playerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    playerDuration: { color: "#ccc", fontSize: 14 },

    // new
    heading: {
      fontSize: 18,
      color: themeColors[theme].text,
      fontWeight: "bold",
      marginBottom: 10,
    },
    card: {
      backgroundColor: themeColors.basic.tertiaryColor,
      borderRadius: 10,
      padding: 25,
      marginVertical: 30,
      flexDirection: "row",
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 25,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    duration: {
      fontSize: 14,
      color: "gray",
    },
    description: {
      fontSize: 12,
      color: "gray",
      marginTop: 5,
    },
  });

export default Meditation;
