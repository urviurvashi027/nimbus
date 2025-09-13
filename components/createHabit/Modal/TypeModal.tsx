import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export type TaskType = {
  id: number;
  name: string;
  description: string;
  is_global: boolean;

  // id: string;
  // label: string;
  // // optional emoji/icon string to show on left
  // icon?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  options: TaskType[];
  selectedId?: number | null;
  onSelect: (option: TaskType) => void;
  title?: string;
};

export default function TypeModal({
  visible,
  onClose,
  options,
  selectedId = null,
  onSelect,
  title = "Select Habit Types",
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const { newTheme } = React.useContext(ThemeContext);

  const renderItem = ({ item }: { item: TaskType }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(item)}
        style={[
          styles.row,
          {
            borderBottomColor: newTheme.divider,
            backgroundColor: newTheme.surface,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`Select ${item.name}`}
      >
        <View style={styles.left}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: isSelected
                  ? newTheme.accent
                  : newTheme.background,
              },
            ]}
          >
            <Text
              style={[
                styles.iconText,
                {
                  color: isSelected
                    ? newTheme.background
                    : newTheme.textPrimary,
                },
              ]}
            >
              {"🏷️"}
            </Text>
          </View>
          <View style={styles.textWrap}>
            <Text style={[styles.labelText, { color: newTheme.textPrimary }]}>
              {item.name}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          {
            isSelected ? (
              <View style={[styles.tickWrap, { borderColor: newTheme.accent }]}>
                <Ionicons name="checkmark" size={16} color={newTheme.accent} />
              </View>
            ) : null
            // (
            //   <Ionicons
            //     name="chevron-forward"
            //     size={20}
            //     color={newTheme.textSecondary}
            //   />
            // )
          }
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: "rgba(0,0,0,0.55)", opacity: fadeAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        pointerEvents={visible ? "auto" : "none"}
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: newTheme.surface,
              borderColor: newTheme.divider,
            },
          ]}
        >
          {/* header */}
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: newTheme.textPrimary }]}
              accessibilityRole="header"
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={22} color={newTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 12 }}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "700" },

  list: {
    maxHeight: 320,
  },

  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 0,
    borderBottomWidth: 1,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 18,
    lineHeight: 20,
  },

  textWrap: {
    minWidth: 120,
  },

  labelText: {
    fontSize: 16,
    fontWeight: "600",
  },

  right: {
    alignItems: "center",
    justifyContent: "center",
  },

  tickWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
