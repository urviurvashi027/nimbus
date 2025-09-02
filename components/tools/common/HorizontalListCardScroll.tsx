import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/theme/Colors";
import { TrackType } from "@/constant/data/soundtrack";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

interface PropType {
  backgroundColor: string;
  title: string;
  description: string;
  itemList: Array<TrackType | any>;
  noOfRows?: number;
  onClickOfAll: () => void;
}

const HorizontalListCardScroll: React.FC<PropType> = (props) => {
  const {
    backgroundColor,
    title,
    description,
    onClickOfAll,
    itemList,
    noOfRows,
  } = props;

  // console.log(itemList, "itemList");

  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForYou, setShowForYou] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);
  // Split data into rows of 3 items each
  const chunkedData = [];
  const rowCount = noOfRows || 3;
  for (let i = 0; i < itemList.length; i += rowCount) {
    chunkedData.push(itemList.slice(i, i + rowCount));
  }

  // console.log(chunkedData, backgroundColor, "chunkedData");

  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styling(theme, newTheme, backgroundColor);

  const handleItemClick = (title: string, entry: any) => {
    console.log("I am clicked", title, entry);
    switch (title) {
      case "Soundscape":
      case "Meditation":
        handlePlayPause(entry);
        break;
      case "Medical Test":
        router.push({
          pathname: "/(auth)/SelfCare/test/getStared",
          params: { id: entry.id },
        });
        break;
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlayPause = async (track: any) => {
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
      const { sound: newSound } = await Audio.Sound.createAsync(
        typeof track.source === "string" ? { uri: track.source } : track.source
      );
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const onCloseModal = async (currentTrack: any) => {
    // handlePlayPause(currentTrack);
    if (isPlaying) {
      await sound?.pauseAsync();
    }
    setCurrentTrack(null);
  };

  return (
    <View style={[styles.card, { backgroundColor: backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity onPress={onClickOfAll}>
          <Text style={styles.allButton}>All {">"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <FlatList
        data={chunkedData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.rowContainer}>
            {item.map((entry: any) => (
              <TouchableOpacity
                key={entry.id}
                onPress={() => handleItemClick(title, entry)}
              >
                <View style={styles.itemRow}>
                  <Image source={entry.image} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{entry.title}</Text>
                    {entry.duration && (
                      <Text style={styles.itemDuration}>
                        {entry.duration || "3"} min
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
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
          <TouchableOpacity onPress={() => onCloseModal(currentTrack)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HorizontalListCardScroll;

const styling = (theme: ThemeKey, newTheme: any, color: string) =>
  StyleSheet.create({
    card: {
      marginVertical: 20,
      borderRadius: 15,
      padding: 15,
      borderWidth: 1,
      // backgroundColor: color,
      borderColor: color,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
      color: themeColors.basic.commonBlack,
    },
    cardDescription: {
      fontSize: 14,
      color: themeColors.basic.commonBlack,
      marginBottom: 10,
    },
    allButton: {
      fontSize: 14,
      color: themeColors.basic.commonBlack,
    },
    rowContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      // paddingVertical: 8,
      // paddingHorizontal: 10,
      backgroundColor: color,
      borderRadius: 10,
      marginRight: 15,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      // paddingVertical: 10,
      minWidth: 250,
      // paddingHorizontal: 10,
      // borderBottomWidth: 1,
      // borderBottomColor: "#ddd",
    },
    itemInfo: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      marginRight: 5,
    },
    startButton: {
      alignSelf: "center",
      marginVertical: 30,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "#7A4DF3",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
    startButtonText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
    startButtonSubText: {
      color: "white",
      fontSize: 14,
      marginTop: 5,
    },
    itemImage: {
      width: 80,
      height: 80,
      // borderRadius: 25,
      marginRight: 5,
    },
    itemTitle: {
      fontSize: 16,
    },
    itemDuration: {
      fontSize: 12,
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
