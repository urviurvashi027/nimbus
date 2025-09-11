// components/EditProfileModal.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // optional, catch if not installed
import ThemeContext from "@/context/ThemeContext";
import InputField from "@/components/common/ThemedComponent/StyledInput"; // use your existing styled input
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import { useAuth } from "@/context/AuthContext"; // YOUR auth context hook (adjust path if different)
import AsyncStorage from "@react-native-async-storage/async-storage";

import AvatarBusy from "@/assets/images/avatar/busyguy.svg";
import AvatarCoolFemale from "@/assets/images/avatar/coolfemale.svg";
import AvatarCoolGuy from "@/assets/images/avatar/coolguy.svg";
import AvatarDeveloperGuy from "@/assets/images/avatar/developerguy.svg";
import AvatarFemale from "@/assets/images/avatar/female.svg";
import AvatarFinanceGuy from "@/assets/images/avatar/financeguy.svg";
import AvatarFitnessFemale from "@/assets/images/avatar/fitnessfemale.svg";
import AvatarSeriousFemale from "@/assets/images/avatar/seriousfemale.svg";
import AvatarYoungGuy from "@/assets/images/avatar/youngguy.svg";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved?: (updatedUser?: any) => void;
};

const SVG_AVATARS = [
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

export default function EditProfileModal({ visible, onClose, onSaved }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  // Attempt to get auth context - if your project uses a different hook name change this import.
  let auth: any = null;
  try {
    auth = useAuth();
  } catch (e) {
    auth = null;
  }

  // Local form state
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null); // could be remote url or local uri
  const [originalUser, setOriginalUser] = useState<any>(null);

  // Compose full name helper
  const fullName = useMemo(
    () => `${firstName || ""} ${lastName || ""}`.trim(),
    [firstName, lastName]
  );

  // Load user data when modal opens
  useEffect(() => {
    if (!visible) return;
    (async () => {
      setInitializing(true);
      try {
        let user = null;
        console.log(typeof auth.userProfile, "typeof auth.userProfile");
        if (auth && typeof auth.userProfile === "object") {
          user = auth.userProfile; // try explicit getter
        } else if (auth && auth.userProfile) {
          user = auth.user;
        } else {
          // dev fallback: read from AsyncStorage key "user"
          const raw = await AsyncStorage.getItem("@nimbus_user");
          user = raw ? JSON.parse(raw) : null;
        }

        // user can be null in dev; use default placeholders
        const usernameVal = user?.username ?? user?.email ?? "";
        const nameVal = user?.full_name ?? user?.name ?? "";
        const avatarVal = user?.avatar ?? null;

        // split name into first/last (simple split)
        const parts = (nameVal || "").split(" ").filter(Boolean);
        const first = parts.length ? parts[0] : "";
        const last = parts.length > 1 ? parts.slice(1).join(" ") : "";

        setUsername(usernameVal);
        setFirstName(first);
        setLastName(last);
        setAvatarUri(avatarVal);

        setOriginalUser({
          username: usernameVal,
          firstName: first,
          lastName: last,
          avatarUri: avatarVal,
          raw: user,
        });
      } catch (err) {
        console.warn("EditProfileModal load error", err);
      } finally {
        setInitializing(false);
      }
    })();
  }, [visible]);

  const isDirty = () => {
    if (!originalUser) return false;
    return (
      username !== originalUser.username ||
      firstName !== originalUser.firstName ||
      lastName !== originalUser.lastName ||
      avatarUri !== originalUser.avatarUri
    );
  };

  // Pick image from library (expo-image-picker)
  const pickImage = async (): Promise<void> => {
    try {
      // Request permission (safe: the method may not exist in some test envs)
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

      // Launch picker
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // normalize result (supports both old & new shapes)
      // New: { canceled: boolean, assets: [{ uri, ... }] }
      // Old: { cancelled: boolean, uri: string }  (note spelling difference)
      const cancelled =
        (res as any).canceled ?? (res as any).cancelled ?? false;
      if (cancelled) return;

      // Try new shape first
      const assets = (res as any).assets;
      if (Array.isArray(assets) && assets.length > 0 && assets[0].uri) {
        const uri: string = assets[0].uri;
        setAvatarUri(uri);
        return;
      }

      // Fallback to older SDK shape
      const maybeUri = (res as any).uri ?? (res as any).uri;
      if (maybeUri) {
        setAvatarUri(maybeUri);
        return;
      }

      // If we reach here, shape unexpected
      console.warn("Unexpected image picker result", res);
      Alert.alert("Upload failed", "Could not read selected image.");
    } catch (e) {
      console.warn("Image picker error", e);
      Alert.alert(
        "Upload not available",
        "Image picker isn't available in this environment."
      );
    }
  };

  // Save handler
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        username,
        full_name: fullName,
        avatar: avatarUri,
        first_name: firstName,
        last_name: lastName,
      };

      // Try auth.updateProfile or updateUser etc.
      if (auth) {
        if (typeof auth.updateProfile === "function") {
          await auth.updateProfile(payload);
        } else if (typeof auth.updateUser === "function") {
          await auth.updateUser(payload);
        } else if (typeof auth.saveUser === "function") {
          await auth.saveUser(payload);
        } else {
          // dev fallback -> write to AsyncStorage
          const existingRaw = await AsyncStorage.getItem("@nimbus_user");
          const existing = existingRaw ? JSON.parse(existingRaw) : {};
          const merged = { ...existing, ...payload };
          await AsyncStorage.setItem("@nimbus_user", JSON.stringify(merged));
        }
      } else {
        // fallback into storage
        const existingRaw = await AsyncStorage.getItem("@nimbus_user");
        const existing = existingRaw ? JSON.parse(existingRaw) : {};
        const merged = { ...existing, ...payload };
        await AsyncStorage.setItem("@nimbus_user", JSON.stringify(merged));
      }

      // success feedback
      Alert.alert("Saved", "Profile updated");
      onSaved?.(payload);
      onClose();
    } catch (e) {
      console.warn("save profile error", e);
      Alert.alert("Error", "Unable to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty()) {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Discard them?",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  // Render one avatar tile: SVG component import rendered directly
  const AvatarTile = ({
    SvgComp,
    index,
  }: {
    SvgComp: React.FC<any>;
    index: number;
  }) => {
    const id = `svg:${index}`;
    const selected = avatarUri === id;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setAvatarUri(id)}
        style={[
          styles.avatarItem,
          selected && { borderColor: newTheme.accent, borderWidth: 2 },
        ]}
      >
        {/* render the svg component full-size */}
        {/* @ts-ignore - SvgComp is a React component typing from declaration file */}
        <SvgComp width="100%" height="100%" />
      </TouchableOpacity>
    );
  };

  // avatar item renderer
  const renderAvatarItem = ({ item, index }: { item: any; index: number }) => {
    const selected =
      avatarUri &&
      typeof avatarUri === "string" &&
      avatarUri === Image.resolveAssetSource?.(item)?.uri;
    // resolveAssetSource only for packaged assets; fallback compare by index by storing "asset:index" format if desired
    const isSelected =
      selected ||
      avatarUri?.includes(`avatar_${index}`) ||
      (!avatarUri && index === 0 && !originalUser?.avatarUri);

    return (
      <TouchableOpacity
        onPress={() => {
          // store identifier as "asset:index" so we can persist
          // but for simplicity we can store remote uri or "asset:index"
          setAvatarUri(
            Image.resolveAssetSource?.(item)?.uri ?? `asset:${index}`
          );
        }}
        style={[
          styles.avatarItem,
          isSelected && { borderColor: newTheme.accent, borderWidth: 2 },
        ]}
      >
        <Image source={item} style={styles.avatarImage} />
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={[styles.screen /* background */]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.backBtn}>
              <Ionicons
                name="arrow-back"
                size={22}
                color={newTheme.textPrimary}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Edit profile</Text>
              {isDirty() ? <Text style={styles.unsaved}>UNSAVED</Text> : null}
            </View>
            <View style={{ width: 64 }} />
          </View>

          {/* Scrollable body */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={{ paddingBottom: 140 }} // big enough for fixed footer
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar grid */}
            <Text style={styles.label}>Avatar</Text>

            <View style={styles.grid}>
              {SVG_AVATARS.map((SvgComp, i) => (
                <AvatarTile SvgComp={SvgComp} index={i} key={i} />
              ))}
            </View>

            {/* Upload + Reset buttons (always visible inside scroll area right below grid) */}
            <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                <Text style={{ color: newTheme.background, fontWeight: "700" }}>
                  Upload photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: newTheme.surface }]}
                onPress={() => {
                  setAvatarUri(null);
                }}
              >
                <Text style={{ color: newTheme.textSecondary }}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Form fields */}
            <View style={{ marginTop: 18 }}>
              <InputField
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="username"
              />
              <View style={{ height: 12 }} />
              <InputField
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
              />
              <View style={{ height: 12 }} />
              <InputField
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
              />
            </View>

            {/* spacer to allow scroll-to-bottom above footer */}
            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Fixed footer: Save / Cancel */}
          <View style={styles.fixedFooterContainer}>
            <View style={styles.footerInner}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text
                  style={{ color: newTheme.textPrimary, fontWeight: "700" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, !isDirty() && { opacity: 0.5 }]}
                onPress={handleSave}
                disabled={!isDirty() || loading}
              >
                {loading ? (
                  <ActivityIndicator color={newTheme.background} />
                ) : (
                  <Text
                    style={{ color: newTheme.background, fontWeight: "800" }}
                  >
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background, paddingTop: 90 },
    header: {
      height: 72,
      paddingHorizontal: 16,
      alignItems: "center",
      flexDirection: "row",
    },
    backBtn: { padding: 6, marginRight: 8 },
    title: { fontSize: 20, fontWeight: "700", color: theme.textPrimary },
    unsaved: {
      marginTop: 4,
      color: theme.background,
      backgroundColor: theme.warning || "#EBCB8B",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontWeight: "700",
      marginLeft: 0,
    },
    body: { flex: 1, padding: 16 },
    label: { color: theme.textPrimary, fontWeight: "700", marginBottom: 8 },
    avatarRow: {
      // grid handled by FlatList numColumns
      marginBottom: 6,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 8,
    },
    // avatarItem: {
    //   width: 96,
    //   height: 96,
    //   borderRadius: 12,
    //   overflow: "hidden",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   backgroundColor: theme.surface,
    // },
    // avatarImage: {
    //   width: "100%",
    //   height: "100%",
    //   resizeMode: "cover",
    // },
    // smallBtn: {
    //   paddingVertical: 10,
    //   paddingHorizontal: 14,
    //   borderRadius: 10,
    //   backgroundColor: theme.accent,
    //   alignItems: "center",
    //   justifyContent: "center",
    // },
    footer: { flexDirection: "row", gap: 12, marginTop: 18 },
    cancelBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.divider,
      backgroundColor: theme.surface,
    },
    saveBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
    },
    // add to styling(...) result
    fixedFooterContainer: {
      // pinned at bottom, full width
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: Platform.OS === "ios" ? 24 : 12, // safe area bottom
      backgroundColor: "transparent",
    },
    footerInner: {
      flexDirection: "row",
      paddingHorizontal: 16,
      gap: 12,
    },
    uploadBtn: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    smallBtn: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarItem: {
      width: (Dimensions.get("window").width - 64) / 3, // three columns with margin
      height: (Dimensions.get("window").width - 64) / 3,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.surface,
      marginBottom: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    placeholder: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });
