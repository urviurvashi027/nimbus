import type { ColorSet } from "../types";

// Later you will fill real light palette.
// For now we can reuse dark safely OR keep a minimal stub.
export const lightColors: ColorSet = {
  ...require("./dark").darkColors,
  // when ready, override:
  // background: "#fff",
};
