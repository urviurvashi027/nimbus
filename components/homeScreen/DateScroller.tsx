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
import { addDays, isSameDay, startOfDay } from "date-fns";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  isLoading?: boolean;
  daysAroundToday?: number;
  centerSelected?: boolean;
};

const DEFAULT_DAYS_AROUND = 365;
const atMidnight = (d: Date) => startOfDay(d);

export default function DateScroller({
  value,
  onChange,
  isLoading = false,
  daysAroundToday = DEFAULT_DAYS_AROUND,
  centerSelected = true,
}: Props) {
  const listRef = useRef<FlatList<Date>>(null);
  const userDraggingRef = useRef(false);
  const didCenterOnceRef = useRef(false); // <-- NEW: avoid repeated “first center”
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 5;
  const sidePad = centerSelected ? (screenWidth - itemWidth) / 2 : 0;

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme, itemWidth);

  const today = useMemo(() => atMidnight(new Date()), []);
  const selected = useMemo(() => atMidnight(value), [value]);

  const days = useMemo(() => {
    const total = 2 * daysAroundToday + 1;
    return Array.from({ length: total }, (_, i) =>
      atMidnight(addDays(today, i - daysAroundToday))
    );
  }, [today, daysAroundToday]);

  const selectedIdx = useMemo(
    () => days.findIndex((d) => d.getTime() === selected.getTime()),
    [days, selected]
  );

  const centerSelectedSilently = (animated = false) => {
    if (selectedIdx < 0) return;
    // Guard so momentum handler won’t emit onChange
    userDraggingRef.current = false;
    listRef.current?.scrollToIndex({
      index: selectedIdx,
      animated,
      viewPosition: centerSelected ? 0.5 : 0,
    });
  };

  // Center after list is laid out the first time
  const handleLayout = (_e: LayoutChangeEvent) => {
    if (didCenterOnceRef.current) return;
    // Defer to ensure items are measured
    requestAnimationFrame(() => {
      centerSelectedSilently(false);
      didCenterOnceRef.current = true;
    });
  };

  // Also re-center whenever the *selected index* changes (e.g., parent sets a new date)
  useEffect(() => {
    if (!didCenterOnceRef.current) return; // first time is handled in onLayout
    requestAnimationFrame(() => centerSelectedSilently(false));
  }, [selectedIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const onScrollBeginDrag = () => {
    userDraggingRef.current = true;
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!userDraggingRef.current) return; // ignore programmatic scrolls
    userDraggingRef.current = false;

    const raw = e.nativeEvent.contentOffset.x - sidePad;
    const idx = Math.round(raw / itemWidth);
    const clamped = Math.max(0, Math.min(days.length - 1, idx));
    const next = days[clamped];
    if (next && next.getTime() !== selected.getTime()) onChange(next);
  };

  return (
    <View onLayout={handleLayout}>
      <FlatList
        ref={listRef}
        data={days}
        keyExtractor={(d) => d.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        contentContainerStyle={
          centerSelected ? { paddingHorizontal: sidePad } : undefined
        }
        initialNumToRender={20}
        renderItem={({ item }) => {
          const isSelected = isSameDay(item, selected);
          return (
            <TouchableOpacity
              onPress={() => !isSelected && onChange(item)}
              disabled={isLoading && isSelected}
              activeOpacity={0.85}
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
