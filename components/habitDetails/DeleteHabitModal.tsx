import React, { useContext, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { deleteHabit } from "@/services/habitService";
import ThemeContext from "@/context/ThemeContext"; // adjust to your ThemeContext hook/shape
import { useNimbusToast } from "../common/toast/useNimbusToast";
import { HabitItem } from "@/types/habitTypes";

type Props = {
  visible: boolean;
  habit: HabitItem | null;
  onClose: () => void;
  onDeleted?: (habitId: string) => void; // e.g. navigate back + refresh list
};

export function DeleteHabitModal({
  visible,
  habit,
  onClose,
  onDeleted,
}: Props) {
  const { newTheme } = useContext(ThemeContext); // adapt to your actual ThemeContext
  const toast = useNimbusToast();

  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const needsHardConfirm = useMemo(() => {
    const streak = habit?.current_streak ?? 0;
    const done = habit?.longest_streak ?? 0;
    return streak >= 3 || done >= 10; // tune this threshold for Nimbus
  }, [habit]);

  const canDelete = useMemo(() => {
    if (!habit) return false;
    if (!needsHardConfirm) return true;
    return confirmText.trim().toUpperCase() === "DELETE";
  }, [habit, needsHardConfirm, confirmText]);

  const styles = styling(newTheme);

  async function handleDelete() {
    if (!habit || loading) return;

    try {
      setLoading(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        ).catch(() => {});
      }

      await deleteHabit(Number(habit.id));

      toast.show({
        variant: "success",
        title: "Habit deleted",
        message: `"${habit.name}" has been removed.`,
      });

      onClose();
      onDeleted?.(habit.id);
    } catch (e: any) {
      toast.show({
        variant: "error",
        title: "Could not delete habit",
        message: e?.message ?? "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      setConfirmText("");
    }
  }

  if (!habit) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>

      {/* Sheet */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View
          style={[
            styles.card,
            {
              backgroundColor: newTheme.card,
              borderColor: "rgba(255,255,255,0.08)",
              shadowColor: "#000",
            },
          ]}
        >
          {/* Premium top glow border */}
          <View
            style={[
              styles.topGlow,
              { backgroundColor: "rgba(255, 77, 79, 0.12)" },
            ]}
          />

          <Text style={[styles.title, { color: newTheme.textPrimary }]}>
            Delete habit?
          </Text>
          <Text style={[styles.subtitle, { color: newTheme.textSecondary }]}>
            This will remove{" "}
            <Text style={{ color: newTheme.textPrimary, fontWeight: "700" }}>
              {habit.name}
            </Text>
            .{"\n"}Your history may be lost if your backend does a hard delete.
          </Text>

          {needsHardConfirm ? (
            <View
              style={[
                styles.confirmBox,
                { borderColor: "rgba(255,255,255,0.10)" },
              ]}
            >
              <Text
                style={[styles.confirmLabel, { color: newTheme.textSecondary }]}
              >
                Type{" "}
                <Text
                  style={{ color: newTheme.textPrimary, fontWeight: "800" }}
                >
                  DELETE
                </Text>{" "}
                to confirm
              </Text>
              <TextInput
                value={confirmText}
                onChangeText={setConfirmText}
                placeholder="DELETE"
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!loading}
                style={[
                  styles.input,
                  {
                    color: newTheme.textPrimary,
                    borderColor: "rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  },
                ]}
              />
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              disabled={loading}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.10)",
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={[styles.btnText, { color: newTheme.textPrimary }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              disabled={!canDelete || loading}
              style={({ pressed }) => [
                styles.btn,
                styles.dangerBtn,
                {
                  backgroundColor:
                    !canDelete || loading
                      ? "rgba(255,77,79,0.22)"
                      : "rgba(255,77,79,0.95)",
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={[
                    styles.btnText,
                    { color: "#0B0B0C", fontWeight: "900" },
                  ]}
                >
                  Delete
                </Text>
              )}
            </Pressable>
          </View>

          <Text style={[styles.footnote, { color: "rgba(255,255,255,0.45)" }]}>
            Tip: If you want “premium safety”, offer Archive instead of Delete.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    centerWrap: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    card: {
      borderWidth: 1,
      borderRadius: 22,
      padding: 18,
      overflow: "hidden",
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    topGlow: {
      position: "absolute",
      top: -40,
      left: -40,
      right: -40,
      height: 80,
      borderRadius: 999,
    },
    title: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 0.2,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 13.5,
      lineHeight: 19,
    },
    confirmBox: {
      marginTop: 14,
      borderWidth: 1,
      borderRadius: 16,
      padding: 12,
    },
    confirmLabel: {
      fontSize: 12.5,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: 1.2,
    },
    actionsRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    btn: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    dangerBtn: {
      borderWidth: 0,
    },
    btnText: {
      fontSize: 14,
      fontWeight: "800",
    },
    footnote: {
      marginTop: 12,
      fontSize: 11.5,
      textAlign: "center",
    },
  });
