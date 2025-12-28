// src/app/(auth)/toolsScreen/Details/ContentDetailsScreen.tsx

import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  forwardRef,
} from "react";
import {
  Animated,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  SafeAreaView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArticleSection from "@/components/tools/contentDetails/ArticleSection";
import NutritionInfo from "@/components/tools/contentDetails/NutritionInfo";

import { getArticleDetails } from "@/services/toolService";
import ThemeContext from "@/context/ThemeContext";
import { TitleHeader } from "@/components/tools/contentDetails/TitleHeader";
import { CatalogCard } from "@/components/tools/contentDetails/Catalog";
import { HeroBanner } from "@/components/tools/contentDetails/HeroBanner";
import { ScreenView } from "@/components/Themed";
import StyledButton from "@/components/common/themeComponents/StyledButton";

const FAVORITES_KEY = "favorites_v1";

export type SectionData = {
  title: string;
  content: string;
};

type ArticleDetails = {
  id: number | string;
  title: string;
  image?: string;
  imageUri?: string | null;
  meta_info?: {
    points: number;
    time: string;
  };
  author_info?: any;
  section_data?: SectionData[];
  instructions?: { step: string; instruction: string }[];
  nutrition?: any;
  action_button?: string | null;
  routine_items?: any[];
  web_url?: string | null;
  source?: string | null;
  [key: string]: any;
};

const HEADER_FADE_START = 32;
const HEADER_FADE_END = 120;

const ContentDetailsScreen: React.FC = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [details, setDetails] = useState<ArticleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const sectionRefs = useRef<(View | null)[]>([]);

  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  // ───────────────────── PARAMS ─────────────────────
  const params = useLocalSearchParams();
  const rawId = (params as any)?.id;

  const getIdFromParam = (p: unknown): string | null => {
    if (!p) return null;
    if (Array.isArray(p)) return String(p[0]);
    return String(p);
  };
  const idParam = getIdFromParam(rawId);

  const resolveImageUri = (img: any): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object") {
      if (typeof img.url === "string") return img.url;
      if (typeof img.uri === "string") return img.uri;
      if (typeof img.path === "string") return img.path;
    }
    return null;
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!idParam) throw new Error("Missing article id");
        const numericId = parseInt(idParam, 10);
        if (Number.isNaN(numericId)) throw new Error("Invalid article id");

        const res = await getArticleDetails(numericId);

        const apiArticle: any =
          res && typeof res === "object" && "data" in res ? res.data : res;

        if (!apiArticle || typeof apiArticle !== "object") {
          throw new Error("Invalid API response");
        }

        const imageUri = resolveImageUri(apiArticle.image);

        const transformed: ArticleDetails = {
          ...apiArticle,
          imageUri,
          action_button:
            (params as any)?.type === "routine"
              ? "Add to routine"
              : apiArticle.action_button ?? null,
          web_url: apiArticle.web_url ?? apiArticle.source ?? null,
        };

        setDetails(transformed);
        await checkIfFavorited(String(transformed.id));
      } catch (e: any) {
        console.warn("Article load error:", e);
        setError(e?.message || "Unable to load article");
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam, (params as any)?.type]);

  // ───────────────── FAVORITES ─────────────────

  const checkIfFavorited = async (articleIdStr: string | number | null) => {
    if (!articleIdStr) return;
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      const favs = raw ? JSON.parse(raw) : [];
      if (Array.isArray(favs)) {
        setIsFavorite(favs.map(String).includes(String(articleIdStr)));
      } else {
        setIsFavorite(false);
      }
    } catch (e) {
      console.warn("fav check failed", e);
    }
  };

  const toggleFavorite = async () => {
    if (!details?.id) return;
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      let favs: string[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(favs)) favs = [];

      const idStr = String(details.id);
      if (favs.includes(idStr)) {
        favs = favs.filter((i) => i !== idStr);
      } else {
        favs = [idStr, ...favs];
      }
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      setIsFavorite((s) => !s);
    } catch (e) {
      console.warn("favorite toggle failed", e);
    }
  };

  // ───────────────── ACTIONS ─────────────────

  const onShare = async () => {
    if (!details) return;
    try {
      const message = `${details.title}\n\nRead more in Nimbus.`;
      const url = details.web_url || details.source || "";
      await Share.share({
        message: url ? `${message}\n${url}` : message,
        title: details.title,
      });
    } catch (e) {
      console.warn("share failed", e);
    }
  };

  const onDownloadPDF = async () => {
    Alert.alert(
      "Download PDF",
      "This will download a PDF of the article. (Coming soon in Nimbus.)"
    );
  };

  const onPrimaryButtonClick = () => {
    if (!details) return;
    console.log(details.routine_items, "routine items");
    router.push({
      pathname: "/(auth)/toolsScreen/AddToRoutineScreen",
      params: {
        id: String(details.id),
        type: "routine",
        data: JSON.stringify(details.routine_items || []),
      },
    });
  };

  const openRecipeScreen = () => {
    if (!details?.id) return;
    // router.push({
    //   pathname: "/(auth)/Tools/Recipe/RecipeContent",
    //   params: { fromArticleId: String(details.id) },
    // });
  };

  // ───────────────── SCROLL / HEADER ANIMATIONS ─────────────────

  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_FADE_START, HEADER_FADE_END],
    outputRange: [0, 0.4, 1],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_FADE_START, HEADER_FADE_END],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerShadowOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_FADE_END],
    outputRange: [0, 0.35],
    extrapolate: "clamp",
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-80, 0, 200],
    outputRange: [1.05, 1, 0.97],
    extrapolate: "clamp",
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [-80, 0, 200],
    outputRange: [-12, 0, 8],
    extrapolate: "clamp",
  });

  // (Optional) TODO: hook up catalog tap → scrollToSection using measureLayout

  // ───────────────── LOADING / ERROR STATES ─────────────────

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.wrapper, { backgroundColor: newTheme.background }]}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color={newTheme.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !details) {
    return (
      <SafeAreaView
        style={[styles.wrapper, { backgroundColor: newTheme.background }]}
      >
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: newTheme.textPrimary }]}>
            {error || "Article not found"}
          </Text>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: newTheme.divider }]}
            onPress={() => router.back()}
          >
            <Text style={{ color: newTheme.accent }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ───────────────── MAIN RENDER ─────────────────

  return (
    <ScreenView
      style={{
        flex: 1,
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2
            : spacing.xl,
        paddingHorizontal: spacing.md,
        backgroundColor: newTheme.background,
      }}
    >
      <SafeAreaView style={[styles.wrapper]}>
        {/* Sticky premium header */}
        <Animated.View
          style={[
            styles.stickyHeader,
            {
              backgroundColor: newTheme.background,
              opacity: 1,
              shadowOpacity: headerShadowOpacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.headerBgOverlay,
              {
                opacity: headerBgOpacity,
                backgroundColor: newTheme.background,
              },
            ]}
          />
          <View style={styles.headerContent}>
            {/* Back */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={newTheme.textPrimary}
              />
            </TouchableOpacity>

            {/* Title that fades in on scroll */}
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.headerTitle,
                { color: newTheme.textPrimary, opacity: headerTitleOpacity },
              ]}
            >
              {details.title}
            </Animated.Text>

            {/* Actions */}
            <View style={styles.actionRow}>
              {/* Favorite */}
              <TouchableOpacity onPress={toggleFavorite} style={styles.iconBtn}>
                {isFavorite ? (
                  <MaterialCommunityIcons
                    name="heart"
                    size={20}
                    color={newTheme.accent}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={20}
                    color={newTheme.textPrimary}
                  />
                )}
              </TouchableOpacity>

              {/* Share */}
              <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
                <Ionicons
                  name="share-social-outline"
                  size={18}
                  color={newTheme.textPrimary}
                />
              </TouchableOpacity>

              {/* Download */}
              <TouchableOpacity onPress={onDownloadPDF} style={styles.iconBtn}>
                <Ionicons
                  name="download-outline"
                  size={18}
                  color={newTheme.textPrimary}
                />
              </TouchableOpacity>

              {/* Recipe bookmark shortcut */}
              {/* {(params as any)?.type === "recipe" && (
                <TouchableOpacity
                  onPress={openRecipeScreen}
                  style={styles.iconBtn}
                  accessibilityLabel="Open saved recipes"
                >
                  <Ionicons
                    name="bookmarks-outline"
                    size={20}
                    color={newTheme.textPrimary}
                  />
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        </Animated.View>

        {/* Scrollable content */}
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {/* Hero banner with parallax */}
          <HeroBanner
            imageUri={details.imageUri}
            tips={details}
            theme={newTheme}
            spacing={spacing}
            typography={typography}
            scale={heroScale}
            translateY={heroTranslateY}
          />

          {/* Title block, meta, author */}
          <TitleHeader
            title={details.title}
            metaInfo={details.meta_info}
            authorInfo={details.author_info}
            theme={newTheme}
            spacing={spacing}
            typography={typography}
          />

          {/* Catalog / TOC */}
          {Array.isArray(details.section_data) &&
            details.section_data.length > 0 && (
              <CatalogCard
                sections={details.section_data}
                theme={newTheme}
                spacing={spacing}
                typography={typography}
                onSectionPress={() => {
                  // TODO: wire up scrollToSection here when ready
                }}
              />
            )}

          {/* Article sections */}
          <View style={styles.sections}>
            {Array.isArray(details.section_data) &&
              details.section_data.map((section, index) => (
                <ArticleSection
                  key={`sec-${index}`}
                  ref={(el: any) => (sectionRefs.current[index] = el)}
                  title={section.title}
                  content={section.content}
                />
              ))}

            {Array.isArray(details.instructions) &&
              details.instructions.map((section, index) => (
                <ArticleSection
                  key={`instr-${index}`}
                  ref={(el: any) =>
                    (sectionRefs.current[
                      index + (details.section_data?.length || 0)
                    ] = el)
                  }
                  title={section.step}
                  content={section.instruction}
                />
              ))}
          </View>

          {/* Nutrition for recipes */}
          {details.nutrition && (
            <NutritionInfo
              title="Nutritional Information"
              data={details.nutrition}
            />
          )}

          {/* Bottom CTA */}
          {details?.action_button && (
            <View style={styles.bottomCtaWrap}>
              <StyledButton
                label={details.action_button}
                variant="primary"
                fullWidth
                onPress={onPrimaryButtonClick}
              />
            </View>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </ScreenView>
  );
};

export default ContentDetailsScreen;

// ───────────────────────────────── STYLES ─────────────────────────────────

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
    },
    scrollContent: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl * 2,
    },

    // Sticky header
    stickyHeader: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: 40,
      // paddingTop: Platform.OS === "ios" ? spacing["xxl"] : spacing.xl, // align with other Nimbus screens
      paddingBottom: spacing.xs,
      // paddingHorizontal: spacing.md,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    headerBgOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      ...typography.body,
      fontWeight: "700",
      flex: 1,
      marginHorizontal: spacing.sm,
    },
    iconBtn: {
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: 999,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    sections: {
      marginTop: spacing.lg,
      //paddingHorizontal: spacing.md,
    },
    bottomCtaWrap: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.md,
    },

    backBtn: {
      marginTop: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 10,
      borderWidth: 1,
    },
    errorText: {
      ...typography.body,
      marginBottom: spacing.xs,
    },
  });
