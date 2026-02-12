import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

// Keep your existing Toast.show({ type, text1, text2 }) calls.
// This config makes them look Nimbus.
export function NimbusToastHost() {
  const { newTheme } = useContext(ThemeContext);

  const toastConfig = useMemo(() => {
    const make =
      (variant: "success" | "error" | "info" | "warning") =>
      (props: BaseToastProps) => {
        const colors = getVariantColors(newTheme, variant);

        return (
          <View style={styles.wrap}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: newTheme.cardRaised ?? newTheme.surface,
                  borderColor: newTheme.borderMuted ?? newTheme.border,
                },
              ]}
            >
              {/* Accent rail */}
              <View style={[styles.rail, { backgroundColor: colors.rail }]} />

              {/* Icon */}
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: colors.iconBg,
                    borderColor: newTheme.borderMuted ?? newTheme.border,
                  },
                ]}
              >
                <Ionicons
                  name={colors.icon as any}
                  size={18}
                  color={colors.iconFg}
                />
              </View>

              {/* Text */}
              <View style={styles.textCol}>
                {!!props.text1 && (
                  <Text
                    numberOfLines={1}
                    style={[styles.title, { color: newTheme.textPrimary }]}
                  >
                    {props.text1}
                  </Text>
                )}

                {!!props.text2 && (
                  <Text
                    numberOfLines={2}
                    style={[styles.subtitle, { color: newTheme.textSecondary }]}
                  >
                    {props.text2}
                  </Text>
                )}
              </View>
            </View>
          </View>
        );
      };

    return {
      success: make("success"),
      error: make("error"),
      info: make("info"),
      warning: make("warning"),
    };
  }, [newTheme]);

  return (
    <Toast
      config={toastConfig}
      position="bottom"
      bottomOffset={34}
      visibilityTime={2200}
      autoHide
    />
  );
}

function getVariantColors(
  theme: any,
  v: "success" | "error" | "info" | "warning"
) {
  // Uses your theme palette, but keeps it premium/subtle (no neon blocks)
  const base = {
    iconBg: theme.surfaceMuted ?? theme.surface,
    iconFg: theme.textPrimary,
    rail: theme.accent,
    icon: "checkmark-circle-outline",
  };

  if (v === "success")
    return {
      ...base,
      rail: theme.success ?? theme.accent,
      icon: "checkmark-circle-outline",
      iconFg: theme.success ?? theme.accent,
    };

  if (v === "error")
    return {
      ...base,
      rail: theme.error,
      icon: "alert-circle-outline",
      iconFg: theme.error,
    };

  if (v === "warning")
    return {
      ...base,
      rail: theme.warning,
      icon: "warning-outline",
      iconFg: theme.warning,
    };

  return {
    ...base,
    rail: theme.info,
    icon: "information-circle-outline",
    iconFg: theme.info,
  };
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    minHeight: 60,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 14,
    overflow: "hidden",
  },
  rail: {
    width: 4,
    height: "100%",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginLeft: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  textCol: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
