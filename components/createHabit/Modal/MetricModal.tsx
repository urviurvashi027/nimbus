import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text as RNText,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { Text } from "@/components/Themed";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton"; // adjust path if required
import InputField from "@/components/common/ThemedComponent/StyledInput";

// ---- Types (adjust per your project) ----
export type HabitUnit = { id: number; name: string };
export type MetricFormat = { count: string; unit: number; label?: string };
type EditData = { count: string; unit: number };

interface HabitMetricModalProps {
  visible: boolean;
  habitUnitList: HabitUnit[];
  onClose: () => void;
  isEditMode?: EditData | null;
  onSave: (value: MetricFormat) => void;
}

// ---- Main metric modal ----
export default function HabitMetricModal({
  visible,
  habitUnitList,
  onClose,
  isEditMode,
  onSave,
}: HabitMetricModalProps) {
  //  const { theme, newTheme } = useContext(ThemeContext);
  //   const { theme,newTheme } = useContext(The);

  const [unitPickerOpen, setUnitPickerOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [target, setTarget] = useState<string>("");
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setTarget(String(isEditMode.count ?? ""));
      setSelectedUnitId(isEditMode.unit ?? null);
    } else {
      setTarget("");
      setSelectedUnitId(null);
    }
  }, [isEditMode, visible]);

  const selectedLabel = useMemo(
    () => habitUnitList.find((u) => u.id === selectedUnitId)?.name ?? "",
    [habitUnitList, selectedUnitId]
  );

  // If unit list comes from remote later, toggle this; currently it's passed as prop
  useEffect(() => {
    if (!habitUnitList || habitUnitList.length === 0) return;
    // simulate possible load state (remove if not needed)
    setLoadingUnits(false);
  }, [habitUnitList]);

  const handleSave = () => {
    if (!target || !selectedUnitId) return;
    onSave({ count: target, unit: selectedUnitId, label: selectedLabel });
    onClose();
  };

  // For StyledButton type-safety: wrapper to pass event if required by your button's typings
  const handleSavePress = (e?: any) => {
    handleSave();
  };

  const { newTheme } = React.useContext(ThemeContext);

  //   console.log(habitUnitList, "habitUnitList");

  return (
    <>
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.centering}
        >
          <SafeAreaView style={{ width: "100%" }}>
            {/* Card (centered) */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: newTheme.surface,
                  borderColor: newTheme.divider,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: newTheme.textPrimary }]}>
                  Select Habit Metric
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={22}
                    color={newTheme.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              {/* Unit selector */}
              <Text style={[styles.label, { color: newTheme.textPrimary }]}>
                Unit
              </Text>

              {/* Unit chooser - opens centered UnitPickerModal */}
              <TouchableOpacity
                style={[
                  styles.selector,
                  {
                    borderColor: newTheme.divider,
                    backgroundColor: newTheme.background,
                  },
                ]}
                onPress={() => setUnitPickerOpen(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: selectedUnitId
                      ? newTheme.textPrimary
                      : newTheme.textSecondary,
                  }}
                >
                  {selectedUnitId ? selectedLabel : "Select an item"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={newTheme.textSecondary}
                />
              </TouchableOpacity>

              <InputField
                label="Target"
                // preset="email"
                value={target}
                onChangeText={setTarget}
                // value={email}
                // onChangeText={validateEmail}
                placeholder="Enter Target"
              />

              <View style={{ height: 18 }} />

              {/* CTA */}
              <View style={styles.cta}>
                <StyledButton
                  label="Save"
                  onPress={handleSavePress}
                  disabled={!target || !selectedUnitId}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>

        {unitPickerOpen && (
          <>
            <View style={styles.inlineOverlay} />
            <SafeAreaView style={styles.inlineContainer}>
              <View
                style={[
                  styles.smallCard,
                  {
                    backgroundColor: newTheme.surface,
                    borderColor: newTheme.divider,
                  },
                ]}
              >
                <View style={styles.smallHeader}>
                  <Text
                    style={[styles.smallTitle, { color: newTheme.textPrimary }]}
                  >
                    Select unit
                  </Text>
                  <TouchableOpacity onPress={() => setUnitPickerOpen(false)}>
                    <Ionicons
                      name="close"
                      size={20}
                      color={newTheme.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                {loadingUnits ? (
                  <View style={styles.centeredRow}>
                    <ActivityIndicator size="small" color={newTheme.accent} />
                  </View>
                ) : (
                  <FlatList
                    data={habitUnitList}
                    keyExtractor={(it) => String(it.id)}
                    style={{ maxHeight: 320 }}
                    renderItem={({ item }) => {
                      const selected = item.id === selectedUnitId;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedUnitId(item.id);
                            setUnitPickerOpen(false);
                          }}
                          style={[
                            styles.unitRow,
                            {
                              backgroundColor: selected
                                ? newTheme.surface
                                : "transparent",
                            },
                          ]}
                        >
                          <Text style={{ color: newTheme.textPrimary }}>
                            {item.name}
                          </Text>
                          {selected && (
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color={newTheme.accent}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View
                        style={{ height: 1, backgroundColor: newTheme.divider }}
                      />
                    )}
                  />
                )}
              </View>
            </SafeAreaView>
          </>
        )}
      </Modal>
    </>
  );
}

/* ----- styles ----- */
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  centering: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    // backgroundColor: "red",
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 22,
    borderWidth: 1,
    // maxHeight: "80%",
    backgroundColor: "red",
    // subtle shadow
    // elevation/shadow for platform:
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  selector: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  cta: {
    marginTop: 12,
  },
  saveButton: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 12,
  },

  /* inline small picker card */
  inlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  inlineContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    top: "30%",
    // top: 250,
    // justifyContent: "center",
    alignItems: "center",
  },
  smallCard: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    maxWidth: 640,
  },
  smallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  smallTitle: { fontSize: 16, fontWeight: "700" },
  unitRow: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centeredRow: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
