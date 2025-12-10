// app/Recipes/Favorites.tsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton"; // if you have this
// import SegmentedTabs from "@/components/common/SegmentedTabs";
// If not available: swap to TouchableOpacity with styles below

type Recipe = {
  id: string;
  title: string;
  notes?: string;
  imageUrl?: string | null;
  createdAt: string;
};

const STORAGE_KEY = "RECIPES_V1";

export default function FavoritesRecipesScreen() {
  const { newTheme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(newTheme), [newTheme]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0); // 0 = Saved, 1 = Your
  const params = useLocalSearchParams();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    loadRecipes();
  }, []);

  // dev helper — run once in development to seed
  const seedMockRecipes = async () => {
    const sample: Recipe[] = [
      {
        id: "r1",
        title: "Golden Turmeric Milk",
        notes: "Warm milk, turmeric, honey. Great before bed.",
        imageUrl: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: "r2",
        title: "Soothing Tulsi Tea",
        notes: "Steep fresh tulsi with ginger.",
        imageUrl: null,
        createdAt: new Date().toISOString(),
      },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    setRecipes(sample);
  };

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) {
        setRecipes([]);
      } else {
        setRecipes(arr);
      }
    } catch (e) {
      console.warn("load recipes failed", e);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async (payload: { title: string; notes?: string }) => {
    const newItem: Recipe = {
      id: `r_${Date.now()}`,
      title: payload.title,
      notes: payload.notes,
      imageUrl: null,
      createdAt: new Date().toISOString(),
    };
    const next = [newItem, ...recipes];
    setRecipes(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setShowAdd(false);
  };

  const onDelete = async (id: string) => {
    Alert.alert("Delete recipe", "Remove this recipe from saved list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const next = recipes.filter((r) => r.id !== id);
          setRecipes(next);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        <Text style={styles.meta}>
          Saved {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(auth)/Tools/Details/ContentDetailsScreen",
              params: { id: item.id },
            })
          }
          style={styles.iconBtn}
          accessibilityLabel="Open recipe"
        >
          <Ionicons
            name="open-outline"
            size={18}
            color={newTheme.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={styles.iconBtn}
          accessibilityLabel="Delete recipe"
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={newTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Recipes</Text>

        {/* <TouchableOpacity
          onPress={() => seedMockRecipes()}
          style={styles.seed}
          accessibilityLabel="seed sample"
        >
          <Text style={styles.seedText}>Seed</Text>
        </TouchableOpacity> */}
      </View>
      {/* // inside render (just below header) */}
      {/* <SegmentedTabs
        tabs={["Saved Recipes", "Your Recipes"]}
        activeIndex={activeTab}
        onChange={(i) => setActiveTab(i)}
      /> */}
      <View style={styles.body}>
        {activeTab === 0 ? (
          // Saved Recipes list
          recipes.length === 0 && !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No saved recipes</Text>
            </View>
          ) : (
            <FlatList
              data={recipes}
              renderItem={renderItem}
              keyExtractor={(i) => i.id}
            />
          )
        ) : (
          // Your Recipes list (stub)
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No recipes yet</Text>
            <Text style={styles.emptySub}>
              Tap the + button to add your first recipe.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setShowAdd(true)}
            >
              <Text style={styles.primaryBtnText}>Add recipe</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* {recipes.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No recipes yet</Text>
            <Text style={styles.emptySub}>
              Tap the + button to add your first recipe.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setShowAdd(true)}
            >
              <Text style={styles.primaryBtnText}>Add recipe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ padding: 12, paddingBottom: 140 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )} */}
      </View>
      {/* Floating add button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: newTheme.accent }]}
        onPress={() => router.push("/(auth)/Tools/Recipe/AddRecipe")}
        accessibilityLabel="Add recipe"
      >
        <Ionicons name="add" size={28} color={newTheme.background} />
      </TouchableOpacity>
      {/* Add recipe modal */}
      {showAdd && (
        <AddRecipeModal
          visible={showAdd}
          onClose={() => setShowAdd(false)}
          onSave={onAdd}
        />
      )}
    </SafeAreaView>
  );
}

/* AddRecipeModal component (inline for convenience) */
function AddRecipeModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: { title: string; notes?: string }) => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!visible) {
      setTitle("");
      setNotes("");
    }
  }, [visible]);

  return (
    <View style={modalStyles.wrapper}>
      <View style={[modalStyles.overlay]} />
      <View
        style={[
          modalStyles.card,
          { backgroundColor: newTheme.surface, borderColor: newTheme.divider },
        ]}
      >
        <View style={modalStyles.header}>
          <Text
            style={[modalStyles.modalTitle, { color: newTheme.textPrimary }]}
          >
            Add Recipe
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={20} color={newTheme.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={[modalStyles.label, { color: newTheme.textSecondary }]}>
          Recipe name
        </Text>
        <TextInput
          placeholder="e.g., Lemon Honey Tea"
          placeholderTextColor={newTheme.textSecondary}
          value={title}
          onChangeText={setTitle}
          style={[
            modalStyles.input,
            { color: newTheme.textPrimary, borderColor: newTheme.divider },
          ]}
        />

        <Text
          style={[
            modalStyles.label,
            { color: newTheme.textSecondary, marginTop: 12 },
          ]}
        >
          Notes
        </Text>
        <TextInput
          placeholder="Optional notes or steps"
          placeholderTextColor={newTheme.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={[
            modalStyles.input,
            {
              height: 90,
              textAlignVertical: "top",
              color: newTheme.textPrimary,
              borderColor: newTheme.divider,
            },
          ]}
        />

        <View style={{ height: 12 }} />
        <View style={modalStyles.actions}>
          <TouchableOpacity
            style={[modalStyles.btnAlt, { borderColor: newTheme.divider }]}
            onPress={onClose}
          >
            <Text style={{ color: newTheme.textSecondary }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              modalStyles.btnPrimary,
              { backgroundColor: newTheme.accent },
            ]}
            onPress={() => {
              if (!title.trim()) {
                Alert.alert("Validation", "Please enter a recipe name");
                return;
              }
              onSave({ title: title.trim(), notes: notes.trim() });
            }}
          >
            <Text style={{ fontWeight: "700", color: newTheme.background }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* Styles (main screen) */
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    back: { padding: 8 },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      textAlign: "center",
    },
    seed: { padding: 6 },
    seedText: { color: theme.textSecondary },

    body: { flex: 1, paddingTop: 40 },

    empty: { alignItems: "center", padding: 24 },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 8,
    },
    emptySub: { color: theme.textSecondary, marginBottom: 16 },

    primaryBtn: {
      backgroundColor: theme.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
    },
    primaryBtnText: { color: theme.background, fontWeight: "700" },

    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.divider,
      marginHorizontal: 20,
      backgroundColor: theme.surface,
      marginBottom: 10,
    },
    title: { fontSize: 16, fontWeight: "700", color: theme.textPrimary },
    notes: { color: theme.textSecondary, marginTop: 6 },
    meta: { fontSize: 12, color: theme.textSecondary, marginTop: 8 },

    actions: { marginLeft: 12, justifyContent: "space-between" },
    iconBtn: { padding: 8 },

    fab: {
      position: "absolute",
      right: 18,
      bottom: 26,
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 12,
      elevation: 6,
    },
  });

/* Modal styles */
const modalStyles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  card: {
    width: "92%",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btnAlt: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  btnPrimary: { flex: 1, padding: 12, borderRadius: 12, alignItems: "center" },
});
