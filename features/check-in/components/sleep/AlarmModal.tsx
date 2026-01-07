import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Modal, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ThemeContext from "@/context/ThemeContext";
import { toHHmm } from "@/utils/time";
import { PrimaryButton, GhostButton } from "./ui/Button";

export default function AlarmModal({
  visible,
  initialAlarm,
  onClose,
  onSave,
}: {
  visible: boolean;
  initialAlarm: Date;
  onClose: () => void;
  onSave: (alarm: Date) => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const [alarm, setAlarm] = useState(initialAlarm);

  const onChange = (e: DateTimePickerEvent, d?: Date) => d && setAlarm(d);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.backdrop,
          { backgroundColor: newTheme.background ?? "rgba(0,0,0,0.6)" },
        ]}
      >
        <View
          style={[
            styles.sheet,
            { backgroundColor: newTheme.surface, borderColor: newTheme.border },
          ]}
        >
          <Text style={[styles.title, { color: newTheme.textPrimary }]}>
            Set Alarm
          </Text>

          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={alarm}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              //   themeVariant={newTheme?.isDark ? "dark" : undefined}
              minuteInterval={1}
            />
            <Text style={[styles.readout, { color: newTheme.textPrimary }]}>
              {toHHmm(alarm)}
            </Text>
          </View>

          <View style={styles.actions}>
            <GhostButton title="Cancel" onPress={onClose} />
            <PrimaryButton title="Save" onPress={() => onSave(alarm)} />
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
    marginBottom: 8,
  },
  pickerWrap: { alignItems: "center" },
  readout: { fontSize: 20, fontWeight: "800", marginTop: 6 },
  actions: { flexDirection: "row", gap: 12, justifyContent: "space-between" },
});
