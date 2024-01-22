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
  PALETTE[key] = [
    ...lightOffsets.map((offset) => [offset, pSBC((offset - 500) / 500, color, "#fff")]),
    ...darkOffsets.map((offset) => [offset, pSBC((500 - offset) / 500, color, "#000")]),
  ].reduce((acc, [offset, color]) => { acc[offset] = color; return acc; }, { 500: color, DEFAULT: color });
});

PALETTE["dark"] = {
  DEFAULT: "#0C0C0C",
  900: "#0C0C0C",
  800: "#1C1C1C",
  700: "#2A2A2A",
  600: "#323232",
  500: "#505050",
  400: "#C8C8C8",
  300: "#ECECEC",
  200: "#FBF8F4",
  100: "#FDFDFD",
};

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
          ...COLORS,
          background: "#1C1C1C",
          dark: {
            900: "#0C0C0C",
            800: "#1C1C1C",
            700: "#2A2A2A",
            600: "#323232",
            500: "#505050",
            400: "#C8C8C8",
            300: "#ECECEC",
            200: "#FBF8F4",
            100: "#FDFDFD",
          }
        },
      },
    ],

    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
