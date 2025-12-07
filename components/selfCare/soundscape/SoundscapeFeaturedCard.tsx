// src/components/selfCare/soundscape/SoundscapeFeaturedCard.tsx

import React from "react";
import NimbusPastelFeaturedCard from "@/components/common/PastelFeaturedCard";

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
    <NimbusPastelFeaturedCard
      title={title}
      subtitle={`${duration || "3"} min · Soundscape`}
      description={descText}
      image={image}
      colors={{ bg: cardColor.bgColor, footer: cardColor.color }}
      onPress={() => onPress(data)}
    />
  );
};

export default SoundscapeFeaturedCard;
