import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  GestureResponderEvent,
} from "react-native";

/**
 * MoodTracker (updated)
 * - Emojis are visually "dull" (reduced opacity) when not selected
 * - When a mood is logged (selected) the entire pill is highlighted with a tinted background
 * - Removed "button-like" visual affordances (no shadow/elevation, no pressed style)
 * - Icon itself does not get extra effects on press (only selection highlight applies)
 * - Proper vertical alignment and consistent sizing
 */

type Mood = {
  id: string;
  label: string;
  // icon can be an emoji ("😄") or a remote/local uri
  icon?: string;
  color?: string; // optional tint/highlight color
};

type Props = {
  moods: Mood[];
  selectedId?: string | null;
  apiEndpoint?: string | null;
  method?: "POST" | "PUT" | "PATCH";
  extraPayload?: Record<string, any>;
  headers?: Record<string, string>;
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
  onSelect?: (mood: Mood) => void;
  containerStyle?: object;
};

export default function MoodTracker({
  moods,
  selectedId: selectedIdProp = null,
  apiEndpoint = null,
  method = "POST",
  extraPayload = {},
  headers = { "Content-Type": "application/json" },
  onSuccess,
  onError,
  onSelect,
  containerStyle,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(selectedIdProp);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  React.useEffect(() => {
    setSelectedId(selectedIdProp ?? null);
  }, [selectedIdProp]);

  const sendMoodToServer = useCallback(
    async (mood: Mood) => {
      if (!apiEndpoint) return null;
      const payload = {
        moodId: mood.id,
        moodLabel: mood.label,
        timestamp: new Date().toISOString(),
        ...extraPayload,
      };

      try {
        setLoadingId(mood.id);
        const res = await fetch(apiEndpoint, {
          method,
          headers,
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        setLoadingId(null);
        if (!res.ok) {
          const err = { status: res.status, body: data };
          onError?.(err);
          return Promise.reject(err);
        }

        onSuccess?.(data);
        return data;
      } catch (err) {
        setLoadingId(null);
        onError?.(err);
        return Promise.reject(err);
      }
    },
    [apiEndpoint, method, extraPayload, headers, onError, onSuccess]
  );

  const handlePress = useCallback(
    async (mood: Mood, e?: GestureResponderEvent) => {
      // optimistic local update
      const prevSelected = selectedId;
      setSelectedId(mood.id);
      onSelect?.(mood);

      if (!apiEndpoint) return;

      try {
        await sendMoodToServer(mood);
      } catch (err) {
        // revert on failure
        setSelectedId(prevSelected ?? null);
        Alert.alert("Could not save mood", "Please try again.");
      }
    },
    [apiEndpoint, onSelect, sendMoodToServer, selectedId]
  );

  const renderItem = ({ item }: { item: Mood }) => {
    const isSelected = item.id === selectedId;
    const isLoading = item.id === loadingId;

    return (
      <Pressable
        key={item.id}
        onPress={(e) => handlePress(item, e)}
        accessibilityRole="button"
        accessibilityLabel={`Select mood ${item.label}`}
        style={styles.wrapper}
      >
        <View style={[styles.pill, isSelected && styles.pillSelected]}>
          <View style={styles.iconContainer} pointerEvents="none">
            {item.icon?.startsWith("http") ? (
              <Image
                source={{ uri: item.icon }}
                style={[
                  styles.iconImage,
                  isSelected ? styles.iconSelected : styles.iconUnselected,
                ]}
              />
            ) : (
              <Text
                style={[
                  styles.iconText,
                  isSelected ? styles.iconSelected : styles.iconUnselected,
                ]}
              >
                {item.icon ?? "🙂"}
              </Text>
            )}
          </View>
          {/* 
          <Text
            style={[styles.label, isSelected && styles.labelSelected]}
            numberOfLines={1}
          >
            {item.label}
          </Text> */}

          {isLoading ? <ActivityIndicator style={styles.loading} /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={moods}
        horizontal
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 8,
  },
  listContent: {
    paddingLeft: 8,
    paddingRight: 16,
    alignItems: "center",
  },
  wrapper: {
    // small touch target padding but the visual pill itself won't show pressed effects
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  pill: {
    width: 60,
    height: 96,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  pillSelected: {
    backgroundColor: "rgba(158, 198, 145, 0.14)", // soft green tint
    borderWidth: 1,
    borderColor: "rgba(158, 198, 145, 0.5)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 8,
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  iconText: {
    fontSize: 26,
    // lineHeight: 30,
  },
  // when not selected: dull (reduced opacity)
  iconUnselected: {
    opacity: 0.36,
  },
  // when selected: full opacity and slight scale to feel "active"
  iconSelected: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  //   label: {
  //     color: "#D6D6D6",
  //     fontSize: 12,
  //     textAlign: "center",
  //     width: 72,
  //   },
  //   labelSelected: {
  //     color: "#EAF5E6",
  //     fontWeight: "600",
  //   },
  loading: {
    position: "absolute",
    bottom: 8,
  },
});
