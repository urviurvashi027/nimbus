import React, { useContext, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/contexts/ThemeContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CreateActionModal from "./modal/CreateActionModal";
import type { ColorSet, Spacing, SvaTokens } from "@/theme/types";

type IconName = keyof typeof Ionicons.glyphMap;

type TabMeta = {
  label: string;
  icon: {
    active: IconName;
    inactive: IconName;
  };
};

const TAB_META: Record<string, TabMeta> = {
  index: {
    label: "Home",
    icon: { active: "home", inactive: "home-outline" },
  },
  "self-care": {
    label: "Selfcare",
    icon: { active: "leaf", inactive: "leaf-outline" },
  },
  tools: {
    label: "Tools",
    icon: { active: "construct", inactive: "construct-outline" },
  },
  settings: {
    label: "Setting",
    icon: { active: "settings", inactive: "settings-outline" },
  },
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { newTheme, spacing, tokens } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const styles = styling(newTheme, spacing, tokens, insets.bottom);

  const onPlusPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <View style={styles.tabBackdrop}>
          <BlurView
            intensity={18}
            tint="dark"
            pointerEvents="none"
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.03)", "rgba(0,0,0,0.18)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            pointerEvents="none"
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <View style={styles.tabContent}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // We render the plus button for the placeholder route
            if (route.name === "plus-button-placeholder") {
              return (
                <View key={route.key} style={styles.plusSlot}>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={onPlusPress}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Create action"
                  >
                    <LinearGradient
                      colors={[newTheme.accent, newTheme.accentPressed]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <Ionicons
                      name="add"
                      size={34}
                      color={newTheme.background}
                    />
                  </TouchableOpacity>
                </View>
              );
            }

            const meta =
              TAB_META[route.name] ?? {
                label: route.name,
                icon: { active: "ellipse", inactive: "ellipse-outline" },
              };
            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : meta.label;
            const iconName = isFocused ? meta.icon.active : meta.icon.inactive;
            const iconColor = isFocused
              ? "rgba(236,239,244,0.92)"
              : "rgba(161,166,155,0.55)";

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={
                  options.tabBarAccessibilityLabel ?? String(label)
                }
                onPress={onPress}
                activeOpacity={0.86}
                style={styles.tabItem}
              >
                <Ionicons
                  name={iconName}
                  size={isFocused ? 25 : 23}
                  color={iconColor}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <CreateActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styling = (
  theme: ColorSet,
  spacing: Spacing,
  tokens: SvaTokens,
  bottomInset: number
) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: bottomInset + spacing.xs,
      left: tokens.layout.screenX,
      right: tokens.layout.screenX,
      alignItems: "center",
    },
    tabBar: {
      width: "100%",
      height: 78,
      borderRadius: 39,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.06)",
      backgroundColor: "transparent",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.34,
      shadowRadius: 14,
      elevation: 10,
      overflow: "visible",
      justifyContent: "center",
    },
    tabBackdrop: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 39,
      overflow: "hidden",
      backgroundColor: theme.surface,
    },
    tabContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
    },
    tabItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      borderRadius: 22,
      paddingVertical: 8,
      paddingHorizontal: 6,
    },
    plusSlot: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    plusButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginTop: -22,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 9,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      overflow: "hidden",
    },
  });

export default CustomTabBar;
