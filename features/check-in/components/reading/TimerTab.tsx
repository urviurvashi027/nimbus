import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PrimaryButton, GhostButton } from "./ui/LogSheetButton";
import { MoodChips, Mood } from "./ui/MoodChips";
import { BookChips } from "./ui/BookChips";
import ThemeContext from "@/context/ThemeContext";

export default function TimerTab({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (p: any) => void;
}) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [bookId, setBookId] = useState<string | undefined>();
  const [mood, setMood] = useState<Mood | undefined>();
  const startedRef = useRef<Date | null>(null);

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  useEffect(() => {
    let id: any;
    if (running) {
      if (!startedRef.current) startedRef.current = new Date();
      id = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => id && clearInterval(id);
  }, [running]);

  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;

  const end = () => {
    const startISO = startedRef.current
      ? startedRef.current.toISOString()
      : undefined;
    const endISO = new Date().toISOString();
    const payload = {
      bookId,
      minutes: Math.max(1, Math.round(elapsed / 60)),
      startedAt: startISO,
      endedAt: endISO,
      date: new Date().toISOString().slice(0, 10),
      mood,
      source: "timer" as const,
    };
    onSave(payload);
  };

  return (
    <View>
      <Text style={styles.label}>Book</Text>
      <BookChips value={bookId} onChange={setBookId} />

      <View style={{ height: 16 }} />
      <View style={styles.timerWrap}>
        <Text style={styles.timerText}>
          {mm.toString().padStart(2, "0")}:{ss.toString().padStart(2, "0")}
        </Text>
      </View>

      {/* <View style={{ height: 12 }} /> */}
      {/* <Text style={styles.label}>Mood</Text> */}
      {/* <MoodChips value={mood} onChange={setMood} /> */}

      <View style={{ height: 14 }} />
      {!running ? (
        <PrimaryButton
          title={elapsed === 0 ? "Start" : "Resume"}
          onPress={() => setRunning(true)}
        />
      ) : (
        <View style={{ flexDirection: "row", gap: 12 }}>
          <GhostButton title="Pause" onPress={() => setRunning(false)} />
          <PrimaryButton title="End" onPress={end} />
        </View>
      )}

      <View style={{ height: 8 }} />
      <GhostButton title="Cancel" onPress={onCancel} />
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    timerWrap: {
      height: 110,
      borderRadius: 16,
      backgroundColor: newTheme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "#262B36",
      alignItems: "center",
      justifyContent: "center",
    },
    timerText: {
      color: newTheme.textPrimary,
      fontSize: 40,
      fontWeight: "800",
      letterSpacing: 1,
    },
    label: {
      color: newTheme.textPrimary,
      fontSize: 12,
      marginBottom: 6,
      fontWeight: "700",
    },
  });
