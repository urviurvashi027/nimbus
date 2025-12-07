// src/components/selfCare/soundscape/SoundscapeFeaturedCard.tsx

import React from "react";
import NimbusPastelFeaturedCard from "@/components/common/PastelFeaturedCard";
import { EnrichedMeditation } from "@/app/(auth)/selfCareScreen/MeditationScreen";

interface MeditationFeaturedCardProps {
  data: EnrichedMeditation;
  onPress: (data: EnrichedMeditation) => void | Promise<void>;
  cardColor: {
    bgColor: string;
    color: string;
  };
}

const MeditationFeaturedCard: React.FC<MeditationFeaturedCardProps> = ({
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
      subtitle={`${duration || "3"} min · Reflection`}
      description={descText}
      image={image}
      colors={{ bg: cardColor.bgColor, footer: cardColor.color }}
      onPress={() => onPress(data)}
    />
  );
};

export default MeditationFeaturedCard;
