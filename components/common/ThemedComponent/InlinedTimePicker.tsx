import React, { useContext, useMemo, useRef } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  label?: string;
  value: Date; // controlled value (time portion used)
  onChange: (d: Date) => void; // fire with updated Date
  minuteStep?: number; // default 5
  use12h?: boolean; // default true
  disabled?: boolean;
  error?: string;
};

const ITEM_HEIGHT = 42;
const { width } = Dimensions.get("window");

// snap Y offset -> index
const snapIndex = (y: number) => Math.round(y / ITEM_HEIGHT);

type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
// Allowed minute intervals per iOS spec
const ALLOWED_MINUTES = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;

export default function InlineTimePicker({
  label,
  value,
  onChange,
  minuteStep = 5,
  use12h = true,
  disabled = false,
  error,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  // iOS needs the union type MinuteInterval
  const minuteInterval: MinuteInterval = (ALLOWED_MINUTES.find(
    (v) => v === minuteStep
  ) ?? 5) as MinuteInterval;

  /**
   * iOS — native spinner
   */
  if (Platform.OS === "ios") {
    return (
      <View style={styles.wrapper}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.card, disabled && { opacity: 0.5 }]}>
          <DateTimePicker
            mode="time"
            value={value}
            textColor={newTheme.textPrimary} // 👈 use your Nimbus theme color
            onChange={(_: DateTimePickerEvent, d?: Date) => {
              if (d) onChange(d);
            }}
            minuteInterval={minuteInterval}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            // NOTE: community picker supports themeVariant on iOS
            // themeVariant={newTheme.isDark ? "dark" : "light"}
            disabled={disabled}
            style={{ alignSelf: "stretch" }}
          />
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  /**
   * Android — custom inline wheel (hours / minutes / AMPM)
   */
  const hoursData = useMemo(() => {
    return use12h
      ? Array.from({ length: 12 }, (_, i) => (i + 1).toString()) // 1..12
      : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")); // 00..23
  }, [use12h]);

  const minutesData = useMemo(() => {
    const n = Math.floor(60 / minuteStep);
    return Array.from({ length: n }, (_, i) =>
      String(i * minuteStep).padStart(2, "0")
    );
  }, [minuteStep]);

  // derive current positions
  const hour24 = value.getHours();
  const isPM = hour24 >= 12;
  const hourIndexInit = use12h ? (hour24 + 11) % 12 /* 0..11 */ : hour24; // 0..23
  const minuteIndexInit =
    Math.round(value.getMinutes() / minuteStep) % minutesData.length;

  // keep *live* indices in refs to avoid using stale “initial” values
  const hourIdxRef = useRef<number>(hourIndexInit);
  const minuteIdxRef = useRef<number>(minuteIndexInit);
  const isPmRef = useRef<boolean>(isPM);

  const hourListRef = useRef<FlatList<string>>(null);
  const minuteListRef = useRef<FlatList<string>>(null);

  const setTimeFromRefs = () => {
    const hIdx = hourIdxRef.current;
    const mIdx = minuteIdxRef.current;
    const pm = isPmRef.current;

    let nextHour24: number;
    if (use12h) {
      const base12 = hIdx + 1; // 1..12
      nextHour24 = pm ? (base12 % 12) + 12 : base12 % 12; // 12->0/12 handled
    } else {
      nextHour24 = hIdx; // 0..23
    }

    const minutes = (mIdx * minuteStep) % 60;
    const next = new Date(value);
    next.setHours(nextHour24, minutes, 0, 0);
    onChange(next);
  };

  const onHourMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    hourIdxRef.current = snapIndex(e.nativeEvent.contentOffset.y);
    setTimeFromRefs();
  };

  const onMinuteMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    minuteIdxRef.current = snapIndex(e.nativeEvent.contentOffset.y);
    setTimeFromRefs();
  };

  const onToggleAMPM = (nextPM: boolean) => {
    if (!use12h) return;
    isPmRef.current = nextPM;
    setTimeFromRefs();
  };

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.card, disabled && { opacity: 0.5 }]}>
        <View style={styles.row}>
          {/* Hours */}
          <FlatList
            ref={hourListRef}
            data={hoursData}
            keyExtractor={(item, i) => `h-${item}-${i}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            initialScrollIndex={hourIndexInit}
            getItemLayout={(_, i) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * i,
              index: i,
            })}
            onMomentumScrollEnd={onHourMomentumEnd}
            renderItem={({ item, index }) => {
              // compare against *live* ref so UI updates when scrolled
              const selected = index === hourIdxRef.current;
              return (
                <View style={[styles.item, selected && styles.itemSelected]}>
                  <Text
                    style={[
                      styles.itemText,
                      selected && styles.itemTextSelected,
                    ]}
                  >
                    {use12h ? item.padStart(2, " ") : item}
                  </Text>
                </View>
              );
            }}
            style={{ width: (width - 48) / (use12h ? 3 : 2) }}
            contentContainerStyle={styles.listPad}
          />

          {/* Minutes */}
          <FlatList
            ref={minuteListRef}
            data={minutesData}
            keyExtractor={(item, i) => `m-${item}-${i}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            initialScrollIndex={minuteIndexInit}
            getItemLayout={(_, i) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * i,
              index: i,
            })}
            onMomentumScrollEnd={onMinuteMomentumEnd}
            renderItem={({ item, index }) => {
              const selected = index === minuteIdxRef.current;
              return (
                <View style={[styles.item, selected && styles.itemSelected]}>
                  <Text
                    style={[
                      styles.itemText,
                      selected && styles.itemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              );
            }}
            style={{ width: (width - 48) / (use12h ? 3 : 2) }}
            contentContainerStyle={styles.listPad}
          />

          {/* AM / PM */}
          {use12h && (
            <View style={[styles.ampmCol, { width: (width - 48) / 3 }]}>
              <ToggleChip
                label="AM"
                active={!isPmRef.current}
                onPress={() => onToggleAMPM(false)}
                theme={newTheme}
              />
              <ToggleChip
                label="PM"
                active={isPmRef.current}
                onPress={() => onToggleAMPM(true)}
                theme={newTheme}
              />
            </View>
          )}
        </View>

        {/* Highlight overlay */}
        <View pointerEvents="none" style={styles.overlay} />
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function ToggleChip({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        {
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          marginVertical: 6,
          alignItems: "center",
          backgroundColor: active ? theme.accent : theme.surface,
        },
      ]}
    >
      <Text
        style={{
          color: active ? theme.background : theme.textPrimary,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styling = (t: any) =>
  StyleSheet.create({
    wrapper: { marginTop: 8 },
    label: {
      color: t.textSecondary,
      fontSize: 13,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    card: {
      borderRadius: 16,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.borderMuted ?? t.divider,
      padding: 12,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    listPad: {
      paddingVertical: ITEM_HEIGHT * 2, // center first/last
    },
    item: {
      height: ITEM_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.65,
    },
    itemSelected: { opacity: 1 },
    itemText: {
      fontSize: 18,
      color: t.textSecondary,
      fontWeight: "600",
    },
    itemTextSelected: {
      color: t.textPrimary,
      fontSize: 22,
      fontWeight: "700",
    },
    ampmCol: { alignItems: "center", justifyContent: "center" },
    overlay: {
      position: "absolute",
      top: "50%",
      left: 12,
      right: 12,
      height: ITEM_HEIGHT,
      marginTop: -ITEM_HEIGHT / 2,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: t.accent,
      opacity: 0.25,
    },
    error: { color: "#ff6b6b", marginTop: 8, fontSize: 12 },
  });
