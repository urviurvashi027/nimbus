// components/EditProfileModal.tsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

import InputField from "@/components/common/themeComponents/StyledInputOld";
import StyledButton from "@/components/common/themeComponents/StyledButton";
import AvatarPickerModal from "./AvatarPickerModal";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

/* import your BUILTIN_SVGS if you want preview of svg selection */
import AvatarBusy from "@/assets/images/avatar/busyguy.svg";
import AvatarCoolFemale from "@/assets/images/avatar/coolfemale.svg";
import AvatarCoolGuy from "@/assets/images/avatar/coolguy.svg";
import AvatarYoungGuy from "@/assets/images/avatar/youngguy.svg";
import AvatarSeriousFemale from "@/assets/images/avatar/seriousfemale.svg";
import AvatarFitnessFemale from "@/assets/images/avatar/fitnessfemale.svg";
import AvatarFinanceGuy from "@/assets/images/avatar/financeguy.svg";
import AvatarDeveloperGuy from "@/assets/images/avatar/developerguy.svg";
import AvatarFemale from "@/assets/images/avatar/female.svg";
import { svgIndexToFileUri } from "@/constant/builtinAvatars";
import { SvgUri } from "react-native-svg";

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

export const BUILTIN_AVATAR_FILES: Record<number, any> = {
  0: require("@/assets/images/avatar/busyguy.svg"),
  1: require("@/assets/images/avatar/coolfemale.svg"),
  2: require("@/assets/images/avatar/coolguy.svg"),
  3: require("@/assets/images/avatar/youngguy.svg"),
  4: require("@/assets/images/avatar/seriousfemale.svg"),
  5: require("@/assets/images/avatar/fitnessfemale.svg"),
  6: require("@/assets/images/avatar/financeguy.svg"),
  7: require("@/assets/images/avatar/developerguy.svg"),
  8: require("@/assets/images/avatar/female.svg"),
};

type AvatarKey = string | null;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved?: (updatedUser?: any) => void;
};

async function buildProfileFormData(payload: any, avatarKey: AvatarKey) {
  const fd = new FormData();

  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  });

  if (avatarKey?.startsWith("svg:")) {
    const idx = Number(avatarKey.split(":")[1]);
    const uri = await svgIndexToFileUri(idx);

    fd.append("avatar", {
      uri,
      name: `avatar-${idx}.svg`,
      type: "image/svg+xml",
    } as any);
  } else if (avatarKey?.startsWith("uri:")) {
    const uri = avatarKey.slice(4);

    fd.append("avatar", {
      uri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);
  }

  console.log(fd, "fdfdfdffdf");

  return fd;
}

// ---------- component ----------
export default function EditProfileModal({ visible, onClose, onSaved }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const { loadUserFromStorage, updateProfile } = useAuth();
  const toast = useNimbusToast();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarKey, setAvatarKey] = useState<string | null>(null);

  const [age, setAge] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const [heightUnit, setHeightUnit] = useState<string>("cm");
  const [weightUnit, setWeightUnit] = useState<string>("kg");

  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setLoading(true);
    (async () => {
      try {
        const cached = await loadUserFromStorage?.();
        if (!cached) return;

        console.log("loaded cached user for edit profile", cached);

        const p = {
          id: cached?.id,
          username: cached?.username ?? "",
          email: cached?.email ?? "",
          first_name: cached?.first_name ?? "",
          last_name: cached?.last_name ?? "",
          profile: cached?.profile ?? {},
          avatar: cached?.avatar ?? null,
          setting: cached?.settings ?? {}, // keeping your naming
        };

        setProfile(p);
        setFirstName(p.first_name);
        setLastName(p.last_name);
        setAvatarKey(p.avatar);

        const backendSettings = p.setting ?? {};
        setHeightUnit(backendSettings.height_unit ?? "cm");
        setWeightUnit(backendSettings.weight_unit ?? "kg");

        const rawAge = p.profile?.age;
        const rawHeight = p.profile?.height;
        const rawWeight = p.profile?.weight;

        setAge(
          typeof rawAge === "number" ? rawAge : rawAge ? Number(rawAge) : null
        );
        setHeight(
          typeof rawHeight === "number"
            ? rawHeight
            : rawHeight
            ? Number(rawHeight)
            : null
        );
        setWeight(
          typeof rawWeight === "number"
            ? rawWeight
            : rawWeight
            ? Number(rawWeight)
            : null
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [visible, loadUserFromStorage]);

  const isDirty = useCallback(() => {
    if (!profile) return false;

    const firstChanged = (profile.first_name ?? "") !== (firstName ?? "");
    const lastChanged = (profile.last_name ?? "") !== (lastName ?? "");
    const avatarChanged = (profile.avatar ?? null) !== (avatarKey ?? null);

    const origAge = profile.profile?.age ?? null;
    const origHeight = profile.profile?.height ?? null;
    const origWeight = profile.profile?.weight ?? null;

    const ageChanged = (origAge ?? null) !== (age ?? null);
    const heightChanged = (origHeight ?? null) !== (height ?? null);
    const weightChanged = (origWeight ?? null) !== (weight ?? null);

    return (
      firstChanged ||
      lastChanged ||
      avatarChanged ||
      ageChanged ||
      heightChanged ||
      weightChanged
    );
  }, [profile, firstName, lastName, avatarKey, age, height, weight]);

  const buildPayload = useCallback(() => {
    if (!profile) return {};

    const payload: any = {};

    if ((profile.first_name ?? "") !== (firstName ?? ""))
      payload.first_name = firstName;
    if ((profile.last_name ?? "") !== (lastName ?? ""))
      payload.last_name = lastName;

    // send profile nested if changed
    const nestedProfile: any = {};
    const orig = profile.profile ?? {};
    if ((orig.age ?? null) !== (age ?? null)) nestedProfile.age = age ?? null;
    if ((orig.height ?? null) !== (height ?? null))
      nestedProfile.height = height ?? null;
    if ((orig.weight ?? null) !== (weight ?? null))
      nestedProfile.weight = weight ?? null;
    if (Object.keys(nestedProfile).length)
      payload.profile = { ...(profile.profile ?? {}), ...nestedProfile };

    // settings if needed
    const nestedSettings: any = {};
    const origSettings = profile.setting ?? {};
    if ((origSettings.height_unit ?? "cm") !== heightUnit)
      nestedSettings.height_unit = heightUnit;
    if ((origSettings.weight_unit ?? "kg") !== weightUnit)
      nestedSettings.weight_unit = weightUnit;
    if (Object.keys(nestedSettings).length)
      payload.settings = { ...(profile.setting ?? {}), ...nestedSettings };

    return payload;
  }, [
    profile,
    firstName,
    lastName,
    age,
    height,
    weight,
    heightUnit,
    weightUnit,
  ]);

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const payload = {}; // build your normal payload here (first_name, last_name, profile, settings, etc.)
      const fd = await buildProfileFormData(payload, avatarKey);
      const saved = await updateProfile?.(fd);
      console.log("saved profile", saved, fd);
      if (saved?.success) {
        toast.show({
          variant: "success",
          title: "Profile Updated",
          message: "Successfully updated the profile",
        });
        onClose();
        onSaved?.(saved?.data);
      } else {
        Alert.alert("Update failed", saved?.message ?? "Try again.");
      }
    } catch (e) {
      console.warn("save profile", e);
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
          { text: "Discard", style: "destructive", onPress: () => onClose() },
        ]
      );
    } else onClose();
  };

  if (!visible) return null;

  const phone = profile?.profile?.phone_number ?? "";
  const username = profile?.username ?? "";

  const isSvgUrl = (u: string) => {
    const clean = u.split("?")[0].toLowerCase();
    return clean.endsWith(".svg");
  };

  const AvatarPreview = () => {
    if (!avatarKey) {
      return (
        <View style={styles.avatarPlaceholder}>
          <Text style={{ color: newTheme.textSecondary }}>No avatar</Text>
        </View>
      );
    }

    // ✅ local built-in selection: "svg:4"
    if (avatarKey.startsWith("svg:")) {
      const idx = Number(avatarKey.split(":")[1]);
      const SvgComp = BUILTIN_SVGS[idx];
      if (SvgComp) {
        return (
          <View style={[styles.avatarPlaceholder, { overflow: "hidden" }]}>
            {/* @ts-ignore */}
            <SvgComp width="100%" height="100%" />
          </View>
        );
      }
    }

    // ✅ uploaded image selection: "uri:file://...."
    const maybeUri = avatarKey.startsWith("uri:")
      ? avatarKey.slice(4)
      : avatarKey;

    // ✅ backend URL is SVG -> render with SvgUri (NOT Image)
    if (typeof maybeUri === "string" && isSvgUrl(maybeUri)) {
      return <SvgUri uri={maybeUri} width="100%" height="100%" />;
    }

    // ✅ normal image
    return <Image source={{ uri: maybeUri }} style={styles.avatarImage} />;
  };

  const onChangeAge = (txt: string) => {
    const n = txt === "" ? null : Number(txt);
    setAge(Number.isNaN(n) ? null : n);
  };
  const onChangeHeight = (txt: string) => {
    const n = txt === "" ? null : Number(txt);
    setHeight(Number.isNaN(n) ? null : n);
  };
  const onChangeWeight = (txt: string) => {
    const n = txt === "" ? null : Number(txt);
    setWeight(Number.isNaN(n) ? null : n);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide">
        <SafeAreaView style={styles.screen}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
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

            <ScrollView
              style={styles.body}
              contentContainerStyle={{ paddingBottom: 140 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.avatarHeader}>
                <TouchableOpacity
                  onPress={() => setPickerOpen(true)}
                  style={styles.avatarPreview}
                >
                  <AvatarPreview />
                </TouchableOpacity>
                <Text style={styles.avatarNote}>Tap to change avatar</Text>
              </View>

              <Text style={styles.sectionLabel}>Account</Text>
              <View style={styles.readRow}>
                <Text style={styles.readLabel}>Username</Text>
                <Text style={styles.readValue}>{username}</Text>
              </View>
              <View style={{ height: 12 }} />
              <View style={styles.readRow}>
                <Text style={styles.readLabel}>Phone</Text>
                <Text style={styles.readValue}>{phone || "Not provided"}</Text>
              </View>

              <View style={{ height: 12 }} />
              <Text style={styles.sectionLabel}>Personal</Text>

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

              <View style={{ height: 8 }} />
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <InputField
                    label="Age"
                    value={age !== null ? String(age) : ""}
                    onChangeText={onChangeAge}
                    placeholder="Age"
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <InputField
                    label={`Height (${heightUnit})`}
                    value={height !== null ? String(height) : ""}
                    onChangeText={onChangeHeight}
                    placeholder="Height"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={{ height: 12 }} />
              <InputField
                label={`Weight (${weightUnit})`}
                value={weight !== null ? String(weight) : ""}
                onChangeText={onChangeWeight}
                placeholder="Weight"
                keyboardType="numeric"
              />

              <View style={{ height: 32 }} />
            </ScrollView>

            <View style={styles.fixedFooterContainer}>
              <View style={styles.footerInner}>
                <StyledButton
                  label="Cancel"
                  variant="secondary"
                  fullWidth
                  onPress={handleCancel}
                  disabled={loading}
                  style={styles.footerButton}
                />

                <StyledButton
                  label={loading ? "Saving..." : "Save"}
                  variant="primary"
                  fullWidth
                  onPress={handleSave}
                  disabled={!isDirty() || loading}
                  loading={loading}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <AvatarPickerModal
          visible={pickerOpen}
          initial={avatarKey}
          onClose={() => setPickerOpen(false)}
          onSelect={(k: any) => setAvatarKey(k)}
        />
      </Modal>
    </>
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
      backgroundColor: theme.warning ?? "#EBCB8B",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontWeight: "700",
    },
    body: { flex: 1, paddingHorizontal: 16 },
    avatarHeader: { alignItems: "center", marginTop: 6, marginBottom: 12 },
    avatarPreview: {
      width: 112,
      height: 112,
      borderRadius: 12,
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "transparent",
    },
    avatarImage: { width: 112, height: 112, borderRadius: 12 },
    avatarNote: {
      marginTop: 8,
      color: theme.textSecondary,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    sectionLabel: {
      color: theme.textSecondary,
      fontWeight: "700",
      marginBottom: 8,
      marginTop: 6,
    },
    readRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.surface,
      paddingHorizontal: 12,
      marginBottom: 6,
    },
    readLabel: { color: theme.textSecondary },
    readValue: { color: theme.textPrimary, fontWeight: "700" },
    rowInputs: { flexDirection: "row", alignItems: "flex-start" },
    fixedFooterContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: Platform.OS === "ios" ? 24 : 12,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    } as any,
    footerInner: {
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    footerButton: {
      marginBottom: 12,
    },
    avatarPlaceholder: {
      width: 112,
      height: 112,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
    },
  });
