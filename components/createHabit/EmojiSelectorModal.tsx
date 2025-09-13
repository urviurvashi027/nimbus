// components/common/EmojiSelector.tsx
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import EmojiPicker, { type EmojiType } from "rn-emoji-keyboard";
import ThemeContext from "@/context/ThemeContext";

type EmojiSelectorProps = {
  value?: string;
  onSelect: (emoji: string) => void;
  placeholder?: string;
  size?: number;
};

export default function EmojiSelector({
  value,
  onSelect,
  placeholder = "😀",
  size = 35,
}: EmojiSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { newTheme } = React.useContext(ThemeContext);

  const handlePick = (obj: EmojiType) => {
    // emoji object example -> { emoji: "😊", name: "smiling face", ... }
    onSelect(obj.emoji);
    setOpen(false);
  };

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.button,
          {
            // backgroundColor: newTheme.surface,
            borderColor: newTheme.background,
          },
        ]}
        accessibilityLabel="Open emoji picker"
      >
        <Text style={[styles.emoji, { fontSize: size }]}>
          {value || placeholder}
        </Text>
      </Pressable>

      <EmojiPicker
        open={open}
        onClose={() => setOpen(false)} // <-- use onClose (not onDismiss)
        onEmojiSelected={(e: EmojiType) => handlePick(e)}
        // optional: emojiSize, enableRecentlyUsed, categoryPosition, etc.
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  emoji: {
    lineHeight: 80,
  },
});
