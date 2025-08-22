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
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { ScreenView, ThemeKey } from "@/components/Themed";
import GuidedMeditationCard from "@/components/selfCare/meditation/FeaturedCard";

import { Meditations } from "@/constant/data/meditation";
import { getMeditationAudioList } from "@/services/selfCareService";

const categories = ["All", "Stress & Anxiety", "Self-Care", "Beginner"];

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

const Meditation = () => {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<Meditations | null>(null);
  const [meditationList, setMeditationList] = useState<any[]>([]);
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

  const getMeditationlList = async () => {
    const tags = ["All", "Stress & Anxiety", "Self-Care", "Beginner"];

    // need to add filters functionality and category param changes
    try {
      const result = await getMeditationAudioList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedAudio = result.map((item: any) => {
          const randomTag = tags[Math.floor(Math.random() * tags.length)];
          return {
            ...item, // Spread operator to keep original properties
            tag: randomTag,
            isLocked: false,
            coachName: "UU",
            image: {
              uri: item.image,
            },
          };
        });
        setMeditationList(processedAudio);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getMeditationlList();
  }, []);

  const handlePlayPause = async (track: Meditations) => {
    if (track.isLocked) {
      return null;
    }
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
    const { sound: newSound } = await Audio.Sound.createAsync(
      typeof track.source === "string" ? { uri: track.source } : track.source
    );
    setSound(newSound);
    setCurrentTrack(track);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  // Filter meditations dynamically
  const filteredMeditations = meditationList.filter(
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

        {/* new Featured Card */}

        <View>
          <FlatList
            horizontal
            data={meditationList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <GuidedMeditationCard data={item} onPress={handlePlayPause} />
            )}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={CARD_WIDTH + 10} // card width + margin
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
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
                  <View style={styles.itemDetails}>
                    <Text style={styles.listDuration}>{item.duration}</Text>
                    {item.isLocked && (
                      <Ionicons
                        name="lock-closed"
                        size={13}
                        color={themeColors.basic.mediumGrey}
                        style={styles.lockIcon}
                      />
                    )}
                  </View>
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
    container: { flex: 1, paddingHorizontal: 10 },
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
      fontSize: 14,
      color: themeColors.basic.subheader,
      marginBottom: 20,
    },
    tabsWrapper: { marginBottom: 5 },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
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
    itemDetails: {
      flexDirection: "row",
    },
    tab: {
      marginRight: 15,
      paddingVertical: 5,
      paddingHorizontal: 10,
      height: 60,
    },
    tabText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
    },
    activeTabText: {
      color: themeColors.basic.activeText,
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
    listImage: { width: 50, height: 50, borderRadius: 25, marginRight: 20 },
    listText: { flex: 1 },
    listTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeColors[theme].text,
      marginBottom: 5,
    },
    lockIcon: {
      marginLeft: 5,
      marginTop: 1,
    },
    listDuration: { fontSize: 14, color: themeColors.basic.mediumGrey },
    bottomPlayer: {
      position: "absolute",
      bottom: 100,
      left: 0,
      right: 0,
      backgroundColor: themeColors.basic.darkGrey,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    playerImage: { width: 50, height: 50, borderRadius: 10 },
    playerText: { flex: 1, marginLeft: 10 },
    playerTitle: {
      color: themeColors.basic.primaryColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    playerDuration: { color: themeColors.basic.lightGrey, fontSize: 14 },

    heading: {
      fontSize: 18,
      color: themeColors[theme].text,
      fontWeight: "bold",
    },
  });

export default Meditation;
