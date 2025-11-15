// components/payments/PaymentMethodCard.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { PaymentMethod } from "@/types/payment";

type Props = {
  method: PaymentMethod;
  selected?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  compact?: boolean; // for summary row
};

const PaymentMethodCard: React.FC<Props> = ({
  method,
  selected = false,
  onPress,
  compact = false,
}) => {
  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme);

  const renderIcon = () => {
    switch (method.type) {
      case "paypal":
        return (
          <MaterialCommunityIcons
            name="google"
            size={26}
            color={newTheme.accent}
          />
        );
      case "google_pay":
        return (
          <MaterialCommunityIcons
            name="google"
            size={26}
            color={newTheme.accent}
          />
        );
      case "apple_pay":
        return <Ionicons name="logo-apple" size={26} color={newTheme.accent} />;
      default:
        // card brands
        return (
          <View style={styles.cardBrandCircle}>
            <Text style={styles.cardBrandText}>{method.brand?.[0] ?? "C"}</Text>
          </View>
        );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        compact && styles.compactContainer,
        selected && styles.containerSelected,
        pressed && { opacity: 0.9 },
      ]}
    >
      {/* Icon */}
      <View style={styles.iconWrap}>{renderIcon()}</View>

      {/* Text block */}
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.label}>{method.label}</Text>
          {method.isDefault && !compact && (
            <View style={styles.defaultPill}>
              <Text style={styles.defaultPillText}>Default</Text>
            </View>
          )}
        </View>

        {method.emailHint && !compact && (
          <Text style={styles.subText}>{method.emailHint}</Text>
        )}

        {method.description && (
          <Text
            style={compact ? styles.compactSubText : styles.subText}
            numberOfLines={1}
          >
            {method.description}
          </Text>
        )}
      </View>

      {/* Right side: check mark */}
      {selected && (
        <View style={styles.checkWrap}>
          <Ionicons name="checkmark-circle" size={22} color={newTheme.accent} />
        </View>
      )}
    </Pressable>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: newTheme.surface,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: newTheme.borderMuted,
    },
    compactContainer: {
      marginBottom: 0,
      paddingVertical: 12,
    },
    containerSelected: {
      borderColor: newTheme.accent,
      backgroundColor: newTheme.surfaceMuted ?? newTheme.surface,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      backgroundColor: newTheme.surfaceMuted,
    },
    textWrap: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: newTheme.textPrimary,
    },
    subText: {
      fontSize: 12,
      color: newTheme.textSecondary,
      marginTop: 2,
    },
    compactSubText: {
      fontSize: 11,
      color: newTheme.textSecondary,
      marginTop: 2,
    },
    checkWrap: {
      marginLeft: 8,
    },
    defaultPill: {
      marginLeft: 8,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: newTheme.surfaceMuted,
    },
    defaultPillText: {
      fontSize: 10,
      color: newTheme.textSecondary,
      fontWeight: "600",
    },
    cardBrandCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: newTheme.accent,
      justifyContent: "center",
      alignItems: "center",
    },
    cardBrandText: {
      color: newTheme.background,
      fontWeight: "700",
      fontSize: 13,
    },
  });

export default PaymentMethodCard;
