import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useNavigation } from "expo-router";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MAX_WEEK = 52; // 1 year forward
const MIN_WEEK = -52; // 1 year backward

// Helper function to generate dates for a given week index
const generateWeekDates = (weekIndex: number): Date[] => {
  const today = new Date();
  const start = startOfWeek(addDays(today, weekIndex * 7), { weekStartsOn: 1 }); // Monday as start
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

interface DatePanelProps {
  onDateChange: any;
  //   getSelectedDate: any;
}

export default function DatePanel(props: DatePanelProps) {
  const { onDateChange } = props;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(0);
  //  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get("window").width;

  // Generate dates for the previous, current, and next weeks
  const prevWeekDates = generateWeekDates(currentWeek - 1);
  const currentWeekDates = generateWeekDates(currentWeek);
  const nextWeekDates = generateWeekDates(currentWeek + 1);

  const flatListData = [prevWeekDates, currentWeekDates, nextWeekDates];

  // Handle scroll events to determine swipe direction
  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);

    if (newIndex === 0 && currentWeek - 1 >= MIN_WEEK) {
      setCurrentWeek((prev) => prev - 1);
    } else if (newIndex === 2 && currentWeek + 1 <= MAX_WEEK) {
      setCurrentWeek((prev) => prev + 1);
    }

    // Reset the FlatList to the center position
    flatListRef.current?.scrollToOffset({
      offset: screenWidth,
      animated: false,
    });
  };

  useEffect(() => {
    // After updating the currentWeek, set the selected date and reset FlatList to center position
    if (currentWeek === 0) {
      // Current week: Select today
      setSelectedDate(new Date());
      //   onDateChange(selectedDate);
    } else {
      // Other weeks: Select Monday
      const weekDates = generateWeekDates(currentWeek);
      setSelectedDate(weekDates[0]); // Monday
      //   onDateChange(selectedDate);
    }
    // After updating the currentWeek, reset FlatList to center position
    flatListRef.current?.scrollToOffset({
      offset: screenWidth,
      animated: false,
    });
  }, [currentWeek]);

  const getDayLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, tomorrow)) {
      return "Tomorrow";
    } else {
      return format(date, "MMM dd, yyyy");
    }
  };

  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate]);

  const renderWeek = ({ item }: { item: Date[] }) => {
    return (
      <View style={styles.weekContainer}>
        {item.map((date) => {
          const isSelected = isSameDay(date, selectedDate);

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[styles.dayContainer, isSelected && styles.selectedDay]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={styles.dayText}>
                {daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]}
              </Text>
              <View style={styles.dateCircle}>
                <Text style={styles.dateText}>{format(date, "dd")}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.headerText}>{getDayLabel(selectedDate)}</Text>
      <FlatList
        ref={flatListRef}
        data={flatListData}
        renderItem={renderWeek}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContainer}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        initialScrollIndex={1} // Start at the center (Current Week)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1, // Ensures full screen coverage
  },
  container: {
    flex: 4, // Covers the full available space
    paddingTop: 16,
    paddingHorizontal: 5,
    paddingBottom: 16, // Adjust as needed for Safe Area
    backgroundColor: "#fff",
    position: "relative", // Establishes positioning context for the floating button
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10, // Space between header and FlatList
    // textAlign: 'center',
  },
  flatList: {
    flex: 1,
    // No additional styles needed
  },
  scrollContainer: {
    // Add any necessary styles here if needed
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: Dimensions.get("window").width,
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 5, // Adjusted for better touchability
    width: Dimensions.get("window").width / 7 - 16, // Ensure each day occupies equal width minus margins
  },
  selectedDay: {
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0, // No margin needed
  },
  dateText: {
    fontSize: 16,
  },
  taskListContainer: {
    flex: 12, // Takes up the remaining space
    marginTop: 10, // 10px space between FlatList and TaskList
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 0, // Aligns with container's horizontal padding
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
