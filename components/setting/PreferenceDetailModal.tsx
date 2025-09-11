// components/SettingDetail.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";
import {
  setPreference,
  getPreference,
  PreferenceKey,
} from "@/services/PreferenceStorage";

type Props = {
  visible: boolean;
  onClose: () => void;
  categoryKey: PreferenceKey;
  label: string;
  options: string[];
};

export default function SettingDetail({
  visible,
  onClose,
  categoryKey,
  label,
  options,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (visible) {
      (async () => {
        const val = await getPreference(categoryKey);
        setSelected(val);
      })();
    }
  }, [visible]);

  const save = async (val: string) => {
    setSelected(val);
    await setPreference(categoryKey, val);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{label}</Text>
        </View>

        <FlatList
          data={options}
          keyExtractor={(i) => i}
          renderItem={({ item }) => {
            const active = item === selected;
            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  active && { borderColor: newTheme.accent },
                ]}
                onPress={() => save(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    active && { color: newTheme.accent },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      </View>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, paddingTop: 90 },
    header: { flexDirection: "row", alignItems: "center", padding: 16 },
    back: { fontSize: 22, color: theme.textPrimary, marginRight: 12 },
    title: { fontSize: 20, fontWeight: "700", color: theme.textPrimary },
    item: {
      padding: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "transparent",
      marginHorizontal: 16,
      marginVertical: 6,
      backgroundColor: theme.surface,
    },
    itemText: { color: theme.textPrimary, fontSize: 16 },
    sep: { height: 1, backgroundColor: theme.divider, marginHorizontal: 16 },
  });
