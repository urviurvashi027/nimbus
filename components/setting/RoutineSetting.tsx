import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import SetReminderModal from "./SetReminderModal";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { LargeButton, ThemeKey } from "../Themed";
import { useNavigation } from "expo-router";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface SettingType {
  key: string;
  label: string;
}
const SETTING_TYPES: SettingType[] = [
  { key: "sorting", label: "Sorting" },
  { key: "startOn", label: "Week start On" },
  { key: "completed", label: "Move completed task down" },
];

export default function RoutineSettingModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [selectedSetting, setSelectedSetting] = useState<SettingType | null>(
    null
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [enableSorting, setEnableSorting] = useState<boolean>(false);

  const [moveTaskDown, setMoveTaskDown] = useState<boolean>(false);

  const [startWeekOn, setStartWeekOn] = useState<string>("");

  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  const onPanelClick = (item: any) => {
    console.log(item, "clicked");
    switch (item.key) {
      case "sorting":
        setEnableSorting((prev) => !prev);
        break;
      case "startOn":
        setShowOverlay((prev) => !prev);
        break;
      case "completed":
        setMoveTaskDown((prev) => !prev);
        break;
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  useEffect(() => {
    console.log(showOverlay, "showOverlay");
  }, [showOverlay]);

  const WeekdaySelection = () => {
    return (
      <View style={styles.container}>
        {showOverlay && (
          <View style={styles.overlay}>
            <FlatList
              data={weekdays}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dayItem,
                    selectedDays.includes(item) && styles.selectedDayItem,
                  ]}
                  onPress={() => toggleDay(item)}
                >
                  <Text style={styles.dayText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowOverlay(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={24} color={themeColors[theme].text} />
      </TouchableOpacity>
      {/* Routine Setting Types */}
      <View style={styles.container}>
        {SETTING_TYPES.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => {
              setSelectedSetting(item);
              onPanelClick(item);
            }}
          >
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.rightSection}>
              {item.key === "sorting" && (
                <Text style={styles.status}>
                  {enableSorting ? `On` : `Off`}
                </Text>
              )}

              {item.key === "completed" && (
                <Text style={styles.status}>{moveTaskDown ? `On` : `Off`}</Text>
              )}
              {/* {showOverlay && item.key === "startOn" && <WeekdaySelection />} */}
              <Ionicons
                name="chevron-forward"
                size={24}
                color="black"
                style={styles.iconRight}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* {selectedSetting && (
        <SetReminderModal
          visible={showRoutineSettingModal}
          type={selectedSetting}
          onClose={() => setSelectedSetting(null)}
        />
      )} */}
    </Modal>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      // paddingTop: 60,
      paddingHorizontal: 20,
      backgroundColor: themeColors.basic.primaryColor,
      flex: 1,
    },
    backButton: {
      marginTop: 80,
      marginLeft: 20,
      marginBottom: 10,
    },
    item: {
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      marginRight: 10,
      fontSize: 16,
    },
    iconRight: {
      marginRight: 12,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6, // or use marginRight on Text instead
    },
    status: {
      fontSize: 16,
      color: "gray",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 20,
      right: 100,
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 10,
      zIndex: 999,
      // elevation: 5,
      // shadowColor: "#000",
      // shadowOpacity: 0.2,
      // shadowRadius: 10,
    },
    dayItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    selectedDayItem: {
      backgroundColor: "#e0f7fa",
    },
    dayText: {
      fontSize: 16,
    },
    closeButton: {
      marginTop: 16,
      backgroundColor: "#4a90e2",
      padding: 10,
      borderRadius: 6,
    },
    closeButtonText: {
      textAlign: "center",
      color: "#fff",
      fontWeight: "bold",
    },
  });
