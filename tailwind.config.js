/** @type {import('tailwindcss').Config} */

import * as daisyui from "daisyui";
import * as themes from "daisyui/src/theming/themes";
import { COLORS, GRADIENTS } from "./src/styles/constants";

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
  DEFAULT: "#1C1C1C",
  900: "#0C0C0C",
  800: "#1C1C1C",
  700: "#2A2A2A",
  600: "#323232",
  550: "#3F3F3F",
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
      scale: {
        200: "2",
        240: "2.4",
      },
      borderWidth: {
        1: "1px",
      },
      backgroundImage: theme => ({
        ...GRADIENTS
      }),
      colors: PALETTE,
      container: {
        center: true,
        screens: {
          DEFAULT: "100%", // set the default screen width to 100% of the container
          sm: '640px', // set the small screen size
          md: '768px', // set the medium screen size
          lg: '1024px', // set the large screen size
          xl: '1150px', // set the extra-large screen size
        },
      },
      contrast: {
        63: '.63',
      },
      fontSize: {
        "2xs": ".55rem",
      },
      maxWidth: {
        "xl": "1150px",
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
