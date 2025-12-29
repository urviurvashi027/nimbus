// screens/selfCare/Meditation.tsx
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
import { useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";

import { Meditations } from "@/types/toolsTypes";
import { getMeditationAudioList } from "@/services/selfCareService";

import MeditationCategoryTabs from "@/components/selfCare/meditation/MeditationCategoryTabs";
import MeditationListItem from "@/components/selfCare/meditation/MeditationListItem";
import BottomPlayer from "@/components/common/BottomPlayer";
import MeditationFeaturedSection from "@/components/selfCare/meditation/MeditationFeaturedSection";
import MeditationHeader from "@/components/selfCare/meditation/MeditationHeader";
import {
  MeditationFeaturedSkeleton,
  MeditationListSkeleton,
} from "@/components/selfCare/meditation/MeditationSkeletonSections";

// TODO: remove mock data

// Dummy list used when API fails / for dev UX testing
const FALLBACK_MEDITATIONS: any[] = [
  {
    id: "dummy-1",
    title: "Quick Calm Breath",
    description: "2-minute reset for hectic days.",
    duration: "2",
    tag: "Stress & Anxiety",
    isLocked: false,
    source: "https://example.com/med1.mp3",
    image: { uri: "https://placehold.co/200x200?text=Calm" },
  },
  {
    id: "dummy-2",
    title: "Self-Compassion Check-In",
    description: "Be gentle with yourself for a moment.",
    duration: "5",
    tag: "Self-Care",
    isLocked: false,
    source: "https://example.com/med2.mp3",
    image: { uri: "https://placehold.co/200x200?text=Care" },
  },
  {
    id: "dummy-3",
    title: "First Steps into Meditation",
    description: "A simple beginner-friendly practice.",
    duration: "4",
    tag: "Beginner",
    isLocked: false,
    source: "https://example.com/med3.mp3",
    image: { uri: "https://placehold.co/200x200?text=Start" },
  },
];

const categories = ["All", "Stress & Anxiety", "Self-Care", "Beginner"];

export type EnrichedMeditation = Meditations & {
  tag: string;
  isLocked: boolean;
  coachName: string;
  durationLabel: string;
  image: any;
};

const Meditation: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [meditationList, setMeditationList] = useState<EnrichedMeditation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const [currentTrack, setCurrentTrack] = useState<EnrichedMeditation | null>(
    null
  );
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  // Soft pastel palette for featured cards
  const colorPalette = [
    // Rosewood (warm calm)
    { bgColor: "rgba(233, 168, 160, 0.14)", color: "#E0A39B" },

    // Sage (signature Nimbus)
    { bgColor: "rgba(167, 201, 180, 0.14)", color: "#A7C9B4" },

    // Sand / Gold (premium highlight)
    { bgColor: "rgba(224, 199, 129, 0.14)", color: "#E0C781" },

    // Mist / Sky (clean + modern)
    { bgColor: "rgba(152, 190, 214, 0.14)", color: "#98BED6" },

    // Mauve (soft luxury)
    { bgColor: "rgba(192, 167, 207, 0.14)", color: "#C0A7CF" },
  ];

  // Header hidden (we draw our own)
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Cleanup audio when sound ref changes
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // // Fetch meditation list
  const loadMeditations = async () => {
    setIsLoading(true);
    try {
      const tags = categories;
      const result = await getMeditationAudioList();

      if (result && Array.isArray(result)) {
        const processed: EnrichedMeditation[] = result.map((item: any) => {
          const randomTag =
            tags[Math.floor(Math.random() * tags.length)] ?? "All";
          return {
            ...item,
            tag: randomTag,
            isLocked: false,
            coachName: "UU",
            durationLabel: `${item.duration ?? 3} min`,
            image: { uri: item.image },
          };
        });

        setMeditationList(processed);
      } else {
        console.error("API response data is not an array:", result);
      }
    } catch (error) {
      console.log(error, "API Error Response");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeditations();
  }, []);

  const handlePlayPause = async (track: EnrichedMeditation) => {
    try {
      if (track.isLocked) {
        return;
      }

      // Toggle if same track
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          await sound?.pauseAsync();
        } else {
          await sound?.playAsync();
        }
        setIsPlaying(!isPlaying);
        return;
      }

      // Switch to new track
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
    } catch (err) {
      console.error("Error playing meditation:", err);
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
      console.warn("Error stopping meditation:", err);
    } finally {
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  // Filter based on category
  const filteredMeditations =
    currentCategory === "All"
      ? meditationList
      : meditationList.filter((m) => m.tag === currentCategory);

  const listHeader = isLoading ? (
    <>
      <MeditationFeaturedSkeleton />
      <MeditationListSkeleton />
    </>
  ) : (
    <>
      <MeditationFeaturedSection
        data={meditationList}
        onPress={handlePlayPause}
        colorPalette={colorPalette}
      />

      <MeditationCategoryTabs
        categories={categories}
        currentCategory={currentCategory}
        onChangeCategory={setCurrentCategory}
      />

      <View style={[styles.sectionContainer, { marginBottom: spacing.md }]}>
        <Text style={styles.sectionTitle}>Library</Text>
      </View>
    </>
  );

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
      <View style={styles.container}>
        {/* 🔝 Non-scrollable header – matches Soundscape */}
        <MeditationHeader onBack={() => navigation.goBack()} />
        {/* Single vertical scroll for featured + library */}
        <FlatList
          data={filteredMeditations}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={listHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: currentTrack ? spacing["xxl"] * 1.4 : spacing.xl,
          }}
          ListEmptyComponent={
            !isLoading && meditationList.length === 0
              ? () => (
                  <Text style={styles.emptyText}>No meditations found.</Text>
                )
              : !isLoading && currentCategory !== "All"
              ? () => (
                  <Text style={styles.emptyText}>
                    No meditations under “{currentCategory}” yet.
                  </Text>
                )
              : null
          }
          renderItem={({ item }) => (
            <MeditationListItem
              item={item}
              isActive={currentTrack?.id === item.id}
              isPlaying={isPlaying}
              onPress={() => handlePlayPause(item)}
            />
          )}
        />

        {/* Bottom Player */}
        {currentTrack && (
          <BottomPlayer
            title={currentTrack.title}
            subtitle={`${currentTrack.durationLabel} · Meditation`}
            image={currentTrack.image}
            isPlaying={isPlaying}
            onPlayPause={() => handlePlayPause(currentTrack)}
            onClose={handleClosePlayer}
          />
        )}
      </View>
    </ScreenView>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    backButton: {
      marginBottom: spacing.md,
    },
    headerBlock: {
      marginBottom: spacing.lg,
    },
    header: {
      ...typography.h2,
      color: newTheme.textPrimary,
    },
    subHeader: {
      ...typography.body,
      color: newTheme.textSecondary,
      marginTop: spacing.xs,
    },
    sectionContainer: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textPrimary,
      marginBottom: spacing.sm,
    },
    emptyText: {
      textAlign: "center",
      ...typography.body,
      color: newTheme.textSecondary,
      marginTop: spacing.lg,
    },
  });

export default Meditation;
