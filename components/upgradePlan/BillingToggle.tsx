import React, { useContext, useMemo, useState } from "react";
import { View } from "react-native";
import { ToggleChip } from "./ToogleChips";
import { BillingPeriod } from "@/types/payment";

type BillingToggleProps = {
  value: BillingPeriod;
  onChange: (v: BillingPeriod) => void;
  theme: any;
};

export const BillingToggle = ({
  value,
  onChange,
  theme,
}: BillingToggleProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        borderRadius: 999,
        backgroundColor: theme.surface,
        marginBottom: 20,
      }}
    >
      <ToggleChip
        label="Monthly"
        active={value === "monthly"}
        onPress={() => onChange("monthly")}
        theme={theme}
      />
      <ToggleChip
        label="Yearly"
        active={value === "yearly"}
        onPress={() => onChange("yearly")}
        theme={theme}
        badgeLabel="Best value"
      />
    </View>
  );
};
