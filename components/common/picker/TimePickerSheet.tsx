import React, { useEffect, useMemo, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";

type Props = {
  visible: boolean;
  value: Date;
  title?: string;
  onClose: () => void;
  onChange: (next: Date) => void;
  is24Hour?: boolean;
};

export default function TimePickerSheet({
  visible,
  value,
  title = "Select time",
  onClose,
  onChange,
  is24Hour = false,
}: Props) {
  const { newTheme } = React.useContext(ThemeContext);

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 220 : 160,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android fires "dismissed" / "set"
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        onClose();
        return;
      }
      if (selected) {
        onChange(selected);
        onClose();
      }
      return;
    }

    // iOS spinner: update value live
    if (selected) onChange(selected);
  };

  const styles = useMemo(() => createStyles(newTheme), [newTheme]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: anim, backgroundColor: "rgba(0,0,0,0.55)" },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheetWrap,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: newTheme.surface,
              borderColor: newTheme.divider,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: newTheme.textPrimary }]}>
              {title}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Close time picker"
            >
              <Ionicons name="close" size={20} color={newTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Picker */}
          <View style={styles.picker}>
            <DateTimePicker
              value={value}
              mode="time"
              accentColor={newTheme.accent}
              textColor={newTheme.textPrimary}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onPickerChange}
              is24Hour={is24Hour}
            />
          </View>

          {/* iOS Done */}
          {Platform.OS === "ios" && (
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.doneBtn,
                  { backgroundColor: newTheme.background },
                ]}
                activeOpacity={0.9}
              >
                <Text style={[styles.doneText, { color: newTheme.accent }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (t: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    sheetWrap: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 12,
      paddingBottom: 10,
    },
    sheet: {
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 24,
        },
        android: { elevation: 16 },
      }),
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
    },
    picker: {
      paddingBottom: Platform.OS === "ios" ? 8 : 0,
    },
    footer: {
      paddingHorizontal: 12,
      paddingBottom: 12,
      paddingTop: 6,
      alignItems: "flex-end",
    },
    doneBtn: {
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    doneText: {
      fontSize: 15,
      fontWeight: "800",
    },
  });
