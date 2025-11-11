import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import LogSheet, { LogPayload } from "../common/logSheet/SleepLogSheet";

// --- Helper Functions to draw the arc ---

/**
 * Converts polar coordinates (angle, radius) to Cartesian coordinates (x, y).
 * 0 degrees is at the 6 o'clock position (bottom center).
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.sin(angleInRadians),
    y: centerY - radius * Math.cos(angleInRadians),
  };
}

/**
 * Describes an SVG arc path.
 */
/**
 * Describes an SVG arc path.
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  // FIX 1: Swapped 'start' and 'end' to draw the arc in the correct direction.
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const sweepFlag = "1"; // 1 for clockwise

  const d = [
    "M",
    start.x,
    start.y, // Move to the start point
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    end.x,
    end.y, // Draw arc to the end point
  ].join(" ");

  return d;
}

// --- Component Props ---
interface MeditationGaugeCardProps {
  progress: number;
  // value?: number;
  showMarker?: boolean;
  // onLogPress?: () => void;
  // onDatePress?: () => void;
  title: string;
  subtitle: string;
}

// --- Main Component ---
const MeditationGaugeCard: React.FC<MeditationGaugeCardProps> = ({
  progress,
  title,
  // value,
  // onLogPress,
  // onDatePress,
  subtitle,
}) => {
  // const { newTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  // --- Chart Parameters ---
  const size = 250;
  const strokeWidth = 25;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  // The arc starts at -120 degrees (8 o'clock) and ends at 120 degrees (4 o'clock)
  const totalAngle = 240;
  const startAngle = -120;
  const endAngle = 120;

  // Calculate the end angle for the progress fill
  const progressAngle = startAngle + (progress / 100) * totalAngle;

  // Generate the SVG path data for the background and progress arcs
  const backgroundArcPath = describeArc(
    center,
    center,
    radius,
    startAngle,
    endAngle
  );
  const progressArcPath = describeArc(
    center,
    center,
    radius,
    startAngle,
    progressAngle
  );

  // TODO POST: Sleep Log API call
  const handleSleepNow = () => {
    // start tracking immediately
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    console.log("Sleep now pressed at:", currentTime);
  };
  const handleSaveManual = (p: LogPayload) => {
    const bedDate = new Date(p.bedTime);
    const wakeDate = new Date(p.wakeTime);

    // Example: 22:47 or 10:47 PM depending on locale
    const bedTimeLocal = bedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const wakeTimeLocal = wakeDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log("Bed:", bedTimeLocal);
    console.log("Wake:", wakeTimeLocal);
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {/* 2. Chart Area */}
      <View style={styles.chartContainer}>
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
          <Path
            d={backgroundArcPath}
            stroke={newTheme.card}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={progressArcPath}
            stroke={newTheme.chart5}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        {/* Inner Circle Content */}
        <View style={styles.centerContent}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      {/* Subtitle Section */}
      <View style={styles.textBlock}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* NEW: Log session button */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && { backgroundColor: newTheme.card },
        ]}
      >
        <Text style={styles.primaryBtnText}>+ Log session</Text>
      </Pressable>

      <LogSheet
        visible={open}
        onClose={() => setOpen(false)}
        // copy overrides (optional):
        titleText="Log session"
        tabNowText="Start now"
        nowTitle="Start meditation now"
        nowSubtitle="Begin your meditation session immediately."
        manualTitleText="Add a past session"
        manualSubtitleText="Pick start and end times. Duration is calculated automatically."
        saveText="Save session"
        // actions:
        onSleepNow={() => {
          const now = new Date();
          // Start meditation timer here
          console.log("Meditation start now:", now.toISOString());
        }}
        onSaveManual={(p: LogPayload) => {
          // Convert to minutes (already provided)
          console.log("Meditation manual session:", {
            start: p.bedTime.toISOString(),
            end: p.wakeTime.toISOString(),
            minutes: p.durationMin,
          });
          // Post to API / store locally
        }}
        // Optional defaults (e.g., guess a 20 min session ending now)
        defaultWake={new Date()}
        defaultBed={new Date(Date.now() - 20 * 60 * 1000)}
      />
    </View>
  );
};

// --- Styles ---
const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: newTheme.surface,
      borderRadius: 20,
      padding: 16,
      alignItems: "center",
      shadowColor: newTheme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      // width: "90%",
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 24,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 50,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
      marginLeft: 8,
      marginRight: 4,
    },
    iconButton: {
      backgroundColor: "red",
      borderRadius: 12,
      padding: 8,
    },
    chartContainer: {
      // backgroundColor: "red",
      width: 250,
      height: 150,
      alignItems: "center",
      justifyContent: "center",
    },
    centerContent: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
    primaryBtn: {
      marginTop: 10,
      height: 46,
      borderRadius: 14,
      // backgroundColor: newTheme.accent,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    primaryBtnText: {
      color: newTheme.buttonPrimary,
      fontWeight: "500",
      fontSize: 16,
      textAlign: "center",
      paddingVertical: 6,
    },
    progressText: {
      fontSize: 52,
      fontWeight: "bold",
      color: newTheme.textPrimary,
      marginVertical: 4,
    },
    textBlock: {
      width: "100%",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 4,
      paddingHorizontal: 8,
    },

    subtitleTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: newTheme.textPrimary,
      marginBottom: 4,
      textAlign: "center",
    },

    subtitle: {
      fontSize: 14,
      color: newTheme.textSecondary,
      textAlign: "center",
      maxWidth: "85%",
      lineHeight: 20,
    },
  });

export default MeditationGaugeCard;
