import { View } from "react-native";

// ---- Little Nimbus skeletons (no extra deps)
export const SkeletonCard = ({
  height = 140,
  radius = 20,
}: {
  height?: number;
  radius?: number;
}) => {
  return (
    <View
      style={{
        height,
        borderRadius: radius,
        backgroundColor: "#2A2D24",
        opacity: 0.7,
        marginBottom: 16,
      }}
    />
  );
};
