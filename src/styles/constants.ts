import { hexToRgba } from "../utils/format";

export const SENTIMENT_COLORS = {
  positive: "00cc7a",
  negative: "f8b024",
  warning: "#f8b024",
};
export const BACKGROUNDS = {
  primary: "#191f2f",
};
export const COLORS = {
  primary: "#f0d816",
  secondary: "#ffd61e",
  tertiary: "#ffd61e",
  background: "#191f2f",
  active: "#ffd61e",
  success: SENTIMENT_COLORS.positive,
  failure: SENTIMENT_COLORS.negative,
  error: SENTIMENT_COLORS.negative,
  "base-100": BACKGROUNDS.primary,
  blurBackground: hexToRgba(BACKGROUNDS.primary, 0.55),
  ...SENTIMENT_COLORS,
};

export const SIZES = {
  unitO: "0.075rem",
  unitH: "0.1rem",
  unit1: "0.25rem",
  unit2: "0.5rem",
  unit3: "0.75rem",
  unit4: "1rem",
  unit5: "1.3rem",
  unit6: "1.7rem",
  unit7: "2.2rem",
  unit8: "2.8rem",
  unit9: "3.6rem",
  unit10: "4.6rem",
  unit11: "5.8rem",
  unit12: "7rem",
  unit13: "8.4rem",
  unit14: "10rem",
};
