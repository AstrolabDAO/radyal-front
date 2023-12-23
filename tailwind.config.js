/** @type {import('tailwindcss').Config} */
import * as daisyui from "daisyui";
import * as themes from "daisyui/src/theming/themes";
import { COLORS } from "./src/styles/constants";

import pSBCLib from "shade-blend-color";

const pSBC = pSBCLib.default;

export const PALETTE = {};

const darkOffsets = Array.from({ length: 9 }, (_, i) => (i + 1) * 50);
const lightOffsets = Array.from({ length: 9 }, (_, i) => (i + 1) * 50 + 500);

Object.entries(COLORS).forEach((value) => {
  const [key, color] = value;

  PALETTE[key] = color;
  PALETTE[`${key}-500`] = color;

  //PALETTE_EXPORTED[key] = []
  darkOffsets.forEach((offset) => {
    PALETTE[`${key}-${offset}`] = pSBC(offset / 2000, color, "#000000");
    //PALETTE_EXPORTED[key].push(pSBC(offset / 2000, color,"#000000"))
  });
  //PALETTE_EXPORTED[key].push(color)
  lightOffsets.forEach((offset) => {
    PALETTE[`${key}-${offset}`] = pSBC(-offset / 3500, color, "#ffffff");
    //PALETTE_EXPORTED[key].push(pSBC(offset / 3500, color,"#ffffff"))
  });
});
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: PALETTE,
      fontSize: {
        "2xs": ".55rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          ...themes.default.dark,
        },
      },
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]

    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
