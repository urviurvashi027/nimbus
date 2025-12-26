import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
  Text,
} from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "expo-router";

import { TrackType } from "@/constant/data/soundtrack";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import { getSoundscapeList } from "@/services/toolService";
import BottomPlayer from "@/components/common/BottomPlayer";

import SoundscapeHeader from "@/components/selfCare/soundscape/SoundscapeHeader";
import SoundscapeForYouSection from "@/components/selfCare/soundscape/SoundscapeForYouSection";
import SoundscapeLibraryItem from "@/components/selfCare/soundscape/SoundscapeLibraryItem";
import SoundscapeForYouSkeleton from "@/components/selfCare/soundscape/SoundscapeForYouSkeleton";
import SoundscapeLibrarySkeleton from "@/components/selfCare/soundscape/SoundscapeLibrarySkeleton";

const { width } = Dimensions.get("window");

const Soundscape = () => {
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [libraryTracks, setLibraryTracks] = useState<any[] | undefined>();
  const [favTracks, setFavTracks] = useState<any[] | undefined>();
  const [showForYou, setShowForYou] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  // soft pastel palette for featured cards
  const colorPalette = [
    { bgColor: "#FADBD8", color: "#F19C94" },
    { bgColor: "#D5F5E3", color: "#ACEBC8" },
    { bgColor: "#F8E187", color: "#FBEDB7" },
    { bgColor: "#D6EAF8", color: "#95C9ED" },
    { bgColor: "#E8DAEF", color: "#C7A5D8" },
  ];

  const getSoundscapeListData = async () => {
    setIsLoading(true);
    try {
      const result = await getSoundscapeList();
      if (result && Array.isArray(result)) {
        const processedTracks = result.map((track: any) => ({
          ...track,
          image: { uri: track.image },
        }));

        setFavTracks(processedTracks.slice(0, 3));
        setLibraryTracks(processedTracks);
        setShowForYou(true);
        setShowLibrary(true);
      } else {
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSoundscapeListData();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  const handleClosePlayer = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    } catch (err) {
      console.warn("Error stopping sound on close:", err);
    } finally {
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  // Header for the vertical list: For You + Library title
  const renderListHeader = () => (
    <View>
      {showForYou && favTracks && (
        <SoundscapeForYouSection
          tracks={favTracks}
          onPlayPause={handlePlayPause}
          colorPalette={colorPalette}
        />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Library</Text>
      </View>
    </View>
  );

  // While loading → show skeleton layout instead of list
  if (isLoading) {
    return (
      <ScreenView
        style={{
          paddingTop:
            Platform.OS === "ios"
              ? spacing["xxl"] + spacing["xxl"] * 0.4
              : spacing.xl,
          paddingHorizontal: spacing.md,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <SoundscapeHeader onBack={() => navigation.goBack()} />
            <SoundscapeForYouSkeleton />
            <SoundscapeLibrarySkeleton />
          </View>
        </SafeAreaView>
      </ScreenView>
    );
  }

  // Loaded state
  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.4
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <SoundscapeHeader onBack={() => navigation.goBack()} />

          {showLibrary && libraryTracks && (
            <FlatList
              data={libraryTracks}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={renderListHeader}
              renderItem={({ item }) => (
                <SoundscapeLibraryItem
                  item={item}
                  isActive={currentTrack?.id === item.id && isPlaying}
                  onPress={() => handlePlayPause(item)}
                />
              )}
              contentContainerStyle={{
                paddingBottom: spacing.xl * 2, // keep last row above bottom player
              }}
            />
          )}
        </View>

        {currentTrack && (
          <BottomPlayer
            title={currentTrack.title}
            subtitle={`${currentTrack.duration || "3"} min · Soundscape`}
            image={currentTrack.image}
            isPlaying={isPlaying}
            onPlayPause={() => handlePlayPause(currentTrack)}
            onClose={handleClosePlayer}
          />
        )}
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textPrimary,
    },
  });

export default Soundscape;
