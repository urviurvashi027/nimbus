import React, { useContext, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import { Tab } from "./components/Tabs";
import { TimeRow } from "./components/TimeRow";
import { GhostButton } from "./components/GhostButton";
import { PrimaryButton } from "./components/PrimaryButton";
import { DurationPill } from "./components/DurationPill";
import { InfoRow } from "./components/InfoRow";

/* ---------- helpers ---------- */

function setHM(d: Date, h: number, m: number) {
  const t = new Date(d);
  t.setHours(h, m, 0, 0);
  return t;
}
function mergeHM(base: Date, src: Date) {
  const t = new Date(base);
  t.setHours(src.getHours(), src.getMinutes(), 0, 0);
  return t;
}
function addDays(d: Date, days: number) {
  const t = new Date(d);
  t.setDate(t.getDate() + days);
  return t;
}
function diffMinutes(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / 60000));
}
function formatHM(d: Date) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export type LogPayload = {
  bedTime: Date; // local date with hours/mins
  wakeTime: Date; // local date with hours/mins
  durationMin: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;

  /** Called when user taps Sleep Now */
  onSleepNow?: () => void;

  /** Called when user saves manual log */
  onSaveManual?: (payload: LogPayload) => void;

  /** Optional defaults for manual tab */
  defaultBed?: Date;
  defaultWake?: Date;
  // NEW: copy overrides (optional)
  titleText?: string; // default: "Log sleep"
  tabNowText?: string; // default: "Sleep Now"
  manualTitleText?: string; // default: "Add a past sleep"
  manualSubtitleText?: string; // default: "Pick yesterday’s bed time …"
  saveText?: string;
  nowTitle?: string;
  nowSubtitle?: string;
};

export default function LogSheet({
  visible,
  onClose,
  onSleepNow,
  onSaveManual,
  defaultBed,
  defaultWake,
  titleText = "Log sleep", // default: "Log sleep"
  tabNowText = "Sleep Now", // default: "Sleep Now"
  nowTitle = "Start sleeping now",
  nowSubtitle = "We will track your sleep from this moment until you wake up.",
  manualTitleText = "Add a past sleep", // default: "Add a past sleep"

  manualSubtitleText = "Pick yesterday’s bed time and today’s wake time (or any range). Duration is calculated automatically.", // default: "Pick yesterday’s bed time …"
  saveText = "Save log",
}: Props) {
  // simple tabs
  const [tab, setTab] = useState<"now" | "manual">("now");

  // Manual state
  const initBed = defaultBed ?? setHM(new Date(), 23, 0);
  const initWake = defaultWake ?? addDays(setHM(new Date(), 7, 0), 1); // next morning 07:00
  const [bedTime, setBedTime] = useState<Date>(initBed);
  const [wakeTime, setWakeTime] = useState<Date>(initWake);

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const durationMin = useMemo(
    () => diffMinutes(bedTime, wakeTime),
    [bedTime, wakeTime]
  );

  const onChange =
    (kind: "bed" | "wake") => (e: DateTimePickerEvent, d?: Date) => {
      if (!d) return;
      if (kind === "bed") setBedTime(mergeHM(bedTime, d));
      else setWakeTime(mergeHM(wakeTime, d));
    };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header + Tabs */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{titleText}</Text>
            <View style={styles.tabs}>
              <Tab
                label={tabNowText}
                active={tab === "now"}
                onPress={() => setTab("now")}
              />
              <Tab
                label={manualTitleText}
                active={tab === "manual"}
                onPress={() => setTab("manual")}
              />
            </View>
          </View>

          <View style={{ height: 20 }} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {tab === "now" ? (
              <View style={{ gap: 24 }}>
                <InfoRow title={nowTitle} subtitle={nowSubtitle} />
                <PrimaryButton
                  label={tabNowText}
                  onPress={() => {
                    onSleepNow?.();
                    onClose();
                  }}
                />
                <GhostButton label="Cancel" onPress={onClose} />
              </View>
            ) : (
              <View style={{ gap: 14 }}>
                <InfoRow
                  title={manualTitleText}
                  subtitle={manualSubtitleText}
                />

                <TimeRow
                  label="Bed time"
                  value={formatHM(bedTime)}
                  onChange={(d) => setBedTime(mergeHM(bedTime, d))}
                >
                  {/* // Date Time Picker for bed time */}
                  <DateTimePicker
                    mode="time"
                    textColor="#E6E6E6" // 👈 Nimbus light gray text
                    themeVariant="dark"
                    value={bedTime}
                    onChange={onChange("bed")}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                  />
                </TimeRow>

                <TimeRow
                  label="Wake time"
                  value={formatHM(wakeTime)}
                  onChange={(d) => setWakeTime(mergeHM(wakeTime, d))}
                >
                  {/* // Date Time Picker for bed time */}
                  <DateTimePicker
                    mode="time"
                    textColor="#E6E6E6" // 👈 Nimbus light gray text
                    themeVariant="dark"
                    value={wakeTime}
                    onChange={onChange("wake")}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                  />
                </TimeRow>

                <DurationPill minutes={durationMin} />

                <PrimaryButton
                  label={saveText}
                  onPress={() => {
                    onSaveManual?.({ bedTime, wakeTime, durationMin });
                    onClose();
                  }}
                />
                <GhostButton label="Cancel" onPress={onClose} />
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------- styles ---------- */

const styling = (newTheme: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: newTheme.overlay,
    },
    container: { flex: 1, justifyContent: "flex-end" },
    sheet: {
      backgroundColor: newTheme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: newTheme.border,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      maxHeight: "86%",
      shadowColor: newTheme.shadow,
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: -8 },
      elevation: 16,
    },
    handle: {
      width: 44,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: newTheme.borderMuted,
      alignSelf: "center",
      marginBottom: 15,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    title: { color: newTheme.textPrimary, fontSize: 18, fontWeight: "800" },
    tabs: { flexDirection: "row", gap: 8 },
  });
