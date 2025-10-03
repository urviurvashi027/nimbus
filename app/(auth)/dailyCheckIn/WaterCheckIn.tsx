import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import { TrackType, forYouTracks } from "@/constant/data/soundtrack";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import WaterTracker from "@/components/DailyCheckIn/WaterIntakeLog";
import NotificationSettingRow from "@/components/DailyCheckIn/NotificationSettingRow";
import WeeklySummaryChart from "@/components/DailyCheckIn/WaterWeekySummary";

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

const options = [
  { key: "15m", label: "Every 15 minutes" },
  { key: "30m", label: "Every 30 minutes" },
  { key: "45m", label: "Every 45 minutes" },
  { key: "60m", label: "Every 1 hour" },
];

const WaterCheckIn = () => {
  const [enabled, setEnabled] = useState(true);
  const [value, setValue] = useState<string | null>("45m");

  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const mockData = [
    { day: "Mon", percent: 40 },
    { day: "Tue", percent: 50 },
    { day: "Wed", percent: 80 },
    { day: "Thu", percent: 65 },
    { day: "Fri", percent: 90 },
    { day: "Sat", percent: 70 },
    { day: "Sun", percent: 30 },
  ];

  // Define your color palette. Add as many colors as you like.
  const colorPalette = [
    { bgColor: "#fadbd8", color: "#f19c94" },
    { bgColor: "#d5f5e3", color: "#acebc8" },
    { bgColor: "#f8e187", color: "#fbedb7" },
    { bgColor: "#d6eaf8", color: "#95c9ed" },
    { bgColor: "#E8DAEF", color: "#c7a5d8" },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleChange = (newValue: number) => {
    console.log(newValue, "newValue");
  };

  return (
    <ScreenView style={{ paddingTop: Platform.OS === "ios" ? 40 : 20 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>

        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>WaterCheckIn</Text>
            <Text style={styles.subtitle}>
              Immense Yourself in true nature.
            </Text>
          </View>

          <View style={styles.section}>
            <WaterTracker
              value={4}
              total={10}
              onChange={handleChange}
              contentPadding={0}
            />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <NotificationSettingRow
              label="Notification"
              subtitle="Remind me to drink water"
              helpText=""
              enabled={enabled}
              onToggle={(v) => setEnabled(v)}
              options={options}
              valueKey={value}
              onOptionSelect={(item) => setValue(item.key)}
            />
          </View>

          <View>
            <WeeklySummaryChart data={mockData} />
          </View>

          {/* "For You" Section */}
        </SafeAreaView>
      </View>
    </ScreenView>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    itemTitle: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: "bold",
    },
    header: {
      paddingTop: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      color: theme.textPrimary,
      fontWeight: "bold",
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 4,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 10,
      color: theme.textSecondary,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      color: theme.textSecondary,
      fontWeight: "bold",
      // marginLeft: 10,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 0,
    },
  });

export default WaterCheckIn;
