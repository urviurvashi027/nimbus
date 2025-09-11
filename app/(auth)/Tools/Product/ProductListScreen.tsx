import React, { useContext, useEffect } from "react";
import { Platform, View, StyleSheet, TouchableOpacity } from "react-native";
import ComingSoon from "@/components/common/ComingSoon";
import ProductIllustration from "@/assets/images/buttonLogo/tool/therapy.svg"; // optional SVG
import { ScreenView } from "@/components/Themed";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export default function ProductAffiliatesScreen() {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={newTheme.textSecondary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <ComingSoon
          title="Affiliate Products"
          emoji="🛍️"
          subtitle="Curated tools & products we love. Launching soon."
          illustration={<ProductIllustration width={280} height={180} />}
          ctaLabel="Join waitlist"
          onCta={() => {
            // track event / open modal / subscribe
            console.log("user want to join product waitlist");
          }}
          altLabel="Browse blog"
          onAlt={() => {
            // fallback action
            console.log("open blog");
          }}
          note="Be the first to get early access and exclusive discounts."
        />
      </View>
    </ScreenView>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    backButton: {
      marginTop: 50,
      // marginLeft: 10,
      marginBottom: 10,
    },
  });
