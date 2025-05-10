import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView, Switch } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { Section } from "@/constant/data/settingsList";
import * as SecureStore from "expo-secure-store";
import { StoreKey } from "@/constant/Constant";
import { themeColors } from "@/constant/Colors";
import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import NotificationTypeModal from "@/components/setting/NotificationTypeSetting";
import RoutineSettingModal from "@/components/setting/RoutineSetting";
import ReportBugModal from "@/components/setting/ReportBug";
import FeedbackModal from "@/components/setting/Feeback";
import PrivacyPolicyModal from "@/components/setting/PrivacyPoilcy";
import TermsModal from "@/components/setting/TermsAndService";
import FAQModal from "@/components/setting/HelpCenter";

type ThemeKey = "basic" | "light" | "dark";

type FormState = {
  darkMode: boolean;
  wifi: boolean;
  showCollaborators: boolean;
};

export default function profile() {
  // modal states
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showRoutineSettingModal, setShowRoutineSettingModal] = useState(false);
  const [showReportBugModal, setShowReportBugModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [showPrivatePolicyModal, setShowPrivatePrivacyModal] = useState(false);
  const [showTermsAndServiceModal, setShowTermsAndServiceModal] =
    useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  // others
  const [user, setUser] = useState<any>();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const [formState, setFormState] = useState<FormState>({
    darkMode: true,
    wifi: false,
    showCollaborators: false,
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const userInfo = (await SecureStore.getItemAsync(StoreKey.USER_KEY)) ?? "";
    const parsedValue = JSON.parse(userInfo);
    setUser(parsedValue);
  };

  const { onLogout } = useAuth();

  const onLogoutClick = async () => {
    if (onLogout) {
      const result = await onLogout();
    } else {
    }
  };

  const onToggle = (id: any, value: any) => {
    setFormState({ ...formState, [id]: value });
    value ? toggleTheme("dark") : toggleTheme("light");
  };

  const onSettingPanelClick = (type: string, label: string) => {
    console.log("setting panel click data", type, label);
    if (type === "modal") {
      handleModalVisibilty(label);
    }
  };

  const handleModalVisibilty = (label: string) => {
    switch (label) {
      case "Notification":
        setShowNotificationModal(true);
        break;
      case "Routine Setting":
        setShowRoutineSettingModal(true);
        break;
      case "Report Bug":
        setShowReportBugModal(true);
        break;
      case "Feedback":
        setShowFeedbackModal(true);
        break;
      case "Privacy Policy":
        setShowPrivatePrivacyModal(true);
        break;
      case "Terms and Services":
        setShowTermsAndServiceModal(true);
        break;

      case "Help Center":
        setShowFAQModal(true);
        break;
    }
  };
  const handleOnSaveNotification = () => {};

  return (
    // <ScreenView>
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.gestureContainer}>
        <ScrollView>
          <TouchableOpacity style={styles.profile}>
            <View style={styles.profileAvatarWrapper}>
              <Image
                alt="profile image"
                style={styles.profileAvatar}
                source={require("../../../assets/images/loginLatest.png")}
              />

              <View style={styles.profileActions}>
                <Ionicons name="pencil" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.profileName}>{user?.userName}</Text>

            <Text style={styles.profileAddress}>
              Tower B, Assetz 63 degree East
            </Text>
          </View>
          {Section.map(({ header, items }) => (
            <View style={styles.section} key={header}>
              <Text style={styles.sectionHeader}>{header}</Text>

              {items.map(
                ({
                  id,
                  label,
                  type,
                  icon,
                  color,
                }: {
                  id: keyof FormState;
                  label: string;
                  type: string;
                  icon: any;
                  color: string;
                }) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => onSettingPanelClick(type, label)}
                  >
                    <View style={styles.row}>
                      <View
                        style={[styles.rowIcon, { backgroundColor: color }]}
                      >
                        {/* icon */}
                        <Ionicons name={icon} size={18} color="#333" />
                      </View>
                      <Text style={styles.rowLabel}>{label}</Text>

                      <View style={{ flex: 1 }} />

                      {type === "toogle" && (
                        <Switch
                          value={formState[id]}
                          thumbColor={themeColors.basic.primaryColor}
                          trackColor={{
                            true: `${themeColors.basic.tertiaryColor}`,
                          }}
                          // onValueChange={(value) =>
                          //   setFormState({ ...formState, [id]: value })
                          // }
                          onValueChange={(value) => onToggle(id, value)}
                          // onValueChange={onToggle}
                        />
                      )}

                      {type === "modal" && (
                        <Ionicons
                          name="chevron-forward"
                          color="#0c0c0c"
                          size={22}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.logout} onPress={onLogoutClick}>
            <Text>Logout</Text>
          </TouchableOpacity>
          {/* Notification Setting Modal */}
          <NotificationTypeModal
            visible={showNotificationModal}
            onClose={() => setShowNotificationModal(false)}
            // onSaveData={handleOnSaveNotification}
          />
          {/* Routine Setting Modal */}
          <RoutineSettingModal
            visible={showRoutineSettingModal}
            onClose={() => setShowRoutineSettingModal(false)}
          />
          <ReportBugModal
            visible={showReportBugModal}
            onClose={() => setShowReportBugModal(false)}
          />
          <FeedbackModal
            visible={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
          />
          <PrivacyPolicyModal
            visible={showPrivatePolicyModal}
            onClose={() => setShowPrivatePrivacyModal(false)}
          />
          <TermsModal
            visible={showTermsAndServiceModal}
            onClose={() => setShowTermsAndServiceModal(false)}
          />
          <FAQModal
            visible={showFAQModal}
            onClose={() => setShowFAQModal(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
    // {/* </ScreenView> */}
  );
}
const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    // const styles = StyleSheet.create({
    gestureContainer: {
      flex: 1,
      backgroundColor: themeColors[theme].background,
    },
    container: {
      paddingVertical: 24,
    },
    profile: {
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    profileName: {
      marginTop: 20,
      fontSize: 19,
      fontWeight: 600,
      color: "#414d63",
      textAlign: "center",
    },
    profileAddress: {
      color: "#989898",
      fontSize: 15,
      marginTop: 5,
      textAlign: "center",
    },
    profileAvatarWrapper: {
      position: "relative",
    },
    profileAvatar: {
      width: 72,
      height: 72,
      borderRadius: 9999,
    },
    profileActions: {
      width: 28,
      height: 28,
      borderRadius: 9999,
      backgroundColor: "#007bff",
      position: "absolute",
      right: -4,
      bottom: -10,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      paddingHorizontal: 24,
    },
    sectionHeader: {
      paddingVertical: 12,
      fontSize: 12,
      fontWeight: 600,
      color: "#9e9e9e",
      textTransform: "uppercase",
      letterSpacing: 1.1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: 50,
      backgroundColor: themeColors[theme].divider,
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12,
    },
    rowLabel: {
      fontSize: 12,
      color: themeColors[theme].text,
    },
    rowIcon: {
      width: 32,
      height: 32,
      borderRadius: 999,
      marginRight: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    logout: {
      // paddingLeft: 24,
      paddingHorizontal: 24,
      // paddingHorizontal: 12,
      // marginRight: 12,
    },
  });
