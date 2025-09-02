import React, { useContext, useEffect, useRef, useState } from "react";
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
} from "react-native";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "../Themed";

const MAX_DAYS = 365;

interface DateScrollerProps {
  onDateChange: (date: Date) => Promise<any>;
}

export default function DateScroller({ onDateChange }: DateScrollerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 5; // show 5 at a time

  // Theme
  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, itemWidth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Generate days
  const days = Array.from({ length: MAX_DAYS * 2 }, (_, i) =>
    addDays(today, i - MAX_DAYS)
  );

  // console.log(days, "days");

  // Select a date (no scroll on tap)
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setLoading(true);
    try {
      await onDateChange(date);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to today on mount
  useEffect(() => {
    // onDateChange(new Date());
    // setSelectedDate(today);
    // onDateChange(today);

    setTimeout(() => {
      // use the same today reference everywhere
      const todayIndex = days.findIndex((d) => isSameDay(d, today));
      if (todayIndex !== -1) {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
          viewPosition: 0.5,
        });
        handleDateSelect(today); // ✅ single API call here
        // setSelectedDate(new Date());
      }
    }, 200);
  }, []);

  // When user swipes → first visible item becomes selected
  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const firstVisibleIndex = Math.round(offsetX / itemWidth);
    if (days[firstVisibleIndex]) {
      handleDateSelect(days[firstVisibleIndex]);
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMM dd"); // Fallback format
  };

  const renderItem = ({ item }: { item: Date }) => {
    const isSelected = isSameDay(item, selectedDate);

    return (
      <TouchableOpacity
        onPress={() => handleDateSelect(item)}
        style={[styles.dateBox, isSelected && styles.selectedBox]}
        disabled={loading && isSelected}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedText]}>
          {format(item, "EEE")}
        </Text>
        {loading && isSelected ? (
          <ActivityIndicator size="small" color={newTheme.textPrimary} />
        ) : (
          <Text style={[styles.dateText, isSelected && styles.selectedText]}>
            {format(item, "dd")}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={days}
        renderItem={renderItem}
        keyExtractor={(item) => item.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - itemWidth) / 2,
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      {/* <Text style={styles.dateLabel}>d:{getDateLabel(selectedDate)}</Text> */}
    </View>
  );
}

const styling = (theme: ThemeKey, newTheme: any, itemWidth: number) =>
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
    selectedBox: {
      backgroundColor: newTheme.accent,
    },
    dayText: {
      fontSize: 14,
      fontWeight: "500",
      color: newTheme.textSecondary,
    },
    dateText: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
      marginTop: 4,
    },
    selectedText: {
      color: newTheme.background,
      fontWeight: "700",
    },
    dateLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: newTheme.textPrimary,
      textAlign: "center",
      marginBottom: 12,
    },
  });
