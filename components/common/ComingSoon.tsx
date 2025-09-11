import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  GestureResponderEvent,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export type ComingSoonProps = {
  title?: string;
  subtitle?: string;
  emoji?: string;
  illustration?: React.ReactNode; // pass an <Svg/> or <Image/>
  ctaLabel?: string;
  onCta?: (e?: GestureResponderEvent) => void;
  altLabel?: string;
  onAlt?: (e?: GestureResponderEvent) => void;
  note?: string;
  compact?: boolean; // smaller layout for tighter screens
};

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Coming soon",
  subtitle = "We’re cooking something special — stay tuned!",
  emoji = "✨",
  illustration,
  ctaLabel = "Notify me",
  onCta,
  altLabel = "Maybe later",
  onAlt,
  note,
  compact = false,
}) => {
  const { newTheme } = useContext(ThemeContext);

  // small pulse animation for illustration background
  const pulse = useMemo(() => new Animated.Value(0), []);
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.22],
  });

  const styles = createStyles(newTheme, compact);

  const handleCtaPress = (e: GestureResponderEvent) => {
    if (onCta) onCta(e);
  };

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {emoji}{" "}
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
        </Text>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.illustrationWrap}>
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
              backgroundColor: newTheme.accent,
            },
          ]}
          pointerEvents="none"
        />

        <View
          style={styles.illustrationInner}
          accessible
          accessibilityLabel="Illustration"
        >
          {illustration ?? <DefaultIllustration color={newTheme.accent} />}
        </View>
      </View>

      <View style={styles.ctaRow}>
        <StyledButton
          label={ctaLabel}
          onPress={handleCtaPress}
          style={styles.ctaPrimary}
          // textStyle={styles.ctaPrimaryText}
        />
        <TouchableOpacity onPress={onAlt} accessibilityRole="button">
          <Text style={styles.ctaAltText}>{altLabel}</Text>
        </TouchableOpacity>
      </View>

      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
};

/* ----------------------
  Default vector-ish illustration
  (keeps file self-contained so you can copy-paste)
------------------------*/
const DefaultIllustration: React.FC<{ color?: string }> = ({
  color = "#A3BE8C",
}) => {
  // Simple circular phone-like placeholder using Views (keeps dependency-free)
  return (
    <View
      style={{
        width: Math.min(300, WINDOW_WIDTH * 0.7),
        height: Math.min(220, WINDOW_WIDTH * 0.55),
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.02)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.03)",
        padding: 18,
      }}
    >
      <View
        style={{
          width: "86%",
          height: "76%",
          borderRadius: 12,
          backgroundColor: "rgba(0,0,0,0.25)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 86,
            height: 86,
            borderRadius: 20,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: color,
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 40, color: "#0f1110" }}>☁️</Text>
        </View>
      </View>
    </View>
  );
};

/* ----------------------
  Styles
------------------------*/
const createStyles = (theme: any, compact: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingVertical: compact ? 8 : 12,
      alignItems: "center",
    },
    headerRow: {
      width: "100%",
      alignItems: "flex-start",
      marginBottom: compact ? 8 : 12,
    },
    title: {
      fontSize: compact ? 22 : 28,
      fontWeight: "800",
      color: theme.textPrimary,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: compact ? 13 : 15,
      textAlign: "left",
      width: "100%",
      marginTop: 6,
      marginBottom: 90,
    },
    illustrationWrap: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 80,
      position: "relative",
    },
    pulse: {
      position: "absolute",
      width: Math.min(320, WINDOW_WIDTH * 0.8),
      height: Math.min(240, WINDOW_WIDTH * 0.62),
      borderRadius: 20,
    },
    illustrationInner: {
      zIndex: 2,
    },
    ctaRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    ctaPrimary: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: compact ? 10 : 14,
      marginRight: 12,
    },
    ctaPrimaryText: {
      fontWeight: "800",
      color: theme.background,
    },
    ctaAltText: {
      color: theme.textSecondary,
      fontSize: 15,
      paddingHorizontal: 6,
      paddingVertical: 10,
    },
    note: {
      marginTop: 14,
      color: theme.textSecondary,
      fontSize: 13,
      textAlign: "center",
      width: "100%",
    },
  });

export default ComingSoon;
