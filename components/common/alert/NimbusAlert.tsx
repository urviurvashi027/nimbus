import React, { useContext, useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import type { NimbusAlertPayload, NimbusAlertVariant } from "./useNimbusAlert";

export default function NimbusAlert({
  visible,
  payload,
  onClose,
}: {
  visible: boolean;
  payload: NimbusAlertPayload | null;
  onClose: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);

  const v = (payload?.variant ?? "info") as NimbusAlertVariant;

  const variantUI = useMemo(() => {
    const map = {
      error: { icon: "alert-circle-outline", color: newTheme.error },
      warning: { icon: "warning-outline", color: newTheme.warning },
      info: { icon: "information-circle-outline", color: newTheme.info },
      success: { icon: "checkmark-circle-outline", color: newTheme.success },
    };
    return map[v];
  }, [v, newTheme]);

  if (!payload) return null;

  const dismissible = payload.dismissible ?? true;

  const onPrimary = () => {
    const fn = payload.primary?.onPress;
    onClose(); // ✅ close first
    fn?.();
  };

  const onSecondary = () => {
    const fn = payload.secondary?.onPress;
    onClose(); // ✅ close first
    fn?.();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => (dismissible ? onClose() : undefined)}
    >
      {/* scrim */}
      <Pressable
        style={[
          s.scrim,
          { backgroundColor: newTheme.overlayStrong ?? "rgba(12,14,11,0.72)" },
        ]}
        onPress={() => (dismissible ? onClose() : undefined)}
      />

      {/* card */}
      <View style={s.center} pointerEvents="box-none">
        <View
          style={[
            s.card,
            {
              backgroundColor: newTheme.cardRaised ?? newTheme.surface,
              borderColor: newTheme.borderMuted ?? newTheme.border,
            },
          ]}
        >
          {/* subtle top accent (not loud) */}
          <View
            style={[s.accent, { backgroundColor: `${variantUI.color}40` }]}
          />

          <View style={s.content}>
            <View style={s.headerRow}>
              <View
                style={[
                  s.iconWrap,
                  { backgroundColor: `${variantUI.color}14` },
                ]}
              >
                <Ionicons
                  name={variantUI.icon as any}
                  size={18}
                  color={variantUI.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[s.title, { color: newTheme.textPrimary }]}
                  numberOfLines={2}
                >
                  {payload.title}
                </Text>

                {!!payload.message && (
                  <Text style={[s.message, { color: newTheme.textSecondary }]}>
                    {payload.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={s.actions}>
              {!!payload.secondary && (
                <Pressable
                  onPress={onSecondary}
                  style={[
                    s.secondaryBtn,
                    {
                      backgroundColor:
                        newTheme.buttonGhostBg ??
                        newTheme.surfaceMuted ??
                        newTheme.surface,
                      borderColor:
                        newTheme.buttonGhostBorder ?? newTheme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.secondaryText,
                      {
                        color: newTheme.buttonGhostText ?? newTheme.textPrimary,
                      },
                    ]}
                  >
                    {payload.secondary.label}
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={onPrimary}
                style={[s.primaryBtn, { backgroundColor: newTheme.accent }]}
              >
                <Text
                  style={[
                    s.primaryText,
                    { color: newTheme.buttonPrimaryText ?? "#10120E" },
                  ]}
                >
                  {payload.primary?.label ?? "OK"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject },
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  card: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  accent: { height: 2 },
  content: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700", // ✅ premium, not 900
    letterSpacing: -0.2,
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  actions: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: 15, fontWeight: "700" },
});
