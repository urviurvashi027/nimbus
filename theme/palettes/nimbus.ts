import type { SvaColorSet } from "../types";

export const svaColors: SvaColorSet = {
  bg: {
    base: "#1C1E1A",
    subtle: "#23261F",
    elevated: "#2A2D24",
  },

  surface: {
    base: "#22251E",
    raised: "#262A22",
  },

  // 🧾 Text
  text: {
    primary: "#ECEFF4",
    secondary: "#A1A69B",
    disabled: "rgba(236,239,244,0.45)",
    inverse: "#10120E", // for buttons on light bg
  },

  // 🌿 Brand / Accent
  brand: {
    primary: "#A3BE8C",
    primaryPressed: "#8FAD78",
    subtle: "rgba(163,190,140,0.12)",
  },
  state: {
    info: "#5E81AC",
    success: "#90B47A",
    warning: "#EBCB8B",
    error: "#BF616A",
  },
  border: {
    default: "#3A3E33",
    muted: "#2D3028",
    subtle: "#242721",
  },
  divider: "#242721",
  overlay: {
    light: "rgba(12,14,11,0.6)",
    strong: "rgba(12,14,11,0.75)",
  },
  shadow: {
    default: "rgba(0,0,0,0.35)",
  },
  focus: {
    color: "#D7E3C8",
    ring: "rgba(163,190,140,0.35)",
  },
  button: {
    primary: {
      bg: "#A3BE8C",
      text: "#10120E",
      pressed: "#8FAD78",
    },
    ghost: {
      bg: "#262A22",
      border: "#3A3E33",
      text: "#ECEFF4",
    },
  },
  interaction: {
    pressed: "rgba(255,255,255,0.04)",
    hover: "rgba(255,255,255,0.03)",
    selected: "rgba(163,190,140,0.12)",
  },
  chart: {
    lime: "#CFE86C",
    blue: "#79A9F2",
    amber: "#F2B36E",
    rose: "#E48FA3",
    seafoam: "#9DD2C5",
    lavender: "#C8B8F4",
    grid: "#35382E",
    areaFade: "rgba(163,190,140,0.10)",
  },
  gradient: {
    accent: "#B8D39B",
    lime: "#D6F083",
    blue: "#A9C7F7",
    amber: "#F6C889",
  },
};
