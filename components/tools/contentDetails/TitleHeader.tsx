import { Animated, Image, Text, View } from "react-native";
import MetaInfo from "@/components/tools/contentDetails/MetaInfo";
import AuthorCard from "@/components/tools/contentDetails/AuthorCard";

type TitleHeaderProps = {
  title: string;
  metaInfo?: { points: number; time: string };
  authorInfo?: any;
  theme: any;
  spacing: any;
  typography: any;
};

export const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  metaInfo,
  authorInfo,
  theme,
  spacing,
  typography,
}) => {
  return (
    <View
      style={{
        // paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
      }}
    >
      <Text
        style={{
          ...typography.h2,
          color: theme.textPrimary,
          marginBottom: spacing.xs,
        }}
      >
        {title}
      </Text>

      {metaInfo && (
        <View style={{ marginBottom: spacing.sm }}>
          <MetaInfo points={metaInfo.points} time={metaInfo.time} />
        </View>
      )}

      {authorInfo && (
        <View style={{ marginTop: spacing.xs }}>
          <AuthorCard author={authorInfo} />
        </View>
      )}
    </View>
  );
};
