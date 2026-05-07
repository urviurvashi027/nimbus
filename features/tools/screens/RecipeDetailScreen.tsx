// app/(auth)/toolsScreen/RecipeDetailScreen.tsx
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Animated,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from "@/components/layout/AppHeader";
import ThemeContext from "@/contexts/ThemeContext";
import { getArticleDetails } from "../services/toolService";

// import { ScreenView } from "@/components/Themed";
// import ThemeContext from "@/context/ThemeContext";
// import AppHeader from "@/components/common/AppHeader";
// import NutritionInfo from "@/components/tools/contentDetails/NutritionInfo";
// import ArticleSection from "@/components/tools/contentDetails/ArticleSection";

// import { getArticleDetails } from "@/services/toolService";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = 300;

const RecipeDetailScreen: React.FC = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const params = useLocalSearchParams();
  const rawId = (params as any)?.id;
  const navigation = useNavigation();

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

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
    if (idParam) {
      fetchDetails();
    }
  }, [idParam]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      if (!idParam) return;
      const numericId = parseInt(idParam, 10);
      if (Number.isNaN(numericId)) return;

      const res = await getArticleDetails(numericId);
      const apiArticle: any =
        res && typeof res === "object" && "data" in res ? res.data : res;

      if (!apiArticle || typeof apiArticle !== "object") {
        throw new Error("Invalid API response");
      }

      const imageUri = resolveImageUri(apiArticle.image);

      // Transform backend data to match template needs
      const transformed = {
        ...apiArticle,
        imageUri,
        ingredients: apiArticle.ingredients || [
          "2 cups organic kale",
          "1 cup wild blueberries",
          "1 tbsp chia seeds",
          "1/2 avocado",
          "1 cup almond milk",
        ],
        instructions: apiArticle.instructions || [
          { step: "1", instruction: "Wash all greens and fruits thoroughly." },
          {
            step: "2",
            instruction: "Place all ingredients into a high-speed blender.",
          },
          { step: "3", instruction: "Blend until smooth and creamy." },
        ],
        nutrition: apiArticle.nutrition || {
          calories: "245 kcal",
          protein: "8g",
          carbs: "32g",
          fats: "12g",
        },
        prepTime: apiArticle.prep_time || "10 min",
        servings: apiArticle.servings || "1 Person",
        difficulty: apiArticle.difficulty || "Easy",
      };

      setDetails(transformed);
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${details?.title}`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: newTheme.background }]}>
        <ActivityIndicator size="large" color={newTheme.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, backgroundColor: newTheme.background },
        ]}
      >
        <AppHeader
          title={details?.title || "Recipe"}
          onBack={() => router.back()}
          rightActions={[
            {
              icon: isFavorite ? "heart" : "heart-outline",
              onPress: () => setIsFavorite(!isFavorite),
            },
            {
              icon: "share-social-outline",
              onPress: onShare,
            },
          ]}
        />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={
              details?.imageUri
                ? { uri: details.imageUri }
                : require("@/assets/images/mt.jpg")
            }
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.8)"]}
            style={styles.heroGradient}
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.tagWrapper}>
              <Text style={styles.tagText}>
                {details?.category || "HEALTHY"}
              </Text>
            </View>
            <Text style={styles.heroTitle}>{details?.title}</Text>

            <View style={styles.quickInfoRow}>
              <View style={styles.quickInfoItem}>
                <Ionicons name="time-outline" size={14} color="#FFF" />
                <Text style={styles.quickInfoText}>{details?.prepTime}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.quickInfoItem}>
                <Ionicons name="people-outline" size={14} color="#FFF" />
                <Text style={styles.quickInfoText}>{details?.servings}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.quickInfoItem}>
                <Ionicons name="stats-chart-outline" size={14} color="#FFF" />
                <Text style={styles.quickInfoText}>{details?.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Nutrients Overlay on Image Bottom */}
          <View style={styles.nutrientsBar}>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>
                {details?.nutrition?.fiber || "5g"}
              </Text>
              <Text style={styles.nutrientLabel}>FIBER</Text>
            </View>
            <View style={styles.nutrientDivider} />
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>
                {details?.nutrition?.carbs || "32g"}
              </Text>
              <Text style={styles.nutrientLabel}>CARBS</Text>
            </View>
            <View style={styles.nutrientDivider} />
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>
                {details?.nutrition?.protein || "8g"}
              </Text>
              <Text style={styles.nutrientLabel}>PROTEIN</Text>
            </View>
            <View style={styles.nutrientDivider} />
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>
                {details?.nutrition?.fats || "12g"}
              </Text>
              <Text style={styles.nutrientLabel}>FATS</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this recipe</Text>
            <Text style={styles.descriptionText}>
              {details?.description ||
                "A nutrient-dense blend designed to optimize your cognitive function and provide sustained energy throughout your morning routine. This recipe combines antioxidant-rich ingredients with healthy fats for peak performance."}
            </Text>
          </View>

          {/* Elements Section (formerly Ingredients) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Elements</Text>
              <Text style={styles.itemCount}>
                {details?.ingredients?.length || 5} ITEMS
              </Text>
            </View>
            {details?.ingredients?.map((item: any, index: number) => (
              <View key={index} style={styles.ingredientItem}>
                <View
                  style={[styles.bullet, { backgroundColor: newTheme.accent }]}
                />
                <Text style={styles.ingredientText}>
                  {typeof item === "object"
                    ? `${item.quantity || ""} ${item.item || ""}`.trim()
                    : String(item)}
                </Text>
              </View>
            ))}
          </View>

          {/* The Process Section (formerly Instructions) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Process</Text>
            {details?.instructions?.map((item: any, index: number) => (
              <View key={index} style={styles.instructionItem}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: newTheme.surfaceMuted },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                <Text style={styles.instructionText}>{item.instruction}</Text>
              </View>
            ))}
          </View>

          {/* Notes Section */}
          <View style={[styles.section, styles.notesSection]}>
            <Text style={styles.sectionTitle}>Chef's Notes</Text>
            <View style={styles.notesContainer}>
              <Ionicons
                name="bulb-outline"
                size={20}
                color={newTheme.accent}
                style={{ marginTop: 2 }}
              />
              <Text style={styles.notesText}>
                For the best texture, ensure your blender is at high speed. You
                can also substitute almond milk with coconut water for a more
                refreshing, electrolyte-rich profile.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: newTheme.accent }]}>
          <Text style={[styles.primaryButtonText, { color: newTheme.background }]}>Add to Meal Plan</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingTop: Platform.OS === "ios" ? 50 : 20,
      paddingHorizontal: spacing.md,
    },
    heroContainer: {
      height: 420, // Increased to accommodate nutrients bar
      width: "100%",
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: 420,
    },
    heroGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    backButton: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 20,
      left: spacing.md,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20,
    },
    heroContent: {
      position: "absolute",
      bottom: 100, // Shifted up to make room for nutrients bar
      left: spacing.md,
      right: spacing.md,
    },
    tagWrapper: {
      backgroundColor: theme.accent,
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: spacing.sm,
    },
    tagText: {
      ...typography.smallCaption,
      color: theme.background,
      fontWeight: "900",
      letterSpacing: 1,
    },
    heroTitle: {
      ...typography.h1,
      color: "#FFF",
      fontSize: 32,
      fontWeight: "800",
      marginBottom: spacing.xs,
    },
    quickInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    quickInfoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    quickInfoText: {
      ...typography.caption,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "600",
    },
    separator: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: "rgba(255,255,255,0.4)",
    },
    nutrientsBar: {
      position: "absolute",
      bottom: 20,
      left: spacing.md,
      right: spacing.md,
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 20,
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(10px)", // Note: for iOS mainly
      justifyContent: "space-around",
      alignItems: "center",
    },
    nutrientItem: {
      alignItems: "center",
      flex: 1,
    },
    nutrientValue: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "800",
    },
    nutrientLabel: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 9,
      fontWeight: "700",
      letterSpacing: 0.5,
      marginTop: 2,
    },
    nutrientDivider: {
      width: 1,
      height: 24,
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    content: {
      paddingTop: spacing.xl,
      paddingBottom: 120,
      paddingHorizontal: spacing.md,
      backgroundColor: theme.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      marginTop: -20, // Pull up over the hero image bottom
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: theme.textPrimary,
      fontWeight: "800",
      fontSize: 20,
    },
    itemCount: {
      ...typography.smallCaption,
      color: theme.accent,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    descriptionText: {
      ...typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      fontSize: 15,
    },
    ingredientItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xs,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 16,
    },
    ingredientText: {
      ...typography.body,
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "500",
    },
    instructionItem: {
      flexDirection: "row",
      marginBottom: spacing.lg,
    },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    stepNumberText: {
      ...typography.smallCaption,
      color: theme.accent,
      fontWeight: "900",
    },
    instructionText: {
      ...typography.body,
      color: theme.textPrimary,
      flex: 1,
      lineHeight: 24,
      fontSize: 15,
    },
    notesSection: {
      backgroundColor: theme.surfaceMuted,
      padding: spacing.md,
      borderRadius: 24,
      marginTop: spacing.sm,
    },
    notesContainer: {
      flexDirection: "row",
      gap: 12,
    },
    notesText: {
      ...typography.body,
      color: theme.textSecondary,
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      fontStyle: "italic",
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing.md,
      paddingBottom: Platform.OS === "ios" ? 34 : spacing.md,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    primaryButton: {
      height: 58,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    primaryButtonText: {
      ...typography.button,
      fontWeight: "900",
      fontSize: 16,
      letterSpacing: 1,
    },
  });

export default RecipeDetailScreen;
