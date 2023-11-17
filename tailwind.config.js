/** @type {import('tailwindcss').Config} */


const colors = {
  blue: "#4159f3",
  red: "FF4242",
  lightBlue:"#6979e4",
  darkBlue: "#14248c",
  beige: "#f1f0ec",
  darker: "#0C0C0C",
  lighter: "#FDFDFD",
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        "light-blue": colors.lightBlue,
        "blue-dark": colors.blueDark,
        "darker-blue": colors.darkerBlue,
        primary: colors.blue,
        "dark-primary": "#3870ff",
        "light-primary": "#5686ff",
        secondary: colors.lightBlue,
        active: colors.lightBlue,
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      "light",
      "dark"
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: false, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}

