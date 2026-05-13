import React, { useContext, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ThemeContext from "@/contexts/ThemeContext";

type ProcessingModalProps = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  message?: string;
};

export default function ProcessingModal({
  visible,
  title = "Processing",
  subtitle = "Please wait while we finish your request.",
  message = "We're sending this to the backend and preparing the next screen.",
}: ProcessingModalProps) {
  const { newTheme, spacing, svaColors, svaTypography, typography } =
    useContext(ThemeContext);

  const bodyTextStyle = svaTypography?.textStyle?.body ?? typography.body;

  const styles = useMemo(
    () => makeStyles(newTheme, spacing, svaColors, bodyTextStyle, svaTypography),
    [bodyTextStyle, newTheme, spacing, svaColors, svaTypography]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.backdrop} />

        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>
            <View style={styles.topAccent} />

            <View style={styles.spinnerWrap}>
              <View style={styles.spinnerFrame}>
                <ActivityIndicator
                  size="large"
                  color={svaColors.brand.primary ?? newTheme.accent}
                />
              </View>
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
              ) : null}
            </View>

            <View style={styles.messagePill}>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (
  t: any,
  spacing: any,
  svaColors: any,
  bodyTextStyle: any,
  svaTypography: any
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.overlayStrong ?? "rgba(12,14,11,0.62)",
    },
    center: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.xl,
    },
    card: {
      width: "100%",
      maxWidth: 360,
      borderRadius: 30,
      backgroundColor: t.cardRaised ?? t.surfaceMuted ?? t.surface,
      borderWidth: 1,
      borderColor: t.borderMuted ?? t.border,
      overflow: "hidden",
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 28,
        },
        android: { elevation: 18 },
      }),
    },
    topAccent: {
      width: 58,
      height: 4,
      borderRadius: 999,
      backgroundColor: t.borderMuted ?? t.border,
      marginBottom: spacing.md,
    },
    spinnerWrap: {
      width: "100%",
      alignItems: "center",
    },
    spinnerFrame: {
      width: 92,
      height: 92,
      borderRadius: 46,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.surface ?? t.background,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.borderMuted ?? t.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.16,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 22,
        },
        android: { elevation: 4 },
      }),
    },
    header: {
      width: "100%",
      alignItems: "center",
      paddingTop: spacing.lg,
    },
    title: {
      ...(svaTypography?.textStyle?.displayMedium ?? {}),
      fontSize: 24,
      lineHeight: 28,
      color: t.textPrimary,
      fontStyle: "normal",
      textAlign: "center",
    },
    subtitle: {
      ...bodyTextStyle,
      marginTop: 6,
      fontSize: 13,
      lineHeight: 18,
      color: t.textSecondary,
      textAlign: "center",
    },
    messagePill: {
      marginTop: spacing.lg,
      width: "100%",
      borderRadius: 20,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: t.surfaceMuted ?? t.background,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.borderMuted ?? t.border,
      alignItems: "center",
    },
    message: {
      color: t.textPrimary,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
      textAlign: "center",
    },
  });
