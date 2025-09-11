import React, { useContext, useEffect } from "react";
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native";
import ComingSoon from "@/components/common/ComingSoon";
import AIIllustration from "@/assets/images/buttonLogo/tool/therapy.svg";
import { ScreenView } from "@/components/Themed";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export default function AskNimbusScreen() {
  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

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
          title="Ask Nimbus"
          emoji="🧠"
          subtitle="Personalized reflections & guidance — powered by AI. Rolling out soon."
          illustration={<AIIllustration width={280} height={180} />}
          ctaLabel="Notify me"
          onCta={() => {
            // subscribe to notifications or call API
            console.log("notify me pressed");
          }}
          altLabel="Learn more"
          onAlt={() => console.log("open docs")}
          note="This feature helps you reflect safely. We'll invite early testers first."
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
