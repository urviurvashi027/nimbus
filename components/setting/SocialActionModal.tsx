// SocialActionModal.tsx (fixed)
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Linking,
  Alert,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  appDeepLink?: string;
  webUrl: string;
};

export default function SocialActionModal({
  visible,
  onClose,
  title = "Open Profile",
  appDeepLink,
  webUrl,
}: Props) {
  const { newTheme } = React.useContext(ThemeContext);
  const styles = makeStyles(newTheme);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert("", msg);
  };

  const openInApp = async () => {
    try {
      if (appDeepLink) {
        const can = await Linking.canOpenURL(appDeepLink);
        if (can) {
          await Linking.openURL(appDeepLink);
          onClose();
          return;
        }
      }
      await Linking.openURL(webUrl);
      onClose();
    } catch (err) {
      console.warn("openInApp error", err);
      showToast("Unable to open link");
    }
  };

  const openInBrowser = async () => {
    try {
      await Linking.openURL(webUrl);
      onClose();
    } catch (err) {
      console.warn("openInBrowser error", err);
      showToast("Unable to open link");
    }
  };

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync(webUrl);
      showToast("Link copied to clipboard");
      onClose();
    } catch (err) {
      console.warn("copyLink error", err);
      showToast("Unable to copy link");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Outer container to hold backdrop + sheet */}
      <View style={{ flex: 1 }}>
        {/* Touchable background must have a single child — keep it as a single empty View */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Bottom sheet / action panel (sibling of the backdrop view) */}
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <TouchableOpacity
            style={styles.row}
            onPress={openInApp}
            accessibilityRole="button"
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name="open-outline"
                size={20}
                color={newTheme.textPrimary}
              />
            </View>
            <Text style={styles.rowText}>Open in app</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={openInBrowser}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={newTheme.textPrimary}
              />
            </View>
            <Text style={styles.rowText}>Open in browser</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={copyLink}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="copy-outline"
                size={20}
                color={newTheme.textPrimary}
              />
            </View>
            <Text style={styles.rowText}>Copy link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.cancelRow]}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    sheet: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
    },
    header: {
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: theme.surface,
      paddingHorizontal: 12,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    rowText: {
      color: theme.textPrimary,
      fontSize: 15,
    },
    cancelRow: {
      backgroundColor: "transparent",
      justifyContent: "center",
    },
    cancelText: {
      color: theme.textSecondary,
      fontSize: 15,
      textAlign: "center",
      width: "100%",
    },
  });
