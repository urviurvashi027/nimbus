import React, { useContext, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/contexts/ThemeContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import CreateActionModal from "./modal/CreateActionModal";

const { width } = Dimensions.get("window");

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { newTheme, spacing } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const styles = styling(newTheme, spacing);

  const onPlusPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
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
              <TouchableOpacity
                key={route.key}
                style={styles.plusButton}
                onPress={onPlusPress}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={32} color={newTheme.background} />
              </TouchableOpacity>
            );
          }

          // Icons mapping based on screenshot 1.png
          let iconName: any = "grid-outline";
          if (route.name === "index")
            iconName = isFocused ? "grid" : "grid-outline";
          else if (route.name === "self-care")
            iconName = isFocused ? "stats-chart" : "stats-chart-outline";
          else if (route.name === "tools")
            iconName = isFocused ? "clipboard" : "clipboard-outline";
          else if (route.name === "setting")
            iconName = isFocused ? "person" : "person-outline";

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? newTheme.accent : newTheme.textSecondary}
                style={{ opacity: isFocused ? 1 : 0.6 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <CreateActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styling = (theme: any, spacing: any) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: spacing.lg,
      left: spacing.lg,
      right: spacing.lg,
      alignItems: "center",
    },
    tabBar: {
      flexDirection: "row",
      width: width - spacing.lg * 2,
      height: 80,
      backgroundColor: "#1C1E1A",
      borderRadius: 40,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.05)",
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: spacing.sm,
      // Premium shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },
    tabItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    plusButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.accent || "#A3BE8C",
      justifyContent: "center",
      alignItems: "center",
      // Lifted effect
      marginTop: -10,
      shadowColor: theme.accent || "#A3BE8C",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 10,
      borderWidth: 4,
      borderColor: "#1C1E1A",
    },
  });

export default CustomTabBar;
