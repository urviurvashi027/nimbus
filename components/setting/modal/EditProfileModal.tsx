// components/EditProfileModal.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import Toast from "react-native-toast-message";

import ThemeContext from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

import InputField from "@/components/common/ThemedComponent/StyledInput";
import StyledButton from "@/components/common/themeComponents/StyledButton";

import AvatarPickerModal from "./AvatarPickerModal";

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
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

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

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved?: (updatedUser?: any) => void;
};

export default function EditProfileModal({ visible, onClose, onSaved }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  let auth: any = null;
  try {
    auth = useAuth();
  } catch (e) {
    auth = null;
  }

  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarKey, setAvatarKey] = useState<string | null>(null);

  // profile nested fields (editable)
  const [age, setAge] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const [heightUnit, setHeightUnit] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("");

  const [pickerOpen, setPickerOpen] = useState(false);
  const { loadUserFromStorage, updateProfile } = useAuth();

  const toast = useNimbusToast();

  // const { get, save } = useReminder();

  useEffect(() => {
    if (!visible) return;
    // console.log("coming here useefect", loadUserFromStorage);
    setLoading(true);
    (async () => {
      const cached = await loadUserFromStorage?.(); // ← safe call
      console.log(cached, "cached");
      const profile = cached.profile;
      const p = {
        id: cached?.id,
        username: cached?.username ?? "",
        email: cached?.email ?? "",
        first_name: cached?.first_name ?? "",
        last_name: cached?.last_name ?? "",
        profile: cached?.profile ?? {},
        avatar: cached?.avatar ?? null,
        setting: cached?.settings ?? {},
      };
      console.log("Loaded from storage: EditProfile", p);
      setProfile(p);
      setFirstName(p.first_name);
      setLastName(p.last_name);
      setHeight(p.profile?.height);
      setWeight(p.profile?.weight);
      setAge(p.profile?.age);
      setAvatarKey(p.avatar);
      const backendSettings = p?.setting ?? {};
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
      setLoading(false);
    })();
  }, []); // include in deps

  // isDirty should consider all editable fields
  const isDirty = () => {
    if (!profile) return false;
    const firstChanged = (profile.first_name ?? "") !== (firstName ?? "");
    const lastChanged = (profile.last_name ?? "") !== (lastName ?? "");
    const avatarChanged = (profile.avatar ?? null) !== (avatarKey ?? null);

    // profile nested changes
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
  };

  const buildPayload = () => {
    if (!profile) return null;

    const payload: any = {};

    // --- Top-level fields ---
    if ((profile.first_name ?? "") !== (firstName ?? "")) {
      payload.first_name = firstName;
    }
    if ((profile.last_name ?? "") !== (lastName ?? "")) {
      payload.last_name = lastName;
    }
    if ((profile.avatar ?? null) !== (avatarKey ?? null)) {
      payload.avatar = avatarKey ?? null;
    }

    // --- Profile nested fields ---
    const nestedProfile: any = {};
    const orig = profile.profile ?? {};

    if ((orig.age ?? null) !== (age ?? null)) nestedProfile.age = age ?? null;
    if ((orig.height ?? null) !== (height ?? null))
      nestedProfile.height = height ?? null;
    if ((orig.weight ?? null) !== (weight ?? null))
      nestedProfile.weight = weight ?? null;

    if (Object.keys(nestedProfile).length > 0) {
      payload.profile = { ...(profile.profile ?? {}), ...nestedProfile };
    }

    // --- Settings fields ---
    const nestedSettings: any = {};
    const origSettings = profile.settings ?? {};

    if ((origSettings.height_unit ?? "cm") !== heightUnit) {
      nestedSettings.height_unit = heightUnit;
    }
    if ((origSettings.weight_unit ?? "kg") !== weightUnit) {
      nestedSettings.weight_unit = weightUnit;
    }

    if (Object.keys(nestedSettings).length > 0) {
      payload.settings = { ...(profile.settings ?? {}), ...nestedSettings };
    }

    // return only if something changed
    return Object.keys(payload).length > 0 ? payload : null;
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const payload = buildPayload();
      if (!payload) {
        Alert.alert("Nothing to save", "No changes detected.");
        setLoading(false);
        return;
      }
      const saved = await updateProfile?.(payload);

      const { success, message, data } = saved;
      if (success && "email" in data) {
        toast.show({
          variant: "success",
          title: "Profile Updated",
          message: "Successfully updated the profile",
        });
        // ✅ merge latest edits into local state
        setProfile((prev: any) => ({
          ...prev,
          first_name: firstName,
          last_name: lastName,
          avatar: avatarKey,
          profile: {
            ...(prev.profile ?? {}),
            age,
            height,
            weight,
          },
          settings: {
            ...(prev.settings ?? {}),
            height_unit: heightUnit,
            weight_unit: weightUnit,
          },
        }));
      }

      onClose();
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

  // Avatar preview helper — renders svg or uri
  const AvatarPreview = () => {
    if (!avatarKey)
      return (
        <View style={styles.avatarPlaceholder}>
          <Text style={{ color: newTheme.textSecondary }}>No avatar</Text>
        </View>
      );

    if (typeof avatarKey === "string" && avatarKey.startsWith("svg:")) {
      const idx = Number(avatarKey.split(":")[1]);
      const SvgComp = BUILTIN_SVGS[idx];
      if (SvgComp) {
        // @ts-ignore
        return (
          <View style={[styles.avatarPlaceholder, { overflow: "hidden" }]}>
            {/* @ts-ignore */}
            <SvgComp width="100%" height="100%" />
          </View>
        );
      }
    }

    const maybeUri =
      typeof avatarKey === "string" && avatarKey.startsWith("uri:")
        ? avatarKey.slice(4)
        : avatarKey;

    if (typeof maybeUri === "string") {
      return <Image source={{ uri: maybeUri }} style={styles.avatarImage} />;
    }

    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={{ color: newTheme.textSecondary }}>Avatar</Text>
      </View>
    );
  };

  // handlers for numeric fields: keep them nullable numbers
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

            {/* <View style={styles.fixedFooterContainer}>
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
            </View> */}
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

    // helper row for age/height
    rowInputs: { flexDirection: "row", alignItems: "flex-start" },

    // fixedFooterContainer: {
    //   position: "absolute",
    //   left: 0,
    //   right: 0,
    //   bottom: 0,
    //   paddingBottom: Platform.OS === "ios" ? 24 : 12,
    //   // backgroundColor: "transparent",
    // } as any,
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
