import { hexToRgba } from "../utils/format";

export const SENTIMENT_COLORS = {
  positive: "#00cc7a",
  negative: "#f8b024",
  warning: "#f8b024",
};
const BASE_BACKGROUNDS = {
  primary: "#131829",
  dark: "#1B1B1B",
};
export const BACKGROUNDS = {
  base: BASE_BACKGROUNDS.primary,
  dark: BASE_BACKGROUNDS.dark,
  "base-100": BASE_BACKGROUNDS.primary,
  "base-half-transparent": hexToRgba(BASE_BACKGROUNDS.primary, 0.55),
  "base-dark-transparent": hexToRgba(BASE_BACKGROUNDS.primary, 0.75),
};

export const COLORS = {
  primary: "#FFB800",
  secondary: "#F6F6F6",
  tertiary: "#FFFFFF",
  //background: BACKGROUNDS.base,
  active: "#ffd61e",
  base: BACKGROUNDS.base,
  dark: BASE_BACKGROUNDS.dark,
  success: SENTIMENT_COLORS.positive,
  failure: SENTIMENT_COLORS.negative,
  error: SENTIMENT_COLORS.negative,
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
