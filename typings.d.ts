declare module "*.svg?react" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  export default ReactComponent;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
