// components/homeScreen/DateScroller.tsx
import React, { useContext, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import { addDays, isSameDay, startOfDay, subDays } from "date-fns";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  isLoading?: boolean;
  daysAroundToday?: number;
};

const DEFAULT_DAYS_AROUND = 365;
const atMidnight = (d: Date) => startOfDay(d);

export default function DateScroller({
  value,
  onChange,
  isLoading = false,
  daysAroundToday = DEFAULT_DAYS_AROUND,
}: Props) {
  const listRef = useRef<FlatList<Date>>(null);
  const didCenterOnceRef = useRef(false);
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 5;
  const sidePad = (screenWidth - itemWidth) / 2;

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme, itemWidth);

  const today = useMemo(() => atMidnight(new Date()), []);
  const selected = useMemo(() => atMidnight(value), [value]);

  const days = useMemo(() => {
    // Generate range: Today - range ... Today ... Today + range
    const total = 2 * daysAroundToday + 1;
    return Array.from({ length: total }, (_, i) =>
      atMidnight(addDays(subDays(today, daysAroundToday), i)) // Start from past
    );
  }, [today, daysAroundToday]);

  const selectedIdx = useMemo(
    () => days.findIndex((d) => d.getTime() === selected.getTime()),
    [days, selected]
  );

  const centerSelected = (animated = false) => {
    if (selectedIdx < 0) return;
    listRef.current?.scrollToIndex({
      index: selectedIdx,
      animated,
      viewPosition: 0.5,
    });
  };

  // Center on initial layout
  const handleLayout = (_e: LayoutChangeEvent) => {
    if (didCenterOnceRef.current) return;
    setTimeout(() => {
      centerSelected(false);
      didCenterOnceRef.current = true;
    }, 100);
  };

  // Only re-center if the *value* prop changes drastically (e.g. initial load or "Today" button)
  // We do NOT want to auto-center during user scrolling
  useEffect(() => {
    if (!didCenterOnceRef.current) return;
    // Optional: You can re-enable this if you want to force-snap on prop change
    // requestAnimationFrame(() => centerSelected(true));
  }, [selectedIdx]);

  return (
    <View onLayout={handleLayout}>
      <FlatList
        ref={listRef}
        data={days}
        keyExtractor={(d) => d.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Remove snapToInterval to allow smooth free scrolling
        // snapToInterval={itemWidth} 
        decelerationRate="normal"
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        contentContainerStyle={{ paddingHorizontal: sidePad }}
        initialNumToRender={15}
        renderItem={({ item }) => {
          const isSelected = isSameDay(item, selected);
          return (
            <TouchableOpacity
              onPress={() => onChange(item)} // Immediate selection + API call via parent
              disabled={isLoading && isSelected}
              activeOpacity={0.7}
              style={[styles.dateBox, isSelected && styles.selectedBox]}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {item.toLocaleDateString(undefined, { weekday: "short" })}
              </Text>
              {isLoading && isSelected ? (
                <ActivityIndicator size="small" color={newTheme.textPrimary} />
              ) : (
                <Text
                  style={[styles.dateText, isSelected && styles.selectedText]}
                >
                  {String(item.getDate()).padStart(2, "0")}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styling = (newTheme: any, itemWidth: number) =>
  StyleSheet.create({
    dateBox: {
      width: itemWidth - 12,
      height: 70,
      borderRadius: 12,
      backgroundColor: newTheme.surface,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 6,
    },
    selectedBox: { backgroundColor: newTheme.accent },
    dayText: { fontSize: 14, fontWeight: "500", color: newTheme.textSecondary },
    dateText: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
      marginTop: 4,
    },
    selectedText: { color: newTheme.background, fontWeight: "700" },
  });
