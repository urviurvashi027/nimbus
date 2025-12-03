import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import HorizontalListCardScroll from "@/components/common/HorizontalListCardScroll";
// import HorizontalBannerCardScroll from "@/components/tools/common/HorizontalBannerCardScroll";

import { router } from "expo-router";
import { banners } from "@/constant/data/banner";
import HorizontalBanner from "@/components/common/HorizontalBanner";
import { getSoundscapeList } from "@/services/toolService";

const SleepModal = ({ visible, onClose }: any) => {
  const [libraryTracks, setLibraryTracks] = useState<any>([]);
  const onModalClose = () => {
    console.log("modal cloe clicked");
    onClose();
  };

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const handleBannerPress = (id: string) => {
    console.log("Banner pressed:", id);
  };

  const onClickOfAll = () => {
    router.push("/(auth)/selfCareScreen/SoundscapeScreen");
  };

  const getSoundscapeListData = async () => {
    try {
      const result = await getSoundscapeList();
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedArticles = result.map((tracks: any) => {
          // Assign a random tag from the 'tags' arra

          // Return a new object with the original properties plus the new ones
          return {
            ...tracks, // Spread operator to keep original properties
            uri: tracks.image,
          };
        });

        // console.log(processedArticles, "processedArticles sleep");
        // setShowLibrary(true);
        setLibraryTracks(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getSoundscapeListData();
  }, []);

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={visible}
    >
      <View style={styles.modalContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onModalClose}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.header}>Better Sleep</Text>
            <Text style={styles.subHeader}>Good Sleep is your super power</Text>

            {/* Start Tracking Button */}
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>START</Text>
              <Text style={styles.startButtonSubText}>Tracking</Text>
            </TouchableOpacity>

            {/* Sleep Report */}
            <View style={styles.reportPanel}>
              <Text style={styles.reportTitle}>SLEEP REPORT</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.daysRow}
              >
                {["30", "31", "1", "2", "3", "4", "5"].map((day, index) => (
                  <TouchableOpacity key={index} style={styles.dayCircle}>
                    <Text style={styles.dayText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.demoButton}>
                <Text style={styles.demoButtonText}>View Demo Report</Text>
              </TouchableOpacity>
            </View>

            {/* Sleep Aids */}
            <View style={styles.sleepAidSection}>
              <Text style={styles.reportTitle}>SLEEP AIDSs</Text>
            </View>

            <HorizontalListCardScroll
              title="Soundscape"
              description="The sound of nature gives you better sleep."
              backgroundColor="#fbfcb3"
              itemList={libraryTracks}
              onClickOfAll={onClickOfAll}
            />

            <HorizontalBanner data={banners} onPress={handleBannerPress} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      paddingVertical: 46,
      backgroundColor: theme.background,
    },
    subHeader: {
      fontSize: 14,
      color: theme.textSecondary,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    header: {
      paddingHorizontal: 15,
      fontSize: 26,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    backButton: {
      position: "absolute",
      top: 90,
      left: 20,
      zIndex: 999, // <--- try adding this
    },
    modalContent: {
      marginTop: 50,
    },
    scrollView: {
      marginTop: 30,
      paddingHorizontal: 16,
    },
    startButton: {
      alignSelf: "center",
      marginVertical: 30,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
    startButtonText: {
      color: theme.backgroundColor,
      fontSize: 24,
      fontWeight: "bold",
    },
    startButtonSubText: {
      color: theme.surface,
      fontSize: 14,
      marginTop: 5,
    },
    reportPanel: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      marginTop: 20,
    },
    reportTitle: {
      color: theme.textSecondary,
      fontSize: 12,
      marginBottom: 10,
    },
    daysRow: {
      flexDirection: "row",
      marginBottom: 20,
    },
    dayCircle: {
      width: 45,
      height: 45,
      borderRadius: 25,
      backgroundColor: theme.accentPressed,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    dayText: {
      color: theme.background,
      fontSize: 16,
    },
    demoButton: {
      backgroundColor: "#7A4DF3",
      borderRadius: 20,
      paddingVertical: 15,
      alignItems: "center",
    },
    demoButtonText: {
      color: "white",
      fontSize: 16,
    },
    sleepAidSection: {
      marginTop: 30,
    },
  });

export default SleepModal;
