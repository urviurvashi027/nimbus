// app/Recipes/AddRecipeScreen.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Text,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { FormInput } from "@/components/Themed";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
// If you do not use expo-image-picker, the optional upload will be disabled
import * as ImagePicker from "expo-image-picker";
import InputField from "@/components/common/ThemedComponent/StyledInput";
import { router, useNavigation } from "expo-router";

type Ingredient = { id: string; item: string; quantity: string };
type Instruction = { id: string; step: number; instruction: string };

const CATEGORIES = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snacks", label: "Snacks" },
  { key: "beverage", label: "Beverage" },
];

export default function AddRecipeScreen() {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  // form fields
  const [recipeName, setRecipeName] = useState("");
  const [shortTitle, setShortTitle] = useState(""); // description.title
  const [description, setDescription] = useState(""); // description.content
  const [category, setCategory] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // lists
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: genId(), item: "", quantity: "" },
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: genId(), step: 1, instruction: "" },
  ]);

  // optional image
  const [imageUri, setImageUri] = useState<string | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);

  async function pickImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "We need access to your photos to upload an image."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (
        !result.canceled &&
        (result.assets?.[0]?.uri || (result as any).uri)
      ) {
        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
        setImageUri(uri);
      }
    } catch (e) {
      console.warn("Image pick failed", e);
    }
  }

  function addIngredient() {
    setIngredients((s) => [...s, { id: genId(), item: "", quantity: "" }]);
  }
  function removeIngredient(id: string) {
    setIngredients((s) => s.filter((i) => i.id !== id));
  }
  function updateIngredient(id: string, part: Partial<Ingredient>) {
    setIngredients((s) =>
      s.map((it) => (it.id === id ? { ...it, ...part } : it))
    );
  }

  function addInstruction() {
    setInstructions((s) => [
      ...s,
      { id: genId(), step: s.length + 1, instruction: "" },
    ]);
  }
  function removeInstruction(id: string) {
    setInstructions((s) =>
      s.filter((i) => i.id !== id).map((i, idx) => ({ ...i, step: idx + 1 }))
    );
  }
  function updateInstruction(id: string, text: string) {
    setInstructions((s) =>
      s.map((it) => (it.id === id ? { ...it, instruction: text } : it))
    );
  }

  function validate(): string | null {
    if (!recipeName.trim()) return "Please enter recipe name.";
    if (!shortTitle.trim()) return "Please add a short title.";
    if (!description.trim()) return "Please add recipe description content.";
    if (!category) return "Please select a category.";
    // at least one ingredient with item name
    if (ingredients.length === 0 || ingredients.every((it) => !it.item.trim()))
      return "Please add at least one ingredient.";
    // at least one instruction text
    if (
      instructions.length === 0 ||
      instructions.every((it) => !it.instruction.trim())
    )
      return "Please add at least one instruction.";
    return null;
  }

  async function onSubmit() {
    const err = validate();
    if (err) {
      Alert.alert("Missing required fields", err);
      return;
    }
    setSubmitting(true);
    try {
      // build payload as requested
      const payload = {
        recipe_name: recipeName.trim(),
        description: {
          title: shortTitle.trim(),
          content: description.trim(),
        },
        category: category,
        ingredients: ingredients
          .filter((i) => i.item.trim())
          .map((i) => ({ item: i.item.trim(), quantity: i.quantity.trim() })),
        instruction: instructions
          .filter((it) => it.instruction.trim())
          .map((it, idx) => ({
            steps: idx + 1,
            instruction: it.instruction.trim(),
          })),
        // optionally add image as URI; in real app you'd upload image & return an asset key/url
        image: imageUri ? imageUri : undefined,
      };

      // TODO: replace with your API call
      // await api.createRecipe(payload)
      console.log("Recipe payload", JSON.stringify(payload, null, 2));
      Alert.alert(
        "Recipe ready",
        "Payload logged to console. Replace with API call."
      );
      // reset form (optional)
      resetForm();
    } catch (e) {
      console.warn("submit failed", e);
      Alert.alert("Submission failed", (e as any)?.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setRecipeName("");
    setShortTitle("");
    setDescription("");
    setCategory(null);
    setIngredients([{ id: genId(), item: "", quantity: "" }]);
    setInstructions([{ id: genId(), step: 1, instruction: "" }]);
    setImageUri(null);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen]}
    >
      {/* CUSTOM HEADER */}
      <View style={[styles.header]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={22} color={newTheme.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Add New Recipe</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        {/* <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Add New Recipe</Text>
        </View> */}

        {/* Image */}
        <View style={styles.section}>
          <Text style={styles.label}>Cover image (optional)</Text>
          <View style={styles.imageRow}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View
                style={[
                  styles.imagePreview,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Ionicons
                  name="image-outline"
                  size={36}
                  color={newTheme.textSecondary}
                />
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <StyledButton
                label={imageUri ? "Replace image" : "Upload image"}
                onPress={pickImage}
                disabled={false}
                style={{ paddingVertical: 12 }}
              />
              {imageUri ? (
                <TouchableOpacity
                  onPress={() => setImageUri(null)}
                  style={{ marginTop: 8 }}
                >
                  <Text
                    style={[styles.link, { color: newTheme.textSecondary }]}
                  >
                    Remove image
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          {/* <Text style={styles.label}>Recipe name</Text> */}

          <InputField
            label="Recipe name"
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="Paneer Tortila"
          />

          {/* <FormInput
            placeholder="e.g. Lemon chia pudding"
            value={recipeName}
            onChangeText={setRecipeName}
          /> */}
        </View>

        <View style={styles.rowTwo}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {/* <Text style={styles.label}>Short title</Text> */}

            <InputField
              placeholder="Short title"
              value={shortTitle}
              onChangeText={setShortTitle}
              label="Short title"
            />

            {/* <FormInput
              placeholder="Short title"
              value={shortTitle}
              onChangeText={setShortTitle}
            /> */}
          </View>
          <View style={{ width: 140 }}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              onPress={() => setCategoryModalOpen(true)}
              style={[styles.dropdown, { borderColor: newTheme.divider }]}
            >
              <Text
                style={{
                  color: category
                    ? newTheme.textPrimary
                    : newTheme.textSecondary,
                }}
              >
                {category
                  ? CATEGORIES.find((c) => c.key === category)?.label ??
                    category
                  : "Select"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={newTheme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          {/* <Text style={styles.label}>Description</Text> */}
          <InputField
            placeholder="Write a short description or intro paragraph"
            value={description}
            onChangeText={setDescription}
            label="Description"
            multiline
            // style={{ minHeight: 90, textAlignVertical: "top", paddingTop: 12 }}
          />

          {/* <FormInput
            multiline
            placeholder="Write a short description or intro paragraph"
            value={description}
            onChangeText={setDescription}
          /> */}
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredient}>
              <Ionicons name="add-circle" size={28} color={newTheme.accent} />
            </TouchableOpacity>
          </View>

          {ingredients.map((ing, idx) => (
            <View key={ing.id} style={styles.listRow}>
              <View style={{ flex: 2, marginRight: 8 }}>
                <InputField
                  placeholder={`Ingredient ${idx + 1}`}
                  value={ing.item}
                  onChangeText={(t) => updateIngredient(ing.id, { item: t })}
                  label=""
                />

                {/* <FormInput
                  placeholder={`Ingredient ${idx + 1}`}
                  value={ing.item}
                  onChangeText={(t) => updateIngredient(ing.id, { item: t })}
                /> */}
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <InputField
                  placeholder="Qty"
                  value={ing.quantity}
                  onChangeText={(t) =>
                    updateIngredient(ing.id, { quantity: t })
                  }
                  //   label="Short title"
                />
                {/* <FormInput
                  placeholder="Qty"
                  value={ing.quantity}
                  onChangeText={(t) =>
                    updateIngredient(ing.id, { quantity: t })
                  }
                /> */}
              </View>
              <TouchableOpacity
                onPress={() => removeIngredient(ing.id)}
                style={styles.iconBtn}
              >
                <Ionicons
                  name="trash"
                  size={20}
                  color={newTheme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TouchableOpacity onPress={addInstruction}>
              <Ionicons name="add-circle" size={28} color={newTheme.accent} />
            </TouchableOpacity>
          </View>

          {instructions.map((it) => (
            <View key={it.id} style={styles.instructionRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{it.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  placeholder={`Step ${it.step}`}
                  value={it.instruction}
                  onChangeText={(t) => updateInstruction(it.id, t)}
                  label=""
                  multiline
                  // style={{ minHeight: 90, textAlignVertical: "top", paddingTop: 12 }}
                />

                {/* <FormInput
                  placeholder={`Step ${it.step}`}
                  value={it.instruction}
                  onChangeText={(t) => updateInstruction(it.id, t)}
                  multiline
                  style={{
                    minHeight: 60,
                    textAlignVertical: "top",
                    paddingTop: 8,
                  }}
                /> */}
              </View>
              <TouchableOpacity
                onPress={() => removeInstruction(it.id)}
                style={styles.iconBtn}
              >
                <Ionicons
                  name="trash"
                  size={20}
                  color={newTheme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Submit */}
        <View style={{ marginVertical: 20 }}>
          <StyledButton
            label="Save recipe"
            onPress={onSubmit}
            disabled={submitting}
          />
        </View>
      </ScrollView>

      {/* Category modal */}
      <Modal
        visible={categoryModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryModalOpen(false)}
        />
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: newTheme.surface,
              borderColor: newTheme.divider,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: newTheme.textPrimary }]}>
            Select category
          </Text>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[
                styles.modalItem,
                category === c.key && {
                  backgroundColor: newTheme.accent,
                  borderColor: newTheme.accent,
                },
              ]}
              onPress={() => {
                setCategory(c.key);
                setCategoryModalOpen(false);
              }}
            >
              <Text
                style={{
                  color:
                    category === c.key
                      ? newTheme.background
                      : newTheme.textPrimary,
                }}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ---------- helpers & styles ---------- */

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

const styling = (theme: any) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background, paddingTop: 50 },
    container: {
      padding: 18,
      paddingBottom: 44,
    },
    header: {
      height: 64,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      backgroundColor: theme.surface,
    },
    headerIcon: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerRow: {
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.textPrimary,
    },
    section: {
      marginTop: 8,
      marginBottom: 12,
    },
    label: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    imageRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    imagePreview: {
      width: 120,
      height: 90,
      borderRadius: 10,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    rowTwo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 6,
    },
    dropdown: {
      borderWidth: 1,
      paddingHorizontal: 12,
      height: 44,
      borderRadius: 10,
      //   justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.surface,
    },
    link: { fontSize: 14, color: theme.accent, fontWeight: "600" },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: theme.textPrimary },

    listRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    iconBtn: {
      padding: 8,
      borderRadius: 8,
      marginTop: 5,
    },

    instructionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    stepBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      marginTop: 5,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    stepBadgeText: {
      color: theme.textPrimary,
      fontWeight: "700",
    },

    // modal
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    modalCard: {
      position: "absolute",
      left: 28,
      right: 28,
      top: "30%",
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      overflow: "hidden",
    },
    modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
    modalItem: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "transparent",
    },
  });
