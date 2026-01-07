import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { PrimaryButton, GhostButton } from "./ui/LogSheetButton";
import { BookChips } from "./ui/BookChips";
import { MoodChips, Mood } from "./ui/MoodChips";
import { MinuteStepper } from "./ui/MinuteStepper";
import { toISODate, toHHmmReading, durationFromRange } from "@/utils/time";
import ThemeContext from "@/context/ThemeContext";

export type QuickLogPayload = {
  bookId?: string;
  minutes: number;
  pages?: number;
  startedAt?: string;
  endedAt?: string;
  date: string; // YYYY-MM-DD
  mood?: Mood;
  notes?: string;
  source: "quick" | "timer";
};

export default function QuickLogTab({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (payload: QuickLogPayload) => void;
}) {
  const [bookId, setBookId] = useState<string | undefined>(undefined);
  const [minutes, setMinutes] = useState(20);
  const [pages, setPages] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  // const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const derivedMinutes = useMemo(() => {
    if (start && end) return durationFromRange(start, end);
    return minutes;
  }, [start, end, minutes]);

  const save = () => {
    const payload: QuickLogPayload = {
      bookId,
      minutes: Math.max(5, Math.min(240, derivedMinutes)),
      pages: pages ? parseInt(pages, 10) : undefined,
      startedAt: start ? new Date(start).toISOString() : undefined,
      endedAt: end ? new Date(end).toISOString() : undefined,
      date: toISODate(date),
      // mood,
      notes: notes?.trim() || undefined,
      source: "quick",
    };
    onSave(payload);
  };

  const onChange =
    (setter: (d: Date) => void) => (_: DateTimePickerEvent, d?: Date) => {
      if (d) setter(d);
    };

  return (
    <View>
      <Text style={styles.label}>Book</Text>
      <BookChips value={bookId} onChange={setBookId} />

      <View style={{ height: 12 }} />
      <Text style={styles.label}>Minutes</Text>
      <MinuteStepper value={minutes} onChange={setMinutes} min={5} max={240} />

      <View style={{ height: 12 }} />

      <View style={{ height: 8 }} />

      {/* <View style={{ height: 12 }} />
      <Text style={styles.label}>Mood</Text> */}
      {/* <MoodChips value={mood} onChange={setMood} /> */}

      <View style={{ height: 12 }} />
      <Text style={styles.label}>Notes</Text>
      <TextInput
        placeholder="What did you read?"
        placeholderTextColor={newTheme.textSecondary}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notes}
      />
      <View style={{ height: 20 }} />

      {/* <View style={styles.actions}> */}
      {/* {!running ? ( */}
      <PrimaryButton
        title={"Start"}
        // onPress={() => setRunning(true)}
      />
      {/* // ) : (
        //   <View style={{ flexDirection: "row", gap: 12 }}>
        //     <GhostButton title="Pause" onPress={() => setRunning(false)} />
        //     <PrimaryButton title="End" onPress={end} />
        //   </View>
        // )} */}

      <View style={{ height: 10 }} />
      <GhostButton title="Cancel" onPress={onCancel} />
      {/* </View> */}
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    label: {
      color: newTheme.textPrimary,
      fontSize: 12,
      marginBottom: 6,
      fontWeight: "700",
    },
    subLabel: {
      color: newTheme.textSecondary,
      fontSize: 11,
      marginBottom: 4,
      fontWeight: "600",
    },
    row: { flexDirection: "row", alignItems: "center" },
    helper: { color: newTheme.textSecondary, fontSize: 12, marginTop: 6 },
    notes: {
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: newTheme.border,
      padding: 12,
      color: newTheme.textPrimary,
      backgroundColor: newTheme.card,
    },
    actions: { flexDirection: "row", gap: 12, marginTop: 14 },
  });
