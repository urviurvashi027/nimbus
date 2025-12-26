import React, { ReactNode, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { tokens } from "@/theme/tokens";

export function NimbusAuthLayout({
  step,
  total,
  onBack,
  children,
}: {
  step: number;
  total: number;
  onBack?: () => void;
  children: ReactNode;
}) {
  const { newTheme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: newTheme.background }]}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            s.content,
            { paddingHorizontal: tokens.layout.screenX },
          ]}
        >
          {/* Top row */}
          <View style={s.topRow} pointerEvents="box-none">
            <Pressable
              onPress={onBack}
              disabled={!onBack}
              style={[s.backBtn, !onBack && { opacity: 0 }]}
              hitSlop={12}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={newTheme.textPrimary}
              />
            </Pressable>

            <Text style={[s.stepText, { color: newTheme.textSecondary }]}>
              {step} / {total}
            </Text>
          </View>

          {/* Progress */}
          <View
            style={[
              s.progressTrack,
              {
                backgroundColor: newTheme.surface,
                borderColor: newTheme.border,
              },
            ]}
          >
            <View
              style={[
                s.progressFill,
                {
                  width: `${(step / total) * 100}%`,
                  backgroundColor: newTheme.accent,
                },
              ]}
            />
          </View>

          {/* Body */}
          <View style={s.body}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  content: {
    paddingTop: 22,
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressTrack: {
    height: tokens.size.progressHeight,
    borderRadius: 999,
    marginTop: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  body: {
    marginTop: 26,
  },
});
