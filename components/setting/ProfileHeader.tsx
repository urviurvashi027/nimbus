// components/setting/ProfileHeader.tsx
import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { SvgUri } from "react-native-svg";

type Props = {
  username: string;
  emailOrTagline?: string;
  planLabel?: string;
  avatarUrl?: string | null; // ✅ backend string URL
  onPressEditProfile?: () => void;
  onPressManagePlan?: () => void;
};

function isSvgUrl(url: string) {
  // handles: ...avatar.svg?X-Amz-...
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".svg") || clean.includes(".svg/");
}

const ProfileHeader: React.FC<Props> = ({
  username,
  emailOrTagline = "Grow a calmer, healthier you 🌿",
  planLabel = "Nimbus Free",
  avatarUrl,
  onPressEditProfile,
  onPressManagePlan,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const initials = useMemo(() => {
    return (
      username
        ?.trim()
        .split(/\s+/)
        .map((p) => p[0]?.toUpperCase())
        .slice(0, 2)
        .join("") || "NM"
    );
  }, [username]);

  const [imgFailed, setImgFailed] = useState(false);
  const [svgFailed, setSvgFailed] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const shouldShowAvatar = !!avatarUrl && !imgFailed && !svgFailed;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Avatar */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressEditProfile}
          style={styles.avatarOuter}
        >
          <View style={styles.avatarRing} />
          <View style={styles.avatarInner}>
            {shouldShowAvatar ? (
              isSvgUrl(avatarUrl!) ? (
                <SvgUri
                  uri={avatarUrl!}
                  width="100%"
                  height="100%"
                  // Some versions support onError; if TS complains, remove it.
                  // @ts-ignore
                  onError={() => setSvgFailed(true)}
                />
              ) : (
                <>
                  {imgLoading ? <ActivityIndicator /> : null}
                  <Image
                    source={{ uri: avatarUrl! }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                    onLoadStart={() => setImgLoading(true)}
                    onLoadEnd={() => setImgLoading(false)}
                    onError={() => {
                      setImgLoading(false);
                      setImgFailed(true);
                    }}
                  />
                </>
              )
            ) : (
              <Text style={styles.initials}>{initials}</Text>
            )}
          </View>

          {onPressEditProfile ? (
            <View style={styles.editDot}>
              <Ionicons name="pencil" size={12} color={newTheme.background} />
            </View>
          ) : null}
        </TouchableOpacity>

        {/* Text block */}
        <View style={styles.textCol}>
          <Text numberOfLines={1} style={styles.username}>
            {username}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {emailOrTagline}
          </Text>

          <View style={styles.chipRow}>
            <View style={styles.planChip}>
              <Ionicons
                name="sparkles"
                size={13}
                color={newTheme.background}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.planChipText}>{planLabel}</Text>
            </View>

            {onPressManagePlan ? (
              <TouchableOpacity onPress={onPressManagePlan} hitSlop={6}>
                <Text style={styles.linkText}>Manage</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styling = (t: any) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 12,
      paddingBottom: 4,
      paddingHorizontal: 16,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 24,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.borderMuted ?? "rgba(255,255,255,0.06)",
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },
    avatarOuter: {
      marginRight: 14,
      width: 64,
      height: 64,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarRing: {
      position: "absolute",
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: t.accent,
      opacity: 0.9,
    },
    avatarInner: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: t.background,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    initials: {
      fontSize: 20,
      fontWeight: "700",
      color: t.textPrimary,
    },
    editDot: {
      position: "absolute",
      bottom: 4,
      right: 4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: t.accent,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    textCol: {
      flex: 1,
      justifyContent: "center",
    },
    username: {
      fontSize: 20,
      fontWeight: "700",
      color: t.textPrimary,
    },
    subtitle: {
      marginTop: 2,
      fontSize: 13,
      color: t.textSecondary,
    },
    chipRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    planChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: t.accent,
      marginRight: 10,
    },
    planChipText: {
      fontSize: 11,
      fontWeight: "600",
      color: t.background,
    },
    linkText: {
      fontSize: 12,
      fontWeight: "600",
      color: t.accent,
    },
  });
