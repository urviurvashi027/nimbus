// components/SettingDetail.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";
import {
  setPreference,
  getPreference,
  PreferenceKey,
} from "@/services/PreferenceStorage";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;

  categoryKey: PreferenceKey | string;
  selectedUnit?: string | null;
  label: string;
  options: string[]; // for pills: ["00:00","01:00"...], for panels: ["ml","oz"] etc.
  onSave: (val: any) => void;
  onClose: () => void;
};

/** Helpers */
const normalize = (s?: string | null) =>
  (s ?? "").toString().trim().toLowerCase();
const normalizeHour = (s?: string | null) => {
  if (!s) return "";
  const parts = String(s).split(":");
  const hh = String(Number(parts[0] ?? "0")).padStart(2, "0");
  const mm = String(Number(parts[1] ?? "0")).padStart(2, "0");
  return `${hh}:${mm}`;
};

// recommended circadian times (used only for start_of_day / sleep_time)
const RECOMMENDED = ["05:00", "06:00", "07:00", "08:00", "09:00"];

// which keys should show the pill-style UI
const PILL_KEYS = new Set(["start_of_day", "sleep_time"]);

export default function SettingDetail({
  visible,
  onClose,
  categoryKey,
  selectedUnit,
  label,
  options,
  onSave,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const { userProfile } = useAuth();

  // load current preference when opening
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const val = await getPreference(categoryKey as PreferenceKey);
        setSelected(val ?? "");
      } catch (e) {
        console.warn("getPreference error", e);
      }
    })();
  }, [visible, categoryKey]);

  // determine UI mode: pill vs panel
  const isPillMode = PILL_KEYS.has(String(categoryKey));

  /* ---------- Panel mode helpers (original style) ---------- */
  const onSelectPanel = async (val: string) => {
    try {
      setSelected(val);
      await setPreference(categoryKey as PreferenceKey, val);
    } catch (e) {
      console.warn("setPreference error", e);
    }
  };

  /* ---------- Pill mode helpers (start_of_day / sleep_time) ---------- */
  const { recommendedOptions, otherOptions } = useMemo(() => {
    // normalize incoming options to HH:MM
    const normalizedOptions = options.map((o) => normalizeHour(o));
    const normalizedSet = new Set(normalizedOptions);

    const recommended = RECOMMENDED.filter((r) =>
      normalizedSet.has(normalizeHour(r))
    );
    const other = normalizedOptions.filter((o) => !recommended.includes(o));

    return { recommendedOptions: recommended, otherOptions: other };
  }, [options]);

  const onSelectPill = async (val: string) => {
    try {
      setSelected(val);
      await setPreference(categoryKey as PreferenceKey, val);
    } catch (e) {
      console.warn("setPreference error", e);
    }
  };

  const isActive = (opt: string) => {
    if (isPillMode) {
      const normSelected = normalizeHour(selected || selectedUnit || "");
      return normalizeHour(opt) === normSelected;
    } else {
      // panel mode: case-insensitive compare
      const normItem = normalize(opt);
      const normSelected = normalize(selected || selectedUnit || "");
      return normItem === normSelected;
    }
  };

  const doSave = () => {
    console.log(selected, categoryKey, "selected to save");
    if (categoryKey === "start_of_day" || categoryKey === "sleep_time") {
      // ensure selected is in HH:MM:SS format
      const timeValue = normalizeHour(selected || selectedUnit || "");
      if (timeValue) {
        const formatted = `${timeValue}:00`; // append seconds
        // call onSave with the selected time value
        const payload = {
          settings: {
            [categoryKey]: formatted,
          },
        };
        onSave(payload);
      }
    } else {
      const payload = {
        settings: {
          [categoryKey]: selected.toLowerCase(),
        },
      };
      onSave(payload);
    }

    onClose();
  };

  const cancel = () => {
    onClose();
  };

  if (!visible) return null;

  /* ---------- Footer buttons component used in both modes ---------- */
  const FooterButtons = () => (
    <View style={styles.footerWrapper}>
      <View style={styles.ctaRow}>
        <TouchableOpacity
          style={styles.btnAlt}
          onPress={cancel}
          activeOpacity={0.85}
        >
          <Text style={styles.btnAltText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={doSave}
          disabled={loading}
          activeOpacity={0.9}
        >
          <Text style={styles.btnPrimaryText}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{label}</Text>
        </View>

        {isPillMode ? (
          // Pill-mode UI (start_of_day, sleep_time)
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Best time to start your day
              </Text>
              <TouchableOpacity
                onPress={() => setShowInfo((s) => !s)}
                style={styles.infoBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={newTheme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {showInfo && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  These suggested times align with typical circadian rhythms —
                  waking between 5–9 AM supports morning light exposure and
                  consistent sleep schedules.
                </Text>
              </View>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedRow}
            >
              {recommendedOptions.length ? (
                recommendedOptions.map((opt) => {
                  const active = isActive(opt);
                  return (
                    <TouchableOpacity
                      key={`rec-${opt}`}
                      onPress={() => onSelectPill(opt)}
                      style={[styles.recPill, active && styles.recPillActive]}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.recPillText,
                          active && styles.recPillTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.smallMuted}>No recommended times</Text>
              )}
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
              Other times
            </Text>

            <View style={styles.pillWrap}>
              {otherOptions.map((opt) => {
                const active = isActive(opt);
                return (
                  <TouchableOpacity
                    key={`opt-${opt}`}
                    onPress={() => onSelectPill(opt)}
                    style={[
                      styles.pillInline,
                      active && styles.pillInlineActive,
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.pillInlineText,
                        active && styles.pillInlineTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <FooterButtons />
          </ScrollView>
        ) : (
          // Panel-mode UI (original style for units)
          <FlatList
            data={options}
            keyExtractor={(i) => i}
            renderItem={({ item }) => {
              const active = isActive(item);
              return (
                <TouchableOpacity
                  style={[styles.item, active && styles.itemActive]}
                  onPress={() => onSelectPanel(item)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[styles.itemText, active && styles.itemTextActive]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={FooterButtons}
          />
        )}
      </View>
    </Modal>
  );
}

/* Styles: combines pill and panel styles, re-uses Nimbus tokens */
const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: newTheme.background,
      paddingTop: 90,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    back: {
      fontSize: 22,
      color: newTheme.textPrimary,
      marginRight: 12,
    },
    title: { fontSize: 20, fontWeight: "700", color: newTheme.textPrimary },

    /* common list content spacing */
    listContent: {
      paddingBottom: 12,
    },

    /* panel mode (original) */
    item: {
      padding: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "transparent",
      marginHorizontal: 16,
      marginVertical: 6,
      backgroundColor: newTheme.surface,
    },
    itemActive: {
      borderColor: newTheme.accent,
    },
    itemText: { color: newTheme.textPrimary, fontSize: 16 },
    itemTextActive: { color: newTheme.accent },

    sep: {
      height: 1,
      backgroundColor: newTheme.divider,
      marginHorizontal: 16,
    },

    /* pill mode styles */
    scrollContent: {
      paddingBottom: Platform.OS === "ios" ? 26 : 16,
      paddingHorizontal: 16,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    sectionTitle: {
      marginTop: 6,
      marginBottom: 18,
      fontSize: 14,
      color: newTheme.textSecondary,
      fontWeight: "700",
    },
    infoBtn: { marginLeft: 8, marginBottom: 8 },
    infoBox: {
      backgroundColor: newTheme.surface,
      borderRadius: 10,
      padding: 12,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: newTheme.divider,
    },
    infoText: { color: newTheme.textSecondary, fontSize: 13, lineHeight: 22 },

    /* recommended */
    recommendedRow: {
      marginBottom: 18,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    recPill: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 22,
      backgroundColor: newTheme.surface,
      marginRight: 12,
      minWidth: 84,
      alignItems: "center",
      justifyContent: "center",
    },
    recPillActive: { backgroundColor: newTheme.accent },
    recPillText: { color: newTheme.textPrimary, fontWeight: "700" },
    recPillTextActive: { color: newTheme.background },

    /* other times pill grid */
    pillWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 18 },
    pillInline: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: newTheme.surface,
      marginRight: 10,
      marginBottom: 10,
      minWidth: 72,
      alignItems: "center",
      justifyContent: "center",
    },
    pillInlineActive: { backgroundColor: newTheme.accent },
    pillInlineText: { color: newTheme.textPrimary, fontWeight: "700" },
    pillInlineTextActive: { color: newTheme.background },

    smallMuted: { color: newTheme.textSecondary },

    /* footer */
    footerWrapper: {
      paddingTop: 8,
      paddingBottom: Platform.OS === "ios" ? 26 : 16,
    },
    ctaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    btnAlt: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: newTheme.divider,
      flex: 1,
      marginRight: 12,
    },
    btnAltText: { color: newTheme.textPrimary, fontWeight: "700" },
    btnPrimary: {
      backgroundColor: newTheme.accent,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      flex: 1,
      alignItems: "center",
    },
    btnPrimaryText: { color: newTheme.background, fontWeight: "700" },
  });
