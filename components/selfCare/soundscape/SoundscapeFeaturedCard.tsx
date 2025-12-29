// src/components/selfCare/soundscape/SoundscapeFeaturedCard.tsx

import React from "react";
import NimbusPastelFeaturedCard from "@/components/common/PastelFeaturedCard";
import NimbusUltraFeaturedCard from "@/components/common/NimbusUltraFeaturedCard";

interface ItemDetails {
  id: string;
  title: string;
  duration: string;
  description?: string;
  image: any;
  source: any;
  category?: string;
  isLocked: boolean;
}

interface SoundscapeFeaturedCardProps {
  data: ItemDetails;
  onPress: (data: ItemDetails) => void;
  cardColor: {
    bgColor: string;
    color: string;
  };
}

const SoundscapeFeaturedCard: React.FC<SoundscapeFeaturedCardProps> = ({
  data,
  onPress,
  cardColor,
}) => {
  const { title, duration, description, category, image } = data;

  const descText =
    description ||
    (category ? category : "Calming ambience · Best with headphones");

  return (
    <NimbusUltraFeaturedCard
      title={title}
      subtitle={`${duration || "3"} min · Reflection`}
      description={descText}
      image={image}
      badge={category || "For you"} // or "Relaxing" etc
      tint={cardColor.bgColor} // keep your palette, but as a glow
      accent={cardColor.color} // used for dot + accent bar
      onPress={() => onPress(data)}
    />
  );
};

export default SoundscapeFeaturedCard;
