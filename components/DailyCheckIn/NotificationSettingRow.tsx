// components/Settings/NotificationSettingRow.tsx
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Switch,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text as RNText,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { Text } from "@/components/Themed"; // your app Text
import { themeColors } from "@/constant/theme/Colors";

export type OptionItem = { key: string; label: string };

interface NotificationSettingRowProps {
  /** Main label (e.g. "Notification") */
  label: string;
  /** Sub-label shown next to switch (e.g. "Remind me to drink water") */
  subtitle?: string;
  /** Switch state */
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  /** Dropdown selected key */
  valueKey?: string | null;
  /** Dropdown options */
  options?: OptionItem[];
  /** When option changes */
  onOptionSelect?: (item: OptionItem) => void;
  /** Optional small description above or below */
  helpText?: string;
  /** Disable (makes everything dim) */
  disabled?: boolean;
}

export const NotificationSettingRow: React.FC<NotificationSettingRowProps> = ({
  label,
  subtitle,
  enabled,
  onToggle,
  valueKey,
  options = [],
  onOptionSelect,
  helpText,
  disabled = false,
}) => {
  const { theme, newTheme } = useContext(ThemeContext);
  const colors = newTheme;
  const styles = styling(colors);

  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.key === valueKey)?.label ?? "Select";

  useEffect(() => {
    if (!enabled) {
      // If disabling, close modal
      setOpen(false);
    }
  }, [enabled]);

  return (
    <View style={styles.wrapper}>
      {/* top row: label + switch */}
      <View style={styles.rowTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>{label}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>

        <Switch
          value={enabled && !disabled}
          onValueChange={(v) => {
            if (!disabled) {
              onToggle(v);
            }
          }}
          //   onValueChange={(v) => !disabled && onToggle(v)}
          thumbColor={colors.surface}
          trackColor={{ true: colors.accent, false: colors.divider }}
          ios_backgroundColor={colors.divider}
          disabled={disabled}
        />
      </View>

      {/* small help text */}
      {helpText ? <Text style={styles.help}>{helpText}</Text> : null}

      {/* Dropdown selector (only interactive if enabled) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => enabled && !disabled && setOpen(true)}
        style={[
          styles.selector,
          { backgroundColor: enabled ? colors.surface : colors.background },
        ]}
      >
        <Text
          style={[
            styles.selectorText,
            { color: valueKey ? colors.textPrimary : colors.textSecondary },
          ]}
        >
          {selectedLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={enabled ? colors.textSecondary : colors.textSecondary}
        />
      </TouchableOpacity>

      {/* modal list */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <SafeAreaView pointerEvents="box-none" style={styles.centering}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose an option</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(i) => i.key}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 320 }}
              renderItem={({ item }) => {
                const selected = item.key === valueKey;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onOptionSelect?.(item);
                      setOpen(false);
                    }}
                    style={[
                      styles.modalItem,
                      selected && { backgroundColor: colors.accentPressed },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selected && { color: colors.background },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={
                          selected ? colors.background : colors.textPrimary
                        }
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.divider },
                  ]}
                />
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default NotificationSettingRow;

const styling = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      marginVertical: 12,
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    heading: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    sub: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    help: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    selector: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.divider,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    selectorText: {
      fontSize: 15,
    },

    // modal
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    centering: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    modalCard: {
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
      // shadow
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 12 },
      }),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    modalItem: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalItemText: {
      fontSize: 15,
      color: colors.textPrimary,
    },
    separator: {
      height: 1,
      width: "100%",
    },
  });
