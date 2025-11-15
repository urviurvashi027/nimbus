import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView, Switch } from "react-native-gesture-handler";
import * as Location from "expo-location";

import { useAuth } from "@/context/AuthContext";
import { Section } from "@/constant/data/settingsList";
import ThemeContext from "@/context/ThemeContext";

import NotificationListModal from "@/components/setting/modal/NotificationListModal";
// import RoutineSettingModal from "@/components/setting/RoutineSetting";
import ReportBugModal from "@/components/setting/ReportBug";
import FeedbackModal from "@/components/setting/Feeback";
import PrivacyPolicyModal from "@/components/setting/modal/PrivacyPoilcy";
import TermsModal from "@/components/setting/modal/TermsAndService";
import FAQModal from "@/components/setting/modal/HelpCenter";
import ChangePasswordModal from "@/components/setting/modal/ChangePassword";
import LogoutModal from "@/components/setting/modal/LogoutModal";
import SocialActionModal from "@/components/setting/SocialActionModal";
import AdvancedSettingsModal from "@/components/setting/modal/AdvanceSettingModal";
import EditProfileModal from "@/components/setting/modal/EditProfileModal";
import UpgradeBanner from "@/components/common/UpgradeBanner";
import { router } from "expo-router";
import DailyCheckInCard from "@/components/homeScreen/component/DailyCheckInCard";
import ProfileHeader from "@/components/setting/ProfileHeader";
import StyledSwitch from "@/components/common/themeComponents/StyledSwitch";

type FormState = {
  darkMode: boolean;
  wifi: boolean;
  showCollaborators: boolean;
};

export default function profile() {
  // modal states
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAdvanceSettingModal, setShowAdvanceSettingModal] = useState(false);
  const [showReportBugModal, setShowReportBugModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);

  const [showPrivatePolicyModal, setShowPrivatePrivacyModal] = useState(false);
  const [showTermsAndServiceModal, setShowTermsAndServiceModal] =
    useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showEditProfile, setEditProfile] = useState(false);

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

  const onToggle = async (id: string, value: boolean, label: string) => {
    console.log(id, value, label, "on toggle");
    // handle side-effects per id
    if (value) {
      await switchEnableHandler(id);
    } else {
      await switchDisableHandler(id);
    }
    // value ? switchEnableHandler(id) : switchdisableHandler(id);
    setFormState({ ...formState, [id]: value });
    value ? toggleTheme("dark") : toggleTheme("light");
  };

  const switchEnableHandler = async (id: string) => {
    try {
      if (id === "navigation") {
        await requestLocation();
      } else if (id === "soundEffect") {
        // enable sound effects: call your audio manager / update prefs
        console.log("Enable sound effects");
      } else {
        // generic enable handler
        console.log("Enable:", id);
      }
    } catch (err) {
      console.warn("switchEnableHandler error", err);
      // optional: revert UI if side-effect failed
      setFormState({ ...formState, [id]: false });
    }
  };

  // called when switch turned OFF
  const switchDisableHandler = async (id: string) => {
    try {
      if (id === "navigation") {
        // optionally clear or stop location usage
        setLoc(null);
        console.log("Navigation/location disabled");
      } else if (id === "soundEffect") {
        console.log("Disable sound effects");
      } else {
        console.log("Disable:", id);
      }
    } catch (err) {
      console.warn("switchDisableHandler error", err);
      // revert UI if necessary
      setFormState({ ...formState, [id]: true });
    }
  };

  useEffect(() => {
    if (!loc) {
      console.log("loc not found useEffect");
      return;
    }

    console.log(
      "loc detail useEffect",
      loc.coords.latitude,
      loc.coords.longitude
    );

    const fetchAddress = async () => {
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          console.log("Place details:", place);

          console.log(
            `${place.name}, ${place.city}, ${place.region}, ${place.country}`
          );
        }
      } catch (error) {
        console.warn("Reverse geocode failed", error);
      }
    };

    fetchAddress();
  }, [loc]);

  const onSettingPanelClick = (type: string, label: string) => {
    if (type === "modal") {
      handleModalVisibilty(label);
    }
    if (type === "screen") {
      if (label === "Overview") router.push("/(auth)/Overview/details");
      if (label === "Badges")
        router.push("/(auth)/AchievementScreen/Achievement");
    }
  };

  async function requestLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied :: Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    setLoc(location);
  }

  const handleModalVisibilty = (label: string) => {
    switch (label) {
      case "Notification":
        setShowNotificationModal(true);
        break;
      case "Advance Setting":
        setShowAdvanceSettingModal(true);
        break;
      case "Profile Info":
        setEditProfile(true);
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
          <ProfileHeader
            username={userProfile?.username || "Nimbus Explorer"}
            emailOrTagline={
              userProfile?.email || "Grow a calmer, healthier you 🌿"
            }
            planLabel={"Nimbus Free"}
            avatarSource={require("../../../assets/images/loginLatest.png")}
            onPressManagePlan={() => router.push("/(auth)/upgradePlan")}
          />
          <View style={{ paddingVertical: 20 }}>
            <UpgradeBanner onPress={() => router.push("/(auth)/upgradePlan")} />
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
                        <StyledSwitch
                          value={formState[id]}
                          onValueChange={(value) => onToggle(id, value, label)}
                          size="medium"
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

          <NotificationListModal
            visible={showNotificationModal}
            onClose={() => setShowNotificationModal(false)}
          />

          <AdvancedSettingsModal
            visible={showAdvanceSettingModal}
            onClose={() => setShowAdvanceSettingModal(false)}
          />

          {/* The modal */}
          <EditProfileModal
            visible={showEditProfile}
            onClose={() => setEditProfile(false)}
            onSaved={(user) => {
              console.log("Profile saved:", user);
              setEditProfile(false);
            }}
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
      fontSize: 19,
      fontWeight: 600,
      color: newTheme.textPrimary,
      textAlign: "center",
    },

    profileAvatarWrapper: {
      position: "relative",
    },
    profileAvatar: {
      width: 82,
      height: 82,
      borderRadius: 9999,
    },

    section: {
      paddingHorizontal: 24,
    },
    sectionHeader: {
      paddingVertical: 12,
      fontSize: 12,
      fontWeight: 600,
      color: newTheme.textPrimary,
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
