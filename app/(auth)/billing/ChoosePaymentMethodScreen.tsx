// app/(auth)/billing/ChoosePaymentMethodScreen.tsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { PaymentMethod } from "@/types/payment";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import NimbusPrimaryButton from "@/components/common/ThemedComponent/PrimaryButton";

const ChoosePaymentMethodScreen = () => {
  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme);
  const navigation = useNavigation();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // You can later replace this with an API response
  const methods = useMemo<PaymentMethod[]>(
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
        isDefault: true,
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

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const selectedMethod = methods.find((m) => m.id === selectedId) ?? null;

  const handleContinue = () => {
    if (!selectedMethod) return;
    router.push({
      pathname: "/(auth)/billing/ReviewSummaryScreen",
      params: {
        methodId: selectedMethod.id,
      },
    });
  };

  return (
    <ScreenView style={{ paddingTop: Platform.OS === "ios" ? 52 : 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={{ padding: 4 }}
        >
          <Ionicons name="arrow-back" size={22} color={newTheme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose Payment Methods</Text>
        {/* placeholder for "+" */}
        <Pressable hitSlop={10} style={{ padding: 4 }}>
          <Ionicons name="add" size={22} color={newTheme.textSecondary} />
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        renderItem={({ item }) => (
          <PaymentMethodCard
            method={item}
            selected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        )}
      />

      <NimbusPrimaryButton
        label="OK"
        onPress={handleContinue}
        disabled={!selectedMethod}
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
  });

export default ChoosePaymentMethodScreen;
