import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video"; // ✅ Import correct expo-video hooks

import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { ScreenView, ThemeKey } from "@/components/Themed";
import ForYouCard from "@/components/selfCare/workout/WorkoutFeaturedCard";
import { getWorkoutVideo } from "@/services/selfCareService";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

const FitnessVideoList = () => {
  const [forYouSectionData, setForYouSectionData] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  const getWorkoutListData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getWorkoutVideo();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedVideo = result.map((item: any) => {
          // Assign a random tag from the 'tags' array
          // Return a new object with the original properties plus the new ones
          return {
            ...item, // Spread operator to keep original properties
            isLocked: false,
            coachName: "UU",
            image: {
              uri: item.image,
            },
          };
        });

        setVideoList(processedVideo);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  const getForYouSectionData = async () => {
    // need to add filters functionality and category param changes
    try {
      const result = await getWorkoutVideo();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedVideo = result.map((item: any) => {
          return {
            ...item, // Spread operator to keep original properties
            title: "testing Section Data",
            isLocked: false,
            coachName: "UU",
            image: {
              uri: item.image,
            },
          };
        });

        setForYouSectionData(processedVideo);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getWorkoutListData();
    getForYouSectionData();
  }, []);

  useEffect(() => {
    if (videoList.length) {
      setPlayingVideoId(videoList[0].source);
    }
  }, [videoList]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // ✅ Initialize Video Player with first video
  const player = useVideoPlayer(currentVideoUrl, (player) => {
    player.loop = true;
    if (isPlaying) player.play();
  });

  const handlePlayVideo = (
    videoId: string,
    islocked: boolean,
    videoUrl: string
  ) => {
    if (islocked) return;
    player.play();
    setPlayingVideoId(videoId);
    setCurrentVideoUrl(videoUrl);
    setIsPlaying(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    player.currentTime += 10;
  };

  const skipBackward = () => {
    player.currentTime -= 10;
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    togglePlayPause();
  };

  const onFeaturePostClick = (
    id: string,
    isLocked: boolean,
    videoUrl: string
  ) => {
    handlePlayVideo(id, isLocked, videoUrl);
    openFullscreen();
  };

  const renderVideoItem = ({ item }: any) => {
    const isPlayingThis = playingVideoId === item.id;

    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handlePlayVideo(item.id, item.isLocked, item.source)}
      >
        {isPlayingThis ? (
          <TouchableOpacity
            onPress={openFullscreen}
            style={styles.videoContainer}
          >
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator
                  size="large"
                  color={themeColors.basic.commonWhite}
                />
              </View>
            )}
            <VideoView
              style={styles.videoPlayer}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          </TouchableOpacity>
        ) : (
          <ImageBackground
            source={item.image}
            style={styles.videoThumbnail}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.playButton}>
              <Ionicons
                name="play-circle"
                size={30}
                color={themeColors.basic.commonWhite}
              />
            </View>
          </ImageBackground>
        )}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.videoDuration}>{item.duration} min</Text>
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
    );
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
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
        {videoList.length ? (
          <ScrollView>
            <Text style={styles.header}>Workout</Text>
            <Text style={styles.subHeader}>
              Make workouts part of your daily life.
            </Text>

            <Text style={styles.sectionTitle}>For you</Text>
            <FlatList
              data={forYouSectionData}
              renderItem={({ item }) => (
                <ForYouCard item={item} onPress={onFeaturePostClick} />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              snapToAlignment="start"
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              keyExtractor={(item) => item.id}
              horizontal
            />

            <Text style={styles.sectionTitle}>All</Text>
            <FlatList
              data={videoList}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />

            {/* Fullscreen Modal */}
            <Modal
              visible={isFullscreen}
              animationType="slide"
              transparent={true}
            >
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeFullscreen}
                >
                  <Ionicons
                    name="close"
                    size={30}
                    color={themeColors.basic.commonWhite}
                    style={{ marginTop: 30, marginRight: 10 }}
                  />
                </TouchableOpacity>

                <VideoView
                  style={styles.fullscreenVideo}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                />

                <View style={styles.fullscreenControls}>
                  <TouchableOpacity onPress={skipBackward}>
                    <Ionicons name="play-back" size={40} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={togglePlayPause}>
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={50}
                      color={themeColors.basic.commonWhite}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={skipForward}>
                    <Ionicons name="play-forward" size={40} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        ) : (
          <View>
            <Text>Loading ....</Text>
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
    header: {
      fontSize: 26,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    subHeader: {
      fontSize: 14,
      color: themeColors[theme].text,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      color: themeColors[theme].text,
    },
    lockIcon: {
      marginLeft: 5,
      marginTop: 1,
    },
    itemDetails: {
      flexDirection: "row",
      marginTop: 4,
    },
    videoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      width: "100%",
    },
    videoThumbnail: {
      width: 120,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 25,
      padding: 5,
    },
    videoInfo: {
      marginLeft: 10,
      flex: 1,
      padding: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    videoTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    videoDuration: { fontSize: 14, color: themeColors.basic.mediumGrey },
    videoContainer: {
      width: 120,
      height: 70,
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
    },
    videoPlayer: { width: "100%", height: "100%" },
    loadingOverlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 10,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: { position: "absolute", top: 30, right: 20 },
    fullscreenVideo: { width: "100%", height: 300 },
    fullscreenControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "80%",
      marginTop: 20,
    },
  });

export default FitnessVideoList;
