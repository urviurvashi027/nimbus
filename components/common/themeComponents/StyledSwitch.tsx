// components/common/NimbusSwitch.tsx
import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

type SwitchProps = {
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * Size of the switch – medium works well for most places,
   * small is great for dense rows.
   */
  size?: "small" | "medium";
};

const StyledSwitch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
  size = "medium",
}) => {
  const { newTheme } = useContext(ThemeContext);

  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

  // animate when value changes
  useEffect(() => {
    Animated.timing(animated, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, animated]);

  const isSmall = size === "small";
  const trackWidth = isSmall ? 40 : 52;
  const trackHeight = isSmall ? 22 : 30;
  const thumbSize = isSmall ? 18 : 24;
  const padding = (trackHeight - thumbSize) / 2;
  const travel = trackWidth - thumbSize - padding * 2;

  const trackBg = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [newTheme.divider, newTheme.accentPressed ?? newTheme.accent],
  });

  const thumbTranslate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  const handlePress = () => {
    if (disabled) return;
    onValueChange?.(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={10}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: trackBg,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: newTheme.background,
              transform: [{ translateX: thumbTranslate }],
              shadowColor: "#000",
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default StyledSwitch;

const styles = StyleSheet.create({
  track: {
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  thumb: {
    // “pill” shadow for premium feel
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 3,
  },
});
