import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

interface SegmentedTabsProps {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeIndex,
  onChange,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(index)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SegmentedTabs;

const styling = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.divider,
      marginHorizontal: 16,
      marginTop: 12,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface,
    },
    activeTab: {
      backgroundColor: theme.accent,
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    activeTabText: {
      color: theme.background,
    },
  });
