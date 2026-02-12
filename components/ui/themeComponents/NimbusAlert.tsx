import React, { useContext, useMemo } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { tokens } from "@/theme/tokens";

type NimbusAlertVariant = "error" | "info" | "warning" | "success";

type NimbusAlertAction = {
  label: string;
  onPress?: () => void; // if not provided -> just closes
  variant?: "primary" | "secondary";
};

type Props = {
  visible: boolean;
  variant?: NimbusAlertVariant;
  title: string;
  message?: string;

  onClose: () => void; // controls visibility

  primaryAction?: NimbusAlertAction; // defaults to OK -> close
  secondaryAction?: NimbusAlertAction; // optional

  showCloseIcon?: boolean; // default false (premium feel)
};

const iconByVariant: Record<
  NimbusAlertVariant,
  keyof typeof Ionicons.glyphMap
> = {
  error: "alert-circle",
  info: "information-circle",
  warning: "warning",
  success: "checkmark-circle",
};

export default function NimbusAlert({
  visible,
  variant = "info",
  title,
  message,
  onClose,
  primaryAction,
  secondaryAction,
  showCloseIcon = false,
}: Props) {
  const { newTheme } = useContext(ThemeContext);

  const v = useMemo(() => {
    const base = {
      icon: iconByVariant[variant],
      topBar: newTheme.borderMuted ?? newTheme.border,
      iconBg: newTheme.surfaceMuted ?? newTheme.surface,
      iconColor: newTheme.textPrimary,
    };

    if (variant === "error")
      return {
        ...base,
        topBar: newTheme.error,
        iconBg: "rgba(191,97,106,0.14)",
        iconColor: newTheme.error,
      };

    if (variant === "warning")
      return {
        ...base,
        topBar: newTheme.warning,
        iconBg: "rgba(235,203,139,0.16)",
        iconColor: newTheme.warning,
      };

    if (variant === "success")
      return {
        ...base,
        topBar: newTheme.success,
        iconBg: "rgba(144,180,122,0.16)",
        iconColor: newTheme.success,
      };

    // info
    return {
      ...base,
      topBar: newTheme.info,
      iconBg: "rgba(94,129,172,0.16)",
      iconColor: newTheme.info,
    };
  }, [variant, newTheme]);

  const primary: NimbusAlertAction = primaryAction ?? {
    label: "OK",
    variant: "primary",
  };

  const pressAction = (a: NimbusAlertAction) => {
    // default behavior: close
    onClose();
    // optional custom behavior after close
    a.onPress?.();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        style={[
          s.backdrop,
          { backgroundColor: newTheme.overlayStrong ?? newTheme.overlay },
        ]}
        onPress={onClose}
      />

      {/* Card */}
      <View pointerEvents="box-none" style={s.centerWrap}>
        <View
          style={[
            s.card,
            {
              backgroundColor: newTheme.cardRaised ?? newTheme.surface,
              borderColor: newTheme.border,
            },
          ]}
        >
          {/* Accent bar */}
          <View style={[s.topBar, { backgroundColor: v.topBar }]} />

          {/* Optional close icon (avoid for errors, but supported) */}
          {showCloseIcon && (
            <Pressable onPress={onClose} hitSlop={12} style={s.closeBtn}>
              <Ionicons name="close" size={18} color={newTheme.textSecondary} />
            </Pressable>
          )}

          <View style={s.headerRow}>
            {/* Status icon (NOT a close icon) */}
            <View style={[s.statusIcon, { backgroundColor: v.iconBg }]}>
              <Ionicons name={v.icon} size={20} color={v.iconColor} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[s.title, { color: newTheme.textPrimary }]}>
                {title}
              </Text>
              {!!message && (
                <Text style={[s.message, { color: newTheme.textSecondary }]}>
                  {message}
                </Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={s.actions}>
            {secondaryAction && (
              <Pressable
                onPress={() => pressAction(secondaryAction)}
                style={[
                  s.btn,
                  s.btnSecondary,
                  {
                    backgroundColor: newTheme.buttonGhostBg ?? newTheme.surface,
                    borderColor: newTheme.buttonGhostBorder ?? newTheme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    s.btnText,
                    { color: newTheme.buttonGhostText ?? newTheme.textPrimary },
                  ]}
                >
                  {secondaryAction.label}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => pressAction(primary)}
              style={[
                s.btn,
                s.btnPrimary,
                { backgroundColor: newTheme.buttonPrimary ?? newTheme.accent },
              ]}
            >
              <Text
                style={[
                  s.btnText,
                  { color: newTheme.buttonPrimaryText ?? "#10120E" },
                ]}
              >
                {primary.label}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  card: {
    width: "100%",
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  topBar: {
    height: 3,
    width: "100%",
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  btn: {
    height: tokens?.size?.buttonHeight ?? 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {},
  btnSecondary: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "900",
  },
});
