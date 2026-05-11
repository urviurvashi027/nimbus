import React, { useContext, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemeContext from "@/contexts/ThemeContext";
import { SVATypography } from "@/theme/typography";

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
  supportingContent?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function SvaRecoveryLayout({
  title,
  subtitle,
  onBack,
  supportingContent,
  children,
  footer,
}: Props) {
  const { svaColors } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.screen, { backgroundColor: svaColors.bg.base }]}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={s.flex}
          contentContainerStyle={[
            s.scrollContent,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              s.outerCard,
              { backgroundColor: svaColors.surface.base },
            ]}
          >
            <View
              style={[
                s.topBar,
                {
                  backgroundColor: svaColors.bg.base,
                  borderBottomColor: svaColors.border.muted,
                },
              ]}
            >
              <Text
                style={[
                  s.brandWordmark,
                  { color: svaColors.brand.primary },
                ]}
              >
                SVA
              </Text>
            </View>

            <View style={s.body}>
              <View style={s.backRow}>
                <Pressable
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  hitSlop={12}
                  style={({ pressed }) => [
                    s.backButton,
                    {
                      backgroundColor: svaColors.surface.raised,
                      borderColor: svaColors.border.default,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={svaColors.text.primary}
                  />
                </Pressable>
              </View>

              <View style={s.headerCopy}>
                <Text
                  style={[
                    s.title,
                    {
                      color: svaColors.text.primary,
                      textShadowColor: "rgba(0,0,0,0.2)",
                    },
                  ]}
                >
                  {title}
                </Text>

                <Text
                  style={[
                    s.subtitle,
                    { color: svaColors.text.secondary },
                  ]}
                >
                  {subtitle}
                </Text>

                {supportingContent ? (
                  <View style={s.supporting}>{supportingContent}</View>
                ) : null}
              </View>

              <View style={s.children}>{children}</View>

              {footer ? <View style={s.footer}>{footer}</View> : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  outerCard: {
    flex: 1,
    overflow: "hidden",
  },
  topBar: {
    height: 66,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandWordmark: {
    ...SVATypography.textStyle.button,
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 4.8,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 20,
  },
  backRow: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerCopy: {
    width: "100%",
  },
  title: {
    fontFamily: SVATypography.fontFamily.display,
    fontSize: 31,
    fontWeight: SVATypography.fontWeight.medium,
    lineHeight: 34,
    letterSpacing: -0.35,
  },
  subtitle: {
    ...SVATypography.textStyle.subtitle,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  supporting: {
    marginTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  children: {
    marginTop: 0,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 28,
    alignItems: "center",
  },
});
