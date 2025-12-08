import { Animated, Image } from "react-native";
import HeaderTipsGrid from "@/components/tools/contentDetails/HeaderTipsGrid";

type HeroBannerProps = {
  imageUri?: string | null;
  tips?: any;
  theme: any;
  spacing: any;
  typography: any;
  scale: Animated.AnimatedInterpolation<number>;
  translateY: Animated.AnimatedInterpolation<number>;
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  imageUri,
  tips,
  theme,
  spacing,
  scale,
  translateY,
}) => {
  return (
    <Animated.View
      style={{
        marginTop: spacing.lg,
        // marginHorizontal: spacing.md,
        borderRadius: 24,
        overflow: "hidden",
        transform: [{ translateY }, { scale }],
        shadowColor: theme.shadow,
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 220 }}
          resizeMode="cover"
        />
      ) : (
        <HeaderTipsGrid tips={tips} />
      )}
    </Animated.View>
  );
};
