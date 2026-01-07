import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { Row } from "./PartsRow";
import BedtimeModal from "./BedTimeModal";
import AlarmModal from "./AlarmModal";
import { fromHHmm, toHHmm } from "@/utils/time";

export type SleepTimeCardProps = {
  defaultBedtime?: string; // "23:00"
  defaultWake?: string; // "08:00"
  defaultAlarm?: string; // "08:00"
  onSaveBedWake?: (bedHHmm: string, wakeHHmm: string) => void;
  onSaveAlarm?: (alarmHHmm: string) => void;
};

export default function SleepTimeCard({
  defaultBedtime = "22:00",
  defaultWake = "09:00",
  defaultAlarm = "08:00",
  onSaveBedWake,
  onSaveAlarm,
}: SleepTimeCardProps) {
  const [bed, setBed] = useState(fromHHmm(defaultBedtime));
  const [wake, setWake] = useState(fromHHmm(defaultWake));
  const [alarm, setAlarm] = useState(fromHHmm(defaultAlarm));

  const { newTheme } = useContext(ThemeContext);

  // 🔁 keep local state in sync with props
  useEffect(() => {
    setBed(fromHHmm(defaultBedtime));
  }, [defaultBedtime]);

  useEffect(() => {
    setWake(fromHHmm(defaultWake));
  }, [defaultWake]);

  useEffect(() => {
    setAlarm(fromHHmm(defaultAlarm));
  }, [defaultAlarm]);

  const [showBedModal, setShowBedModal] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);

  return (
    <View>
      {/* Title */}
      <Text style={[styles.title, { color: newTheme.textPrimary }]}>
        Your Time
      </Text>
      <Row
        icon={
          <Ionicons
            name="moon-outline"
            size={20}
            color={newTheme.textSecondary}
          />
        }
        label="Bed time"
        value={`${toHHmm(bed)} → ${toHHmm(wake)}`}
        onPress={() => setShowBedModal(true)}
      />
      <View style={{ height: 12 }} />
      <Row
        icon={
          <Ionicons
            name="alarm-outline"
            size={20}
            color={newTheme.textSecondary}
          />
        }
        label="Alarm"
        value={toHHmm(alarm)}
        onPress={() => setShowAlarmModal(true)}
      />

      <BedtimeModal
        visible={showBedModal}
        initialBed={bed}
        initialWake={wake}
        onClose={() => setShowBedModal(false)}
        onSave={(b, w) => {
          setBed(b);
          setWake(w);
          setShowBedModal(false);
          onSaveBedWake?.(toHHmm(b), toHHmm(w));
        }}
      />

      <AlarmModal
        visible={showAlarmModal}
        initialAlarm={alarm}
        onClose={() => setShowAlarmModal(false)}
        onSave={(a) => {
          setAlarm(a);
          setShowAlarmModal(false);
          onSaveAlarm?.(toHHmm(a));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 10,
  },
});
