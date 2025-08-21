import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { TrackType, forYouTracks } from "@/constant/data/soundtrack";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import SoundscapeFeaturedCard from "@/components/selfCare/soundscape/FeaturedCard";
import { getSoundscapeList } from "@/services/toolService";

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

const Soundscape = () => {
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForYou, setShowForYou] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);

  const [libraryTracks, setLibraryTracks] = useState<any[] | undefined>();

  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  //libraryTracks
  // need to integrate audio functionality and image check
  const getSoundscapeListData = async () => {
    try {
      const result = await getSoundscapeList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedArticles = result.map((tracks: any) => {
          // Assign a random tag from the 'tags' arra

          // Return a new object with the original properties plus the new ones
          return {
            ...tracks, // Spread operator to keep original properties
            image: {
              uri: tracks.image,
            },
          };
        });

        // console.log(processedArticles, "processedArticles sound");
        setShowLibrary(true);
        setLibraryTracks(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getSoundscapeListData();
  }, []);

  const refreshData = () => {
    getSoundscapeListData();
  };

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

  const handlePlayPause = async (track: any) => {
    console.log(track, "track");
    try {
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

      // const { sound: newSound } = await Audio.Sound.createAsync(track.source);
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: track.source,
      });
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <ScreenView
      style={{ padding: 0, paddingTop: Platform.OS === "ios" ? 40 : 20 }}
    >
      <View style={styles.container}>
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

        <Text style={styles.header}>Soundscape</Text>
        <Text style={styles.subHeader}>Immense Yourself in true nature.</Text>

        {/* "For You" Section */}
        {showForYou ? (
          <View>
            <FlatList
              horizontal
              data={forYouTracks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <SoundscapeFeaturedCard data={item} onPress={handlePlayPause} />
              )}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              snapToInterval={CARD_WIDTH + 10} // card width + margin
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 0 }}
            />
          </View>
        ) : null}

        {/* "Library" Section */}
        {showLibrary ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Library</Text>
            </View>
            <FlatList
              data={libraryTracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handlePlayPause(item)}
                >
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.duration}>{item.duration}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}

        {/* Bottom Player */}
        {currentTrack && (
          <View style={styles.bottomPlayer}>
            <Image source={currentTrack.image} style={styles.playerImage} />
            <View style={styles.playerText}>
              <Text style={styles.playerTitle}>{currentTrack.title}</Text>
              <Text style={styles.playerDuration}>
                {currentTrack.duration} · Soundscape
              </Text>
            </View>
            <TouchableOpacity onPress={() => handlePlayPause(currentTrack)}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentTrack(null)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
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
    header: {
      fontSize: 26,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    subHeader: {
      fontSize: 14,
      color: themeColors.basic.subheader,
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 10,
      color: themeColors[theme].text,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      color: themeColors[theme].text,
      fontWeight: "bold",
      marginLeft: 10,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      color: themeColors[theme].text,
      fontWeight: "bold",
    },
    duration: {
      fontSize: 14,
      color: themeColors[theme].text,
    },
    bottomPlayer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#333",
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    playerImage: {
      width: 50,
      height: 50,
      borderRadius: 10,
    },
    playerText: {
      flex: 1,
      marginLeft: 10,
    },
    playerTitle: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    playerDuration: {
      color: "#ccc",
      fontSize: 14,
    },
  });

export default Soundscape;
