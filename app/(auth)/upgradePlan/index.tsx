import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import { PlanDetailsCard } from "@/components/upgradePlan/PlanDetailsCard";
import { BillingToggle } from "@/components/upgradePlan/BillingToggle";
import { BillingPeriod, Plan } from "@/types/payment";

// 🔢 Your plan copy – tweak prices / copy as you like
const PLANS: Record<BillingPeriod, Plan> = {
  monthly: {
    id: "monthly",
    price: "₹499",
    periodLabel: "/ month",
    headline: "Nimbus Plus — Monthly",
    features: [
      "Unlimited routines & habits",
      "Advanced progress tracking and reports",
      "Smart reminders & custom themes",
      "Priority support from Nimbus Coach",
      "Ad-free, distraction-free experience",
    ],
  },
  yearly: {
    id: "yearly",
    price: "₹4,999",
    periodLabel: "/ year",
    savingsTag: "Save 17%",
    headline: "Nimbus Plus — Yearly",
    features: [
      "Everything in Monthly",
      "Best value for long-term growth",
      "Early access to new features",
      "Exclusive seasonal rituals & templates",
      "Founding member badge in profile",
    ],
  },
};

const UpgradePlanScreen = () => {
  const navigation = useNavigation();
  const { theme, newTheme } = useContext(ThemeContext);
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  const styles = useMemo(() => styling(theme, newTheme), [theme, newTheme]);
  const activePlan = PLANS[billing];

  //    const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleContinue = () => {
    // TODO: hook up to in-app purchase / Stripe flow
    router.push("/(auth)/billing/ChoosePaymentMethodScreen");

    console.log("Upgrade with plan:", billing);
  };

  return (
    <ScreenView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.headerBack,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={newTheme.textPrimary}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Upgrade Plan</Text>
          <View style={{ width: 22 }} />
          {/* spacer for symmetry */}
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces
            showsVerticalScrollIndicator={false}
          >
            {/* Billing toggle */}
            <BillingToggle
              value={billing}
              onChange={setBilling}
              theme={newTheme}
            />

            {/* Pricing card */}
            <PlanDetailsCard
              plan={activePlan}
              isHighlighted={billing === "yearly"}
              theme={newTheme}
            />
          </ScrollView>

          {/* Sticky bottom CTA */}
          <View style={styles.bottomBar}>
            <StyledButton
              label={
                billing === "monthly"
                  ? `Continue – ${activePlan.price} / month`
                  : `Continue – ${activePlan.price} / year`
              }
              onPress={handleContinue}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenView>
  );
};

export default UpgradePlanScreen;

/* ----------------- Styles for screen ----------------- */

const styling = (theme: ThemeKey, t: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 4,
    },
    headerBack: {
      paddingVertical: 6,
      paddingRight: 12,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
      color: t.textPrimary,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    bottomBar: {
      paddingHorizontal: 16,
      paddingBottom: 18,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: t.borderMuted ?? "rgba(255,255,255,0.06)",
      backgroundColor: t.background,
    },
  });
