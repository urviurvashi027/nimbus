// components/sleep/SleepPerformanceCard.tsx
import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Line } from "react-native-svg";
import ThemeContext from "@/context/ThemeContext";
import LogSheet, { LogPayload } from "../common/logSheet/SleepLogSheet";

type Props = {
  /** Minutes you actually slept */
  asleepMinutes: number;
  /** Goal in minutes (e.g., 8 * 60) */
  goalMinutes: number;
  /** Optional label above percentage (e.g., “Good”, “Great”, “Poor”) */
  ratingLabel?: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));

const fmtHM = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${h}:${pad(m)}h`;
};

export default function SleepPerformanceCard({
  asleepMinutes,
  goalMinutes,
  ratingLabel,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const percent = useMemo(() => {
    if (!goalMinutes) return 0;
    return clamp(Math.round((asleepMinutes / goalMinutes) * 100), 0, 200);
  }, [asleepMinutes, goalMinutes]);

  const label =
    ratingLabel ??
    (percent >= 90 ? "Great" : percent >= 70 ? "Good" : "Keep Improving");

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
    <View
      style={[
        styles.card,
        {
          backgroundColor: newTheme.surface,
          borderColor: newTheme.border,
          shadowColor: newTheme.accent ?? "#000",
        },
      ]}
    >
      {/* Title */}
      <Text style={[styles.title, { color: newTheme.textPrimary }]}>
        Sleep Performance
      </Text>

      {/* Center metric */}
      <View style={styles.centerWrap}>
        <Text style={[styles.centerLabel, { color: newTheme.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.centerValue, { color: newTheme.textPrimary }]}>
          {percent}%
        </Text>
      </View>

      {/* Dotted “guides” to left/right stats */}
      <View style={styles.guidesWrap}>
        <DashedGuide color={newTheme.textDisabled} />
        <DashedGuide color={newTheme.textDisabled} />
      </View>

      {/* Bottom stats */}
      <View style={styles.bottomRow}>
        <View style={styles.statBlock}>
          <Text style={[styles.statValue, { color: newTheme.textPrimary }]}>
            {fmtHM(asleepMinutes)}
          </Text>
          <Text style={[styles.statLabel, { color: newTheme.textSecondary }]}>
            Your time asleep
          </Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={[styles.statValue, { color: newTheme.textPrimary }]}>
            {fmtHM(goalMinutes)}
          </Text>
          <Text style={[styles.statLabel, { color: newTheme.textSecondary }]}>
            Your sleep goal
          </Text>
        </View>
      </View>
      {/* Your existing Sleep Performance card here... */}
      <Pressable onPress={() => setOpen(true)} style={{ marginTop: 12 }}>
        <Text
          style={{
            color: newTheme.buttonPrimary,
            fontWeight: "500",
            fontSize: 16,
            textAlign: "center",
            paddingVertical: 6,
          }}
        >
          + Add sleep log
        </Text>
      </Pressable>

      <LogSheet
        visible={open}
        onClose={() => setOpen(false)}
        onSleepNow={handleSleepNow}
        onSaveManual={handleSaveManual}
        // Optional: pass defaults for manual tab
        defaultBed={new Date()} // or your last bedtime
        defaultWake={new Date()} // or last wake time
      />
    </View>
  );
}

const DashedGuide = ({ color }: { color: string }) => {
  // vertical dashed line, sized to layout via viewBox 60x40, then scaled by style
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 6 40"
      preserveAspectRatio="xMidYMid meet"
    >
      <Line
        x1="3"
        y1="0"
        x2="3"
        y2="40"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2,2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  centerWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  centerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  centerValue: {
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: 0.5,
    lineHeight: 60,
  },
  guidesWrap: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    height: 24, // controls the dashed guide height
  },
  bottomRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
  },
});
