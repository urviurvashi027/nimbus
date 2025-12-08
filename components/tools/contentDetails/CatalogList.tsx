// CatalogList.tsx
import React, { useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

type CatalogItem = {
  id?: number | string;
  title: string;
};

type Props = {
  catalog: CatalogItem[] | undefined | null;
  onPress: (index: number) => void; // pass index to keep layout logic simple
};

const CatalogList: React.FC<Props> = ({ catalog = [], onPress }) => {
  const { newTheme } = useContext(ThemeContext);

  const renderRow = ({ item, index }: { item: CatalogItem; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.row,
          { borderColor: newTheme.divider, backgroundColor: newTheme.surface },
        ]}
        onPress={() => onPress(index)}
        accessibilityRole="button"
        accessibilityLabel={`Go to ${item.title}`}
      >
        {/* <View style={[styles.badge, { backgroundColor: newTheme.background }]}>
          <Text style={[styles.badgeText, { color: newTheme.textPrimary }]}>
            {index + 1}
          </Text>
        </View> */}

        <View style={styles.titleWrap}>
          <Text
            numberOfLines={2}
            style={[styles.title, { color: newTheme.textPrimary }]}
          >
            {item.title}
          </Text>
        </View>

        {/* <Ionicons
          name="chevron-forward"
          size={20}
          color={newTheme.textSecondary}
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.wrap,
        { borderColor: newTheme.divider, backgroundColor: newTheme.surface },
      ]}
    >
      <Text style={[styles.heading, { color: newTheme.textPrimary }]}>
        Catalog
      </Text>

      <FlatList
        data={catalog}
        renderItem={renderRow}
        keyExtractor={(it, i) => (it.id ? String(it.id) : String(i))}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        scrollEnabled={false}
      />
    </View>
  );
};

export default CatalogList;

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12,
    padding: 12,
    // borderWidth: 1,
    marginBottom: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    // borderWidth: 1,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    elevation: 1,
  },
  badgeText: {
    fontWeight: "700",
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
});
