// app/(auth)/SelfCare/test/MentalHealthTestScreen.tsx (or your path)
import React, { useContext, useEffect } from "react";
import { View, FlatList, Platform, StyleSheet, Text } from "react-native";
import { router, useNavigation } from "expo-router";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { medTests } from "@/constant/data/medicalTest";

import MentalHealthHeader from "@/components/selfCare/mentalTest/mentalHealthScreen/MentalHealthHeader";
import MentalHealthTestItem, {
  MentalTest,
} from "@/components/selfCare/mentalTest/mentalHealthScreen/MentalHealthTestItem";

const MentalHealthTestScreen = () => {
  const navigation = useNavigation();
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const onMedicalTestClick = (value: MentalTest) => {
    router.push({
      pathname: "/(auth)/selfCareScreen/MentalHealthGetStartedScreen",
      params: { id: value.id },
    });
  };

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.4
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <View style={styles.container}>
        {/* Non-scrollable header */}
        <MentalHealthHeader onBack={() => navigation.goBack()} />

        {/* Vertical list of tests */}
        <FlatList
          data={medTests as unknown as MentalTest[]}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing.xl,
          }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Tests coming soon.</Text>
          )}
          renderItem={({ item }) => (
            <MentalHealthTestItem
              item={item as unknown as MentalTest}
              onPress={() => onMedicalTestClick(item as unknown as MentalTest)}
            />
          )}
        />
      </View>
    </ScreenView>
  );
};

export default MentalHealthTestScreen;

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    emptyText: {
      ...typography.caption,
      textAlign: "center",
      color: newTheme.textSecondary,
      marginTop: spacing.lg,
    },
  });
