import type { Config } from "postcss-load-config";

import { COLORS, SIZES } from "./src/styles/constants";

import postCssImport from "postcss-import";
import tailwindNesting from "tailwindcss/nesting";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postCssVars from "postcss-simple-vars";
import postcssNesting from "postcss-nesting";

const CSS_VARIABLES = {
};

Object.entries({...COLORS,...SIZES}).map(([key,value]) => {
  CSS_VARIABLES[`--${key}`] = value
})
console.log(CSS_VARIABLES);
export default {
  syntax: "postcss-scss",
  plugins: [
    postcssNesting,
    postCssImport,
    tailwindNesting,
    tailwindcss,
    autoprefixer,
    postCssVars({
      variables: {
        ...COLORS,...SIZES,
        ...CSS_VARIABLES

      },
    }),
  ],
} satisfies Config;
