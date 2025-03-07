import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import libraryTracks from "@/constant/data/soundtrack";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";

// Define a type for the track
interface Track {
  id: string;
  title: string;
  duration: string;
  image: any; // Image source (can be refined later)
  source: any; // Audio source (can be refined later)
}

const forYouTracks: Track[] = [
  {
    id: "1",
    title: "Rainstorm",
    duration: "61 min",
    image: require("../../../../assets/images/soundscape/lightRain.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
  },
];

const Soundscape = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForYou, setShowForYou] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);

  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

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

  const handlePlayPause = async (track: Track) => {
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

      const { sound: newSound } = await Audio.Sound.createAsync(track.source);
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenView
        style={{ padding: 0, paddingTop: Platform.OS === "ios" ? 50 : 20 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Soundscape</Text>
        </View>
        {/* "For You" Section */}
        {showForYou ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              {/* <TouchableOpacity onPress={() => setShowForYou(false)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity> */}
              <Text style={styles.sectionTitle}>For You</Text>
            </View>
            <FlatList
              data={forYouTracks}
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

        {/* "Library" Section */}
        {showLibrary ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              {/* <TouchableOpacity onPress={() => setShowLibrary(false)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity> */}
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
      </ScreenView>
    </View>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 10,
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
      fontWeight: "bold",
      marginLeft: 10,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
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
      fontWeight: "bold",
    },
    duration: {
      fontSize: 14,
      color: "#666",
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
