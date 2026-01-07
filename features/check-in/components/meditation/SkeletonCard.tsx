import { View } from "react-native";

// ----- tiny nimbus skeleton & error card
export const Skeleton = ({ h = 150 }: { h?: number }) => (
  <View
    style={{
      height: h,
      borderRadius: 20,
      backgroundColor: "#2A2D24",
      opacity: 0.7,
      marginBottom: 16,
    }}
  />
);
