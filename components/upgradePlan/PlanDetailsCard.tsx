import React from "react";
import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Plan } from "@/types/payment";
type PlanDetailsCardProps = {
  plan: Plan;
  isHighlighted?: boolean;
  theme: any;
};

export const PlanDetailsCard = ({
  plan,
  isHighlighted = false,
  theme,
}: PlanDetailsCardProps) => {
  const borderBase = theme.borderMuted ?? "rgba(255,255,255,0.10)";

  // ✅ explicitly type as tuple of strings
  const borderColors: [string, string] = isHighlighted
    ? [theme.accent, "rgba(167,197,122,0.35)"]
    : [borderBase, borderBase];

  return (
    <LinearGradient
      colors={borderColors} // ✅ now matches [string, string, ...string[]]
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        padding: isHighlighted ? 1.5 : 1,
      }}
    >
      <View
        style={{
          borderRadius: 18,
          padding: 18,
          backgroundColor: theme.surface,
        }}
      >
        {/* Header line: plan + savings */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: theme.textPrimary,
              fontSize: 16,
              fontWeight: "700",
              flex: 1,
            }}
          >
            {plan.headline}
          </Text>
          {plan.savingsTag && (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: theme.accent,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: theme.background,
                }}
              >
                {plan.savingsTag}
              </Text>
            </View>
          )}
        </View>

        {/* Price */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginTop: 16,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: theme.textPrimary,
              fontSize: 32,
              fontWeight: "800",
            }}
          >
            {plan.price}
          </Text>
          <Text
            style={{
              marginLeft: 6,
              fontSize: 14,
              color: theme.textSecondary,
              marginBottom: 4,
            }}
          >
            {plan.periodLabel}
          </Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: borderBase,
            marginVertical: 10,
          }}
        />

        {/* Features list */}
        {plan.features.map((f, idx) => (
          <View
            key={f}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: idx === 0 ? 4 : 10,
            }}
          >
            <View
              style={{
                width: 18,
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Ionicons name="checkmark" size={16} color={theme.accent} />
            </View>
            <Text
              style={{
                flex: 1,
                color: theme.textSecondary,
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              {f}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};
