// typings.d.ts ou globals.d.ts
declare module "*.svg?react" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  export default ReactComponent;
}

// Vous pouvez également inclure une déclaration pour les importations SVG standard
declare module "*.svg" {
  const content: string;
  export default content;
}

declare const COLORS_PALETTE: { [key: string]: string };
