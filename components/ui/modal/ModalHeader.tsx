import React, { useContext, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
};

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  accessibilityLabel = "Close",
  style,
  titleStyle,
  subtitleStyle,
  closeButtonStyle,
  iconSize = 22,
}: ModalHeaderProps) {
  const { newTheme, svaColors } = useContext(ThemeContext);

  const colors = useMemo(
    () => ({
      textPrimary: svaColors.text.primary ?? newTheme.textPrimary,
      textSecondary: svaColors.text.secondary ?? newTheme.textSecondary,
    }),
    [newTheme, svaColors]
  );

  const styles = useMemo(() => makeStyles(colors), [colors]);
  const hasSubtitle = !!subtitle?.trim();

  return (
    <View
      style={[
        styles.header,
        hasSubtitle && styles.headerWithSubtitle,
        style,
      ]}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {hasSubtitle ? (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onClose}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[styles.closeButton, closeButtonStyle]}
        activeOpacity={0.85}
      >
        <Ionicons name="close" size={iconSize} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (colors: { textPrimary: string; textSecondary: string }) =>
  StyleSheet.create({
    header: {
      width: "100%",
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerWithSubtitle: {
      alignItems: "flex-start",
    },
    textWrap: {
      flex: 1,
      paddingRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    closeButton: {
      padding: 4,
      borderRadius: 999,
    },
  });
