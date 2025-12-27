import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type VideoClassCardType = {
  title: string;
  coachName: string;
  thumbnail: any;
  onPress: () => void;
  courses?: number;
  tag?: string;
};

const MasterclassCard: React.FC<VideoClassCardType> = ({
  title,
  coachName,
  thumbnail,
  onPress,
  courses = 9,
  tag = "ADHD",
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: newTheme.cardRaised,
          shadowColor: newTheme.shadow,
        },
      ]}
    >
      <ImageBackground
        source={thumbnail}
        style={styles.image}
        imageStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {/* Gradient Overlay */}
        <View
          style={[styles.overlay, { backgroundColor: newTheme.overlayStrong }]}
        />

        {/* TAG */}
        <View
          style={[
            styles.tag,
            {
              backgroundColor: newTheme.selected,
              borderColor: newTheme.accent,
            },
          ]}
        >
          <Text style={[styles.tagText, { color: newTheme.accent }]}>
            {tag}
          </Text>
        </View>
      </ImageBackground>

      {/* Content */}
      <View style={{ padding: spacing.md }}>
        <Text
          style={[
            typography.caption,
            { color: newTheme.textSecondary, marginBottom: spacing.xs },
          ]}
        >
          {courses} courses
        </Text>

        <Text
          style={[
            typography.h3,
            { color: newTheme.textPrimary, marginBottom: spacing.xs },
          ]}
        >
          {title}
        </Text>

        <View style={styles.footer}>
          <Text
            style={[
              typography.body,
              { color: newTheme.textSecondary, flex: 1 },
            ]}
          >
            Coach:{" "}
            <Text style={{ color: newTheme.textPrimary, fontWeight: "600" }}>
              {coachName}
            </Text>
          </Text>

          {/* Play Button */}
          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: newTheme.buttonPrimary },
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                typography.caption,
                { color: newTheme.buttonPrimaryText, fontWeight: "700" },
              ]}
            >
              Play
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    borderRadius: 16,
    marginRight: 16,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    height: 180,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
});

export default MasterclassCard;
