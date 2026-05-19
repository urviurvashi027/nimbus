import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import BottomPlayer from "@/components/layout/BottomPlayer";
import AppHeader from "@/components/layout/AppHeader";
import PillFilters from "@/components/ui/PillFilters";
import { ScreenView } from "@/components/ui/Themed";
import ThemeContext from "@/contexts/ThemeContext";
import { TrackType } from "@/constants/data/soundtrack";
import { ROUTES } from "@/constants/routes";
import { getSoundscapeList } from "@/features/tools/services/toolService";
import ProtocolTemplateCard from "@/features/tools/components/common/ProtocolTemplateCard";
import SoundscapePinterestSkeleton from "@/features/self-care/components/soundscape/SoundscapePinterestSkeleton";
import type { Spacing, SvaColorSet, TypographyTokens } from "@/theme/types";

const FAVORITES_KEY = "soundscape_favorites_v1";
const FAVORITES_FILTER_VALUE = "favorites";
const FALLBACK_IMAGE = require("@/assets/images/mt.jpg");
const FALLBACK_SOURCE = require("@/assets/dump/lightRain.mp3");

const MOCK_SOUNDSCAPES = [
  {
    id: "528-dna-integrity",
    title: "528Hz: DNA Integrity",
    duration: "6 min",
    description: "Alpha 10Hz | Solfeggio 528Hz",
    image: require("@/assets/images/mt.jpg"),
    source: FALLBACK_SOURCE,
    category: "Frequency",
    isLocked: false,
  },
  {
    id: "432-earth-pulse",
    title: "432Hz: Earth Pulse",
    duration: "7 min",
    description: "Theta 6Hz | Pythagorean 432Hz",
    image: require("@/assets/images/loginLatest.png"),
    source: FALLBACK_SOURCE,
    category: "Grounding",
    isLocked: false,
  },
  {
    id: "639-neural-bridge",
    title: "639Hz: Neural Bridge",
    duration: "8 min",
    description: "Gamma 40Hz | Solfeggio 639Hz",
    image: require("@/assets/images/bodyShape/1.png"),
    source: FALLBACK_SOURCE,
    category: "Coherence",
    isLocked: false,
  },
  {
    id: "174-foundation",
    title: "174Hz: Foundation",
    duration: "5 min",
    description: "Delta 2Hz | Solfeggio 174Hz",
    image: require("@/assets/images/bodyShape/2.png"),
    source: FALLBACK_SOURCE,
    category: "Release",
    isLocked: false,
  },
  {
    id: "rain-cedar",
    title: "Rain Over Cedar",
    duration: "10 min",
    description: "Late rain, cedar hush, and low-frequency calm.",
    image: require("@/assets/images/mentalTest/childhoodTrauma.png"),
    source: FALLBACK_SOURCE,
    category: "Nature",
    isLocked: false,
  },
  {
    id: "ocean-drift",
    title: "Ocean Drift",
    duration: "12 min",
    description: "Slow surf texture for sleep and deep reset.",
    image: require("@/assets/images/result.jpg"),
    source: FALLBACK_SOURCE,
    category: "Sleep",
    isLocked: false,
  },
];

type SoundscapeTrack = TrackType & {
  durationLabel: string;
  tags: string[];
  filterTags: string[];
};

type SoundscapeRawTrack = {
  id?: string;
  title?: string;
  name?: string;
  duration?: unknown;
  description?: string;
  image?: unknown;
  source?: unknown;
  category?: string;
  isLocked?: boolean;
};

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const formatTagLabel = (value?: string | null) => {
  if (!value) return "Curated";

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((part) =>
      part && part === part.toUpperCase()
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(" ");
};

const formatDurationLabel = (duration: unknown) => {
  if (typeof duration === "number" && Number.isFinite(duration)) {
    return `${duration} min`;
  }

  if (typeof duration === "string") {
    const trimmed = duration.trim();
    if (!trimmed) return "3 min";
    if (/\d/.test(trimmed)) return trimmed;
    return `${trimmed} min`;
  }

  return "3 min";
};

const detectMoodTag = (
  title: string,
  description: string,
  category: string
) => {
  const blob = `${title} ${description} ${category}`.toLowerCase();

  if (/(rain|storm|wave|ocean|river|stream|brook|water|sea)/.test(blob)) {
    return "Nature";
  }
  if (/(sleep|dream|night|rest|nap|lullaby)/.test(blob)) {
    return "Sleep";
  }
  if (/(focus|study|work|clarity|concentr|productiv|brain)/.test(blob)) {
    return "Focus";
  }
  if (
    /(binaural|frequency|hz|resonance|pulse|alpha|beta|theta|delta|gamma)/.test(
      blob
    )
  ) {
    return "Frequency";
  }
  if (/(breath|breathing|meditat|calm|relax|soothe)/.test(blob)) {
    return "Calm";
  }

  return "Curated";
};

const resolveImageSource = (image: unknown): ImageSourcePropType => {
  if (!image) return FALLBACK_IMAGE;
  if (typeof image === "string") return { uri: image };
  if (typeof image === "number") return image;
  if (typeof image === "object") {
    const maybeImage = image as { uri?: unknown; url?: unknown };
    if (typeof maybeImage.uri === "string") return { uri: maybeImage.uri };
    if (typeof maybeImage.url === "string") return { uri: maybeImage.url };
    return image as ImageSourcePropType;
  }

  return FALLBACK_IMAGE;
};

const resolveAudioSource = (source: unknown) => {
  if (!source) return FALLBACK_SOURCE;
  if (typeof source === "string") return { uri: source };
  return source;
};

const uniqueStrings = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean)));

const toSoundscapeTrack = (
  item: SoundscapeRawTrack | unknown,
  index: number
): SoundscapeTrack => {
  const record = isRecord(item) ? (item as SoundscapeRawTrack) : {};
  const title = String(record.title ?? `Soundscape ${index + 1}`);
  const description = String(record.description ?? "");
  const category = formatTagLabel(String(record.category ?? "Curated"));
  const durationLabel = formatDurationLabel(record.duration);
  const moodTag = detectMoodTag(title, description, category);
  const tags = uniqueStrings([category, moodTag]);

  return {
    ...(record ?? {}),
    id: String(record.id ?? `${normalizeKey(title)}-${index}`),
    title,
    name: record.name ?? title,
    duration: durationLabel,
    durationLabel,
    description,
    image: resolveImageSource(record.image),
    source: resolveAudioSource(record.source),
    category,
    isLocked: Boolean(record.isLocked),
    tags,
    filterTags: tags,
  };
};

const FAVORITES_SUBTITLE = "Soundscape archive for rest, focus, and reset.";

export const SoundscapeScreen = () => {
  const navigation = useNavigation();
  const { svaColors, svaTypography, spacing } = useContext(ThemeContext);
  const styles = useMemo(
    () => styling(svaColors, svaTypography, spacing),
    [svaColors, svaTypography, spacing]
  );

  const [currentTrack, setCurrentTrack] = useState<SoundscapeTrack | null>(
    null
  );
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<SoundscapeTrack[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [hasStoredFavorites, setHasStoredFavorites] = useState<boolean | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const seededFavoritesRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadFavorites = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          if (isMountedRef.current) {
            setFavoriteIds(parsed.map(String));
            setHasStoredFavorites(true);
          }
        } else if (isMountedRef.current) {
          setHasStoredFavorites(false);
        }
      } else if (isMountedRef.current) {
        setHasStoredFavorites(false);
      }
    } catch (error) {
      console.warn("Unable to load soundscape favorites:", error);
      if (isMountedRef.current) {
        setHasStoredFavorites(false);
      }
    } finally {
      if (isMountedRef.current) {
        setFavoritesLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      void loadFavorites();
    });

    return unsubscribe;
  }, [loadFavorites, navigation]);

  useEffect(() => {
    let active = true;

    const loadSoundscapes = async () => {
      setIsLoading(true);
      try {
        const result: unknown = await getSoundscapeList();
        const rawTracks = isRecord(result)
          ? Array.isArray(result.data)
            ? (result.data as SoundscapeRawTrack[])
            : Array.isArray(result.items)
            ? (result.items as SoundscapeRawTrack[])
            : null
          : Array.isArray(result)
          ? (result as SoundscapeRawTrack[])
          : null;

        if (!rawTracks) {
          console.error("Soundscape response data is not an array:", result);
          if (active) {
            setTracks(
              MOCK_SOUNDSCAPES.map((item, index) =>
                toSoundscapeTrack(item, index)
              )
            );
          }
          return;
        }

        const sourceTracks =
          rawTracks.length > 0 ? rawTracks : MOCK_SOUNDSCAPES;
        const normalized = sourceTracks.map((item, index) =>
          toSoundscapeTrack(item, index)
        );

        if (active) {
          setTracks(normalized);
        }
      } catch (error) {
        console.log(error, "API Error Response");
        if (active) {
          setTracks(
            MOCK_SOUNDSCAPES.map((item, index) =>
              toSoundscapeTrack(item, index)
            )
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadSoundscapes();

    return () => {
      active = false;
    };
  }, []);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filterOptions = useMemo(() => {
    const filters = tracks.flatMap((track) => track.filterTags);
    const uniqueFilters = uniqueStrings(filters).filter(
      (label) => normalizeKey(label) !== FAVORITES_FILTER_VALUE
    );

    return [
      { label: "All", value: "all" },
      { label: "Favorites", value: FAVORITES_FILTER_VALUE },
      ...uniqueFilters.slice(0, 8).map((label) => ({
        label,
        value: label,
      })),
    ];
  }, [tracks]);

  const showFavoritesOnly = selectedFilter === FAVORITES_FILTER_VALUE;

  const filteredTracks = useMemo(() => {
    const selectedKey = normalizeKey(selectedFilter);

    return tracks.filter((track) => {
      const matchesFilter =
        selectedFilter === "all" ||
        selectedFilter === FAVORITES_FILTER_VALUE ||
        track.filterTags.some((tag) => normalizeKey(tag) === selectedKey);
      const matchesFavorites = !showFavoritesOnly || favoriteSet.has(track.id);

      return matchesFilter && matchesFavorites;
    });
  }, [tracks, selectedFilter, favoriteSet, showFavoritesOnly]);

  useEffect(() => {
    if (
      !favoritesLoaded ||
      hasStoredFavorites !== false ||
      seededFavoritesRef.current ||
      tracks.length === 0 ||
      favoriteIds.length > 0
    ) {
      return;
    }

    const seed = tracks.slice(0, 3).map((track) => track.id);
    if (seed.length === 0) {
      return;
    }

    seededFavoritesRef.current = true;
    setFavoriteIds(seed);
    void AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(seed));
  }, [favoriteIds.length, favoritesLoaded, hasStoredFavorites, tracks]);

  const handlePlayPause = async (track: SoundscapeTrack) => {
    try {
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          await sound?.pauseAsync();
        } else {
          await sound?.playAsync();
        }
        setIsPlaying((value) => !value);
        return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: nextSound } = await Audio.Sound.createAsync(
        typeof track.source === "string" ? { uri: track.source } : track.source
      );

      setSound(nextSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      await nextSound.playAsync();
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
    } catch (error) {
      console.warn("Error stopping sound on close:", error);
    } finally {
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const handleToggleFavorite = async (trackId: string) => {
    try {
      const nextFavorites = favoriteSet.has(trackId)
        ? favoriteIds.filter((id) => id !== trackId)
        : [trackId, ...favoriteIds];

      setFavoriteIds(nextFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    } catch (error) {
      console.warn("favorite toggle failed", error);
    }
  };

  const handleOpenSoundscapeDetail = useCallback((soundscapeId: string) => {
    router.push({
      pathname: ROUTES.AUTH.SELF_CARE_SOUNDSCAPE_DETAIL,
      params: { soundscapeId },
    });
  }, []);

  const handleBack = useCallback(() => {
    if (selectedFilter === FAVORITES_FILTER_VALUE) {
      setSelectedFilter("all");
      return;
    }

    navigation.goBack();
  }, [navigation, selectedFilter]);

  const headerTitle = "Acoustic Formulas";
  const headerSubtitle = selectedFilter === FAVORITES_FILTER_VALUE
    ? "A private stack of saved soundscapes."
    : FAVORITES_SUBTITLE;

  const emptyTitle = selectedFilter === FAVORITES_FILTER_VALUE
    ? "No favorites yet."
    : selectedFilter === "all"
    ? "No soundscapes found."
    : "No soundscapes in this filter.";
  const emptySubtitle = selectedFilter === FAVORITES_FILTER_VALUE
    ? "Tap the favorites tag on any card to save it here."
    : selectedFilter === "all"
    ? "Try again in a moment or revisit the library later."
    : "Try a different tag or clear the filter row.";

  if (isLoading) {
    return (
      <ScreenView bgColor={svaColors.bg.base} padding={0} style={styles.screen}>
        <View style={styles.root}>
          <AppHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            onBack={handleBack}
            titleStyle={styles.headerTitle}
            subtitleStyle={styles.headerSubtitle}
            containerStyle={styles.header}
          />

          <SoundscapePinterestSkeleton />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView bgColor={svaColors.bg.base} padding={0} style={styles.screen}>
      <View style={styles.root}>
        <AppHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          onBack={handleBack}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
          containerStyle={styles.header}
        />

        <PillFilters
          options={filterOptions}
          selectedValue={selectedFilter}
          onChange={setSelectedFilter}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersRow}
          selectedPillStyle={styles.filterPillSelected}
          inactivePillStyle={styles.filterPillInactive}
          selectedLabelStyle={styles.filterLabelSelected}
          inactiveLabelStyle={styles.filterLabelInactive}
          labelStyle={styles.filterLabel}
        />

        <FlatList
          data={filteredTracks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: currentTrack ? spacing.xl * 5 : spacing.xl * 3 },
          ]}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.cardShell}>
              <ProtocolTemplateCard
                item={item}
                style={styles.cardCell}
                onPress={() => handleOpenSoundscapeDetail(item.id)}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  favoriteSet.has(item.id)
                    ? `Remove ${item.title} from favorites`
                    : `Add ${item.title} to favorites`
                }
                onPress={() => handleToggleFavorite(item.id)}
                style={({ pressed }) => [
                  styles.favoriteTag,
                  favoriteSet.has(item.id) && styles.favoriteTagActive,
                  pressed && styles.favoriteTagPressed,
                ]}
              >
                <Ionicons
                  name={favoriteSet.has(item.id) ? "bookmark" : "bookmark-outline"}
                  size={13}
                  color={
                    favoriteSet.has(item.id)
                      ? svaColors.brand.primary
                      : svaColors.text.primary
                  }
                />
                <Text
                  style={[
                    styles.favoriteTagText,
                    {
                      color: favoriteSet.has(item.id)
                        ? svaColors.brand.primary
                        : svaColors.text.primary,
                    },
                  ]}
                >
                  {favoriteSet.has(item.id) ? "Saved" : "Favorite"}
                </Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{emptyTitle}</Text>
              <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
            </View>
          }
        />
      </View>

      {currentTrack && (
        <BottomPlayer
          title={currentTrack.title}
          subtitle={`${currentTrack.durationLabel} · Soundscape`}
          image={currentTrack.image}
          isPlaying={isPlaying}
          onPlayPause={() => handlePlayPause(currentTrack)}
          onClose={handleClosePlayer}
        />
      )}
    </ScreenView>
  );
};

const styling = (
  colors: SvaColorSet,
  typography: TypographyTokens | undefined,
  spacing: Spacing
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg.base,
    },
    root: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    header: {
      marginBottom: spacing.sm,
    },
    headerTitle: {
      ...(typography?.textStyle?.authTitle ?? {}),
    },
    headerSubtitle: {
      ...(typography?.textStyle?.authTinyLabel ?? {}),
      textTransform: "uppercase",
      color: colors.text.secondary,
    },
    filtersContainer: {
      marginTop: spacing.lg,
      marginBottom: spacing.lg,
    },
    filtersRow: {
      paddingBottom: spacing.md,
      paddingTop: spacing.md,
      paddingRight: spacing.md,
    },
    filterLabel: {
      ...(typography?.textStyle?.authTinyLabel ?? {}),
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    filterLabelSelected: {
      color: colors.text.inverse,
    },
    filterLabelInactive: {
      color: colors.text.secondary,
    },
    filterPillSelected: {
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
    },
    filterPillInactive: {
      backgroundColor: colors.surface.base,
      borderColor: colors.border.default,
    },
    listContent: {
      paddingTop: spacing.xs,
    },
    columnWrapper: {
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    cardShell: {
      width: "48%",
      position: "relative",
    },
    cardCell: {
      width: "100%",
    },
    favoriteTag: {
      position: "absolute",
      top: 12,
      right: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: "rgba(12, 14, 11, 0.88)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.08)",
      zIndex: 2,
    },
    favoriteTagActive: {
      backgroundColor: "rgba(163, 190, 140, 0.18)",
      borderColor: "rgba(163, 190, 140, 0.3)",
    },
    favoriteTagPressed: {
      transform: [{ scale: 0.96 }],
      opacity: 0.92,
    },
    favoriteTagText: {
      ...(typography?.textStyle?.authTinyLabel ?? {}),
      fontSize: 9.5,
      lineHeight: 12,
      letterSpacing: 1.1,
      textTransform: "uppercase",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    emptyTitle: {
      ...(typography?.textStyle?.authTitle ?? {}),
      fontSize: 22,
      lineHeight: 26,
      color: colors.text.primary,
      textAlign: "center",
      marginBottom: spacing.xs,
    },
    emptySubtitle: {
      ...(typography?.textStyle?.body ?? {}),
      color: colors.text.secondary,
      textAlign: "center",
    },
  });

export default SoundscapeScreen;
