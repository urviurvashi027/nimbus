// components/DailyCheckIn/WaterTracker.tsx
import React, { useCallback, useMemo, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  AccessibilityInfo,
  Dimensions,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

type WaterTrackerProps = {
  value: number;
  total: number;
  onChange?: (newValue: number) => void;
  title?: string;
  subtitle?: string;
  // allows parent to control horizontal padding used inside the tracker
  contentPadding?: number;
  // visual overrides:
  dropletSize?: number;
  filledColor?: string;
  emptySlotColor?: string;
  plusColor?: string;
  allowUndo?: boolean;
  // how many items per row at default — tracker will wrap if necessary
  perRow?: number;
};

export default function WaterTracker({
  value,
  total,
  onChange,
  title,
  subtitle,
  contentPadding = 0,
  dropletSize = 56,
  filledColor,
  emptySlotColor,
  plusColor,
  allowUndo = true,
  perRow = 6,
}: WaterTrackerProps) {
  const { newTheme } = useContext(ThemeContext);
  const screenW = Dimensions.get("window").width;
  // compute a sensible droplet size max if parent supplies too large value
  const maxDroplet = Math.min(
    dropletSize,
    Math.floor((screenW - contentPadding * 2) / Math.min(perRow, total)) - 12
  );

  const styles = styling(newTheme);

  const filled = filledColor ?? "#2D3028";
  const empty = emptySlotColor ?? "#2D3028";
  const plus = plusColor ?? newTheme.accent;

  const anims = useMemo(
    () => Array.from({ length: total }).map(() => new Animated.Value(1)),
    [total]
  );

  const handlePressIncrement = useCallback(
    (index: number) => {
      const newVal = Math.min(total, value + 1);
      Animated.sequence([
        Animated.timing(anims[index], {
          toValue: 0.92,
          duration: 90,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anims[index], {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.elastic(1)),
          useNativeDriver: true,
        }),
      ]).start();
      onChange?.(newVal);
      AccessibilityInfo.announceForAccessibility?.(
        `Logged ${newVal} out of ${total} glasses`
      );
    },
    [anims, onChange, value, total]
  );

  const handlePressDecrement = useCallback(
    (index: number) => {
      if (!allowUndo) return;
      const newVal = Math.max(0, value - 1);
      Animated.sequence([
        Animated.timing(anims[index], {
          toValue: 0.9,
          duration: 80,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anims[index], {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.elastic(1)),
          useNativeDriver: true,
        }),
      ]).start();
      onChange?.(newVal);
      AccessibilityInfo.announceForAccessibility?.(
        `Removed one glass. ${newVal} of ${total}`
      );
    },
    [anims, allowUndo, onChange, value, total]
  );

  const headerTitle = title ?? `${value} of ${total} glasses`;
  const headerSubtitle =
    subtitle ??
    `You drank ${value}/${total} glasses today. ${Math.max(
      0,
      total - value
    )} left.`;

  // create a flat list of indices and render wrapped rows using flexWrap
  const slots = Array.from({ length: total }).map((_, i) => i);

  return (
    <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: newTheme.textPrimary }]}>
          {headerTitle}
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: newTheme.textSecondary }]}>
        {headerSubtitle}
      </Text>

      <View style={{ height: 12 }} />

      <View style={styles.grid}>
        {slots.map((index) => {
          const isFilled = index < value;
          const animStyle = { transform: [{ scale: anims[index] }] };
          return (
            <View key={`slot-${index}`} style={{ margin: 6 }}>
              {isFilled ? (
                <AnimatedTouchable
                  onPress={() => handlePressDecrement(index)}
                  activeOpacity={0.86}
                  style={[animStyle]}
                >
                  <View
                    style={[
                      styles.droplet,
                      {
                        width: maxDroplet,
                        height: maxDroplet,
                        borderRadius: maxDroplet / 2,
                        backgroundColor: filled,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: Math.round(maxDroplet * 0.48) }}>
                      💧
                    </Text>
                  </View>
                </AnimatedTouchable>
              ) : (
                <AnimatedTouchable
                  onPress={() => handlePressIncrement(index)}
                  activeOpacity={0.86}
                  style={[animStyle]}
                >
                  <View
                    style={[
                      styles.emptySlot,
                      {
                        width: maxDroplet,
                        height: maxDroplet,
                        borderRadius: maxDroplet / 2,
                        backgroundColor: empty,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.plusCircle,
                        {
                          width: Math.round(maxDroplet * 0.56),
                          height: Math.round(maxDroplet * 0.56),
                          borderRadius: Math.round((maxDroplet * 0.56) / 2),
                          backgroundColor: plus,
                        },
                      ]}
                    >
                      <Text style={styles.plusText}>+</Text>
                    </View>
                  </View>
                </AnimatedTouchable>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      padding: 15,
      backgroundColor: newTheme.surface,
      borderRadius: 12,
      // NO backgroundColor here — parent should control the section background.
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
    },
    title: { fontSize: 20, fontWeight: "800" },
    // editBtn: { padding: 6 },
    subtitle: { fontSize: 13, marginTop: 6, paddingHorizontal: 18 },
    // grid uses wrap so it will break into next line instead of overflowing
    grid: {
      marginTop: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      // backgroundColor: "green",
    },
    droplet: {
      justifyContent: "center",
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    emptySlot: {
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0.1,
      borderColor: newTheme.focus,
    },
    plusCircle: {
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: "red",
      ...Platform.select({
        ios: {
          // shadowColor: "red",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
        },
        android: { elevation: 2 },
      }),
    },
    plusText: { fontSize: 20, fontWeight: "700", color: newTheme.chart1 },
  });
