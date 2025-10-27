// components/AvatarPickerModal.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

/* SVG avatar imports (your existing assets) */
import AvatarBusy from "@/assets/images/avatar/busyguy.svg";
import AvatarCoolFemale from "@/assets/images/avatar/coolfemale.svg";
import AvatarCoolGuy from "@/assets/images/avatar/coolguy.svg";
import AvatarDeveloperGuy from "@/assets/images/avatar/developerguy.svg";
import AvatarFemale from "@/assets/images/avatar/female.svg";
import AvatarFinanceGuy from "@/assets/images/avatar/financeguy.svg";
import AvatarFitnessFemale from "@/assets/images/avatar/fitnessfemale.svg";
import AvatarSeriousFemale from "@/assets/images/avatar/seriousfemale.svg";
import AvatarYoungGuy from "@/assets/images/avatar/youngguy.svg";

const BUILTIN_SVGS = [
  AvatarBusy,
  AvatarCoolFemale,
  AvatarCoolGuy,
  AvatarYoungGuy,
  AvatarSeriousFemale,
  AvatarFitnessFemale,
  AvatarFinanceGuy,
  AvatarDeveloperGuy,
  AvatarFemale,
];

const sizing = Dimensions.get("window").width;
const AVATAR_SIZE = (sizing - 64) / 3;

type AvatarItem =
  | { id: string; kind: "svg"; svg: React.FC<any> }
  | { id: string; kind: "uri"; uri: string };

type Props = {
  visible: boolean;
  initial?: string | null; // e.g. "svg:0" or "uri:<uri>"
  onClose: () => void;
  onSelect: (key: string | null) => void; // returns id (svg:<i> or uri:<uri>) or null
  avatarsOverride?: AvatarItem[]; // optional override
};

export default function AvatarPickerModal({
  visible,
  initial = null,
  onClose,
  onSelect,
  avatarsOverride,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);
  const [selectedId, setSelectedId] = useState<string | null>(initial ?? null);
  const [items, setItems] = useState<AvatarItem[]>([]);

  console.log("AvatarPickerModal render", { visible, initial, selectedId });

  // build initial items from BUILTIN_SVGS (and any override)
  useEffect(() => {
    const built: AvatarItem[] = BUILTIN_SVGS.map((SvgComp, i) => ({
      id: `svg:${i}`,
      kind: "svg",
      svg: SvgComp,
    }));

    if (avatarsOverride && avatarsOverride.length) {
      // use provided list (prefer override)
      setItems(avatarsOverride);
    } else {
      setItems(built);
    }
  }, [avatarsOverride]);

  useEffect(() => {
    if (visible) setSelectedId(initial ?? null);
  }, [visible, initial]);

  const pickImage = async () => {
    try {
      if (ImagePicker.requestMediaLibraryPermissionsAsync) {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please allow photo access to upload avatar."
          );
          return;
        }
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      const cancelled =
        (res as any).canceled ?? (res as any).cancelled ?? false;
      if (cancelled) return;

      const assets = (res as any).assets;
      let uri: string | undefined;
      if (Array.isArray(assets) && assets.length > 0 && assets[0].uri)
        uri = assets[0].uri;
      else uri = (res as any).uri ?? undefined;

      if (uri) {
        const id = `uri:${uri}`;
        // if this uri already in items, keep it; otherwise insert at front so user sees it
        setItems((prev) => {
          if (prev.some((it) => it.kind === "uri" && it.uri === uri))
            return prev;
          return [{ id, kind: "uri", uri }, ...prev];
        });
        setSelectedId(id);
      }
    } catch (e) {
      console.warn("AvatarPicker pickImage error", e);
      Alert.alert("Upload failed", "Could not pick image.");
    }
  };

  const handleReset = () => {
    setSelectedId(null);
  };

  const handleSave = () => {
    // return the selected key
    // caller can store either the id ("svg:0" or "uri:<uri>") or parse it
    onSelect(selectedId);
    onClose();
  };

  const renderItem = ({ item }: { item: AvatarItem }) => {
    const active = selectedId === item.id;
    if (item.kind === "svg") {
      const SvgComp = item.svg;
      return (
        <TouchableOpacity
          style={[styles.avatarItem, active && styles.avatarItemActive]}
          onPress={() => setSelectedId(item.id)}
        >
          {/* @ts-ignore - SVG component */}
          <SvgComp width="100%" height="100%" />
          {active && (
            <View style={styles.check}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={newTheme.background}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.avatarItem, active && styles.avatarItemActive]}
          onPress={() => setSelectedId(item.id)}
        >
          <Image source={{ uri: item.uri }} style={styles.avatarImage} />
          {active && (
            <View style={styles.check}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={newTheme.background}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={newTheme.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Choose avatar</Text>
          <View style={{ width: 44 }} />
        </View>

        <Text style={styles.subtitle}>Built-in avatars</Text>

        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.actions}>
          {/* <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={pickImage}
          >
            <Text style={styles.btnPrimaryText}>Upload photo</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.btn, styles.btnAlt]}
            onPress={handleReset}
          >
            <Text style={styles.btnAltText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnSave]}
            onPress={handleSave}
          >
            <Text style={styles.btnSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      height: 72,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    backBtn: { padding: 6, marginRight: 8 },
    title: { fontSize: 20, fontWeight: "700", color: theme.textPrimary },
    subtitle: {
      paddingHorizontal: 16,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: Platform.OS === "ios" ? 24 : 16,
    },
    row: { justifyContent: "space-between", marginBottom: 14 },
    avatarItem: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    avatarItemActive: { borderWidth: 2, borderColor: theme.accent },
    avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
    check: { position: "absolute", right: 6, top: 6 },
    actions: {
      padding: 16,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    btn: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    btnPrimary: { backgroundColor: theme.accent },
    btnPrimaryText: { color: theme.background, fontWeight: "700" },
    btnAlt: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    btnAltText: { color: theme.textSecondary, fontWeight: "700" },
    btnSave: { backgroundColor: theme.accent },
    btnSaveText: { color: theme.background, fontWeight: "700" },
  });
