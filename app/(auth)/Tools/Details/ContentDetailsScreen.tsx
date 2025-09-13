// ContentDetailsScreen.tsx
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  findNodeHandle,
  ActivityIndicator,
  Alert,
  Share,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderTipsGrid from "@/components/ArticleDetails/Header";
import MetaInfo from "@/components/ArticleDetails/MetaInfo";
import AuthorCard from "@/components/ArticleDetails/AuthorCard";
import CatalogList from "@/components/ArticleDetails/CatalogList";
import ArticleSection from "@/components/ArticleDetails/ArticleSection";
import PrimaryButton from "@/components/ArticleDetails/PrimaryButton";
import NutritionInfo from "./component/NutritionInfo";

import { getArticleDetails } from "@/services/toolService";
import ThemeContext from "@/context/ThemeContext";

const FAVORITES_KEY = "favorites_v1";

// height used to offset scroll content so header doesn't overlap hero
const HEADER_SAFE_HEIGHT = Platform.OS === "ios" ? 80 : 96;

export default function ContentDetailsScreen() {
  const { theme, newTheme } = useContext(ThemeContext);

  // using `any` for details to avoid type friction; replace with ArticleData when ready
  const [details, setDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const sectionRefs = useRef<(View | null)[]>([]);

  const navigation = useNavigation();

  // params handling (useLocalSearchParams may return string|string[])
  const params = useLocalSearchParams();
  const rawId = (params as any)?.id;
  const getIdFromParam = (p: unknown): string | null => {
    if (!p) return null;
    if (Array.isArray(p)) return String(p[0]);
    return String(p);
  };
  const idParam = getIdFromParam(rawId);

  // helper to normalize image field to string url
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
    navigation.setOptions({
      headerShown: false,
    });
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

        // API may sometimes return { data: ArticleData } or ArticleData directly
        const apiArticle: any =
          res && typeof res === "object" && "data" in res ? res.data : res;

        if (!apiArticle || typeof apiArticle !== "object") {
          throw new Error("Invalid API response");
        }

        const imageUri = resolveImageUri(apiArticle.image);

        const transformed = {
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
      "This will download a PDF of the article. (In development — implement server/pdf generation.)"
    );
  };

  // scroll to section (measures and scrolls)
  const scrollToSection = (index: number) => {
    // to do not working now
    // const sectionView = sectionRefs.current[index];
    // const scrollViewHandle = findNodeHandle(scrollRef.current);
    // if (sectionView && scrollViewHandle) {
    //   (sectionView as any).measureLayout(
    //     scrollViewHandle,
    //     (_x: number, y: number) => {
    //       const offset = Platform.OS === "ios" ? 8 : 0;
    //       (scrollRef.current as any)?.scrollTo({
    //         y: Math.max(0, y - 20 - offset),
    //         animated: true,
    //       });
    //     },
    //     () => console.warn("measureLayout failed")
    //   );
    // }
  };

  const onPrimaryButtonClick = () => {
    if (!details) return;
    router.push({
      pathname: "/Tools/RoutineList/RouitneList",
      params: {
        id: String(details.id),
        type: "routine",
        data: JSON.stringify(details.routine_items || []),
      },
    });
  };

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

  // MAIN RENDER
  return (
    <SafeAreaView
      style={[styles.wrapper, { backgroundColor: newTheme.background }]}
    >
      {/* ---------- Sticky header (fixed) ---------- */}
      <View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: newTheme.background,
            paddingTop: Platform.OS === "ios" ? 50 : 12,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* top row: back + actions */}
        <View style={styles.topRow}>
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

          <View style={styles.actionRow}>
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

            <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
              <Ionicons
                name="share-social-outline"
                size={18}
                color={newTheme.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDownloadPDF} style={styles.iconBtn}>
              <Ionicons
                name="download-outline"
                size={18}
                color={newTheme.textPrimary}
              />
            </TouchableOpacity>
            {(params as any)?.type === "recipe" && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/Tools/Recipe/RecipeContent", // change if your route path is different
                    params: { fromArticleId: String(details?.id ?? "") },
                  })
                }
                style={styles.iconBtn}
                accessibilityLabel="Open saved recipes"
              >
                <Ionicons
                  name="bookmarks-outline"
                  size={20}
                  color={newTheme.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* fixed title + pills */}
        {/* <View style={[styles.titleBlock]}>
          <Text
            style={[styles.fixedTitle, { color: newTheme.textPrimary }]}
            numberOfLines={2}
          >
            {details.title}
          </Text>

          <View style={styles.pillsRow}>
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: newTheme.surface,
                  borderColor: newTheme.divider,
                },
              ]}
            >
              <Ionicons
                name="star"
                size={14}
                color={newTheme.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.pillText, { color: newTheme.textSecondary }]}
              >
                {details?.meta_info?.points ?? "—"} Points
              </Text>
            </View>

            <View
              style={[
                styles.pill,
                {
                  backgroundColor: newTheme.surface,
                  borderColor: newTheme.divider,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={newTheme.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.pillText, { color: newTheme.textSecondary }]}
              >
                {details?.meta_info?.time ?? "—"} min
              </Text>
            </View>
          </View>
        </View> */}
      </View>

      {/* ---------- Scrollable content ---------- */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.container,
          { paddingTop: HEADER_SAFE_HEIGHT + 10 }, // leave space so header doesn't overlap
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* hero image inline */}
        {details.imageUri ? (
          <Image
            source={{ uri: details.imageUri }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <HeaderTipsGrid tips={details} />
        )}

        <View style={styles.content}>
          {/* we still show title near hero for visual continuity (but header has fixed title) */}
          <Text
            style={[styles.underHeroTitle, { color: newTheme.textPrimary }]}
          >
            {details.title}
          </Text>

          {details.meta_info && (
            <MetaInfo
              points={details.meta_info.points}
              time={details.meta_info.time}
            />
          )}

          {details.author_info && <AuthorCard author={details.author_info} />}

          {/* Catalog */}
          {Array.isArray(details.section_data) &&
            details.section_data.length > 0 && (
              <View
                style={[
                  styles.catalogWrap,
                  {
                    backgroundColor: newTheme.surface,
                    borderColor: newTheme.divider,
                  },
                ]}
              >
                {/* <Text
                  style={[styles.catalogTitle, { color: newTheme.textPrimary }]}
                >
                  Catalog
                </Text> */}
                <CatalogList
                  catalog={details.section_data}
                  onPress={scrollToSection}
                />
              </View>
            )}

          {/* Sections */}
          <View style={styles.sections}>
            {Array.isArray(details.section_data) &&
              details.section_data.map((section: any, index: number) => (
                <ArticleSection
                  key={`sec-${index}`}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  title={section.title}
                  content={section.content}
                />
              ))}

            {Array.isArray(details.instructions) &&
              details.instructions.map((section: any, index: number) => (
                <ArticleSection
                  key={`instr-${index}`}
                  ref={(el) =>
                    (sectionRefs.current[
                      index + (details.section_data?.length || 0)
                    ] = el)
                  }
                  title={section.step}
                  content={section.instruction}
                />
              ))}
          </View>

          {/* Nutrition */}
          {details.nutrition && (
            <NutritionInfo
              title="Nutritional Information"
              data={details.nutrition}
            />
          )}

          {/* bottom CTA */}
          <View style={styles.bottomCtaWrap}>
            {details?.action_button && (
              <PrimaryButton
                title={details.action_button}
                onPress={onPrimaryButtonClick}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    paddingBottom: 48,
  },
  heroImage: {
    width: "90%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: "#111",
  },
  content: {
    marginTop: 14,
    paddingHorizontal: 20,
  },

  /* sticky header */
  stickyHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "5%",
    zIndex: 120,
    paddingHorizontal: 6,
    paddingBottom: 6,
    // backgroundColor: 'transparent' // set by component usage
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* title block */
  titleBlock: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  fixedTitle: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 8,
  },
  underHeroTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  pillsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  catalogWrap: {
    marginTop: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  catalogTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  sections: {
    marginTop: 14,
  },
  bottomCtaWrap: {
    marginTop: 18,
    marginBottom: 36,
  },

  headerAbsolute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "ios" ? 12 : 8,
    position: "absolute",
    zIndex: 10,
    width: "100%",
  },

  backBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
  },

  errorText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
