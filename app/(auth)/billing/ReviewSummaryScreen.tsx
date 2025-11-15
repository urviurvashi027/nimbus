// app/(auth)/billing/ReviewSummaryScreen.tsx
import React, { useContext, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { PaymentMethod } from "@/types/payment";
import NimbusPrimaryButton from "@/components/common/ThemedComponent/PrimaryButton";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";

// plan details — same as before
const yearlyPlan = {
  id: "yearly",
  headline: "Nimbus Premium",
  price: "$49.99",
  periodLabel: "/ year",
  savingsTag: "Save 17%",
  features: [
    "Unlimited routine & habit tracking",
    "Advanced progress reports",
    "Premium themes & notification options",
    "Priority Nimbus Coach access",
    "Advanced mood & wellness stats",
    "Ad-free experience",
  ],
};

const ReviewSummaryScreen = () => {
  const { newTheme, theme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme);
  const router = useRouter();
  const navigation = useNavigation();

  // 🔒 hide Expo Router header
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const params = useLocalSearchParams<{ methodId?: string }>();
  const methodId = params.methodId ?? "card1";

  const methods: PaymentMethod[] = useMemo(
    () => [
      {
        id: "paypal",
        type: "paypal",
        label: "PayPal",
        emailHint: "you@example.com",
      },
      {
        id: "gpay",
        type: "google_pay",
        label: "Google Pay",
        emailHint: "you@example.com",
      },
      {
        id: "applepay",
        type: "apple_pay",
        label: "Apple Pay",
        emailHint: "you@example.com",
      },
      {
        id: "card1",
        type: "card",
        label: "Mastercard",
        brand: "Mastercard",
        description: "•••• 4679",
      },
      {
        id: "card2",
        type: "card",
        label: "Visa",
        brand: "Visa",
        description: "•••• 5567",
      },
    ],
    []
  );

  const selectedMethod = methods.find((m) => m.id === methodId) ?? methods[0];

  const handleConfirm = () => {
    // TODO: call backend / stripe etc.
    // router.push("/(auth)/billing/SuccessPaymentScreen");
  };

  const handleChangeMethod = () => {
    router.back(); // back to choose-payment screen
  };

  return (
    <ScreenView style={{ paddingTop: Platform.OS === "ios" ? 52 : 32 }}>
      {/* Custom header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={{ padding: 4 }}
        >
          <Ionicons name="arrow-back" size={22} color={newTheme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Summary</Text>
        {/* spacer to keep title centered */}
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan card */}
        <View style={styles.planCard}>
          <View style={styles.planHeaderRow}>
            <Text style={styles.planTitle}>{yearlyPlan.headline}</Text>
            <View style={styles.planTag}>
              <Text style={styles.planTagText}>{yearlyPlan.savingsTag}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{yearlyPlan.price}</Text>
            <Text style={styles.priceSuffix}>{yearlyPlan.periodLabel}</Text>
          </View>

          <View style={styles.divider} />

          {yearlyPlan.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons
                name="checkmark"
                size={16}
                color={newTheme.accent}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Selected payment method */}
        <Text style={styles.sectionLabel}>Selected Payment Method</Text>
        <View style={styles.summaryMethodRow}>
          {/* card takes remaining width, gives space to "Change" */}
          <View style={{ flex: 1, marginRight: 12 }}>
            <PaymentMethodCard
              method={selectedMethod}
              compact
              selected={false}
            />
          </View>

          <Pressable
            hitSlop={8}
            onPress={handleChangeMethod}
            style={styles.changeButton}
          >
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>
      </ScrollView>

      <NimbusPrimaryButton
        label="Confirm Payment – $49.99"
        onPress={handleConfirm}
      />
    </ScreenView>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    header: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
    planCard: {
      borderRadius: 24,
      padding: 18,
      backgroundColor: newTheme.surface,
    },
    planHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    planTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
    planTag: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: newTheme.accent,
    },
    planTagText: {
      fontSize: 11,
      fontWeight: "700",
      color: newTheme.background,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 18,
      marginBottom: 10,
    },
    price: {
      fontSize: 32,
      fontWeight: "800",
      color: newTheme.textPrimary,
    },
    priceSuffix: {
      fontSize: 14,
      marginLeft: 6,
      marginBottom: 4,
      color: newTheme.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: newTheme.borderMuted,
      marginVertical: 12,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    featureText: {
      fontSize: 13,
      color: newTheme.textSecondary,
      flex: 1,
    },
    sectionLabel: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 13,
      fontWeight: "600",
      color: newTheme.textSecondary,
    },
    summaryMethodRow: {
      borderRadius: 20,
      backgroundColor: newTheme.surface,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    changeButton: {
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
    changeText: {
      fontSize: 13,
      fontWeight: "600",
      color: newTheme.accent,
    },
  });

export default ReviewSummaryScreen;
