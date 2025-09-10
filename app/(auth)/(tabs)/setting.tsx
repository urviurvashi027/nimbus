import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView, Switch } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { Section } from "@/constant/data/settingsList";
import ThemeContext from "@/context/ThemeContext";
import NotificationTypeModal from "@/components/setting/NotificationTypeSetting";
import RoutineSettingModal from "@/components/setting/RoutineSetting";
import ReportBugModal from "@/components/setting/ReportBug";
import FeedbackModal from "@/components/setting/Feeback";
import PrivacyPolicyModal from "@/components/setting/PrivacyPoilcy";
import TermsModal from "@/components/setting/TermsAndService";
import FAQModal from "@/components/setting/HelpCenter";
import ChangePasswordModal from "@/components/setting/ChangePassword";
import LogoutModal from "@/components/setting/LogoutModal";
import SocialActionModal from "@/components/setting/SocialActionModal";

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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const [showPrivatePolicyModal, setShowPrivatePrivacyModal] = useState(false);
  const [showTermsAndServiceModal, setShowTermsAndServiceModal] =
    useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  // Instagram deep link: instagram://user?username=your_username
  // webUrl: https://instagram.com/your_username
  const instagramDeep = "instagram://user?username=nimbus_app";
  const instagramWeb = "https://instagram.com/nimbus_app";

  // others
  const { newTheme, toggleTheme } = useContext(ThemeContext);

  const { onLogout, userProfile } = useAuth();

  const styles = styling(newTheme);

  const [formState, setFormState] = useState<FormState>({
    darkMode: true,
    wifi: false,
    showCollaborators: false,
  });

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
      case "Change Password":
        setShowChangePasswordModal(true);
        break;
      case "Logout":
        setShowLogoutModal(true);
        break;
      case "Facebook":
      case "Instagram":
      case "Discord":
        console.log("coming here social");
        setShowSocialModal(true);
        break;

      case "Help Center":
        setShowFAQModal(true);
        break;
    }
  };
  const handleOnSaveNotification = () => {};

  return (
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

          {userProfile && userProfile.first_name && (
            <View>
              <Text style={styles.profileName}>
                {userProfile?.first_name} {userProfile?.last_name}
              </Text>

              <Text style={styles.profileAddress}>
                Tower B, Assetz 63 degree East
              </Text>
            </View>
          )}
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
                        style={[
                          styles.rowIcon,
                          { backgroundColor: newTheme.accent },
                        ]}
                      >
                        {/* icon */}
                        <Ionicons
                          name={icon}
                          size={18}
                          color={newTheme.background}
                        />
                      </View>
                      <Text style={styles.rowLabel}>{label}</Text>

                      <View style={{ flex: 1 }} />

                      {type === "toogle" && (
                        <Switch
                          value={formState[id]}
                          thumbColor={newTheme.accent}
                          trackColor={{
                            true: `${newTheme.background}`,
                          }}
                          onValueChange={(value) => onToggle(id, value)}
                        />
                      )}

                      {type === "modal" && (
                        <Ionicons
                          name="chevron-forward"
                          color={newTheme.textSecondary}
                          size={22}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
          {/* <TouchableOpacity style={styles.logout} onPress={onLogoutClick}>
            <Text style={{ color: newTheme.textSecondary }}>Logout</Text>
          </TouchableOpacity> */}
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

          <ChangePasswordModal
            visible={showChangePasswordModal}
            onClose={() => setShowChangePasswordModal(false)}
          />

          <SocialActionModal
            visible={showSocialModal}
            onClose={() => setShowSocialModal(false)}
            title="Nimbus on Instagram"
            appDeepLink={instagramDeep}
            webUrl={instagramWeb}
          />

          <LogoutModal
            visible={showLogoutModal}
            onLogout={onLogoutClick}
            onClose={() => setShowLogoutModal(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
const styling = (newTheme: any) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1,
      backgroundColor: newTheme.background,
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
      color: newTheme.textPrimary,
      // color: "#414d63",
      textAlign: "center",
    },
    profileAddress: {
      color: newTheme.textSecondary,
      // color: "#989898",
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
      color: newTheme.textPrimary,
      // color: "red",
      textTransform: "uppercase",
      letterSpacing: 1.1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: 50,
      backgroundColor: newTheme.divider,
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12,
    },
    rowLabel: {
      fontSize: 12,
      color: newTheme.textPrimary,
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
      fontSize: 12,
      color: newTheme.textPrimary,
      paddingHorizontal: 24,
    },
  });
