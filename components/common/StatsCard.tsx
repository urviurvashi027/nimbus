// components/common/StatsCard.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

type Alignment = "left" | "center";

type Props = {
  value: string | number; // 226, "89%", 3268…
  valueSuffix?: string; // "days", "%" (optional helper)
  label: string; // "Current streak"
  align?: Alignment; // "left" | "center"
  style?: StyleProp<ViewStyle>; // allow custom width / margin
};

const StatsCard: React.FC<Props> = ({
  value,
  valueSuffix,
  label,
  align = "left",
  style,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = makeStyles(newTheme);

  const textAlign: TextStyle["textAlign"] = align;

  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.value, { textAlign }]} numberOfLines={1}>
        {value}
        {valueSuffix ? ` ${valueSuffix}` : ""}
      </Text>
      <Text style={[styles.label, { textAlign }]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
};

export default StatsCard;

const makeStyles = (t: any) =>
  StyleSheet.create({
    card: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.divider,
      // so grid layouts work nicely
      minWidth: 140,
    } as ViewStyle,
    value: {
      fontSize: 18,
      fontWeight: "700",
      color: t.textPrimary,
      marginBottom: 4,
    } as TextStyle,
    label: {
      fontSize: 12,
      color: t.textSecondary,
    } as TextStyle,
  });
