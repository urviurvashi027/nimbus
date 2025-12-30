import React, { useContext, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";
import FilterPill from "@/components/selfCare/workout/FilterPill";
import { scribbleService, Scribble } from "@/services/scribbleService";
import { useFocusEffect } from "expo-router";

const ScribbleListScreen = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);
  const navigation = useNavigation();

  const [scribbles, setScribbles] = useState<Scribble[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [allTagsList, setAllTagsList] = useState<string[]>(["All"]);

  const fetchScribbles = async (tag?: string) => {
    try {
      setLoading(true);
      const params: any = { 
        ordering: "-date", // "todays ordering" - latest first
      };
      
      // If a specific tag is selected (not "All"), add it to the filter params in lowercase
      if (tag && tag !== "All") {
        params.tag = tag.replace('#', '').toLowerCase();
      }

      const data = await scribbleService.getScribbles(params);
      setScribbles(data);
    } catch (e) {
      console.error("Fetch scribbles failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTags = async () => {
    try {
      const tags = await scribbleService.getRecentTags();
      setAllTagsList(["All", ...tags]);
    } catch (e) {
      console.error("Fetch recent tags failed:", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchScribbles(selectedTag);
      fetchRecentTags();
    }, [selectedTag])
  );

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag);
  };

  const renderScribbleItem = ({ item }: { item: Scribble }) => (
    <TouchableOpacity
      style={styles.scribbleCard}
      onPress={() =>
        router.push({
          pathname: "/(auth)/toolsScreen/ScribbleDetailScreen",
          params: { id: item.id },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
      </View>
      <Text style={styles.cardContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.tagsRow}>
        {item.tags.map((tag) => (
          <TouchableOpacity 
            key={tag} 
            style={styles.tagBadge}
            onPress={() => handleTagPress(tag.replace('#', '').toLowerCase())}
          >
            <Text style={styles.tagText}>
              {tag.startsWith("#") ? tag.toLowerCase() : `#${tag.toLowerCase()}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ToolScreenHeader
          title="Scribbles"
          subtitle="Jot down your thoughts and ideas."
          onBack={() => router.back()}
        />

        {/* Filter Row */}
        <View style={{ marginBottom: spacing.md }}>
          <FlatList
            data={allTagsList}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            renderItem={({ item }) => (
              <FilterPill
                label={item === "All" ? "All" : `#${item}`}
                isActive={selectedTag === item}
                onPress={() => handleTagPress(item)}
              />
            )}
          />
        </View>

        {/* List content */}
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={newTheme.accent} />
          </View>
        ) : (
          <FlatList
            data={scribbles}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderScribbleItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="pencil-off-outline"
                  size={64}
                  color={newTheme.textSecondary}
                />
                <Text style={styles.emptyText}>No scribbles found.</Text>
              </View>
            }
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(auth)/toolsScreen/CreateScribbleScreen")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color={newTheme.background} />
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    filterRow: {
      paddingVertical: spacing.xs,
    },
    scribbleCard: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.divider,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing.xs,
    },
    cardTitle: {
      ...typography.bodyStrong,
      color: theme.textPrimary,
      fontSize: 18,
      flex: 1,
    },
    cardDate: {
      ...typography.caption,
      color: theme.textSecondary,
      marginLeft: spacing.sm,
    },
    cardContent: {
      ...typography.body,
      color: theme.textSecondary,
      fontSize: 14,
      marginBottom: spacing.md,
    },
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tagBadge: {
      backgroundColor: theme.surfaceElevated,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    tagText: {
      ...typography.caption,
      color: theme.accent,
      fontWeight: "600",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: theme.textSecondary,
      marginTop: spacing.md,
    },
    fab: {
      position: "absolute",
      bottom: spacing.xl,
      right: spacing.md,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
  });

export default ScribbleListScreen;
