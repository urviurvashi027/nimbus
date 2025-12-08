import { Animated, Image, Text, View, StyleSheet } from "react-native";

import CatalogList from "@/components/tools/contentDetails/CatalogList";
import { SectionData } from "@/app/(auth)/toolsScreen/ContentDetailsScreen";

type CatalogCardProps = {
  sections: SectionData[];
  onSectionPress?: (index: number) => void;
  theme: any;
  spacing: any;
  typography: any;
};

export const CatalogCard: React.FC<CatalogCardProps> = ({
  sections,
  onSectionPress,
  theme,
  spacing,
  typography,
}) => {
  return (
    <View
      style={{
        // marginTop: spacing.lg,
        // marginHorizontal: spacing.md,
        borderRadius: 20,
        // paddingHorizontal: spacing.md,
        // paddingVertical: spacing.md,
        // backgroundColor: theme.surfaceMuted ?? "#181C18",
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: theme.divider,
      }}
    >
      {/* <Text
        style={{
          ...typography.caption,
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: spacing.sm,
        }}
      >
        Catalog
      </Text> */}

      {/* Reuse existing CatalogList for actual list UI */}
      <CatalogList
        catalog={sections}
        onPress={(index) => onSectionPress && onSectionPress(index)}
      />
    </View>
  );
};
