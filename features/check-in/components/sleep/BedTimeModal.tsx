import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Modal, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import { toHHmm, overnightDiff, fmtDuration } from "@/utils/time";
import { PrimaryButton, GhostButton } from "./ui/Button";

export default function BedtimeModal({
  visible,
  initialBed,
  initialWake,
  onClose,
  onSave,
}: {
  visible: boolean;
  initialBed: Date;
  initialWake: Date;
  onClose: () => void;
  onSave: (bed: Date, wake: Date) => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const [bed, setBed] = useState<Date>(initialBed);
  const [wake, setWake] = useState<Date>(initialWake);

  const duration = useMemo(() => overnightDiff(bed, wake), [bed, wake]);
  const onChange =
    (setter: (d: Date) => void) => (e: DateTimePickerEvent, d?: Date) =>
      d && setter(d);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.backdrop,
          { backgroundColor: newTheme.overlay ?? "rgba(0,0,0,0.6)" },
        ]}
      >
        <View
          style={[
            styles.sheet,
            { backgroundColor: newTheme.card, borderColor: newTheme.border },
          ]}
        >
          <Text style={[styles.title, { color: newTheme.textPrimary }]}>
            Set Bedtime & Wake
          </Text>

          <View style={styles.pickersRow}>
            <View style={styles.pickerCol}>
              <Text
                style={[styles.pickerLabel, { color: newTheme.textSecondary }]}
              >
                Bedtime
              </Text>
              <DateTimePicker
                value={bed}
                mode="time"
                textColor="#E6E6E6" // 👈 Nimbus light gray text
                themeVariant="dark"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange(setBed)}
                // themeVariant={newTheme?.isDark ? "dark" : undefined}
                minuteInterval={1}
              />
              <Text
                style={[styles.valueReadout, { color: newTheme.textPrimary }]}
              >
                {toHHmm(bed)}
              </Text>
            </View>

            <View style={styles.pickerCol}>
              <Text
                style={[styles.pickerLabel, { color: newTheme.textSecondary }]}
              >
                Wake up
              </Text>
              <DateTimePicker
                value={wake}
                mode="time"
                textColor="#E6E6E6" // 👈 Nimbus light gray text
                themeVariant="dark"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange(setWake)}
                // themeVariant={newTheme?.isDark ? "dark" : undefined}
                minuteInterval={1}
              />
              <Text
                style={[styles.valueReadout, { color: newTheme.textPrimary }]}
              >
                {toHHmm(wake)}
              </Text>
            </View>
          </View>

          <View style={[styles.durationBar, { borderColor: newTheme.border }]}>
            <Text
              style={[styles.durationLabel, { color: newTheme.textSecondary }]}
            >
              Sleep duration
            </Text>
            <Text
              style={[styles.durationValue, { color: newTheme.textPrimary }]}
            >
              {fmtDuration(duration)}
            </Text>
          </View>

          <View style={styles.actions}>
            <GhostButton title="Cancel" onPress={onClose} />
            <PrimaryButton title="Save" onPress={() => onSave(bed, wake)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  pickersRow: { flexDirection: "row", gap: 16, paddingVertical: 8 },
  pickerCol: { flex: 1, alignItems: "center" },
  pickerLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  valueReadout: { fontSize: 20, fontWeight: "800", marginTop: 6 },
  durationBar: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  durationLabel: { fontSize: 12, fontWeight: "600" },
  durationValue: { fontSize: 18, fontWeight: "800", marginTop: 4 },
  actions: { flexDirection: "row", gap: 12, justifyContent: "space-between" },
});
