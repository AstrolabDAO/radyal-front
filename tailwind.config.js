/** @type {import('tailwindcss').Config} */
import * as daisyui from 'daisyui'
import  * as themes from 'daisyui/src/theming/themes'
console.log("🚀 ~ file: tailwind.config.js:3 ~ daisyui:", daisyui)

const colors = {
  blue: "#4159f3",
  red: "FF4242",
  lightBlue:"#6979e4",
  darkBlue: "#14248c",
  beige: "#f1f0ec",
  darker: "#0C0C0C",
  lighter: "#FDFDFD",
};


const themeColors = {
  ...colors,
  "light-blue": colors.lightBlue,
  "blue-dark": colors.blueDark,
  "darker-blue": colors.darkerBlue,
  primary: colors.blue,
  "dark-primary": "#3870ff",
  "light-primary": "#5686ff",
  secondary: colors.lightBlue,
  active: colors.lightBlue,
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: themeColors
    },
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          ...themeColors,
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
}

