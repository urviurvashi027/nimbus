import React from "react";
import { View } from "react-native";
import AdviceItem from "./AdviceItem";
import type { Advice } from "./types";

export default function AdviceList({
  items,
  onPressItem,
}: {
  items: Advice[];
  onPressItem?: (a: Advice) => void;
}) {
  return (
    <View>
      {items.map((a) => (
        <AdviceItem key={a.id} item={a} onPress={onPressItem} />
      ))}
    </View>
  );
}
