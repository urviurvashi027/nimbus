import React, { useContext } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import AppHeader, { HeaderRightAction } from "@/components/layout/AppHeader";
import ThemeContext from "@/contexts/ThemeContext";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightActions?: HeaderRightAction[];
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightActions,
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  const { svaColors, svaTypography } = useContext(ThemeContext);
  const mergedTitleStyle = StyleSheet.flatten([
    styles.title,
    {
      color: svaColors.text.primary,
      fontFamily:
        svaTypography?.textStyle.authTitle.fontFamily ??
        "CormorantGaramond_500Medium",
    },
    titleStyle,
  ]);
  const mergedSubtitleStyle = StyleSheet.flatten([
    styles.subtitle,
    {
      color: svaColors.text.secondary,
    },
    subtitleStyle,
  ]);
  const mergedContainerStyle = StyleSheet.flatten([containerStyle]);

  return (
    <AppHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      rightActions={rightActions}
      titleStyle={mergedTitleStyle}
      subtitleStyle={mergedSubtitleStyle}
      containerStyle={mergedContainerStyle}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});

export default ScreenHeader;
