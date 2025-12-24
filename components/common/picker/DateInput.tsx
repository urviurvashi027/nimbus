import React, { useMemo, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { Text } from "@/components/Themed";
import DatePickerSheet from "@/components/common/picker/DatePickerSheet";
import { format } from "date-fns";

type Props = {
  label?: string;
  value: Date;
  onChange: (next: Date) => void;

  // optional
  disabled?: boolean;
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  showYear?: boolean;
};

export default function DateInput({
  label = "Date",
  value,
  onChange,
  disabled = false,
  title,
  minimumDate,
  maximumDate,
  showYear = false,
}: Props) {
  const { newTheme } = React.useContext(ThemeContext);
  const styles = useMemo(() => createStyles(newTheme), [newTheme]);
  const [open, setOpen] = useState(false);

  const formatDate = (d: Date) => {
    return showYear ? format(d, "dd MMM yyyy") : format(d, "dd MMM");
  };

  return (
    <>
      {!!label && (
        <Text style={[styles.label, { color: newTheme.textSecondary }]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={disabled ? undefined : () => setOpen(true)}
        activeOpacity={0.9}
        style={[
          styles.input,
          {
            backgroundColor: newTheme.background,
            borderColor: newTheme.divider,
          },
          disabled && { opacity: 0.5 },
        ]}
      >
        <Text style={[styles.valueText, { color: newTheme.textPrimary }]}>
          {format(value, "dd MMM yyyy")}
          {/* {formatDate(value)} */}
        </Text>

        <Ionicons
          name="calendar-outline"
          size={18}
          color={newTheme.textSecondary}
        />
      </TouchableOpacity>

      <DatePickerSheet
        visible={open}
        value={value}
        title={title ?? label}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={onChange}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const createStyles = (t: any) =>
  StyleSheet.create({
    label: {
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    valueText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });
