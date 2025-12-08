// src/app/(auth)/Tools/Product/AffiliateProductsComingSoonScreen.tsx

import React, { useContext, useEffect } from "react";
import { useNavigation } from "expo-router";

import ComingSoonFeatureScreen from "@/components/tools/common/ComingSoonFeatureScreen";
import { ScreenView } from "@/components/Themed";
import { Platform } from "react-native";
import ThemeContext from "@/context/ThemeContext";

const AffiliateProductsComingSoonScreen: React.FC = () => {
  const navigation = useNavigation();
  const { spacing } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2 // same as Recipe / Routine / Article
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <ComingSoonFeatureScreen
        onBack={() => navigation.goBack()}
        config={{
          emoji: "🛍️",
          title: "Affiliate Productss",
          subtitle: "Curated tools & products we genuinely use and love.",
          description:
            "Soon, you’ll be able to explore a small, carefully curated shelf of products that match Nimbus’ values — nervous-system friendly, high quality, and genuinely useful in daily life.",
          benefits: [
            "Every item is tested or personally vetted by the Nimbus team.",
            "Short, honest notes on why we like each product — no confusing jargon.",
            "Occasional early-access drops and member-only discounts on select items.",
          ],
          primaryCtaLabel: "Join waitlist",
          onPrimaryPress: () => {
            // TODO: plug this into your waitlist / notifications flow
            console.log("[AffiliateProducts] Join waitlist tapped");
          },
          secondaryCtaLabel: "Browse blog",
          onSecondaryPress: () => {
            // TODO: deep-link to your blog / article list when ready
            console.log("[AffiliateProducts] Browse blog tapped");
          },
          footnote:
            "Joining the waitlist keeps you first in line for launches, quiet drops, and exclusive discounts.",
          badgeLabel: "Coming soon",
        }}
      />
    </ScreenView>
  );
};

export default AffiliateProductsComingSoonScreen;
